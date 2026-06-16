<?php

declare(strict_types=1);

namespace Lifescc;

use PDO;

final class ContactRepository
{
    public static function create(array $row): int
    {
        $pdo = Database::connection();
        $sql = 'INSERT INTO contact (first_name, last_name, email, country_code, phone, service, submit_method, message)
                VALUES (:first_name, :last_name, :email, :country_code, :phone, :service, :submit_method, :message)';
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':first_name' => $row['first_name'],
            ':last_name' => $row['last_name'],
            ':email' => $row['email'],
            ':country_code' => $row['country_code'],
            ':phone' => $row['phone'],
            ':service' => $row['service'],
            ':submit_method' => $row['submit_method'],
            ':message' => $row['message'],
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
            'SELECT id, first_name, last_name, email, country_code, phone, service, submit_method, message, created_at,
                    contacted, customer_note, status
             FROM contact
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

        $sql = 'UPDATE contact SET ' . implode(', ', $parts) . ' WHERE id = :id';
        $stmt = $pdo->prepare($sql);

        return $stmt->execute($params);
    }

    public static function find(int $id): ?array
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare(
            'SELECT id, first_name, last_name, email, country_code, phone, service, submit_method, message, created_at,
                    contacted, customer_note, status
             FROM contact WHERE id = :id LIMIT 1'
        );
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return $row === false ? null : $row;
    }
}
