<?php

declare(strict_types=1);

namespace Lifescc;

use PDO;

final class SupportRepository
{
    /** @var list<string> */
    public const ALLOWED_BRANCH_IDS = [
        'gachibowli',
        'banjara-hills',
        'madhapur',
        'chandanagar',
        'dilsukhnagar',
        'sr-nagar',
        'himayat-nagar',
        'vizag',
        'vijayawada',
        'nellore',
        'kukatpally',
    ];

    public static function isAllowedBranchId(string $id): bool
    {
        return in_array($id, self::ALLOWED_BRANCH_IDS, true);
    }

    public static function create(array $row): int
    {
        $pdo = Database::connection();
        $sql = 'INSERT INTO support (full_name, email, mobile, branch_id, query)
                VALUES (:full_name, :email, :mobile, :branch_id, :query)';
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':full_name' => $row['full_name'],
            ':email' => $row['email'],
            ':mobile' => $row['mobile'],
            ':branch_id' => $row['branch_id'],
            ':query' => $row['query'],
        ]);

        return (int) $pdo->lastInsertId();
    }

    /**
     * @return list<array<string, mixed>>
     */
    public static function allLatestFirst(): array
    {
        $pdo = Database::connection();
        $stmt = $pdo->query(
            'SELECT id, full_name, email, mobile, branch_id, query, created_at,
                    contacted, customer_note, status
             FROM support
             ORDER BY created_at DESC, id DESC'
        );

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * @param array<string, mixed> $fields
     */
    public static function update(int $id, array $fields): bool
    {
        $pdo = Database::connection();
        $parts = [];
        $params = [':id' => $id];

        if (array_key_exists('status', $fields)) {
            $parts[] = 'status = :status';
            $params[':status'] = (string) $fields['status'];
        }
        if (array_key_exists('contacted', $fields)) {
            $parts[] = 'contacted = :contacted';
            $params[':contacted'] = (string) $fields['contacted'];
        }
        if (array_key_exists('customer_note', $fields)) {
            $note = $fields['customer_note'];
            if ($note === null || $note === '') {
                $parts[] = 'customer_note = NULL';
            } else {
                $parts[] = 'customer_note = :customer_note';
                $params[':customer_note'] = (string) $note;
            }
        }

        if ($parts === []) {
            return false;
        }

        $sql = 'UPDATE support SET ' . implode(', ', $parts) . ' WHERE id = :id';
        $stmt = $pdo->prepare($sql);

        return $stmt->execute($params);
    }

    public static function find(int $id): ?array
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare(
            'SELECT id, full_name, email, mobile, branch_id, query, created_at,
                    contacted, customer_note, status
             FROM support WHERE id = :id LIMIT 1'
        );
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return $row === false ? null : $row;
    }
}
