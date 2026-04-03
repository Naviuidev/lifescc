<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

require dirname(__DIR__) . '/src/bootstrap.php';

use Lifescc\Database;

$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';

if ($path === '/api/health') {
    $dbOk = false;
    try {
        Database::connection()->query('SELECT 1');
        $dbOk = true;
    } catch (Throwable) {
        $dbOk = false;
    }
    echo json_encode([
        'status' => 'ok',
        'database' => $dbOk ? 'connected' : 'unavailable',
    ], JSON_THROW_ON_ERROR);
    exit;
}

http_response_code(404);
echo json_encode(['error' => 'Not found'], JSON_THROW_ON_ERROR);
