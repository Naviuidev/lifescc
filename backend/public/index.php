<?php

declare(strict_types=1);

/**
 * Hostinger often uses index.php as the directory index before index.html.
 * Serve the React SPA unless this request is for /api/*.
 */
$requestPath = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$appDir = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? ''));
$appDir = rtrim($appDir, '/');
$relativePath = $requestPath;
if ($appDir !== '' && $appDir !== '/' && str_starts_with($requestPath, $appDir)) {
    $relativePath = substr($requestPath, strlen($appDir)) ?: '/';
}
if (!preg_match('#^/api(/|$)#', $relativePath)) {
    $indexHtml = __DIR__ . '/index.html';
    if (is_file($indexHtml)) {
        header('Content-Type: text/html; charset=utf-8');
        readfile($indexHtml);
        exit;
    }
}

header('Content-Type: application/json; charset=utf-8');

require is_file(__DIR__ . '/src/bootstrap.php')
    ? __DIR__ . '/src/bootstrap.php'
    : dirname(__DIR__) . '/src/bootstrap.php';

use Lifescc\BookingMailer;
use Lifescc\Cors;
use Lifescc\Database;
use Lifescc\ContactRepository;
use Lifescc\SlotRepository;
use Lifescc\DetailsSlotRepository;
use Lifescc\WeightLossRepository;
use Lifescc\SkinDataRepository;
use Lifescc\SkinDetailsRepository;
use Lifescc\SupportRepository;
use Lifescc\ReviewRepository;
use Lifescc\ReviewStorage;
use Lifescc\TestimonialVideoRepository;
use Lifescc\YoutubeEmbed;
use Lifescc\ChatbotRepository;
use Lifescc\ChatbotFlowRepository;
use Lifescc\ChatbotConversationRepository;
use Lifescc\FlowsRepository;
use Lifescc\ChatConvRepository;
use Lifescc\FranchiseRepository;
use Lifescc\FranchiseDistricts;
use Lifescc\BlogRepository;
use Lifescc\BlogUserRepository;
use Lifescc\BlogStorage;
use Lifescc\BlogBlocks;
use Lifescc\CustomChatbotRepository;
use Lifescc\ChatbotUserRepository;

Cors::handlePreflight();
Cors::applyHeaders();

$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$basePath = rtrim((string) (getenv('APP_BASE_PATH') ?: ''), '/');
if ($basePath !== '' && str_starts_with($path, $basePath)) {
    $path = substr($path, strlen($basePath)) ?: '/';
}
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($path === '/api/health' && $method === 'GET') {
    $dbOk = false;
    $diagnostic = null;
    try {
        Database::connection()->query('SELECT 1');
        $dbOk = true;
    } catch (Throwable $e) {
        $dbOk = false;
        if (getenv('API_DEBUG') === '1') {
            $diagnostic = $e->getMessage();
        }
    }
    $payload = [
        'status' => 'ok',
        'database' => $dbOk ? 'connected' : 'unavailable',
    ];
    if (!$dbOk) {
        $payload['hint'] =
            'Start MySQL/MariaDB on this machine, create the database (e.g. import database/init.sql from the repo root), and match DB_HOST/DB_PORT/DB_NAME/DB_USER/DB_PASS in backend/.env. Set API_DEBUG=1 in .env to include connection error details in diagnostic.';
        if ($diagnostic !== null) {
            $payload['diagnostic'] = $diagnostic;
        }
    }
    echo json_encode($payload, JSON_THROW_ON_ERROR);
    exit;
}

if ($path === '/api/contacts' && $method === 'GET') {
    try {
        $rows = ContactRepository::allLatestFirst();
        echo json_encode(['contacts' => $rows], JSON_THROW_ON_ERROR);
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not load contacts'], JSON_THROW_ON_ERROR);
    }
    exit;
}

if ($path === '/api/contacts' && $method === 'PATCH') {
    $raw = file_get_contents('php://input') ?: '';
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON'], JSON_THROW_ON_ERROR);
        exit;
    }

    $id = (int) ($data['id'] ?? 0);
    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid id'], JSON_THROW_ON_ERROR);
        exit;
    }

    $existing = ContactRepository::find($id);
    if ($existing === null) {
        http_response_code(404);
        echo json_encode(['error' => 'Contact not found'], JSON_THROW_ON_ERROR);
        exit;
    }

    $update = [];

    if (array_key_exists('status', $data)) {
        $st = trim((string) $data['status']);
        if (strlen($st) > 32) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid status'], JSON_THROW_ON_ERROR);
            exit;
        }
        $update['status'] = $st;
    }

    if (array_key_exists('contacted', $data)) {
        $c = (string) $data['contacted'];
        if (!in_array($c, ['not_contacted', 'contacted_remember'], true)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid contacted'], JSON_THROW_ON_ERROR);
            exit;
        }
        $update['contacted'] = $c;
        if ($c === 'not_contacted') {
            $update['customer_note'] = null;
        }
    }

    $effectiveContacted = $update['contacted'] ?? ($existing['contacted'] ?? 'not_contacted');
    if (array_key_exists('customer_note', $data)) {
        if ($effectiveContacted !== 'contacted_remember') {
            http_response_code(400);
            echo json_encode(['error' => 'customer_note only when contacted is contacted_remember'], JSON_THROW_ON_ERROR);
            exit;
        }
        $note = $data['customer_note'];
        $update['customer_note'] = $note === null || $note === '' ? null : (string) $note;
    }

    if ($update === []) {
        http_response_code(400);
        echo json_encode(['error' => 'No valid fields to update'], JSON_THROW_ON_ERROR);
        exit;
    }

    try {
        ContactRepository::update($id, $update);
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not update contact'], JSON_THROW_ON_ERROR);
        exit;
    }

    $row = ContactRepository::find($id);
    echo json_encode(['ok' => true, 'contact' => $row], JSON_THROW_ON_ERROR);
    exit;
}

if ($path === '/api/supports' && $method === 'GET') {
    try {
        $rows = SupportRepository::allLatestFirst();
        echo json_encode(['supports' => $rows], JSON_THROW_ON_ERROR);
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not load support requests'], JSON_THROW_ON_ERROR);
    }
    exit;
}

if ($path === '/api/supports' && $method === 'PATCH') {
    $raw = file_get_contents('php://input') ?: '';
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON'], JSON_THROW_ON_ERROR);
        exit;
    }

    $id = (int) ($data['id'] ?? 0);
    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid id'], JSON_THROW_ON_ERROR);
        exit;
    }

    $existing = SupportRepository::find($id);
    if ($existing === null) {
        http_response_code(404);
        echo json_encode(['error' => 'Support request not found'], JSON_THROW_ON_ERROR);
        exit;
    }

    $update = [];

    if (array_key_exists('status', $data)) {
        $st = trim((string) $data['status']);
        if (strlen($st) > 32) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid status'], JSON_THROW_ON_ERROR);
            exit;
        }
        $update['status'] = $st;
    }

    if (array_key_exists('contacted', $data)) {
        $c = (string) $data['contacted'];
        if (!in_array($c, ['not_contacted', 'contacted_remember'], true)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid contacted'], JSON_THROW_ON_ERROR);
            exit;
        }
        $update['contacted'] = $c;
        if ($c === 'not_contacted') {
            $update['customer_note'] = null;
        }
    }

    $effectiveContacted = $update['contacted'] ?? ($existing['contacted'] ?? 'not_contacted');
    if (array_key_exists('customer_note', $data)) {
        if ($effectiveContacted !== 'contacted_remember') {
            http_response_code(400);
            echo json_encode(['error' => 'customer_note only when contacted is contacted_remember'], JSON_THROW_ON_ERROR);
            exit;
        }
        $note = $data['customer_note'];
        $update['customer_note'] = $note === null || $note === '' ? null : (string) $note;
    }

    if ($update === []) {
        http_response_code(400);
        echo json_encode(['error' => 'No valid fields to update'], JSON_THROW_ON_ERROR);
        exit;
    }

    try {
        SupportRepository::update($id, $update);
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not update support request'], JSON_THROW_ON_ERROR);
        exit;
    }

    $row = SupportRepository::find($id);
    echo json_encode(['ok' => true, 'support' => $row], JSON_THROW_ON_ERROR);
    exit;
}

if ($path === '/api/support' && $method === 'POST') {
    $raw = file_get_contents('php://input') ?: '';
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON'], JSON_THROW_ON_ERROR);
        exit;
    }

    $fullName = trim((string) ($data['full_name'] ?? ''));
    $email = trim((string) ($data['email'] ?? ''));
    $mobile = trim((string) ($data['mobile'] ?? ''));
    $branchId = trim((string) ($data['branch_id'] ?? ''));
    $query = trim((string) ($data['query'] ?? ''));

    if ($fullName === '' || $email === '' || $mobile === '' || $branchId === '' || $query === '') {
        http_response_code(400);
        echo json_encode(['error' => 'All fields are required'], JSON_THROW_ON_ERROR);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid email'], JSON_THROW_ON_ERROR);
        exit;
    }

    if (!SupportRepository::isAllowedBranchId($branchId)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid branch'], JSON_THROW_ON_ERROR);
        exit;
    }

    try {
        $id = SupportRepository::create([
            'full_name' => $fullName,
            'email' => $email,
            'mobile' => $mobile,
            'branch_id' => $branchId,
            'query' => $query,
        ]);
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not save support request'], JSON_THROW_ON_ERROR);
        exit;
    }

    $emailSent = false;
    $emailError = null;
    try {
        BookingMailer::sendSupportAdminNotification([
            'id' => $id,
            'full_name' => $fullName,
            'email' => $email,
            'mobile' => $mobile,
            'branch_id' => $branchId,
            'query' => $query,
        ]);
        $emailSent = true;
    } catch (Throwable) {
        $emailError = 'Email could not be sent. Your request was saved.';
    }

    echo json_encode([
        'ok' => true,
        'id' => $id,
        'email_sent' => $emailSent,
        'message' => $emailSent ? null : $emailError,
    ], JSON_THROW_ON_ERROR);
    exit;
}

if ($path === '/api/contact' && $method === 'POST') {
    $raw = file_get_contents('php://input') ?: '';
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON'], JSON_THROW_ON_ERROR);
        exit;
    }

    $firstName = trim((string) ($data['first_name'] ?? ''));
    $lastName = trim((string) ($data['last_name'] ?? ''));
    $email = trim((string) ($data['email'] ?? ''));
    $countryCode = trim((string) ($data['country_code'] ?? '+91'));
    $phone = trim((string) ($data['phone'] ?? ''));
    $service = trim((string) ($data['service'] ?? ''));
    $submitMethod = trim((string) ($data['submit_method'] ?? ''));
    $message = trim((string) ($data['message'] ?? ''));

    if ($firstName === '' || $lastName === '' || $email === '' || $phone === '' || $service === '' || $submitMethod === '' || $message === '') {
        http_response_code(400);
        echo json_encode(['error' => 'All fields are required'], JSON_THROW_ON_ERROR);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid email'], JSON_THROW_ON_ERROR);
        exit;
    }

    $allowedMethods = ['email', 'phone'];
    if (!in_array($submitMethod, $allowedMethods, true)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid submit method'], JSON_THROW_ON_ERROR);
        exit;
    }

    if (strlen($countryCode) > 8) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid country code'], JSON_THROW_ON_ERROR);
        exit;
    }

    try {
        $id = ContactRepository::create([
            'first_name' => $firstName,
            'last_name' => $lastName,
            'email' => $email,
            'country_code' => $countryCode,
            'phone' => $phone,
            'service' => $service,
            'submit_method' => $submitMethod,
            'message' => $message,
        ]);
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not save contact'], JSON_THROW_ON_ERROR);
        exit;
    }

    $emailSent = false;
    $emailError = null;
    try {
        BookingMailer::sendContactAdminNotification([
            'id' => $id,
            'first_name' => $firstName,
            'last_name' => $lastName,
            'email' => $email,
            'country_code' => $countryCode,
            'phone' => $phone,
            'service' => $service,
            'submit_method' => $submitMethod,
            'message' => $message,
        ]);
        $emailSent = true;
    } catch (Throwable) {
        $emailError = 'Email could not be sent. Your message was saved.';
    }

    echo json_encode([
        'ok' => true,
        'id' => $id,
        'email_sent' => $emailSent,
        'message' => $emailSent ? null : $emailError,
    ], JSON_THROW_ON_ERROR);
    exit;
}

if ($path === '/api/slots' && $method === 'GET') {
    try {
        $rows = SlotRepository::allLatestFirst();
        echo json_encode(['slots' => $rows], JSON_THROW_ON_ERROR);
    } catch (Throwable $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not load slots'], JSON_THROW_ON_ERROR);
    }
    exit;
}

if ($path === '/api/slots' && $method === 'POST') {
    $raw = file_get_contents('php://input') ?: '';
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON'], JSON_THROW_ON_ERROR);
        exit;
    }

    $fullName = trim((string) ($data['full_name'] ?? ''));
    $email = trim((string) ($data['email'] ?? ''));
    $mobile = trim((string) ($data['mobile'] ?? ''));
    $service = trim((string) ($data['service'] ?? ''));
    $slotDate = trim((string) ($data['slot_date'] ?? ''));
    $slotTime = trim((string) ($data['slot_time'] ?? ''));

    if ($fullName === '' || $email === '' || $mobile === '' || $service === '' || $slotDate === '' || $slotTime === '') {
        http_response_code(400);
        echo json_encode(['error' => 'All fields are required'], JSON_THROW_ON_ERROR);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid email'], JSON_THROW_ON_ERROR);
        exit;
    }

    $dt = \DateTimeImmutable::createFromFormat('Y-m-d H:i', $slotDate . ' ' . $slotTime);
    if ($dt === false) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid date or time'], JSON_THROW_ON_ERROR);
        exit;
    }
    $slotDatetime = $dt->format('Y-m-d H:i:s');

    try {
        $id = SlotRepository::create([
            'full_name' => $fullName,
            'email' => $email,
            'mobile' => $mobile,
            'service' => $service,
            'slot_datetime' => $slotDatetime,
        ]);
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not save booking'], JSON_THROW_ON_ERROR);
        exit;
    }

    $display = $dt->format('l, F j, Y \a\t g:i A');
    $emailSent = false;
    $emailError = null;
    try {
        BookingMailer::sendAdminNotification($display);
        $emailSent = true;
    } catch (Throwable $e) {
        $emailError = 'Email could not be sent. Booking was saved.';
    }

    echo json_encode([
        'ok' => true,
        'id' => $id,
        'slot_datetime' => $slotDatetime,
        'email_sent' => $emailSent,
        'message' => $emailSent ? null : $emailError,
    ], JSON_THROW_ON_ERROR);
    exit;
}

if ($path === '/api/slots' && $method === 'PATCH') {
    $raw = file_get_contents('php://input') ?: '';
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON'], JSON_THROW_ON_ERROR);
        exit;
    }

    $id = (int) ($data['id'] ?? 0);
    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid id'], JSON_THROW_ON_ERROR);
        exit;
    }

    $existing = SlotRepository::find($id);
    if ($existing === null) {
        http_response_code(404);
        echo json_encode(['error' => 'Slot not found'], JSON_THROW_ON_ERROR);
        exit;
    }

    $update = [];

    if (array_key_exists('status', $data)) {
        $st = trim((string) $data['status']);
        if (strlen($st) > 32) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid status'], JSON_THROW_ON_ERROR);
            exit;
        }
        $update['status'] = $st;
    }

    if (array_key_exists('follow_up', $data)) {
        $fu = $data['follow_up'];
        if ($fu === null || $fu === '') {
            $update['follow_up'] = null;
        } else {
            $fu = trim((string) $fu);
            $d = \DateTimeImmutable::createFromFormat('Y-m-d', $fu);
            if ($d === false || $d->format('Y-m-d') !== $fu) {
                http_response_code(400);
                echo json_encode(['error' => 'follow_up must be Y-m-d'], JSON_THROW_ON_ERROR);
                exit;
            }
            $update['follow_up'] = $fu;
        }
    }

    if (array_key_exists('visited', $data)) {
        $v = (string) $data['visited'];
        if (!in_array($v, ['not_visited', 'visited'], true)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid visited'], JSON_THROW_ON_ERROR);
            exit;
        }
        $update['visited'] = $v;
    }

    if (array_key_exists('contacted', $data)) {
        $c = (string) $data['contacted'];
        if (!in_array($c, ['not_contacted', 'contacted_remember'], true)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid contacted'], JSON_THROW_ON_ERROR);
            exit;
        }
        $update['contacted'] = $c;
        if ($c === 'not_contacted') {
            $update['customer_note'] = null;
        }
    }

    $effectiveContacted = $update['contacted'] ?? ($existing['contacted'] ?? 'not_contacted');
    if (array_key_exists('customer_note', $data)) {
        if ($effectiveContacted !== 'contacted_remember') {
            http_response_code(400);
            echo json_encode(['error' => 'customer_note only when contacted is contacted_remember'], JSON_THROW_ON_ERROR);
            exit;
        }
        $note = $data['customer_note'];
        $update['customer_note'] = $note === null || $note === '' ? null : (string) $note;
    }

    if ($update === []) {
        http_response_code(400);
        echo json_encode(['error' => 'No valid fields to update'], JSON_THROW_ON_ERROR);
        exit;
    }

    try {
        SlotRepository::update($id, $update);
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not update slot'], JSON_THROW_ON_ERROR);
        exit;
    }

    $row = SlotRepository::find($id);
    echo json_encode(['ok' => true, 'slot' => $row], JSON_THROW_ON_ERROR);
    exit;
}

if ($path === '/api/details-slot' && $method === 'GET') {
    try {
        $rows = DetailsSlotRepository::allLatestFirst();
        echo json_encode(['details_slots' => $rows], JSON_THROW_ON_ERROR);
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not load consultation requests'], JSON_THROW_ON_ERROR);
    }
    exit;
}

if ($path === '/api/details-slot' && $method === 'POST') {
    $raw = file_get_contents('php://input') ?: '';
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON'], JSON_THROW_ON_ERROR);
        exit;
    }

    $fullName = trim((string) ($data['full_name'] ?? ''));
    $phone = trim((string) ($data['phone'] ?? ''));
    $locationId = trim((string) ($data['location_id'] ?? ''));
    $treatment = trim((string) ($data['treatment'] ?? ''));
    $message = trim((string) ($data['message'] ?? ''));
    $sourcePage = trim((string) ($data['source_page'] ?? 'book_an_appointment'));

    if ($fullName === '' || $phone === '' || $locationId === '' || $treatment === '' || $message === '') {
        http_response_code(400);
        echo json_encode(['error' => 'All fields are required'], JSON_THROW_ON_ERROR);
        exit;
    }

    if (!in_array($treatment, ['skin', 'hair', 'skin_hair'], true)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid treatment'], JSON_THROW_ON_ERROR);
        exit;
    }

    if (strlen($locationId) > 64) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid location'], JSON_THROW_ON_ERROR);
        exit;
    }

    if ($sourcePage === '' || strlen($sourcePage) > 64) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid source_page'], JSON_THROW_ON_ERROR);
        exit;
    }

    try {
        $id = DetailsSlotRepository::create([
            'full_name' => $fullName,
            'phone' => $phone,
            'location_id' => $locationId,
            'treatment' => $treatment,
            'message' => $message,
            'source_page' => $sourcePage,
        ]);
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not save request'], JSON_THROW_ON_ERROR);
        exit;
    }

    $emailSent = false;
    $emailError = null;
    try {
        BookingMailer::sendDetailsSlotAdminNotification([
            'id' => $id,
            'full_name' => $fullName,
            'phone' => $phone,
            'location_id' => $locationId,
            'treatment' => $treatment,
            'message' => $message,
        ]);
        $emailSent = true;
    } catch (Throwable $e) {
        $emailError = 'Email could not be sent. Your request was saved.';
    }

    echo json_encode([
        'ok' => true,
        'id' => $id,
        'email_sent' => $emailSent,
        'message' => $emailSent ? null : $emailError,
    ], JSON_THROW_ON_ERROR);
    exit;
}

if ($path === '/api/details-slot' && $method === 'PATCH') {
    $raw = file_get_contents('php://input') ?: '';
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON'], JSON_THROW_ON_ERROR);
        exit;
    }

    $id = (int) ($data['id'] ?? 0);
    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid id'], JSON_THROW_ON_ERROR);
        exit;
    }

    $existing = DetailsSlotRepository::find($id);
    if ($existing === null) {
        http_response_code(404);
        echo json_encode(['error' => 'Request not found'], JSON_THROW_ON_ERROR);
        exit;
    }

    $update = [];

    if (array_key_exists('status', $data)) {
        $st = trim((string) $data['status']);
        if (strlen($st) > 32) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid status'], JSON_THROW_ON_ERROR);
            exit;
        }
        $update['status'] = $st;
    }

    if (array_key_exists('follow_up', $data)) {
        $fu = $data['follow_up'];
        if ($fu === null || $fu === '') {
            $update['follow_up'] = null;
        } else {
            $fu = trim((string) $fu);
            $d = \DateTimeImmutable::createFromFormat('Y-m-d', $fu);
            if ($d === false || $d->format('Y-m-d') !== $fu) {
                http_response_code(400);
                echo json_encode(['error' => 'follow_up must be Y-m-d'], JSON_THROW_ON_ERROR);
                exit;
            }
            $update['follow_up'] = $fu;
        }
    }

    if (array_key_exists('visited', $data)) {
        $v = (string) $data['visited'];
        if (!in_array($v, ['not_visited', 'visited'], true)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid visited'], JSON_THROW_ON_ERROR);
            exit;
        }
        $update['visited'] = $v;
    }

    if (array_key_exists('contacted', $data)) {
        $c = (string) $data['contacted'];
        if (!in_array($c, ['not_contacted', 'contacted_remember'], true)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid contacted'], JSON_THROW_ON_ERROR);
            exit;
        }
        $update['contacted'] = $c;
        if ($c === 'not_contacted') {
            $update['customer_note'] = null;
        }
    }

    $effectiveContacted = $update['contacted'] ?? ($existing['contacted'] ?? 'not_contacted');
    if (array_key_exists('customer_note', $data)) {
        if ($effectiveContacted !== 'contacted_remember') {
            http_response_code(400);
            echo json_encode(['error' => 'customer_note only when contacted is contacted_remember'], JSON_THROW_ON_ERROR);
            exit;
        }
        $note = $data['customer_note'];
        $update['customer_note'] = $note === null || $note === '' ? null : (string) $note;
    }

    if ($update === []) {
        http_response_code(400);
        echo json_encode(['error' => 'No valid fields to update'], JSON_THROW_ON_ERROR);
        exit;
    }

    try {
        DetailsSlotRepository::update($id, $update);
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not update request'], JSON_THROW_ON_ERROR);
        exit;
    }

    $row = DetailsSlotRepository::find($id);
    echo json_encode(['ok' => true, 'details_slot' => $row], JSON_THROW_ON_ERROR);
    exit;
}

if ($path === '/api/weight-loss' && $method === 'GET') {
    try {
        $rows = WeightLossRepository::allLatestFirst();
        echo json_encode(['weight_loss_rows' => $rows], JSON_THROW_ON_ERROR);
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not load weight-loss requests'], JSON_THROW_ON_ERROR);
    }
    exit;
}

if ($path === '/api/weight-loss' && $method === 'POST') {
    $raw = file_get_contents('php://input') ?: '';
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON'], JSON_THROW_ON_ERROR);
        exit;
    }

    $fullName = trim((string) ($data['full_name'] ?? ''));
    $phone = trim((string) ($data['phone'] ?? ''));
    $locationId = trim((string) ($data['location_id'] ?? ''));
    $message = trim((string) ($data['message'] ?? ''));
    $sourcePage = trim((string) ($data['source_page'] ?? 'book_an_appointment'));

    if ($fullName === '' || $phone === '' || $locationId === '' || $message === '') {
        http_response_code(400);
        echo json_encode(['error' => 'All fields are required'], JSON_THROW_ON_ERROR);
        exit;
    }

    if (!in_array($sourcePage, ['coolsculpting', 'book_an_appointment', 'cryolipolysis', 'bmi', 'hifu_liposonix', 'cool_mini', 'figure_correction', 'inch_loss', 'non_surgical_liposuction', 'zimmer', 'weight_loss_treatment', 'program_360_weight_management', 'program_young_after_40', 'program_glp_1', 'program_diabetes_management_programme', 'program_super_woman', 'program_kids_nutrition'], true)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid source_page'], JSON_THROW_ON_ERROR);
        exit;
    }

    if (strlen($locationId) > 64) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid location'], JSON_THROW_ON_ERROR);
        exit;
    }

    try {
        $id = WeightLossRepository::create([
            'full_name' => $fullName,
            'phone' => $phone,
            'location_id' => $locationId,
            'message' => $message,
            'source_page' => $sourcePage,
        ]);
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not save request'], JSON_THROW_ON_ERROR);
        exit;
    }

    $emailSent = false;
    $emailError = null;
    try {
        BookingMailer::sendWeightLossAdminNotification([
            'id' => $id,
            'full_name' => $fullName,
            'phone' => $phone,
            'location_id' => $locationId,
            'message' => $message,
            'source_page' => $sourcePage,
        ]);
        $emailSent = true;
    } catch (Throwable $e) {
        $emailError = 'Email could not be sent. Your request was saved.';
    }

    echo json_encode([
        'ok' => true,
        'id' => $id,
        'email_sent' => $emailSent,
        'message' => $emailSent ? null : $emailError,
    ], JSON_THROW_ON_ERROR);
    exit;
}

if ($path === '/api/weight-loss' && $method === 'PATCH') {
    $raw = file_get_contents('php://input') ?: '';
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON'], JSON_THROW_ON_ERROR);
        exit;
    }

    $id = (int) ($data['id'] ?? 0);
    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid id'], JSON_THROW_ON_ERROR);
        exit;
    }

    $existing = WeightLossRepository::find($id);
    if ($existing === null) {
        http_response_code(404);
        echo json_encode(['error' => 'Request not found'], JSON_THROW_ON_ERROR);
        exit;
    }

    $update = [];

    if (array_key_exists('status', $data)) {
        $st = trim((string) $data['status']);
        if (strlen($st) > 32) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid status'], JSON_THROW_ON_ERROR);
            exit;
        }
        $update['status'] = $st;
    }

    if (array_key_exists('follow_up', $data)) {
        $fu = $data['follow_up'];
        if ($fu === null || $fu === '') {
            $update['follow_up'] = null;
        } else {
            $fu = trim((string) $fu);
            $d = \DateTimeImmutable::createFromFormat('Y-m-d', $fu);
            if ($d === false || $d->format('Y-m-d') !== $fu) {
                http_response_code(400);
                echo json_encode(['error' => 'follow_up must be Y-m-d'], JSON_THROW_ON_ERROR);
                exit;
            }
            $update['follow_up'] = $fu;
        }
    }

    if (array_key_exists('visited', $data)) {
        $v = (string) $data['visited'];
        if (!in_array($v, ['not_visited', 'visited'], true)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid visited'], JSON_THROW_ON_ERROR);
            exit;
        }
        $update['visited'] = $v;
    }

    if (array_key_exists('contacted', $data)) {
        $c = (string) $data['contacted'];
        if (!in_array($c, ['not_contacted', 'contacted_remember'], true)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid contacted'], JSON_THROW_ON_ERROR);
            exit;
        }
        $update['contacted'] = $c;
        if ($c === 'not_contacted') {
            $update['customer_note'] = null;
        }
    }

    $effectiveContacted = $update['contacted'] ?? ($existing['contacted'] ?? 'not_contacted');
    if (array_key_exists('customer_note', $data)) {
        if ($effectiveContacted !== 'contacted_remember') {
            http_response_code(400);
            echo json_encode(['error' => 'customer_note only when contacted is contacted_remember'], JSON_THROW_ON_ERROR);
            exit;
        }
        $note = $data['customer_note'];
        $update['customer_note'] = $note === null || $note === '' ? null : (string) $note;
    }

    if ($update === []) {
        http_response_code(400);
        echo json_encode(['error' => 'No valid fields to update'], JSON_THROW_ON_ERROR);
        exit;
    }

    try {
        WeightLossRepository::update($id, $update);
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not update request'], JSON_THROW_ON_ERROR);
        exit;
    }

    $row = WeightLossRepository::find($id);
    echo json_encode(['ok' => true, 'weight_loss' => $row], JSON_THROW_ON_ERROR);
    exit;
}

if ($path === '/api/skin-data' && $method === 'GET') {
    try {
        $rows = SkinDataRepository::allLatestFirst();
        echo json_encode(['skin_data_rows' => $rows], JSON_THROW_ON_ERROR);
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not load skin consultation requests'], JSON_THROW_ON_ERROR);
    }
    exit;
}

if ($path === '/api/skin-data' && $method === 'POST') {
    $raw = file_get_contents('php://input') ?: '';
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON'], JSON_THROW_ON_ERROR);
        exit;
    }

    $fullName = trim((string) ($data['full_name'] ?? ''));
    $phone = trim((string) ($data['phone'] ?? ''));
    $locationId = trim((string) ($data['location_id'] ?? ''));
    $message = trim((string) ($data['message'] ?? ''));
    $sourcePage = trim((string) ($data['source_page'] ?? 'book_an_appointment'));
    $serviceLabel = trim((string) ($data['service_label'] ?? ''));

    if ($fullName === '' || $phone === '' || $locationId === '' || $message === '' || $serviceLabel === '') {
        http_response_code(400);
        echo json_encode(['error' => 'All fields are required'], JSON_THROW_ON_ERROR);
        exit;
    }

    if (strlen($serviceLabel) > 255) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid service_label'], JSON_THROW_ON_ERROR);
        exit;
    }

    if ($sourcePage === '' || strlen($sourcePage) > 64 || !preg_match('/^[a-z][a-z0-9_]*$/', $sourcePage)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid source_page'], JSON_THROW_ON_ERROR);
        exit;
    }

    if (strlen($locationId) > 64) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid location'], JSON_THROW_ON_ERROR);
        exit;
    }

    try {
        $id = SkinDataRepository::create([
            'full_name' => $fullName,
            'phone' => $phone,
            'location_id' => $locationId,
            'message' => $message,
            'service_label' => $serviceLabel,
            'source_page' => $sourcePage,
        ]);
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not save request'], JSON_THROW_ON_ERROR);
        exit;
    }

    $emailSent = false;
    $emailError = null;
    try {
        BookingMailer::sendSkinDataAdminNotification([
            'id' => $id,
            'full_name' => $fullName,
            'phone' => $phone,
            'location_id' => $locationId,
            'message' => $message,
            'service_label' => $serviceLabel,
            'source_page' => $sourcePage,
        ]);
        $emailSent = true;
    } catch (Throwable) {
        $emailError = 'Email could not be sent. Your request was saved.';
    }

    echo json_encode([
        'ok' => true,
        'id' => $id,
        'email_sent' => $emailSent,
        'message' => $emailSent ? null : $emailError,
    ], JSON_THROW_ON_ERROR);
    exit;
}

if ($path === '/api/skin-data' && $method === 'PATCH') {
    $raw = file_get_contents('php://input') ?: '';
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON'], JSON_THROW_ON_ERROR);
        exit;
    }

    $id = (int) ($data['id'] ?? 0);
    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid id'], JSON_THROW_ON_ERROR);
        exit;
    }

    $existing = SkinDataRepository::find($id);
    if ($existing === null) {
        http_response_code(404);
        echo json_encode(['error' => 'Request not found'], JSON_THROW_ON_ERROR);
        exit;
    }

    $update = [];

    if (array_key_exists('status', $data)) {
        $st = trim((string) $data['status']);
        if (strlen($st) > 32) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid status'], JSON_THROW_ON_ERROR);
            exit;
        }
        $update['status'] = $st;
    }

    if (array_key_exists('follow_up', $data)) {
        $fu = $data['follow_up'];
        if ($fu === null || $fu === '') {
            $update['follow_up'] = null;
        } else {
            $fu = trim((string) $fu);
            $d = \DateTimeImmutable::createFromFormat('Y-m-d', $fu);
            if ($d === false || $d->format('Y-m-d') !== $fu) {
                http_response_code(400);
                echo json_encode(['error' => 'follow_up must be Y-m-d'], JSON_THROW_ON_ERROR);
                exit;
            }
            $update['follow_up'] = $fu;
        }
    }

    if (array_key_exists('visited', $data)) {
        $v = (string) $data['visited'];
        if (!in_array($v, ['not_visited', 'visited'], true)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid visited'], JSON_THROW_ON_ERROR);
            exit;
        }
        $update['visited'] = $v;
    }

    if (array_key_exists('contacted', $data)) {
        $c = (string) $data['contacted'];
        if (!in_array($c, ['not_contacted', 'contacted_remember'], true)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid contacted'], JSON_THROW_ON_ERROR);
            exit;
        }
        $update['contacted'] = $c;
        if ($c === 'not_contacted') {
            $update['customer_note'] = null;
        }
    }

    $effectiveContacted = $update['contacted'] ?? ($existing['contacted'] ?? 'not_contacted');
    if (array_key_exists('customer_note', $data)) {
        if ($effectiveContacted !== 'contacted_remember') {
            http_response_code(400);
            echo json_encode(['error' => 'customer_note only when contacted is contacted_remember'], JSON_THROW_ON_ERROR);
            exit;
        }
        $note = $data['customer_note'];
        $update['customer_note'] = $note === null || $note === '' ? null : (string) $note;
    }

    if ($update === []) {
        http_response_code(400);
        echo json_encode(['error' => 'No valid fields to update'], JSON_THROW_ON_ERROR);
        exit;
    }

    try {
        SkinDataRepository::update($id, $update);
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not update request'], JSON_THROW_ON_ERROR);
        exit;
    }

    $row = SkinDataRepository::find($id);
    echo json_encode(['ok' => true, 'skin_data' => $row], JSON_THROW_ON_ERROR);
    exit;
}

if ($path === '/api/skin-details' && $method === 'GET') {
    try {
        $rows = SkinDetailsRepository::allLatestFirst();
        echo json_encode(['skin_details_rows' => $rows], JSON_THROW_ON_ERROR);
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not load skin consultation requests'], JSON_THROW_ON_ERROR);
    }
    exit;
}

if ($path === '/api/skin-details' && $method === 'POST') {
    $raw = file_get_contents('php://input') ?: '';
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON'], JSON_THROW_ON_ERROR);
        exit;
    }

    $fullName = trim((string) ($data['full_name'] ?? ''));
    $phone = trim((string) ($data['phone'] ?? ''));
    $locationId = trim((string) ($data['location_id'] ?? ''));
    $message = trim((string) ($data['message'] ?? ''));
    $sourcePage = trim((string) ($data['source_page'] ?? 'book_an_appointment'));
    $serviceLabel = trim((string) ($data['service_label'] ?? ''));

    if ($fullName === '' || $phone === '' || $locationId === '' || $message === '' || $serviceLabel === '') {
        http_response_code(400);
        echo json_encode(['error' => 'All fields are required'], JSON_THROW_ON_ERROR);
        exit;
    }

    if (strlen($serviceLabel) > 255) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid service_label'], JSON_THROW_ON_ERROR);
        exit;
    }

    if ($sourcePage === '' || strlen($sourcePage) > 64 || !preg_match('/^[a-z][a-z0-9_]*$/', $sourcePage)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid source_page'], JSON_THROW_ON_ERROR);
        exit;
    }

    if (strlen($locationId) > 64) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid location'], JSON_THROW_ON_ERROR);
        exit;
    }

    try {
        $id = SkinDetailsRepository::create([
            'full_name' => $fullName,
            'phone' => $phone,
            'location_id' => $locationId,
            'message' => $message,
            'service_label' => $serviceLabel,
            'source_page' => $sourcePage,
        ]);
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not save request'], JSON_THROW_ON_ERROR);
        exit;
    }

    $emailSent = false;
    $emailError = null;
    try {
        BookingMailer::sendSkinDataAdminNotification([
            'id' => $id,
            'full_name' => $fullName,
            'phone' => $phone,
            'location_id' => $locationId,
            'message' => $message,
            'service_label' => $serviceLabel,
            'source_page' => $sourcePage,
        ]);
        $emailSent = true;
    } catch (Throwable) {
        $emailError = 'Email could not be sent. Your request was saved.';
    }

    echo json_encode([
        'ok' => true,
        'id' => $id,
        'email_sent' => $emailSent,
        'message' => $emailSent ? null : $emailError,
    ], JSON_THROW_ON_ERROR);
    exit;
}

if ($path === '/api/skin-details' && $method === 'PATCH') {
    $raw = file_get_contents('php://input') ?: '';
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON'], JSON_THROW_ON_ERROR);
        exit;
    }

    $id = (int) ($data['id'] ?? 0);
    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid id'], JSON_THROW_ON_ERROR);
        exit;
    }

    $existing = SkinDetailsRepository::find($id);
    if ($existing === null) {
        http_response_code(404);
        echo json_encode(['error' => 'Request not found'], JSON_THROW_ON_ERROR);
        exit;
    }

    $update = [];

    if (array_key_exists('status', $data)) {
        $st = trim((string) $data['status']);
        if (strlen($st) > 32) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid status'], JSON_THROW_ON_ERROR);
            exit;
        }
        $update['status'] = $st;
    }

    if (array_key_exists('follow_up', $data)) {
        $fu = $data['follow_up'];
        if ($fu === null || $fu === '') {
            $update['follow_up'] = null;
        } else {
            $fu = trim((string) $fu);
            $d = \DateTimeImmutable::createFromFormat('Y-m-d', $fu);
            if ($d === false || $d->format('Y-m-d') !== $fu) {
                http_response_code(400);
                echo json_encode(['error' => 'follow_up must be Y-m-d'], JSON_THROW_ON_ERROR);
                exit;
            }
            $update['follow_up'] = $fu;
        }
    }

    if (array_key_exists('visited', $data)) {
        $v = (string) $data['visited'];
        if (!in_array($v, ['not_visited', 'visited'], true)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid visited'], JSON_THROW_ON_ERROR);
            exit;
        }
        $update['visited'] = $v;
    }

    if (array_key_exists('contacted', $data)) {
        $c = (string) $data['contacted'];
        if (!in_array($c, ['not_contacted', 'contacted_remember'], true)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid contacted'], JSON_THROW_ON_ERROR);
            exit;
        }
        $update['contacted'] = $c;
        if ($c === 'not_contacted') {
            $update['customer_note'] = null;
        }
    }

    $effectiveContacted = $update['contacted'] ?? ($existing['contacted'] ?? 'not_contacted');
    if (array_key_exists('customer_note', $data)) {
        if ($effectiveContacted !== 'contacted_remember') {
            http_response_code(400);
            echo json_encode(['error' => 'customer_note only when contacted is contacted_remember'], JSON_THROW_ON_ERROR);
            exit;
        }
        $note = $data['customer_note'];
        $update['customer_note'] = $note === null || $note === '' ? null : (string) $note;
    }

    if ($update === []) {
        http_response_code(400);
        echo json_encode(['error' => 'No valid fields to update'], JSON_THROW_ON_ERROR);
        exit;
    }

    try {
        SkinDetailsRepository::update($id, $update);
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not update request'], JSON_THROW_ON_ERROR);
        exit;
    }

    $row = SkinDetailsRepository::find($id);
    echo json_encode(['ok' => true, 'skin_detail' => $row], JSON_THROW_ON_ERROR);
    exit;
}

if ($path === '/api/franchises' && $method === 'GET') {
    try {
        $rows = FranchiseRepository::allLatestFirst();
        echo json_encode(['franchises' => $rows], JSON_THROW_ON_ERROR);
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not load franchise inquiries'], JSON_THROW_ON_ERROR);
    }
    exit;
}

if ($path === '/api/franchises' && $method === 'POST') {
    $raw = file_get_contents('php://input') ?: '';
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON'], JSON_THROW_ON_ERROR);
        exit;
    }

    $state = trim((string) ($data['state'] ?? ''));
    $district = trim((string) ($data['district'] ?? ''));
    $planningOption = trim((string) ($data['planning_option'] ?? ''));
    $fullName = trim((string) ($data['full_name'] ?? ''));
    $email = trim((string) ($data['email'] ?? ''));
    $mobile = trim((string) ($data['mobile'] ?? ''));
    $customDate = isset($data['planning_date']) ? trim((string) $data['planning_date']) : '';

    if ($fullName === '' || $email === '' || $mobile === '' || $state === '' || $district === '' || $planningOption === '') {
        http_response_code(400);
        echo json_encode(['error' => 'All fields are required'], JSON_THROW_ON_ERROR);
        exit;
    }

    if (!in_array($state, FranchiseDistricts::STATES, true)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid state'], JSON_THROW_ON_ERROR);
        exit;
    }

    if (!FranchiseDistricts::isValidDistrict($state, $district)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid district for selected state'], JSON_THROW_ON_ERROR);
        exit;
    }

    if (!in_array($planningOption, ['this_week', 'next_month', 'custom'], true)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid planning option'], JSON_THROW_ON_ERROR);
        exit;
    }

    if ($planningOption === 'custom' && $customDate === '') {
        http_response_code(400);
        echo json_encode(['error' => 'Date is required for custom planning'], JSON_THROW_ON_ERROR);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid email'], JSON_THROW_ON_ERROR);
        exit;
    }

    try {
        [$pStart, $pEnd] = FranchiseRepository::resolvePlanningWindow(
            $planningOption,
            $planningOption === 'custom' ? $customDate : null,
        );
    } catch (Throwable) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid planning dates'], JSON_THROW_ON_ERROR);
        exit;
    }

    try {
        $id = FranchiseRepository::create([
            'state' => $state,
            'district' => $district,
            'planning_option' => $planningOption,
            'planning_start' => $pStart,
            'planning_end' => $pEnd,
            'full_name' => $fullName,
            'email' => $email,
            'mobile' => $mobile,
        ]);
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not save inquiry'], JSON_THROW_ON_ERROR);
        exit;
    }

    echo json_encode([
        'ok' => true,
        'id' => $id,
        'planning_start' => $pStart,
        'planning_end' => $pEnd,
    ], JSON_THROW_ON_ERROR);
    exit;
}

if ($path === '/api/franchises' && $method === 'PATCH') {
    $raw = file_get_contents('php://input') ?: '';
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON'], JSON_THROW_ON_ERROR);
        exit;
    }

    $id = (int) ($data['id'] ?? 0);
    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid id'], JSON_THROW_ON_ERROR);
        exit;
    }

    $existing = FranchiseRepository::find($id);
    if ($existing === null) {
        http_response_code(404);
        echo json_encode(['error' => 'Franchise inquiry not found'], JSON_THROW_ON_ERROR);
        exit;
    }

    $update = [];

    if (array_key_exists('status', $data)) {
        $st = trim((string) $data['status']);
        if (strlen($st) > 32) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid status'], JSON_THROW_ON_ERROR);
            exit;
        }
        $update['status'] = $st;
    }

    if (array_key_exists('follow_up', $data)) {
        $fu = $data['follow_up'];
        if ($fu === null || $fu === '') {
            $update['follow_up'] = null;
        } else {
            $fu = trim((string) $fu);
            $d = \DateTimeImmutable::createFromFormat('Y-m-d', $fu);
            if ($d === false || $d->format('Y-m-d') !== $fu) {
                http_response_code(400);
                echo json_encode(['error' => 'follow_up must be Y-m-d'], JSON_THROW_ON_ERROR);
                exit;
            }
            $update['follow_up'] = $fu;
        }
    }

    if (array_key_exists('contacted', $data)) {
        $c = (string) $data['contacted'];
        if (!in_array($c, ['not_contacted', 'contacted_remember'], true)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid contacted'], JSON_THROW_ON_ERROR);
            exit;
        }
        $update['contacted'] = $c;
        if ($c === 'not_contacted') {
            $update['customer_note'] = null;
        }
    }

    $effectiveContacted = $update['contacted'] ?? ($existing['contacted'] ?? 'not_contacted');
    if (array_key_exists('customer_note', $data)) {
        if ($effectiveContacted !== 'contacted_remember') {
            http_response_code(400);
            echo json_encode(['error' => 'customer_note only when contacted is contacted_remember'], JSON_THROW_ON_ERROR);
            exit;
        }
        $note = $data['customer_note'];
        $update['customer_note'] = $note === null || $note === '' ? null : (string) $note;
    }

    if ($update === []) {
        http_response_code(400);
        echo json_encode(['error' => 'No valid fields to update'], JSON_THROW_ON_ERROR);
        exit;
    }

    try {
        FranchiseRepository::update($id, $update);
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not update franchise inquiry'], JSON_THROW_ON_ERROR);
        exit;
    }

    $row = FranchiseRepository::find($id);
    echo json_encode(['ok' => true, 'franchise' => $row], JSON_THROW_ON_ERROR);
    exit;
}

if ($path === '/api/blogs/public' && $method === 'GET') {
    try {
        $rows = BlogRepository::publishedListForPublic();
        echo json_encode(['blogs' => $rows], JSON_THROW_ON_ERROR);
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not load blogs'], JSON_THROW_ON_ERROR);
    }
    exit;
}

if ($path === '/api/blog-leads' && $method === 'GET') {
    try {
        $rows = BlogUserRepository::allWithBlog();
        echo json_encode(['leads' => $rows], JSON_THROW_ON_ERROR);
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not load blog leads'], JSON_THROW_ON_ERROR);
    }
    exit;
}

if (preg_match('#^/api/blog-leads/(\d+)$#', $path, $blogLeadPatchM) && $method === 'PATCH') {
    $lid = (int) $blogLeadPatchM[1];
    if ($lid <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid id'], JSON_THROW_ON_ERROR);
        exit;
    }
    $existing = BlogUserRepository::findById($lid);
    if ($existing === null) {
        http_response_code(404);
        echo json_encode(['error' => 'Lead not found'], JSON_THROW_ON_ERROR);
        exit;
    }
    $raw = file_get_contents('php://input') ?: '';
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON'], JSON_THROW_ON_ERROR);
        exit;
    }
    $statusOk = ['pending', 'confirmed', 'cancelled', 'completed'];
    $fields = [];
    if (array_key_exists('status', $data)) {
        $st = trim((string) $data['status']);
        if (!in_array($st, $statusOk, true)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid status'], JSON_THROW_ON_ERROR);
            exit;
        }
        $fields['status'] = $st;
    }
    if (array_key_exists('contacted', $data)) {
        $c = (string) $data['contacted'];
        if (!in_array($c, ['not_contacted', 'contacted_remember'], true)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid contacted'], JSON_THROW_ON_ERROR);
            exit;
        }
        $fields['contacted'] = $c;
    }
    if (array_key_exists('customer_note', $data)) {
        $note = $data['customer_note'];
        $fields['customer_note'] = ($note === null || $note === '') ? null : (string) $note;
    }
    if ($fields === []) {
        http_response_code(400);
        echo json_encode(['error' => 'No updatable fields'], JSON_THROW_ON_ERROR);
        exit;
    }
    try {
        $ok = BlogUserRepository::update($lid, $fields);
        if (!$ok) {
            http_response_code(500);
            echo json_encode(['error' => 'Could not update lead'], JSON_THROW_ON_ERROR);
            exit;
        }
        $row = BlogUserRepository::findById($lid);
        echo json_encode(['lead' => $row], JSON_THROW_ON_ERROR);
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not update lead'], JSON_THROW_ON_ERROR);
    }
    exit;
}

if (preg_match('#^/api/blog-leads/(\d+)$#', $path, $blogLeadDelM) && $method === 'DELETE') {
    $lid = (int) $blogLeadDelM[1];
    if ($lid <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid id'], JSON_THROW_ON_ERROR);
        exit;
    }
    try {
        $ok = BlogUserRepository::deleteById($lid);
        if (!$ok) {
            http_response_code(404);
            echo json_encode(['error' => 'Lead not found'], JSON_THROW_ON_ERROR);
            exit;
        }
        echo json_encode(['ok' => true], JSON_THROW_ON_ERROR);
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not delete lead'], JSON_THROW_ON_ERROR);
    }
    exit;
}

if ($path === '/api/blogs/analytics-overview' && $method === 'GET') {
    try {
        $rows = BlogRepository::analyticsOverview();
        echo json_encode(['rows' => $rows], JSON_THROW_ON_ERROR);
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not load analytics'], JSON_THROW_ON_ERROR);
    }
    exit;
}

if (preg_match('#^/api/blogs/slug/(.+)/lead$#', $path, $blogLeadM) && $method === 'POST') {
    $slug = rawurldecode((string) $blogLeadM[1]);
    $fieldCatalog = ['first_name', 'last_name', 'email', 'mobile', 'message'];
    try {
        $blog = BlogRepository::findPublishedBySlug($slug);
        if ($blog === null) {
            http_response_code(404);
            echo json_encode(['error' => 'Blog not found'], JSON_THROW_ON_ERROR);
            exit;
        }
        $enabled = (int) ($blog['analytics_enabled'] ?? 0) === 1;
        if (!$enabled) {
            http_response_code(403);
            echo json_encode(['error' => 'Lead form is not enabled for this article'], JSON_THROW_ON_ERROR);
            exit;
        }
        $raw = file_get_contents('php://input') ?: '';
        $data = json_decode($raw, true);
        if (!is_array($data)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid JSON'], JSON_THROW_ON_ERROR);
            exit;
        }

        $keysJson = $blog['analytics_field_keys_json'] ?? null;
        $keys = [];
        if ($keysJson !== null && $keysJson !== '') {
            $decoded = json_decode((string) $keysJson, true);
            if (is_array($decoded)) {
                foreach ($decoded as $k) {
                    if (is_string($k) && in_array($k, $fieldCatalog, true)) {
                        $keys[] = $k;
                    }
                }
            }
        }
        if ($keys === []) {
            $keys = $fieldCatalog;
        }

        $row = ['blog_id' => (int) $blog['id']];
        $errors = [];

        foreach ($keys as $k) {
            $v = isset($data[$k]) ? trim((string) $data[$k]) : '';
            if ($v === '') {
                $errors[] = $k;
                continue;
            }
            if ($k === 'email' && filter_var($v, FILTER_VALIDATE_EMAIL) === false) {
                $errors[] = $k;
                continue;
            }
            if ($k === 'message') {
                $row['message'] = $v;
            } elseif ($k === 'mobile') {
                $row['mobile_number'] = $v;
            } else {
                $row[$k] = $v;
            }
        }

        if ($errors !== []) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing or invalid fields', 'fields' => $errors], JSON_THROW_ON_ERROR);
            exit;
        }

        foreach (['first_name', 'last_name', 'email', 'mobile_number', 'message'] as $col) {
            if (!array_key_exists($col, $row)) {
                $row[$col] = null;
            }
        }

        $id = BlogUserRepository::create($row);
        echo json_encode(['ok' => true, 'id' => $id], JSON_THROW_ON_ERROR);
    } catch (Throwable $e) {
        http_response_code(500);
        $msg = $e->getMessage();
        $hint =
            (str_contains($msg, 'blog_user') && str_contains($msg, "doesn't exist"))
            || str_contains($msg, 'Unknown table')
                ? 'Database table blog_user is missing. Run database/migrations/011_blog_user_table.sql (or backend/migrations/020_blog_user_table.sql) on your DB.'
                : 'Could not save submission';
        echo json_encode(['error' => $hint], JSON_THROW_ON_ERROR);
    }
    exit;
}

if (preg_match('#^/api/blogs/slug/(.+)$#', $path, $blogSlugM) && $method === 'GET') {
    $slug = rawurldecode((string) $blogSlugM[1]);
    try {
        $row = BlogRepository::findPublishedBySlug($slug);
        if ($row === null) {
            http_response_code(404);
            echo json_encode(['error' => 'Blog not found'], JSON_THROW_ON_ERROR);
            exit;
        }
        BlogRepository::incrementPublishedViewCount((int) $row['id']);
        echo json_encode(['blog' => $row], JSON_THROW_ON_ERROR);
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not load blog'], JSON_THROW_ON_ERROR);
    }
    exit;
}

if ($path === '/api/blogs' && $method === 'GET') {
    try {
        $rows = BlogRepository::allLatestFirst();
        echo json_encode(['blogs' => $rows], JSON_THROW_ON_ERROR);
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not load blogs'], JSON_THROW_ON_ERROR);
    }
    exit;
}

if (preg_match('#^/api/blogs/(\d+)$#', $path, $blogIdM) && $method === 'GET') {
    $bid = (int) $blogIdM[1];
    try {
        $row = BlogRepository::find($bid);
        if ($row === null) {
            http_response_code(404);
            echo json_encode(['error' => 'Blog not found'], JSON_THROW_ON_ERROR);
            exit;
        }
        echo json_encode(['blog' => $row], JSON_THROW_ON_ERROR);
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not load blog'], JSON_THROW_ON_ERROR);
    }
    exit;
}

if (preg_match('#^/api/blogs/(\d+)/analytics-data$#', $path, $blogAnClearM) && $method === 'DELETE') {
    $bid = (int) $blogAnClearM[1];
    if ($bid <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid id'], JSON_THROW_ON_ERROR);
        exit;
    }
    try {
        if (BlogRepository::find($bid) === null) {
            http_response_code(404);
            echo json_encode(['error' => 'Blog not found'], JSON_THROW_ON_ERROR);
            exit;
        }
        BlogRepository::resetAnalyticsMetrics($bid);
        echo json_encode(['ok' => true], JSON_THROW_ON_ERROR);
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not clear analytics'], JSON_THROW_ON_ERROR);
    }
    exit;
}

if (preg_match('#^/api/blogs/(\d+)$#', $path, $blogDelM) && $method === 'DELETE') {
    $bid = (int) $blogDelM[1];
    if ($bid <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid id'], JSON_THROW_ON_ERROR);
        exit;
    }
    try {
        $ok = BlogRepository::delete($bid);
        if (!$ok) {
            http_response_code(404);
            echo json_encode(['error' => 'Blog not found'], JSON_THROW_ON_ERROR);
            exit;
        }
        echo json_encode(['ok' => true], JSON_THROW_ON_ERROR);
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not delete blog'], JSON_THROW_ON_ERROR);
    }
    exit;
}

if (preg_match('#^/api/blogs/(\d+)/analytics$#', $path, $anM) && $method === 'POST') {
    $bid = (int) $anM[1];
    if ($bid <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid id'], JSON_THROW_ON_ERROR);
        exit;
    }
    $blog = BlogRepository::find($bid);
    if ($blog === null) {
        http_response_code(404);
        echo json_encode(['error' => 'Blog not found'], JSON_THROW_ON_ERROR);
        exit;
    }
    $raw = file_get_contents('php://input') ?: '';
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON'], JSON_THROW_ON_ERROR);
        exit;
    }

    $badgeCatalog = [
        'Page views',
        'Lead capture',
        'Conversion tracking',
        'Newsletter signup',
        'Remarketing',
    ];

    $fieldKeyCatalog = ['first_name', 'last_name', 'email', 'mobile', 'message'];

    $subject = trim((string) ($data['subject'] ?? ''));
    if ($subject === '') {
        $subject = trim((string) ($blog['title'] ?? ''));
    }
    if (strlen($subject) > 500) {
        http_response_code(400);
        echo json_encode(['error' => 'Subject too long'], JSON_THROW_ON_ERROR);
        exit;
    }

    $badgesRaw = $data['badges'] ?? [];
    if (!is_array($badgesRaw)) {
        http_response_code(400);
        echo json_encode(['error' => 'badges must be an array'], JSON_THROW_ON_ERROR);
        exit;
    }
    $badges = [];
    foreach ($badgesRaw as $b) {
        if (!is_string($b)) {
            continue;
        }
        $b = trim($b);
        if (in_array($b, $badgeCatalog, true)) {
            $badges[] = $b;
        }
    }
    $badges = array_values(array_unique($badges));
    if ($badges === []) {
        http_response_code(400);
        echo json_encode(['error' => 'Select at least one tracking badge'], JSON_THROW_ON_ERROR);
        exit;
    }

    $fieldKeysRaw = $data['field_keys'] ?? [];
    if (!is_array($fieldKeysRaw)) {
        http_response_code(400);
        echo json_encode(['error' => 'field_keys must be an array'], JSON_THROW_ON_ERROR);
        exit;
    }
    $fieldKeys = [];
    foreach ($fieldKeysRaw as $k) {
        if (!is_string($k)) {
            continue;
        }
        $k = trim($k);
        if (in_array($k, $fieldKeyCatalog, true)) {
            $fieldKeys[] = $k;
        }
    }
    $fieldKeys = array_values(array_unique($fieldKeys));
    if ($fieldKeys === []) {
        http_response_code(400);
        echo json_encode(['error' => 'Select at least one form field badge'], JSON_THROW_ON_ERROR);
        exit;
    }

    try {
        $badgesJson = json_encode($badges, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE);
        $fieldKeysJson = json_encode($fieldKeys, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE);
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not encode analytics JSON'], JSON_THROW_ON_ERROR);
        exit;
    }

    try {
        BlogRepository::update($bid, [
            'analytics_enabled' => 1,
            'analytics_subject' => $subject,
            'analytics_first_name' => null,
            'analytics_last_name' => null,
            'analytics_email' => null,
            'analytics_mobile' => null,
            'analytics_message' => null,
            'analytics_badges_json' => $badgesJson,
            'analytics_field_keys_json' => $fieldKeysJson,
        ]);
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not save analytics'], JSON_THROW_ON_ERROR);
        exit;
    }

    $row = BlogRepository::find($bid);
    echo json_encode(['ok' => true, 'blog' => $row], JSON_THROW_ON_ERROR);
    exit;
}

/*
 * Blog create/update use POST + multipart/form-data so PHP populates $_POST and $_FILES.
 * (PHP does not populate $_POST for PATCH with multipart bodies, which previously caused
 * "Invalid id" on edit saves.) Updates: POST with numeric "id" field.
 */
if ($path === '/api/blogs' && $method === 'POST') {
    $updateId = (int) ($_POST['id'] ?? 0);

    if ($updateId > 0) {
        $id = $updateId;
        $existing = BlogRepository::find($id);
        if ($existing === null) {
            http_response_code(404);
            echo json_encode(['error' => 'Blog not found'], JSON_THROW_ON_ERROR);
            exit;
        }

        $title = trim((string) ($_POST['title'] ?? ''));
        if ($title === '') {
            http_response_code(400);
            echo json_encode(['error' => 'Title is required'], JSON_THROW_ON_ERROR);
            exit;
        }

        $blocksRaw = json_decode((string) ($_POST['blocks_json'] ?? '[]'), true);
        try {
            $blocksJson = BlogBlocks::encodeValidated($blocksRaw);
        } catch (Throwable $e) {
            http_response_code(400);
            echo json_encode(['error' => $e->getMessage()], JSON_THROW_ON_ERROR);
            exit;
        }

        $nullIfEmpty = static function (?string $s): ?string {
            $t = trim((string) ($s ?? ''));

            return $t === '' ? null : $t;
        };

        $slug = BlogRepository::uniqueSlugFromTitle($title, $id);

        $coverPath = $existing['cover_image'] ?? null;
        $coverFile = $_FILES['cover_image'] ?? null;
        if (is_array($coverFile) && ($coverFile['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE) {
            try {
                $newCover = BlogStorage::saveCoverImageIfPresent($coverFile);
                if ($newCover !== null) {
                    BlogStorage::deleteRelativeIfExists($coverPath);
                    $coverPath = $newCover;
                }
            } catch (Throwable $e) {
                http_response_code(400);
                echo json_encode(['error' => $e->getMessage()], JSON_THROW_ON_ERROR);
                exit;
            }
        }

        $status = trim((string) ($_POST['status'] ?? 'published'));
        if (!in_array($status, ['draft', 'published'], true)) {
            $status = 'published';
        }

        try {
            BlogRepository::update($id, [
                'title' => $title,
                'slug' => $slug,
                'banner_headline' => $nullIfEmpty($_POST['banner_headline'] ?? null),
                'banner_subtitle' => $nullIfEmpty($_POST['banner_subtitle'] ?? null),
                'banner_button_label' => $nullIfEmpty($_POST['banner_button_label'] ?? null),
                'banner_button_link' => $nullIfEmpty($_POST['banner_button_link'] ?? null),
                'cover_image' => $coverPath,
                'listing_summary' => $nullIfEmpty($_POST['listing_summary'] ?? null),
                'blocks_json' => $blocksJson,
                'status' => $status,
            ]);
        } catch (Throwable) {
            http_response_code(500);
            echo json_encode(['error' => 'Could not update blog'], JSON_THROW_ON_ERROR);
            exit;
        }

        $row = BlogRepository::find($id);
        echo json_encode(['ok' => true, 'blog' => $row], JSON_THROW_ON_ERROR);
        exit;
    }

    $title = trim((string) ($_POST['title'] ?? ''));
    if ($title === '') {
        http_response_code(400);
        echo json_encode(['error' => 'Title is required'], JSON_THROW_ON_ERROR);
        exit;
    }

    $blocksRaw = json_decode((string) ($_POST['blocks_json'] ?? '[]'), true);
    try {
        $blocksJson = BlogBlocks::encodeValidated($blocksRaw);
    } catch (Throwable $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()], JSON_THROW_ON_ERROR);
        exit;
    }

    $nullIfEmpty = static function (?string $s): ?string {
        $t = trim((string) ($s ?? ''));

        return $t === '' ? null : $t;
    };

    $slug = BlogRepository::uniqueSlugFromTitle($title);

    $coverPath = null;
    $coverFile = $_FILES['cover_image'] ?? null;
    if (is_array($coverFile)) {
        try {
            $coverPath = BlogStorage::saveCoverImageIfPresent($coverFile);
        } catch (Throwable $e) {
            http_response_code(400);
            echo json_encode(['error' => $e->getMessage()], JSON_THROW_ON_ERROR);
            exit;
        }
    }

    $status = trim((string) ($_POST['status'] ?? 'published'));
    if (!in_array($status, ['draft', 'published'], true)) {
        $status = 'published';
    }

    try {
        $row = BlogRepository::create([
            'title' => $title,
            'slug' => $slug,
            'banner_headline' => $nullIfEmpty($_POST['banner_headline'] ?? null),
            'banner_subtitle' => $nullIfEmpty($_POST['banner_subtitle'] ?? null),
            'banner_button_label' => $nullIfEmpty($_POST['banner_button_label'] ?? null),
            'banner_button_link' => $nullIfEmpty($_POST['banner_button_link'] ?? null),
            'cover_image' => $coverPath,
            'listing_summary' => $nullIfEmpty($_POST['listing_summary'] ?? null),
            'blocks_json' => $blocksJson,
            'status' => $status,
        ]);
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not save blog'], JSON_THROW_ON_ERROR);
        exit;
    }

    echo json_encode(['ok' => true, 'blog' => $row], JSON_THROW_ON_ERROR);
    exit;
}

if ($path === '/api/blog-images' && $method === 'POST') {
    $img = $_FILES['image'] ?? null;
    if (!is_array($img)) {
        http_response_code(400);
        echo json_encode(['error' => 'No image'], JSON_THROW_ON_ERROR);
        exit;
    }
    try {
        $saved = BlogStorage::saveBlogImage($img);
    } catch (Throwable $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()], JSON_THROW_ON_ERROR);
        exit;
    }

    echo json_encode([
        'ok' => true,
        'path' => $saved,
        'url' => '/' . ltrim(str_replace('\\', '/', $saved), '/'),
    ], JSON_THROW_ON_ERROR);
    exit;
}

if ($path === '/api/reviews/public' && $method === 'GET') {
    try {
        $rows = ReviewRepository::approvedLatest(12);
        echo json_encode(['reviews' => $rows], JSON_THROW_ON_ERROR);
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not load reviews'], JSON_THROW_ON_ERROR);
    }
    exit;
}

if ($path === '/api/reviews' && $method === 'GET') {
    try {
        $rows = ReviewRepository::allLatestFirst();
        echo json_encode(['reviews' => $rows], JSON_THROW_ON_ERROR);
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not load reviews'], JSON_THROW_ON_ERROR);
    }
    exit;
}

if ($path === '/api/reviews' && $method === 'PATCH') {
    $raw = file_get_contents('php://input') ?: '';
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON'], JSON_THROW_ON_ERROR);
        exit;
    }

    $id = (int) ($data['id'] ?? 0);
    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid id'], JSON_THROW_ON_ERROR);
        exit;
    }

    $status = trim((string) ($data['status'] ?? ''));
    if (!in_array($status, ['pending', 'approved', 'discarded'], true)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid status'], JSON_THROW_ON_ERROR);
        exit;
    }

    $existing = ReviewRepository::find($id);
    if ($existing === null) {
        http_response_code(404);
        echo json_encode(['error' => 'Review not found'], JSON_THROW_ON_ERROR);
        exit;
    }

    try {
        ReviewRepository::setStatus($id, $status);
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not update review'], JSON_THROW_ON_ERROR);
        exit;
    }

    $row = ReviewRepository::find($id);
    echo json_encode(['ok' => true, 'review' => $row], JSON_THROW_ON_ERROR);
    exit;
}

if ($path === '/api/reviews' && $method === 'DELETE') {
    $raw = file_get_contents('php://input') ?: '';
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON'], JSON_THROW_ON_ERROR);
        exit;
    }

    $id = (int) ($data['id'] ?? 0);
    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid id'], JSON_THROW_ON_ERROR);
        exit;
    }

    $existing = ReviewRepository::find($id);
    if ($existing === null) {
        http_response_code(404);
        echo json_encode(['error' => 'Review not found'], JSON_THROW_ON_ERROR);
        exit;
    }

    try {
        $ok = ReviewRepository::deleteById($id);
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not delete review'], JSON_THROW_ON_ERROR);
        exit;
    }

    if (!$ok) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not delete review'], JSON_THROW_ON_ERROR);
        exit;
    }

    echo json_encode(['ok' => true], JSON_THROW_ON_ERROR);
    exit;
}

if ($path === '/api/reviews' && $method === 'POST') {
    $customerName = trim((string) ($_POST['customer_name'] ?? ''));
    $email = trim((string) ($_POST['email'] ?? ''));
    $treatment = trim((string) ($_POST['treatment'] ?? ''));
    $reviewText = trim((string) ($_POST['review_text'] ?? ''));
    $rating = (int) ($_POST['rating'] ?? 0);

    if ($customerName === '' || $email === '' || $treatment === '' || $reviewText === '') {
        http_response_code(400);
        echo json_encode(['error' => 'All fields are required'], JSON_THROW_ON_ERROR);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid email'], JSON_THROW_ON_ERROR);
        exit;
    }

    if (!ReviewRepository::isAllowedTreatment($treatment)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid treatment'], JSON_THROW_ON_ERROR);
        exit;
    }

    if ($rating < 1 || $rating > 5) {
        http_response_code(400);
        echo json_encode(['error' => 'Rating must be between 1 and 5'], JSON_THROW_ON_ERROR);
        exit;
    }

    $wordCount = preg_match_all('/\S+/u', $reviewText, $wm) ? count($wm[0]) : 0;
    if ($wordCount < 1 || $wordCount > 20) {
        http_response_code(400);
        echo json_encode(['error' => 'Review must be between 1 and 20 words'], JSON_THROW_ON_ERROR);
        exit;
    }

    $profilePath = null;
    if (!empty($_FILES['profile_image']) && is_array($_FILES['profile_image'])) {
        try {
            $profilePath = ReviewStorage::saveProfileImageIfPresent($_FILES['profile_image']);
        } catch (\InvalidArgumentException|\RuntimeException $e) {
            http_response_code(400);
            echo json_encode(['error' => $e->getMessage()], JSON_THROW_ON_ERROR);
            exit;
        }
    }

    try {
        $id = ReviewRepository::create([
            'customer_name' => $customerName,
            'email' => $email,
            'treatment' => $treatment,
            'review_text' => $reviewText,
            'rating' => $rating,
            'profile_image' => $profilePath,
            'status' => 'pending',
        ]);
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not save review'], JSON_THROW_ON_ERROR);
        exit;
    }

    echo json_encode(['ok' => true, 'id' => $id], JSON_THROW_ON_ERROR);
    exit;
}

if ($path === '/api/testimonial-videos' && $method === 'GET') {
    try {
        $rows = TestimonialVideoRepository::allLatestFirst();
        echo json_encode(['videos' => $rows], JSON_THROW_ON_ERROR);
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not load videos'], JSON_THROW_ON_ERROR);
    }
    exit;
}

if ($path === '/api/testimonial-videos' && $method === 'POST') {
    $raw = file_get_contents('php://input') ?: '';
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON'], JSON_THROW_ON_ERROR);
        exit;
    }

    $title = trim((string) ($data['title'] ?? ''));
    $embedRaw = trim((string) ($data['embed'] ?? ''));
    if ($title === '' || $embedRaw === '') {
        http_response_code(400);
        echo json_encode(['error' => 'Title and embed are required'], JSON_THROW_ON_ERROR);
        exit;
    }

    $embedUrl = YoutubeEmbed::extractEmbedUrl($embedRaw);
    if ($embedUrl === null || !YoutubeEmbed::isAllowedYoutubeEmbed($embedUrl)) {
        http_response_code(400);
        echo json_encode(['error' => 'Paste a valid YouTube iframe or YouTube link'], JSON_THROW_ON_ERROR);
        exit;
    }

    try {
        $id = TestimonialVideoRepository::create($title, $embedUrl);
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not save video'], JSON_THROW_ON_ERROR);
        exit;
    }

    $row = TestimonialVideoRepository::find($id);
    echo json_encode(['ok' => true, 'video' => $row], JSON_THROW_ON_ERROR);
    exit;
}

if ($path === '/api/testimonial-videos' && $method === 'DELETE') {
    $raw = file_get_contents('php://input') ?: '';
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON'], JSON_THROW_ON_ERROR);
        exit;
    }

    $id = (int) ($data['id'] ?? 0);
    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid id'], JSON_THROW_ON_ERROR);
        exit;
    }

    $existing = TestimonialVideoRepository::find($id);
    if ($existing === null) {
        http_response_code(404);
        echo json_encode(['error' => 'Video not found'], JSON_THROW_ON_ERROR);
        exit;
    }

    try {
        $ok = TestimonialVideoRepository::deleteById($id);
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not delete video'], JSON_THROW_ON_ERROR);
        exit;
    }

    if (!$ok) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not delete video'], JSON_THROW_ON_ERROR);
        exit;
    }

    echo json_encode(['ok' => true], JSON_THROW_ON_ERROR);
    exit;
}

if ($path === '/api/custom-chatbots' && $method === 'GET') {
    try {
        $rows = CustomChatbotRepository::allLatestFirst();
        echo json_encode(['custom_chatbots' => $rows], JSON_THROW_ON_ERROR);
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not load chatbots'], JSON_THROW_ON_ERROR);
    }
    exit;
}

if ($path === '/api/custom-chatbots' && $method === 'POST') {
    $raw = file_get_contents('php://input') ?: '';
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON'], JSON_THROW_ON_ERROR);
        exit;
    }

    $name = trim((string) ($data['name'] ?? ''));
    if ($name === '' || strlen($name) > 255) {
        http_response_code(400);
        echo json_encode(['error' => 'name is required (max 255 characters)'], JSON_THROW_ON_ERROR);
        exit;
    }

    $steps = $data['steps'] ?? null;
    if (!is_array($steps)) {
        http_response_code(400);
        echo json_encode(['error' => 'steps must be an array'], JSON_THROW_ON_ERROR);
        exit;
    }

    try {
        CustomChatbotRepository::validateSteps($steps);
    } catch (\InvalidArgumentException $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()], JSON_THROW_ON_ERROR);
        exit;
    }

    try {
        $id = CustomChatbotRepository::create($name, $steps);
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not save chatbot'], JSON_THROW_ON_ERROR);
        exit;
    }

    $row = CustomChatbotRepository::find($id);
    echo json_encode(['ok' => true, 'custom_chatbot' => $row], JSON_THROW_ON_ERROR);
    exit;
}

if (preg_match('#^/api/custom-chatbots/(\d+)$#', $path, $ccGetM) && $method === 'GET') {
    $cid = (int) $ccGetM[1];
    if ($cid <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid id'], JSON_THROW_ON_ERROR);
        exit;
    }
    try {
        $row = CustomChatbotRepository::find($cid);
        if ($row === null) {
            http_response_code(404);
            echo json_encode(['error' => 'Chatbot not found'], JSON_THROW_ON_ERROR);
            exit;
        }
        echo json_encode(['custom_chatbot' => $row], JSON_THROW_ON_ERROR);
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not load chatbot'], JSON_THROW_ON_ERROR);
    }
    exit;
}

if (preg_match('#^/api/custom-chatbots/(\d+)$#', $path, $ccPatchM) && $method === 'PATCH') {
    $cid = (int) $ccPatchM[1];
    if ($cid <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid id'], JSON_THROW_ON_ERROR);
        exit;
    }
    $raw = file_get_contents('php://input') ?: '';
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON'], JSON_THROW_ON_ERROR);
        exit;
    }

    $name = array_key_exists('name', $data) ? trim((string) $data['name']) : null;
    if ($name !== null && ($name === '' || strlen($name) > 255)) {
        http_response_code(400);
        echo json_encode(['error' => 'name must be 1–255 characters'], JSON_THROW_ON_ERROR);
        exit;
    }

    $steps = null;
    if (array_key_exists('steps', $data)) {
        $st = $data['steps'];
        if (!is_array($st)) {
            http_response_code(400);
            echo json_encode(['error' => 'steps must be an array'], JSON_THROW_ON_ERROR);
            exit;
        }
        $steps = $st;
    }

    if ($name === null && $steps === null) {
        http_response_code(400);
        echo json_encode(['error' => 'No fields to update'], JSON_THROW_ON_ERROR);
        exit;
    }

    try {
        CustomChatbotRepository::update($cid, $name, $steps);
    } catch (\InvalidArgumentException $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()], JSON_THROW_ON_ERROR);
        exit;
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not update chatbot'], JSON_THROW_ON_ERROR);
        exit;
    }

    $row = CustomChatbotRepository::find($cid);
    echo json_encode(['ok' => true, 'custom_chatbot' => $row], JSON_THROW_ON_ERROR);
    exit;
}

if (preg_match('#^/api/custom-chatbots/(\d+)$#', $path, $ccDelM) && $method === 'DELETE') {
    $cid = (int) $ccDelM[1];
    if ($cid <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid id'], JSON_THROW_ON_ERROR);
        exit;
    }
    try {
        $ok = CustomChatbotRepository::deleteById($cid);
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not delete chatbot'], JSON_THROW_ON_ERROR);
        exit;
    }
    if (!$ok) {
        http_response_code(404);
        echo json_encode(['error' => 'Chatbot not found'], JSON_THROW_ON_ERROR);
        exit;
    }
    echo json_encode(['ok' => true], JSON_THROW_ON_ERROR);
    exit;
}

if (preg_match('#^/api/custom-chatbots/(\d+)/publish$#', $path, $ccPubM) && $method === 'POST') {
    $cid = (int) $ccPubM[1];
    if ($cid <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid id'], JSON_THROW_ON_ERROR);
        exit;
    }
    try {
        CustomChatbotRepository::publishOnSite($cid);
    } catch (\InvalidArgumentException $e) {
        $msg = $e->getMessage();
        http_response_code($msg === 'Chatbot not found' ? 404 : 400);
        echo json_encode(['error' => $msg], JSON_THROW_ON_ERROR);
        exit;
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not publish chatbot'], JSON_THROW_ON_ERROR);
        exit;
    }
    $row = CustomChatbotRepository::find($cid);
    echo json_encode(['ok' => true, 'custom_chatbot' => $row], JSON_THROW_ON_ERROR);
    exit;
}

if (preg_match('#^/api/custom-chatbots/(\d+)/unpublish$#', $path, $ccUnpubM) && $method === 'POST') {
    $cid = (int) $ccUnpubM[1];
    if ($cid <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid id'], JSON_THROW_ON_ERROR);
        exit;
    }
    try {
        $ok = CustomChatbotRepository::unpublish($cid);
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not unpublish chatbot'], JSON_THROW_ON_ERROR);
        exit;
    }
    if (!$ok) {
        http_response_code(404);
        echo json_encode(['error' => 'Chatbot not found'], JSON_THROW_ON_ERROR);
        exit;
    }
    $row = CustomChatbotRepository::find($cid);
    echo json_encode(['ok' => true, 'custom_chatbot' => $row], JSON_THROW_ON_ERROR);
    exit;
}

if ($path === '/api/public/site-chatbot-status' && $method === 'GET') {
    echo json_encode(['enabled' => CustomChatbotRepository::siteEmbeddedWebsiteEnabled()], JSON_THROW_ON_ERROR);
    exit;
}

if ($path === '/api/site-chatbot-settings' && $method === 'GET') {
    echo json_encode(['website_enabled' => CustomChatbotRepository::siteEmbeddedWebsiteEnabled()], JSON_THROW_ON_ERROR);
    exit;
}

if ($path === '/api/site-chatbot-settings' && $method === 'PATCH') {
    $raw = file_get_contents('php://input') ?: '';
    $data = json_decode($raw, true);
    if (!is_array($data) || !array_key_exists('website_enabled', $data)) {
        http_response_code(400);
        echo json_encode(['error' => 'website_enabled is required'], JSON_THROW_ON_ERROR);
        exit;
    }
    $enabled = filter_var($data['website_enabled'], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
    if ($enabled === null) {
        http_response_code(400);
        echo json_encode(['error' => 'website_enabled must be a boolean'], JSON_THROW_ON_ERROR);
        exit;
    }
    try {
        CustomChatbotRepository::setSiteEmbeddedWebsiteEnabled($enabled);
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not save site chatbot settings'], JSON_THROW_ON_ERROR);
        exit;
    }
    echo json_encode(['ok' => true, 'website_enabled' => $enabled], JSON_THROW_ON_ERROR);
    exit;
}

if ($path === '/api/public/custom-chatbot-config' && $method === 'GET') {
    try {
        if (!CustomChatbotRepository::siteEmbeddedWebsiteEnabled()) {
            http_response_code(404);
            echo json_encode(['error' => 'Site chatbot is disabled'], JSON_THROW_ON_ERROR);
            exit;
        }
        $row = CustomChatbotRepository::siteEmbeddedFromFile();
        if ($row === null) {
            http_response_code(404);
            echo json_encode(['error' => 'Site chatbot is not configured'], JSON_THROW_ON_ERROR);
            exit;
        }
        echo json_encode(['custom_chatbot' => $row], JSON_THROW_ON_ERROR);
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not load chatbot'], JSON_THROW_ON_ERROR);
    }
    exit;
}

if ($path === '/api/public/custom-chatbot-submit' && $method === 'POST') {
    if (!CustomChatbotRepository::siteEmbeddedWebsiteEnabled()) {
        http_response_code(404);
        echo json_encode(['error' => 'Site chatbot is disabled'], JSON_THROW_ON_ERROR);
        exit;
    }
    $pub = CustomChatbotRepository::siteEmbeddedFromFile();
    if ($pub === null) {
        http_response_code(404);
        echo json_encode(['error' => 'Site chatbot is not configured'], JSON_THROW_ON_ERROR);
        exit;
    }
    $raw = file_get_contents('php://input') ?: '';
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON'], JSON_THROW_ON_ERROR);
        exit;
    }

    $bid = (int) ($data['chatbot_id'] ?? 0);
    if ($bid !== (int) $pub['id']) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid chatbot'], JSON_THROW_ON_ERROR);
        exit;
    }

    $answers = $data['answers'] ?? null;
    if (!is_array($answers)) {
        http_response_code(400);
        echo json_encode(['error' => 'answers must be an object'], JSON_THROW_ON_ERROR);
        exit;
    }

    /** @var list<array<string, mixed>> $steps */
    $steps = $pub['steps'] ?? [];
    if (!is_array($steps)) {
        $steps = [];
    }

    try {
        $lead = CustomChatbotRepository::buildLeadFromAnswers($steps, $answers);
    } catch (\InvalidArgumentException $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()], JSON_THROW_ON_ERROR);
        exit;
    }

    $botLabel = trim((string) ($pub['name'] ?? 'Website chat'));
    $message = 'Website custom chatbot — ' . $botLabel . "\n\n" . json_encode($lead['transcript'], JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

    try {
        $id = ContactRepository::create([
            'first_name' => $lead['first_name'],
            'last_name' => $lead['last_name'],
            'email' => $lead['email'],
            'country_code' => $lead['country_code'],
            'phone' => $lead['phone'],
            'service' => $lead['service'],
            'submit_method' => $lead['submit_method'],
            'message' => $message,
        ]);
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not save your details'], JSON_THROW_ON_ERROR);
        exit;
    }

    $emailSent = false;
    $emailError = null;
    try {
        BookingMailer::sendContactAdminNotification([
            'id' => $id,
            'first_name' => $lead['first_name'],
            'last_name' => $lead['last_name'],
            'email' => $lead['email'],
            'country_code' => $lead['country_code'],
            'phone' => $lead['phone'],
            'service' => $lead['service'],
            'submit_method' => $lead['submit_method'],
            'message' => $message,
        ]);
        $emailSent = true;
    } catch (Throwable) {
        $emailError = 'Email could not be sent. Your details were saved.';
    }

    echo json_encode([
        'ok' => true,
        'id' => $id,
        'email_sent' => $emailSent,
        'message' => $emailSent ? null : $emailError,
    ], JSON_THROW_ON_ERROR);
    exit;
}

if ($path === '/api/public/chatbot-engagement' && $method === 'POST') {
    if (!CustomChatbotRepository::siteEmbeddedWebsiteEnabled()) {
        http_response_code(404);
        echo json_encode(['error' => 'Site chatbot is disabled'], JSON_THROW_ON_ERROR);
        exit;
    }
    $pub = CustomChatbotRepository::siteEmbeddedFromFile();
    if ($pub === null) {
        http_response_code(404);
        echo json_encode(['error' => 'Site chatbot is not configured'], JSON_THROW_ON_ERROR);
        exit;
    }
    $raw = file_get_contents('php://input') ?: '';
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON'], JSON_THROW_ON_ERROR);
        exit;
    }

    $bid = (int) ($data['chatbot_id'] ?? 0);
    if ($bid !== (int) $pub['id']) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid chatbot'], JSON_THROW_ON_ERROR);
        exit;
    }

    $dwell = (int) ($data['dwell_seconds'] ?? 0);
    if ($dwell < 30 || $dwell > 86400) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid dwell_seconds'], JSON_THROW_ON_ERROR);
        exit;
    }

    $payload = trim((string) ($data['payload_json'] ?? ''));
    if ($payload === '' || strlen($payload) > 650000) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid payload'], JSON_THROW_ON_ERROR);
        exit;
    }

    try {
        json_decode($payload, true, 512, JSON_THROW_ON_ERROR);
    } catch (\JsonException) {
        http_response_code(400);
        echo json_encode(['error' => 'payload_json must be JSON'], JSON_THROW_ON_ERROR);
        exit;
    }

    $summary = ChatbotUserRepository::summarizePayload($payload);

    try {
        $id = ChatbotUserRepository::create([
            'chatbot_id' => $bid,
            'dwell_seconds' => $dwell,
            'summary_line' => $summary,
            'payload_json' => $payload,
            'email_sent' => 0,
        ]);
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not save engagement'], JSON_THROW_ON_ERROR);
        exit;
    }

    $emailSent = false;
    $emailError = null;
    try {
        BookingMailer::sendChatbotEngagementSnapshot($id, $dwell, $summary, $payload);
        ChatbotUserRepository::markEmailSent($id, true);
        $emailSent = true;
    } catch (Throwable) {
        $emailError = 'Email could not be sent. Engagement was saved.';
    }

    echo json_encode([
        'ok' => true,
        'id' => $id,
        'email_sent' => $emailSent,
        'message' => $emailSent ? null : $emailError,
    ], JSON_THROW_ON_ERROR);
    exit;
}

if ($path === '/api/chatbot-users' && $method === 'GET') {
    try {
        $rows = ChatbotUserRepository::allLatestFirst();
        echo json_encode(['chatbot_users' => $rows], JSON_THROW_ON_ERROR);
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not load chatbot visitors'], JSON_THROW_ON_ERROR);
    }
    exit;
}

if ($path === '/api/public/chatbot-config' && $method === 'GET') {
    try {
        $row = ChatbotRepository::findPublishedForSite();
        if ($row === null) {
            http_response_code(404);
            echo json_encode(['error' => 'No published chatbot'], JSON_THROW_ON_ERROR);
            exit;
        }
        $cid = (int) $row['id'];
        $flows = ChatbotFlowRepository::listFlows($cid);
        $edges = ChatbotFlowRepository::listEdges($cid);
        $optRows = ChatbotFlowRepository::listOptionsByChatbot($cid);
        $byFlow = [];
        foreach ($optRows as $o) {
            $ofid = (int) $o['flow_id'];
            if (!isset($byFlow[$ofid])) {
                $byFlow[$ofid] = [];
            }
            $byFlow[$ofid][] = $o;
        }
        $flowsOut = [];
        foreach ($flows as $f) {
            $fid = (int) $f['id'];
            $f['options'] = $byFlow[$fid] ?? [];
            $flowsOut[] = $f;
        }
        echo json_encode(
            ['chatbot' => $row, 'flows' => $flowsOut, 'edges' => $edges],
            JSON_THROW_ON_ERROR
        );
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not load public chatbot'], JSON_THROW_ON_ERROR);
    }
    exit;
}

if (preg_match('#^/api/chatbots/(\d+)/publish$#', $path, $pubM) && $method === 'POST') {
    $cid = (int) $pubM[1];
    if ($cid <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid chatbot id'], JSON_THROW_ON_ERROR);
        exit;
    }
    $raw = file_get_contents('php://input') ?: '';
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON'], JSON_THROW_ON_ERROR);
        exit;
    }
    $published = filter_var($data['published'] ?? false, FILTER_VALIDATE_BOOLEAN);
    try {
        if ($published) {
            ChatbotRepository::publishOnSite($cid);
        } else {
            ChatbotRepository::unpublish($cid);
        }
        $row = ChatbotRepository::find($cid);
        echo json_encode(['ok' => true, 'chatbot' => $row], JSON_THROW_ON_ERROR);
    } catch (\InvalidArgumentException $e) {
        http_response_code(404);
        echo json_encode(['error' => $e->getMessage()], JSON_THROW_ON_ERROR);
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not update publish status'], JSON_THROW_ON_ERROR);
    }
    exit;
}

if (preg_match('#^/api/chatbots/(\d+)$#', $path, $chatbotPathM) && $method === 'GET') {
    $cid = (int) $chatbotPathM[1];
    if ($cid <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid id'], JSON_THROW_ON_ERROR);
        exit;
    }
    try {
        $row = ChatbotRepository::find($cid);
        if ($row === null) {
            http_response_code(404);
            echo json_encode(['error' => 'Chatbot not found'], JSON_THROW_ON_ERROR);
            exit;
        }
        echo json_encode(['chatbot' => $row], JSON_THROW_ON_ERROR);
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not load chatbot'], JSON_THROW_ON_ERROR);
    }
    exit;
}

if ($path === '/api/chatbots' && $method === 'GET') {
    try {
        $rows = ChatbotRepository::allLatestFirst();
        echo json_encode(['chatbots' => $rows], JSON_THROW_ON_ERROR);
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not load chatbots'], JSON_THROW_ON_ERROR);
    }
    exit;
}

if ($path === '/api/chatbots' && $method === 'POST') {
    $raw = file_get_contents('php://input') ?: '';
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON'], JSON_THROW_ON_ERROR);
        exit;
    }

    $name = trim((string) ($data['template_name'] ?? ($data['name'] ?? '')));
    $businessTitle = trim((string) ($data['business_title'] ?? ''));
    $websiteRaw = $data['website_url'] ?? null;
    $website = is_string($websiteRaw) ? trim($websiteRaw) : '';
    $logoRaw = $data['logo'] ?? null;
    $logo = is_string($logoRaw) ? trim($logoRaw) : '';

    if ($name === '' || strlen($name) > 255) {
        http_response_code(400);
        echo json_encode(['error' => 'name is required (max 255 characters)'], JSON_THROW_ON_ERROR);
        exit;
    }

    if ($businessTitle !== '' && strlen($businessTitle) > 128) {
        http_response_code(400);
        echo json_encode(['error' => 'business_title max is 128 characters'], JSON_THROW_ON_ERROR);
        exit;
    }

    if (strlen($logo) > 2048) {
        http_response_code(400);
        echo json_encode(['error' => 'logo URL is too long'], JSON_THROW_ON_ERROR);
        exit;
    }

    if ($website === '') {
        http_response_code(400);
        echo json_encode(['error' => 'website_url is required'], JSON_THROW_ON_ERROR);
        exit;
    }
    if (strlen($website) > 2048) {
        http_response_code(400);
        echo json_encode(['error' => 'website_url is too long'], JSON_THROW_ON_ERROR);
        exit;
    }
    if (filter_var($website, FILTER_VALIDATE_URL) === false) {
        http_response_code(400);
        echo json_encode(['error' => 'website_url must be a valid URL'], JSON_THROW_ON_ERROR);
        exit;
    }

    try {
        $id = ChatbotRepository::create(
            $name,
            $businessTitle !== '' ? $businessTitle : 'Template',
            $logo !== '' ? $logo : null,
            $website
        );
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not save chatbot'], JSON_THROW_ON_ERROR);
        exit;
    }

    $row = ChatbotRepository::find($id);
    echo json_encode(['ok' => true, 'chatbot' => $row], JSON_THROW_ON_ERROR);
    exit;
}

if ($path === '/api/chatbots' && $method === 'DELETE') {
    $raw = file_get_contents('php://input') ?: '';
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON'], JSON_THROW_ON_ERROR);
        exit;
    }

    $id = (int) ($data['id'] ?? 0);
    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid id'], JSON_THROW_ON_ERROR);
        exit;
    }

    $existing = ChatbotRepository::find($id);
    if ($existing === null) {
        http_response_code(404);
        echo json_encode(['error' => 'Chatbot not found'], JSON_THROW_ON_ERROR);
        exit;
    }

    try {
        $ok = ChatbotRepository::deleteById($id);
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not delete chatbot'], JSON_THROW_ON_ERROR);
        exit;
    }

    if (!$ok) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not delete chatbot'], JSON_THROW_ON_ERROR);
        exit;
    }

    echo json_encode(['ok' => true], JSON_THROW_ON_ERROR);
    exit;
}

if (preg_match('#^/api/chatbots/(\d+)/flow-canvas$#', $path, $cfcM) && ($method === 'GET' || $method === 'PUT')) {
    $cid = (int) $cfcM[1];
    if ($cid <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid chatbot id'], JSON_THROW_ON_ERROR);
        exit;
    }
    if (ChatbotRepository::find($cid) === null) {
        http_response_code(404);
        echo json_encode(['error' => 'Template not found'], JSON_THROW_ON_ERROR);
        exit;
    }
    if ($method === 'GET') {
        try {
            $canvas = FlowsRepository::getCanvas($cid);
            echo json_encode(['ok' => true, 'canvas' => $canvas], JSON_THROW_ON_ERROR);
        } catch (Throwable) {
            http_response_code(500);
            echo json_encode(['error' => 'Could not load canvas'], JSON_THROW_ON_ERROR);
        }
        exit;
    }
    $raw = file_get_contents('php://input') ?: '';
    $data = json_decode($raw, true);
    if (!is_array($data) || !isset($data['canvas']) || !is_array($data['canvas'])) {
        http_response_code(400);
        echo json_encode(['error' => 'canvas object required'], JSON_THROW_ON_ERROR);
        exit;
    }
    $canvas = $data['canvas'];
    $nodes = $canvas['nodes'] ?? [];
    $edges = $canvas['edges'] ?? [];
    if (!is_array($nodes) || !is_array($edges)) {
        http_response_code(400);
        echo json_encode(['error' => 'canvas.nodes and canvas.edges must be arrays'], JSON_THROW_ON_ERROR);
        exit;
    }
    try {
        FlowsRepository::saveCanvas($cid, ['nodes' => $nodes, 'edges' => $edges]);
        echo json_encode(['ok' => true], JSON_THROW_ON_ERROR);
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not save canvas'], JSON_THROW_ON_ERROR);
    }
    exit;
}

if ($path === '/api/flows' && $method === 'GET') {
    $chatbotId = (int) ($_GET['chatbot_id'] ?? 0);
    try {
        if ($chatbotId > 0) {
            if (ChatbotRepository::find($chatbotId) === null) {
                http_response_code(404);
                echo json_encode(['error' => 'Template not found'], JSON_THROW_ON_ERROR);
                exit;
            }
            $rows = FlowsRepository::listByTemplate($chatbotId);
        } else {
            $rows = FlowsRepository::listAllLatestFirst();
        }
        echo json_encode(['flows' => $rows], JSON_THROW_ON_ERROR);
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not load flows'], JSON_THROW_ON_ERROR);
    }
    exit;
}

if ($path === '/api/flows' && $method === 'POST') {
    $raw = file_get_contents('php://input') ?: '';
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON'], JSON_THROW_ON_ERROR);
        exit;
    }
    $chatbotId = (int) ($data['chatbot_id'] ?? 0);
    $flowKey = trim((string) ($data['flow_key'] ?? 'greeting_name'));
    $greetingText = trim((string) ($data['greeting_text'] ?? ''));
    $namePlaceholder = trim((string) ($data['name_placeholder'] ?? ''));
    $promptText = trim((string) ($data['prompt_text'] ?? ''));
    $badgeKeysRaw = $data['badge_keys'] ?? null;

    if ($chatbotId <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'chatbot_id is required'], JSON_THROW_ON_ERROR);
        exit;
    }
    if (ChatbotRepository::find($chatbotId) === null) {
        http_response_code(404);
        echo json_encode(['error' => 'Template not found'], JSON_THROW_ON_ERROR);
        exit;
    }
    if (!in_array($flowKey, FlowsRepository::allowedFlowKeys(), true)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid flow_key'], JSON_THROW_ON_ERROR);
        exit;
    }

    try {
        if ($flowKey === 'greeting_name') {
            if ($greetingText === '' || strlen($greetingText) > 512) {
                http_response_code(400);
                echo json_encode(['error' => 'greeting_text is required (max 512)'], JSON_THROW_ON_ERROR);
                exit;
            }
            if ($namePlaceholder === '' || strlen($namePlaceholder) > 255) {
                http_response_code(400);
                echo json_encode(['error' => 'name_placeholder is required (max 255)'], JSON_THROW_ON_ERROR);
                exit;
            }
            $id = FlowsRepository::upsertGreetingNameFlow($chatbotId, $greetingText, $namePlaceholder);
        } elseif ($flowKey === 'business_query') {
            if (!is_array($badgeKeysRaw)) {
                http_response_code(400);
                echo json_encode(['error' => 'badge_keys must be an array'], JSON_THROW_ON_ERROR);
                exit;
            }
            $bqDoc = [
                'badge_keys' => $badgeKeysRaw,
                'services' => is_array($data['services'] ?? null) ? $data['services'] : [],
                'locations' => is_array($data['locations'] ?? null) ? $data['locations'] : [],
                'fee_structure' => is_array($data['fee_structure'] ?? null)
                    ? $data['fee_structure']
                    : ['placeholder' => trim((string) ($data['fee_placeholder'] ?? ''))],
            ];
            $id = FlowsRepository::upsertBusinessQueryFlow($chatbotId, $bqDoc);
        } else {
            if ($promptText === '' || strlen($promptText) > 512) {
                http_response_code(400);
                echo json_encode(['error' => 'prompt_text is required (max 512)'], JSON_THROW_ON_ERROR);
                exit;
            }
            $id = FlowsRepository::upsertPromptFlow($chatbotId, $flowKey, $promptText);
        }
        $row = FlowsRepository::find($id);
        echo json_encode(['ok' => true, 'flow' => $row], JSON_THROW_ON_ERROR);
    } catch (InvalidArgumentException $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()], JSON_THROW_ON_ERROR);
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not save flow'], JSON_THROW_ON_ERROR);
    }
    exit;
}

if (preg_match('#^/api/flows/(\d+)$#', $path, $flowIdM) && $method === 'PATCH') {
    $flowId = (int) $flowIdM[1];
    if ($flowId <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid id'], JSON_THROW_ON_ERROR);
        exit;
    }
    $raw = file_get_contents('php://input') ?: '';
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON'], JSON_THROW_ON_ERROR);
        exit;
    }

    $existing = FlowsRepository::find($flowId);
    if ($existing === null) {
        http_response_code(404);
        echo json_encode(['error' => 'Flow not found'], JSON_THROW_ON_ERROR);
        exit;
    }

    $flowKey = (string) ($existing['flow_key'] ?? '');

    try {
        if ($flowKey === 'greeting_name') {
            $greetingText = trim((string) ($data['greeting_text'] ?? ''));
            $namePlaceholder = trim((string) ($data['name_placeholder'] ?? ''));
            if ($greetingText === '' || strlen($greetingText) > 512) {
                http_response_code(400);
                echo json_encode(['error' => 'greeting_text is required (max 512)'], JSON_THROW_ON_ERROR);
                exit;
            }
            if ($namePlaceholder === '' || strlen($namePlaceholder) > 255) {
                http_response_code(400);
                echo json_encode(['error' => 'name_placeholder is required (max 255)'], JSON_THROW_ON_ERROR);
                exit;
            }
            $ok = FlowsRepository::updateGreetingNameFlow($flowId, $greetingText, $namePlaceholder);
        } elseif (in_array($flowKey, ['collect_email', 'collect_phone'], true)) {
            $promptText = trim((string) ($data['prompt_text'] ?? ''));
            if ($promptText === '' || strlen($promptText) > 512) {
                http_response_code(400);
                echo json_encode(['error' => 'prompt_text is required (max 512)'], JSON_THROW_ON_ERROR);
                exit;
            }
            $ok = FlowsRepository::updatePromptFlow($flowId, $promptText);
        } elseif ($flowKey === 'business_query') {
            $badgeKeysRaw = $data['badge_keys'] ?? null;
            if (!is_array($badgeKeysRaw)) {
                http_response_code(400);
                echo json_encode(['error' => 'badge_keys must be an array'], JSON_THROW_ON_ERROR);
                exit;
            }
            $bqDoc = [
                'badge_keys' => $badgeKeysRaw,
                'services' => is_array($data['services'] ?? null) ? $data['services'] : [],
                'locations' => is_array($data['locations'] ?? null) ? $data['locations'] : [],
                'fee_structure' => is_array($data['fee_structure'] ?? null)
                    ? $data['fee_structure']
                    : ['placeholder' => trim((string) ($data['fee_placeholder'] ?? ''))],
            ];
            $ok = FlowsRepository::updateBusinessQueryFlow($flowId, $bqDoc);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Unsupported flow type for update'], JSON_THROW_ON_ERROR);
            exit;
        }
        if (!$ok) {
            http_response_code(400);
            echo json_encode(['error' => 'Flow could not be updated'], JSON_THROW_ON_ERROR);
            exit;
        }
        $row = FlowsRepository::find($flowId);
        echo json_encode(['ok' => true, 'flow' => $row], JSON_THROW_ON_ERROR);
    } catch (InvalidArgumentException $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()], JSON_THROW_ON_ERROR);
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not update flow'], JSON_THROW_ON_ERROR);
    }
    exit;
}

if (preg_match('#^/api/chatbots/(\d+)/flows/reorder$#', $path, $flowReorderM) && $method === 'POST') {
    $cid = (int) $flowReorderM[1];
    if ($cid <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid chatbot id'], JSON_THROW_ON_ERROR);
        exit;
    }
    $bot = ChatbotRepository::find($cid);
    if ($bot === null) {
        http_response_code(404);
        echo json_encode(['error' => 'Chatbot not found'], JSON_THROW_ON_ERROR);
        exit;
    }
    $raw = file_get_contents('php://input') ?: '';
    $data = json_decode($raw, true);
    if (!is_array($data) || !isset($data['flow_ids']) || !is_array($data['flow_ids'])) {
        http_response_code(400);
        echo json_encode(['error' => 'flow_ids array required'], JSON_THROW_ON_ERROR);
        exit;
    }
    $ids = array_map('intval', $data['flow_ids']);
    try {
        ChatbotFlowRepository::reorderFlows($cid, $ids);
    } catch (\InvalidArgumentException $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()], JSON_THROW_ON_ERROR);
        exit;
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not reorder flows'], JSON_THROW_ON_ERROR);
        exit;
    }
    try {
        $flows = ChatbotFlowRepository::listFlows($cid);
        echo json_encode(['ok' => true, 'flows' => $flows], JSON_THROW_ON_ERROR);
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not load flows'], JSON_THROW_ON_ERROR);
    }
    exit;
}

if (preg_match('#^/api/chatbots/(\d+)/flows/(\d+)$#', $path, $flowOneM) && $method === 'DELETE') {
    $cid = (int) $flowOneM[1];
    $fid = (int) $flowOneM[2];
    if ($cid <= 0 || $fid <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid id'], JSON_THROW_ON_ERROR);
        exit;
    }
    if (ChatbotRepository::find($cid) === null) {
        http_response_code(404);
        echo json_encode(['error' => 'Chatbot not found'], JSON_THROW_ON_ERROR);
        exit;
    }
    try {
        $ok = ChatbotFlowRepository::deleteFlow($cid, $fid);
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not delete flow'], JSON_THROW_ON_ERROR);
        exit;
    }
    if (!$ok) {
        http_response_code(404);
        echo json_encode(['error' => 'Flow not found'], JSON_THROW_ON_ERROR);
        exit;
    }
    echo json_encode(['ok' => true], JSON_THROW_ON_ERROR);
    exit;
}

if (preg_match('#^/api/chatbots/(\d+)/flows$#', $path, $flowsListM) && ($method === 'GET' || $method === 'POST')) {
    $cid = (int) $flowsListM[1];
    if ($cid <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid chatbot id'], JSON_THROW_ON_ERROR);
        exit;
    }
    if (ChatbotRepository::find($cid) === null) {
        http_response_code(404);
        echo json_encode(['error' => 'Chatbot not found'], JSON_THROW_ON_ERROR);
        exit;
    }

    if ($method === 'GET') {
        try {
            $flows = ChatbotFlowRepository::listFlows($cid);
            $edges = ChatbotFlowRepository::listEdges($cid);
            $optRows = ChatbotFlowRepository::listOptionsByChatbot($cid);
            $byFlow = [];
            foreach ($optRows as $o) {
                $ofid = (int) $o['flow_id'];
                if (!isset($byFlow[$ofid])) {
                    $byFlow[$ofid] = [];
                }
                $byFlow[$ofid][] = $o;
            }
            $flowsOut = [];
            foreach ($flows as $f) {
                $fid = (int) $f['id'];
                $f['options'] = $byFlow[$fid] ?? [];
                $flowsOut[] = $f;
            }
            echo json_encode(['flows' => $flowsOut, 'edges' => $edges], JSON_THROW_ON_ERROR);
        } catch (Throwable) {
            http_response_code(500);
            echo json_encode(['error' => 'Could not load flows'], JSON_THROW_ON_ERROR);
        }
        exit;
    }

    $raw = file_get_contents('php://input') ?: '';
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON'], JSON_THROW_ON_ERROR);
        exit;
    }
    $heading = trim((string) ($data['heading'] ?? ''));
    $placeholder = trim((string) ($data['placeholder_text'] ?? ($data['placeholder'] ?? '')));
    $flowTypeRaw = trim((string) ($data['flow_type'] ?? 'custom'));
    if (strlen($heading) > 512) {
        http_response_code(400);
        echo json_encode(['error' => 'heading is too long'], JSON_THROW_ON_ERROR);
        exit;
    }
    if (strlen($placeholder) > 1024) {
        http_response_code(400);
        echo json_encode(['error' => 'placeholder_text is too long'], JSON_THROW_ON_ERROR);
        exit;
    }
    try {
        ChatbotFlowRepository::assertFlowType($flowTypeRaw);
    } catch (\InvalidArgumentException) {
        http_response_code(400);
        echo json_encode(['error' => 'invalid flow_type'], JSON_THROW_ON_ERROR);
        exit;
    }

    try {
        $newId = ChatbotFlowRepository::createFlow($cid, $heading, $placeholder, $flowTypeRaw);
        $flows = ChatbotFlowRepository::listFlows($cid);
        $flow = null;
        foreach ($flows as $f) {
            if ((int) $f['id'] === $newId) {
                $flow = $f;
                break;
            }
        }
        echo json_encode(['ok' => true, 'flow' => $flow, 'flows' => $flows], JSON_THROW_ON_ERROR);
    } catch (\InvalidArgumentException $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()], JSON_THROW_ON_ERROR);
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not create flow'], JSON_THROW_ON_ERROR);
    }
    exit;
}

if (preg_match('#^/api/chatbots/(\d+)/flow-edges$#', $path, $feM) && ($method === 'POST' || $method === 'DELETE')) {
    $cid = (int) $feM[1];
    if ($cid <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid chatbot id'], JSON_THROW_ON_ERROR);
        exit;
    }
    if (ChatbotRepository::find($cid) === null) {
        http_response_code(404);
        echo json_encode(['error' => 'Chatbot not found'], JSON_THROW_ON_ERROR);
        exit;
    }

    $raw = file_get_contents('php://input') ?: '';
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON'], JSON_THROW_ON_ERROR);
        exit;
    }
    $from = (int) ($data['from_flow_id'] ?? 0);
    $to = (int) ($data['to_flow_id'] ?? 0);
    if ($from <= 0 || $to <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'from_flow_id and to_flow_id required'], JSON_THROW_ON_ERROR);
        exit;
    }

    if ($method === 'POST') {
        try {
            ChatbotFlowRepository::addEdge($cid, $from, $to);
        } catch (\InvalidArgumentException $e) {
            http_response_code(400);
            echo json_encode(['error' => $e->getMessage()], JSON_THROW_ON_ERROR);
            exit;
        } catch (Throwable) {
            http_response_code(500);
            echo json_encode(['error' => 'Could not add edge'], JSON_THROW_ON_ERROR);
            exit;
        }
        try {
            $edges = ChatbotFlowRepository::listEdges($cid);
            echo json_encode(['ok' => true, 'edges' => $edges], JSON_THROW_ON_ERROR);
        } catch (Throwable) {
            http_response_code(500);
            echo json_encode(['error' => 'Could not load edges'], JSON_THROW_ON_ERROR);
        }
        exit;
    }

    try {
        $ok = ChatbotFlowRepository::removeEdge($cid, $from, $to);
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not remove edge'], JSON_THROW_ON_ERROR);
        exit;
    }
    if (!$ok) {
        http_response_code(404);
        echo json_encode(['error' => 'Edge not found'], JSON_THROW_ON_ERROR);
        exit;
    }
    try {
        $edges = ChatbotFlowRepository::listEdges($cid);
        echo json_encode(['ok' => true, 'edges' => $edges], JSON_THROW_ON_ERROR);
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not load edges'], JSON_THROW_ON_ERROR);
    }
    exit;
}

if (preg_match('#^/api/chatbots/(\d+)/flow-type-catalog$#', $path, $ftCatM) && $method === 'GET') {
    $cid = (int) $ftCatM[1];
    if ($cid <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid chatbot id'], JSON_THROW_ON_ERROR);
        exit;
    }
    if (ChatbotRepository::find($cid) === null) {
        http_response_code(404);
        echo json_encode(['error' => 'Chatbot not found'], JSON_THROW_ON_ERROR);
        exit;
    }
    $types = [];
    foreach (ChatbotFlowRepository::allowedFlowTypes() as $id) {
        $types[] = [
            'id' => $id,
            'label' => match ($id) {
                'custom' => 'Custom',
                'greeting' => 'Greeting / welcome',
                'greeting_name' => 'Greeting + name',
                'collect_email' => 'Ask email',
                'collect_phone' => 'Ask mobile number',
                'collect_location' => 'Ask location',
                'query_menu' => 'Query menu (branch by choice)',
                'core_features' => 'Core features',
                'services_list' => 'Services list',
                'contact' => 'Contact / more details',
                'book_slot' => 'Book slot',
                'fee_structure' => 'Fee structure',
                'go_back' => 'Go back (previous bot step)',
                'end_chat' => 'End chat (save conversation)',
                default => $id,
            },
        ];
    }
    echo json_encode(['flow_types' => $types], JSON_THROW_ON_ERROR);
    exit;
}

if (preg_match('#^/api/chatbots/(\d+)/chat-conv/progress$#', $path, $ccM) && $method === 'POST') {
    $cid = (int) $ccM[1];
    if ($cid <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid chatbot id'], JSON_THROW_ON_ERROR);
        exit;
    }
    if (ChatbotRepository::find($cid) === null) {
        http_response_code(404);
        echo json_encode(['error' => 'Chatbot not found'], JSON_THROW_ON_ERROR);
        exit;
    }
    $raw = file_get_contents('php://input') ?: '';
    $data = json_decode($raw, true);
    if (!is_array($data) || !isset($data['messages']) || !is_array($data['messages'])) {
        http_response_code(400);
        echo json_encode(['error' => 'messages array required'], JSON_THROW_ON_ERROR);
        exit;
    }
    $convId = isset($data['conversation_id']) ? (int) $data['conversation_id'] : null;
    if (isset($data['conversation_id']) && $convId <= 0) {
        $convId = null;
    }
    try {
        $id = ChatConvRepository::upsertInProgress($cid, $convId > 0 ? $convId : null, $data['messages']);
        echo json_encode(['ok' => true, 'id' => $id, 'conversation_id' => $id], JSON_THROW_ON_ERROR);
    } catch (\InvalidArgumentException $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()], JSON_THROW_ON_ERROR);
        exit;
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not save conversation'], JSON_THROW_ON_ERROR);
    }
    exit;
}

if (preg_match('#^/api/chatbots/(\d+)/chat-conv/complete$#', $path, $ccM) && $method === 'POST') {
    $cid = (int) $ccM[1];
    if ($cid <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid chatbot id'], JSON_THROW_ON_ERROR);
        exit;
    }
    if (ChatbotRepository::find($cid) === null) {
        http_response_code(404);
        echo json_encode(['error' => 'Chatbot not found'], JSON_THROW_ON_ERROR);
        exit;
    }
    $raw = file_get_contents('php://input') ?: '';
    $data = json_decode($raw, true);
    if (!is_array($data) || !isset($data['messages']) || !is_array($data['messages'])) {
        http_response_code(400);
        echo json_encode(['error' => 'messages array required'], JSON_THROW_ON_ERROR);
        exit;
    }
    $convId = isset($data['conversation_id']) ? (int) $data['conversation_id'] : null;
    try {
        if ($convId !== null && $convId > 0) {
            ChatConvRepository::completeExisting($cid, $convId, $data['messages']);
            echo json_encode(['ok' => true, 'id' => $convId, 'conversation_id' => $convId], JSON_THROW_ON_ERROR);
        } else {
            $id = ChatConvRepository::saveCompleted($cid, $data['messages']);
            echo json_encode(['ok' => true, 'id' => $id, 'conversation_id' => $id], JSON_THROW_ON_ERROR);
        }
    } catch (\InvalidArgumentException $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()], JSON_THROW_ON_ERROR);
        exit;
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not save conversation'], JSON_THROW_ON_ERROR);
    }
    exit;
}

if ($path === '/api/chat-conv' && $method === 'GET') {
    try {
        $rows = ChatConvRepository::listLatest();
        echo json_encode(['conversations' => $rows], JSON_THROW_ON_ERROR);
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not load conversations'], JSON_THROW_ON_ERROR);
    }
    exit;
}

if (preg_match('#^/api/chatbots/(\d+)/conversations/complete$#', $path, $convM) && $method === 'POST') {
    $cid = (int) $convM[1];
    if ($cid <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid chatbot id'], JSON_THROW_ON_ERROR);
        exit;
    }
    if (ChatbotRepository::find($cid) === null) {
        http_response_code(404);
        echo json_encode(['error' => 'Chatbot not found'], JSON_THROW_ON_ERROR);
        exit;
    }
    $raw = file_get_contents('php://input') ?: '';
    $data = json_decode($raw, true);
    if (!is_array($data) || !isset($data['messages']) || !is_array($data['messages'])) {
        http_response_code(400);
        echo json_encode(['error' => 'messages array required'], JSON_THROW_ON_ERROR);
        exit;
    }
    try {
        $result = ChatbotConversationRepository::saveCompletedConversation($cid, $data['messages']);
        echo json_encode(['ok' => true, 'conversation_id' => $result['conversation_id']], JSON_THROW_ON_ERROR);
    } catch (\InvalidArgumentException $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()], JSON_THROW_ON_ERROR);
        exit;
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not save conversation'], JSON_THROW_ON_ERROR);
    }
    exit;
}

if (preg_match('#^/api/chatbots/(\d+)/flows/(\d+)/options$#', $path, $foM) && $method === 'POST') {
    $cid = (int) $foM[1];
    $fid = (int) $foM[2];
    if ($cid <= 0 || $fid <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid id'], JSON_THROW_ON_ERROR);
        exit;
    }
    if (ChatbotRepository::find($cid) === null) {
        http_response_code(404);
        echo json_encode(['error' => 'Chatbot not found'], JSON_THROW_ON_ERROR);
        exit;
    }
    $raw = file_get_contents('php://input') ?: '';
    $data = json_decode($raw, true);
    if (!is_array($data) || !isset($data['options']) || !is_array($data['options'])) {
        http_response_code(400);
        echo json_encode(['error' => 'options array required'], JSON_THROW_ON_ERROR);
        exit;
    }
    try {
        ChatbotFlowRepository::replaceFlowOptions($cid, $fid, $data['options']);
    } catch (\InvalidArgumentException $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()], JSON_THROW_ON_ERROR);
        exit;
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not save options'], JSON_THROW_ON_ERROR);
        exit;
    }
    try {
        $opts = ChatbotFlowRepository::listOptionsByChatbot($cid);
        $forFlow = array_values(array_filter($opts, static fn (array $o): bool => (int) $o['flow_id'] === $fid));
        echo json_encode(['ok' => true, 'options' => $forFlow], JSON_THROW_ON_ERROR);
    } catch (Throwable) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not load options'], JSON_THROW_ON_ERROR);
    }
    exit;
}

http_response_code(404);
echo json_encode(['error' => 'Not found'], JSON_THROW_ON_ERROR);
