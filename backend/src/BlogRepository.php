<?php

declare(strict_types=1);

namespace Lifescc;

use PDO;

final class BlogRepository
{
    public static function slugify(string $title): string
    {
        $s = strtolower(trim($title));
        $s = preg_replace('/[^a-z0-9]+/i', '-', $s) ?? '';
        $s = trim((string) $s, '-');

        return $s !== '' ? $s : 'post';
    }

    public static function slugExists(string $slug, ?int $exceptId = null): bool
    {
        $pdo = Database::connection();
        if ($exceptId !== null) {
            $stmt = $pdo->prepare('SELECT 1 FROM blogs WHERE slug = :slug AND id != :id LIMIT 1');
            $stmt->execute([':slug' => $slug, ':id' => $exceptId]);
        } else {
            $stmt = $pdo->prepare('SELECT 1 FROM blogs WHERE slug = :slug LIMIT 1');
            $stmt->execute([':slug' => $slug]);
        }

        return (bool) $stmt->fetchColumn();
    }

    public static function uniqueSlugFromTitle(string $title, ?int $exceptId = null): string
    {
        $base = self::slugify($title);
        $slug = $base;
        $n = 2;
        while (self::slugExists($slug, $exceptId)) {
            $slug = $base . '-' . $n;
            ++$n;
        }

        return $slug;
    }

    /**
     * @param list<array<string, mixed>> $blocks
     * @return array<string, mixed>
     */
    public static function create(array $row): array
    {
        $pdo = Database::connection();
        $slug = $row['slug'];
        $sql = 'INSERT INTO blogs (
            title, slug, banner_headline, banner_subtitle, banner_button_label, banner_button_link,
            cover_image, listing_summary, blocks_json, status
        ) VALUES (
            :title, :slug, :banner_headline, :banner_subtitle, :banner_button_label, :banner_button_link,
            :cover_image, :listing_summary, :blocks_json, :status
        )';
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':title' => $row['title'],
            ':slug' => $slug,
            ':banner_headline' => $row['banner_headline'],
            ':banner_subtitle' => $row['banner_subtitle'],
            ':banner_button_label' => $row['banner_button_label'],
            ':banner_button_link' => $row['banner_button_link'],
            ':cover_image' => $row['cover_image'],
            ':listing_summary' => $row['listing_summary'],
            ':blocks_json' => $row['blocks_json'],
            ':status' => $row['status'],
        ]);
        $id = (int) $pdo->lastInsertId();

        return self::find($id) ?? [];
    }

    /**
     * @return list<array<string, mixed>>
     */
    public static function allLatestFirst(): array
    {
        $pdo = Database::connection();
        $stmt = $pdo->query(
            'SELECT id, title, slug, banner_headline, banner_subtitle, banner_button_label, banner_button_link,
                    cover_image, listing_summary, blocks_json, status,
                    analytics_enabled, analytics_subject, analytics_first_name, analytics_last_name,
                    analytics_email, analytics_mobile, analytics_message, analytics_badges_json, analytics_field_keys_json,
                    view_count,
                    created_at, updated_at
             FROM blogs
             ORDER BY created_at DESC, id DESC'
        );

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Published posts only, light columns for public listing (newest first).
     *
     * @return list<array<string, mixed>>
     */
    public static function publishedListForPublic(): array
    {
        $pdo = Database::connection();
        $stmt = $pdo->query(
            "SELECT id, title, slug, cover_image, listing_summary, banner_subtitle, created_at
             FROM blogs
             WHERE status = 'published'
             ORDER BY created_at DESC, id DESC"
        );

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function findPublishedBySlug(string $slug): ?array
    {
        $slug = trim($slug);
        if ($slug === '') {
            return null;
        }
        $pdo = Database::connection();
        $stmt = $pdo->prepare(
            'SELECT id, title, slug, banner_headline, banner_subtitle, banner_button_label, banner_button_link,
                    cover_image, listing_summary, blocks_json, created_at,
                    analytics_enabled, analytics_subject, analytics_field_keys_json
             FROM blogs
             WHERE slug = :slug AND status = \'published\'
             LIMIT 1'
        );
        $stmt->execute([':slug' => $slug]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return $row === false ? null : $row;
    }

    public static function find(int $id): ?array
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare(
            'SELECT id, title, slug, banner_headline, banner_subtitle, banner_button_label, banner_button_link,
                    cover_image, listing_summary, blocks_json, status,
                    analytics_enabled, analytics_subject, analytics_first_name, analytics_last_name,
                    analytics_email, analytics_mobile, analytics_message, analytics_badges_json, analytics_field_keys_json,
                    view_count,
                    created_at, updated_at
             FROM blogs WHERE id = :id LIMIT 1'
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
        $allowed = [
            'title',
            'slug',
            'banner_headline',
            'banner_subtitle',
            'banner_button_label',
            'banner_button_link',
            'cover_image',
            'listing_summary',
            'blocks_json',
            'status',
            'analytics_enabled',
            'analytics_subject',
            'analytics_first_name',
            'analytics_last_name',
            'analytics_email',
            'analytics_mobile',
            'analytics_message',
            'analytics_badges_json',
            'analytics_field_keys_json',
        ];
        $parts = [];
        $params = [':id' => $id];

        foreach ($allowed as $col) {
            if (!array_key_exists($col, $fields)) {
                continue;
            }
            $v = $fields[$col];
            if ($v === null) {
                $parts[] = "`{$col}` = NULL";
            } else {
                $parts[] = "`{$col}` = :{$col}";
                $params[":{$col}"] = $v;
            }
        }

        if ($parts === []) {
            return false;
        }

        $pdo = Database::connection();
        $sql = 'UPDATE blogs SET ' . implode(', ', $parts) . ' WHERE id = :id';
        $stmt = $pdo->prepare($sql);

        return $stmt->execute($params);
    }

    public static function delete(int $id): bool
    {
        $existing = self::find($id);
        if ($existing === null) {
            return false;
        }
        BlogStorage::deleteBlogPostFiles($existing);
        $pdo = Database::connection();
        $stmt = $pdo->prepare('DELETE FROM blogs WHERE id = :id');
        $stmt->execute([':id' => $id]);

        return $stmt->rowCount() > 0;
    }

    public static function incrementPublishedViewCount(int $id): void
    {
        if ($id <= 0) {
            return;
        }
        $pdo = Database::connection();
        $stmt = $pdo->prepare("UPDATE blogs SET view_count = view_count + 1 WHERE id = :id AND status = 'published'");
        $stmt->execute([':id' => $id]);
    }

    /**
     * Per-post metrics for admin analytics (all blogs).
     *
     * @return list<array<string, mixed>>
     */
    public static function analyticsOverview(): array
    {
        $pdo = Database::connection();
        $stmt = $pdo->query(
            'SELECT b.id AS blog_id, b.title, b.slug AS blog_slug, b.created_at AS posted_at, b.updated_at, b.view_count,
                    COALESCE(s.cnt, 0) AS submissions_count,
                    s.last_submission_at
             FROM blogs b
             LEFT JOIN (
                 SELECT blog_id,
                        COUNT(*) AS cnt,
                        MAX(created_at) AS last_submission_at
                 FROM blog_user
                 GROUP BY blog_id
             ) s ON s.blog_id = b.id
             ORDER BY b.created_at DESC, b.id DESC'
        );

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /** Clear lead rows and reset view counter for one post (admin analytics action). */
    public static function resetAnalyticsMetrics(int $blogId): bool
    {
        if ($blogId <= 0) {
            return false;
        }
        BlogUserRepository::deleteAllForBlog($blogId);
        $pdo = Database::connection();
        $stmt = $pdo->prepare('UPDATE blogs SET view_count = 0 WHERE id = :id');
        $stmt->execute([':id' => $blogId]);

        return $stmt->rowCount() > 0;
    }
}
