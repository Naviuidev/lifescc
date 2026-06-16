<?php

declare(strict_types=1);

namespace Lifescc;

use PDO;

final class SkinDataRepository
{
    public static function create(array $row): int
    {
        $pdo = Database::connection();
        $sql = 'INSERT INTO skin_data (full_name, phone, location_id, message, service_label, source_page)
                VALUES (:full_name, :phone, :location_id, :message, :service_label, :source_page)';
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':full_name' => $row['full_name'],
            ':phone' => $row['phone'],
            ':location_id' => $row['location_id'],
            ':message' => $row['message'],
            ':service_label' => $row['service_label'] ?? '',
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
            'SELECT id, full_name, phone, location_id, message, service_label, created_at,
                    status, follow_up, visited, contacted, customer_note, source_page
             FROM skin_data
             ORDER BY created_at DESC, id DESC'
        );

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function find(int $id): ?array
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare(
            'SELECT id, full_name, phone, location_id, message, service_label, created_at,
                    status, follow_up, visited, contacted, customer_note, source_page
             FROM skin_data WHERE id = :id LIMIT 1'
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

        $sql = 'UPDATE skin_data SET ' . implode(', ', $parts) . ' WHERE id = :id';
        $stmt = $pdo->prepare($sql);

        return $stmt->execute($params);
    }
}
