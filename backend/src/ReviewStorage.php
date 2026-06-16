<?php

declare(strict_types=1);

namespace Lifescc;

use InvalidArgumentException;
use RuntimeException;

final class ReviewStorage
{
    /**
     * Save an optional profile image from $_FILES['profile_image'].
     * Returns relative web path (e.g. uploads/reviews/abc.jpg) or null if no file.
     *
     * @param array{name?: string, type?: string, tmp_name?: string, error?: int, size?: int} $file
     */
    public static function saveProfileImageIfPresent(array $file): ?string
    {
        $err = (int) ($file['error'] ?? UPLOAD_ERR_NO_FILE);
        if ($err === UPLOAD_ERR_NO_FILE) {
            return null;
        }
        if ($err !== UPLOAD_ERR_OK) {
            throw new InvalidArgumentException('Upload failed');
        }
        $size = (int) ($file['size'] ?? 0);
        if ($size > 2 * 1024 * 1024) {
            throw new InvalidArgumentException('Image must be 2MB or smaller');
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
        $publicDir = LIFESCC_PUBLIC_DIR . '/uploads/reviews';
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

        return 'uploads/reviews/' . $basename;
    }

    /** Remove a stored file under public/ if it exists (safe path, no traversal). */
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
}
