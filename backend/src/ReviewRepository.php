<?php

declare(strict_types=1);

namespace Lifescc;

use PDO;

final class ReviewRepository
{
    /** @var list<string> */
    public const ALLOWED_TREATMENTS = [
        'Service 1 a',
        'Service 1 b',
        'Service 1 c',
        'Service 2 a',
        'Service 2 b',
        'Service 2 c',
        'Service 3 a',
        'Service 3 b',
        'Service 3 c',
    ];

    public static function isAllowedTreatment(string $value): bool
    {
        return in_array($value, self::ALLOWED_TREATMENTS, true);
    }

    public static function create(array $row): int
    {
        $pdo = Database::connection();
        $sql = 'INSERT INTO reviews (customer_name, email, treatment, review_text, rating, profile_image, status)
                VALUES (:customer_name, :email, :treatment, :review_text, :rating, :profile_image, :status)';
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':customer_name' => $row['customer_name'],
            ':email' => $row['email'],
            ':treatment' => $row['treatment'],
            ':review_text' => $row['review_text'],
            ':rating' => $row['rating'],
            ':profile_image' => $row['profile_image'],
            ':status' => $row['status'] ?? 'pending',
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
            'SELECT id, customer_name, email, treatment, review_text, rating, profile_image, status, created_at
             FROM reviews
             ORDER BY created_at DESC, id DESC'
        );

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Approved reviews for public display (newest first).
     *
     * @return list<array<string, mixed>>
     */
    public static function approvedLatest(int $limit = 12): array
    {
        $limit = max(1, min(50, $limit));
        $pdo = Database::connection();
        $stmt = $pdo->prepare(
            'SELECT id, customer_name, email, treatment, review_text, rating, profile_image, created_at
             FROM reviews
             WHERE status = \'approved\'
             ORDER BY created_at DESC, id DESC
             LIMIT :lim'
        );
        $stmt->bindValue(':lim', $limit, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function find(int $id): ?array
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare(
            'SELECT id, customer_name, email, treatment, review_text, rating, profile_image, status, created_at
             FROM reviews WHERE id = :id LIMIT 1'
        );
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return $row === false ? null : $row;
    }

    public static function setStatus(int $id, string $status): bool
    {
        if (!in_array($status, ['pending', 'approved', 'discarded'], true)) {
            return false;
        }
        $pdo = Database::connection();
        $stmt = $pdo->prepare('UPDATE reviews SET status = :status WHERE id = :id');

        return $stmt->execute([':status' => $status, ':id' => $id]);
    }

    public static function deleteById(int $id): bool
    {
        $row = self::find($id);
        if ($row === null) {
            return false;
        }
        $pdo = Database::connection();
        $stmt = $pdo->prepare('DELETE FROM reviews WHERE id = :id');
        $ok = $stmt->execute([':id' => $id]);
        if ($ok) {
            $img = $row['profile_image'] ?? null;
            if (is_string($img) && $img !== '') {
                ReviewStorage::deleteRelativeIfExists($img);
            }
        }

        return $ok;
    }
}
