<?php

declare(strict_types=1);

$root = dirname(__DIR__);

if (!defined('LIFESCC_ROOT')) {
    define('LIFESCC_ROOT', $root);
}

/** Web document root: `backend/public` locally, or flat `test/` folder on shared hosting. */
if (!defined('LIFESCC_PUBLIC_DIR')) {
    define('LIFESCC_PUBLIC_DIR', is_dir($root . '/public') ? $root . '/public' : $root);
}

if (is_file($root . '/vendor/autoload.php')) {
    require $root . '/vendor/autoload.php';
}

$envFile = $root . '/.env';
if (is_readable($envFile)) {
    foreach (file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [] as $line) {
        if (str_starts_with(trim($line), '#')) {
            continue;
        }
        if (!str_contains($line, '=')) {
            continue;
        }
        [$k, $v] = explode('=', $line, 2);
        $k = trim($k);
        $v = trim($v, " \t\"'");
        if ($k !== '' && getenv($k) === false) {
            putenv("$k=$v");
            $_ENV[$k] = $v;
        }
    }
}
