<?php

declare(strict_types=1);

namespace Lifescc;

final class Cors
{
    public static function applyHeaders(): void
    {
        $origin = getenv('CORS_ORIGIN') ?: 'http://localhost:5173';
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type');
    }

    public static function handlePreflight(): void
    {
        if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
            self::applyHeaders();
            http_response_code(204);
            exit;
        }
    }
}
