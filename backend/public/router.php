<?php

declare(strict_types=1);

/**
 * Router for PHP's built-in server (`php -S`). Apache uses .htaccess rewrite instead.
 * Serves real files as-is; everything else goes to index.php.
 */
$uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$uri = str_replace('\\', '/', $uri);

if (str_contains($uri, '..')) {
    http_response_code(400);
    exit;
}

$file = __DIR__ . $uri;

/*
 * PHP's built-in server often uses the *current working directory* as document root when the router
 * returns false, so /uploads/... would be resolved to backend/uploads/... instead of public/uploads/...
 * Serve files under this directory explicitly so review profile images and other static assets load.
 */
if ($uri !== '/' && is_file($file)) {
    $mime = @mime_content_type($file);
    if (is_string($mime) && $mime !== '') {
        header('Content-Type: ' . $mime);
    }
    header('Content-Length: ' . (string) filesize($file));
    readfile($file);
    exit;
}

require __DIR__ . '/index.php';
