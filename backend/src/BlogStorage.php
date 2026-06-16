<?php

declare(strict_types=1);

namespace Lifescc;

use InvalidArgumentException;
use RuntimeException;

final class BlogStorage
{
    /**
     * Save optional cover image from $_FILES['cover_image'].
     *
     * @param array{name?: string, type?: string, tmp_name?: string, error?: int, size?: int} $file
     */
    public static function saveCoverImageIfPresent(array $file): ?string
    {
        $err = (int) ($file['error'] ?? UPLOAD_ERR_NO_FILE);
        if ($err === UPLOAD_ERR_NO_FILE) {
            return null;
        }
        if ($err !== UPLOAD_ERR_OK) {
            throw new InvalidArgumentException('Cover upload failed');
        }
        $size = (int) ($file['size'] ?? 0);
        if ($size > 4 * 1024 * 1024) {
            throw new InvalidArgumentException('Cover image must be 4MB or smaller');
        }
        $tmp = (string) ($file['tmp_name'] ?? '');
        if ($tmp === '' || !is_uploaded_file($tmp)) {
            throw new InvalidArgumentException('Invalid cover upload');
        }
        $finfo = new \finfo(FILEINFO_MIME_TYPE);
        $mime = $finfo->file($tmp);
        $map = [
            'image/jpeg' => 'jpg',
            'image/png' => 'png',
            'image/webp' => 'webp',
        ];
        if (!is_string($mime) || !isset($map[$mime])) {
            throw new InvalidArgumentException('Cover: use JPG, PNG, or WebP');
        }
        $ext = $map[$mime];
        $publicDir = LIFESCC_PUBLIC_DIR . '/uploads/blogs';
        if (!is_dir($publicDir)) {
            if (!mkdir($publicDir, 0755, true) && !is_dir($publicDir)) {
                throw new RuntimeException('Could not create upload directory');
            }
        }
        $basename = bin2hex(random_bytes(16)) . '.' . $ext;
        $dest = $publicDir . '/' . $basename;
        if (!move_uploaded_file($tmp, $dest)) {
            throw new RuntimeException('Could not save cover image');
        }

        return 'uploads/blogs/' . $basename;
    }

    /**
     * Inline / block image upload (required file).
     *
     * @param array{name?: string, type?: string, tmp_name?: string, error?: int, size?: int} $file
     */
    public static function saveBlogImage(array $file): string
    {
        $err = (int) ($file['error'] ?? UPLOAD_ERR_NO_FILE);
        if ($err === UPLOAD_ERR_NO_FILE) {
            throw new InvalidArgumentException('Choose an image file');
        }
        if ($err !== UPLOAD_ERR_OK) {
            throw new InvalidArgumentException('Image upload failed');
        }
        $size = (int) ($file['size'] ?? 0);
        if ($size > 4 * 1024 * 1024) {
            throw new InvalidArgumentException('Image must be 4MB or smaller');
        }
        $tmp = (string) ($file['tmp_name'] ?? '');
        if ($tmp === '' || !is_uploaded_file($tmp)) {
            throw new InvalidArgumentException('Invalid upload');
        }
        $finfo = new \finfo(FILEINFO_MIME_TYPE);
        $mime = $finfo->file($tmp);
        $map = [
            'image/jpeg' => 'jpg',
            'image/png' => 'png',
            'image/webp' => 'webp',
        ];
        if (!is_string($mime) || !isset($map[$mime])) {
            throw new InvalidArgumentException('Use JPG, PNG, or WebP');
        }
        $ext = $map[$mime];
        $publicDir = LIFESCC_PUBLIC_DIR . '/uploads/blogs';
        if (!is_dir($publicDir)) {
            if (!mkdir($publicDir, 0755, true) && !is_dir($publicDir)) {
                throw new RuntimeException('Could not create upload directory');
            }
        }
        $basename = bin2hex(random_bytes(16)) . '.' . $ext;
        $dest = $publicDir . '/' . $basename;
        if (!move_uploaded_file($tmp, $dest)) {
            throw new RuntimeException('Could not save image');
        }

        return 'uploads/blogs/' . $basename;
    }

    public static function deleteRelativeIfExists(?string $relative): void
    {
        if ($relative === null || $relative === '') {
            return;
        }
        $rel = ltrim(str_replace('\\', '/', $relative), '/');
        if ($rel === '' || str_contains($rel, '..')) {
            return;
        }
        $full = LIFESCC_PUBLIC_DIR . '/' . $rel;
        if (is_file($full)) {
            @unlink($full);
        }
    }

    /**
     * Remove cover and inline block images stored under uploads/blogs/ for this post.
     *
     * @param array<string, mixed> $row Row from BlogRepository::find
     */
    public static function deleteBlogPostFiles(array $row): void
    {
        $cover = $row['cover_image'] ?? null;
        self::deleteRelativeIfExists(is_string($cover) ? $cover : null);

        $raw = $row['blocks_json'] ?? '[]';
        $blocks = json_decode((string) $raw, true);
        if (!is_array($blocks)) {
            return;
        }
        foreach ($blocks as $b) {
            if (!is_array($b) || ($b['type'] ?? '') !== 'image') {
                continue;
            }
            $src = trim((string) ($b['src'] ?? ''));
            if ($src === '' || preg_match('#^https?://#i', $src) === 1) {
                continue;
            }
            $norm = ltrim(str_replace('\\', '/', $src), '/');
            if (str_starts_with($norm, 'uploads/blogs/')) {
                self::deleteRelativeIfExists($norm);
            }
        }
    }
}
