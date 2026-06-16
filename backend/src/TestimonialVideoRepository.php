<?php

declare(strict_types=1);

namespace Lifescc;

use PDO;

final class TestimonialVideoRepository
{
    /**
     * @return list<array<string, mixed>>
     */
    public static function allLatestFirst(): array
    {
        $pdo = Database::connection();
        $stmt = $pdo->query(
            'SELECT id, title, embed_src, created_at FROM testimonial_videos ORDER BY created_at DESC, id DESC'
        );

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function find(int $id): ?array
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare(
            'SELECT id, title, embed_src, created_at FROM testimonial_videos WHERE id = :id LIMIT 1'
        );
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return $row === false ? null : $row;
    }

    public static function create(string $title, string $embedSrc): int
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare(
            'INSERT INTO testimonial_videos (title, embed_src) VALUES (:title, :embed_src)'
        );
        $stmt->execute([
            ':title' => $title,
            ':embed_src' => $embedSrc,
        ]);

        return (int) $pdo->lastInsertId();
    }

    public static function deleteById(int $id): bool
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare('DELETE FROM testimonial_videos WHERE id = :id');

        return $stmt->execute([':id' => $id]);
    }
}
