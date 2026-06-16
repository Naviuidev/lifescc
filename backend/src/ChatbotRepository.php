<?php

declare(strict_types=1);

namespace Lifescc;

use PDO;

final class ChatbotRepository
{
    /**
     * @return list<array<string, mixed>>
     */
    public static function allLatestFirst(): array
    {
        $pdo = Database::connection();
        $stmt = $pdo->query(
            'SELECT id, logo, name, business_title, website_url, published, created_at FROM chatbots ORDER BY created_at DESC, id DESC'
        );

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * @param string|null $logoUrl null or empty = stored as NULL
     */
    public static function create(string $name, string $businessTitle, ?string $logoUrl, ?string $websiteUrl): int
    {
        $pdo = Database::connection();
        $logo = $logoUrl !== null && trim($logoUrl) !== '' ? trim($logoUrl) : null;
        $website = $websiteUrl !== null && trim($websiteUrl) !== '' ? trim($websiteUrl) : null;
        $stmt = $pdo->prepare(
            'INSERT INTO chatbots (logo, name, business_title, website_url) VALUES (:logo, :name, :business_title, :website_url)'
        );
        $stmt->execute([
            ':logo' => $logo,
            ':name' => $name,
            ':business_title' => $businessTitle,
            ':website_url' => $website,
        ]);

        return (int) $pdo->lastInsertId();
    }

    /**
     * Mark one chatbot as published on the public site; others are unpublished.
     */
    public static function publishOnSite(int $id): void
    {
        $pdo = Database::connection();
        if (self::find($id) === null) {
            throw new \InvalidArgumentException('Chatbot not found');
        }
        $pdo->beginTransaction();
        try {
            $pdo->exec('UPDATE chatbots SET published = 0');
            $u = $pdo->prepare('UPDATE chatbots SET published = 1 WHERE id = :id');
            $u->execute([':id' => $id]);
            $pdo->commit();
        } catch (\Throwable $e) {
            $pdo->rollBack();
            throw $e;
        }
    }

    public static function unpublish(int $id): void
    {
        $pdo = Database::connection();
        $u = $pdo->prepare('UPDATE chatbots SET published = 0 WHERE id = :id');
        $u->execute([':id' => $id]);
    }

    /**
     * @return array<string, mixed>|null
     */
    public static function findPublishedForSite(): ?array
    {
        $pdo = Database::connection();
        $stmt = $pdo->query(
            'SELECT id, logo, name, business_title, website_url, published, created_at
             FROM chatbots WHERE published = 1 ORDER BY id ASC LIMIT 1'
        );
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return $row === false ? null : $row;
    }

    /**
     * @return array<string, mixed>|null
     */
    public static function find(int $id): ?array
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare(
            'SELECT id, logo, name, business_title, website_url, published, created_at FROM chatbots WHERE id = :id LIMIT 1'
        );
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return $row === false ? null : $row;
    }

    public static function deleteById(int $id): bool
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare('DELETE FROM chatbots WHERE id = :id');

        return $stmt->execute([':id' => $id]);
    }
}
