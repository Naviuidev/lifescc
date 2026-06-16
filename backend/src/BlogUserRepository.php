<?php

declare(strict_types=1);

namespace Lifescc;

use PDO;

final class BlogUserRepository
{
    /**
     * @param array{
     *   blog_id: int,
     *   first_name?: string|null,
     *   last_name?: string|null,
     *   email?: string|null,
     *   mobile_number?: string|null,
     *   message?: string|null
     * } $row
     */
    public static function create(array $row): int
    {
        $pdo = Database::connection();
        $sql = 'INSERT INTO blog_user (blog_id, first_name, last_name, email, mobile_number, message)
                VALUES (:blog_id, :first_name, :last_name, :email, :mobile_number, :message)';
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':blog_id' => $row['blog_id'],
            ':first_name' => $row['first_name'] ?? null,
            ':last_name' => $row['last_name'] ?? null,
            ':email' => $row['email'] ?? null,
            ':mobile_number' => $row['mobile_number'] ?? null,
            ':message' => $row['message'] ?? null,
        ]);

        return (int) $pdo->lastInsertId();
    }

    /**
     * @return list<array<string, mixed>>
     */
    public static function allWithBlog(): array
    {
        $pdo = Database::connection();
        $stmt = $pdo->query(
            'SELECT bu.id, bu.blog_id, bu.first_name, bu.last_name, bu.email, bu.mobile_number, bu.message,
                    bu.status, bu.contacted, bu.customer_note, bu.created_at,
                    b.title AS blog_title, b.slug AS blog_slug
             FROM blog_user bu
             INNER JOIN blogs b ON b.id = bu.blog_id
             ORDER BY bu.created_at DESC, bu.id DESC'
        );

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * @param array<string, mixed> $fields
     */
    public static function update(int $id, array $fields): bool
    {
        $allowed = ['status', 'contacted', 'customer_note'];
        $parts = [];
        $params = [':id' => $id];

        foreach ($allowed as $col) {
            if (!array_key_exists($col, $fields)) {
                continue;
            }
            $v = $fields[$col];
            if ($col === 'customer_note') {
                if ($v === null || $v === '') {
                    $parts[] = '`customer_note` = NULL';
                } else {
                    $parts[] = '`customer_note` = :customer_note';
                    $params[':customer_note'] = (string) $v;
                }
            } elseif ($col === 'status') {
                $parts[] = '`status` = :status';
                $params[':status'] = (string) $v;
            } elseif ($col === 'contacted') {
                $parts[] = '`contacted` = :contacted';
                $params[':contacted'] = (string) $v;
            }
        }

        if ($parts === []) {
            return false;
        }

        $pdo = Database::connection();
        $sql = 'UPDATE blog_user SET ' . implode(', ', $parts) . ' WHERE id = :id';
        $stmt = $pdo->prepare($sql);

        return $stmt->execute($params);
    }

    public static function findById(int $id): ?array
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare(
            'SELECT bu.id, bu.blog_id, bu.first_name, bu.last_name, bu.email, bu.mobile_number, bu.message,
                    bu.status, bu.contacted, bu.customer_note, bu.created_at,
                    b.title AS blog_title, b.slug AS blog_slug
             FROM blog_user bu
             INNER JOIN blogs b ON b.id = bu.blog_id
             WHERE bu.id = :id
             LIMIT 1'
        );
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return $row === false ? null : $row;
    }

    public static function deleteById(int $id): bool
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare('DELETE FROM blog_user WHERE id = :id');
        $stmt->execute([':id' => $id]);

        return $stmt->rowCount() > 0;
    }

    public static function deleteAllForBlog(int $blogId): int
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare('DELETE FROM blog_user WHERE blog_id = :bid');
        $stmt->execute([':bid' => $blogId]);

        return $stmt->rowCount();
    }
}
