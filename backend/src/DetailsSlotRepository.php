<?php

declare(strict_types=1);

namespace Lifescc;

use PDO;

final class DetailsSlotRepository
{
    public static function create(array $row): int
    {
        $pdo = Database::connection();
        $sql = 'INSERT INTO details_slot (full_name, phone, location_id, treatment, message, source_page)
                VALUES (:full_name, :phone, :location_id, :treatment, :message, :source_page)';
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':full_name' => $row['full_name'],
            ':phone' => $row['phone'],
            ':location_id' => $row['location_id'],
            ':treatment' => $row['treatment'],
            ':message' => $row['message'],
            ':source_page' => $row['source_page'] ?? 'book_an_appointment',
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
            'SELECT id, full_name, phone, location_id, treatment, message, created_at,
                    status, follow_up, visited, contacted, customer_note, source_page
             FROM details_slot
             ORDER BY created_at DESC, id DESC'
        );

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function find(int $id): ?array
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare(
            'SELECT id, full_name, phone, location_id, treatment, message, created_at,
                    status, follow_up, visited, contacted, customer_note, source_page
             FROM details_slot WHERE id = :id LIMIT 1'
        );
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return $row === false ? null : $row;
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
        if (array_key_exists('follow_up', $fields)) {
            $fu = $fields['follow_up'];
            if ($fu === null || $fu === '') {
                $parts[] = 'follow_up = NULL';
            } else {
                $parts[] = 'follow_up = :follow_up';
                $params[':follow_up'] = (string) $fu;
            }
        }
        if (array_key_exists('visited', $fields)) {
            $parts[] = 'visited = :visited';
            $params[':visited'] = (string) $fields['visited'];
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

        $sql = 'UPDATE details_slot SET ' . implode(', ', $parts) . ' WHERE id = :id';
        $stmt = $pdo->prepare($sql);

        return $stmt->execute($params);
    }
}
