<?php

declare(strict_types=1);

namespace Lifescc;

use PDO;

final class ChatbotUserRepository
{
    /** One-line summary for admin list + email subject (from answers JSON keyed by step id). */
    public static function summarizePayload(string $json): string
    {
        $data = json_decode($json, true);
        if (!is_array($data)) {
            return 'Site chat — engagement';
        }
        $parts = [];
        $main = $data['s_main_service'] ?? null;
        if (is_string($main)) {
            $o = json_decode($main, true);
            if (is_array($o) && isset($o['service']['label']) && trim((string) $o['service']['label']) !== '') {
                $parts[] = trim((string) $o['service']['label']);
            }
        }
        $near = $data['s_near_me'] ?? null;
        if (is_string($near)) {
            $o = json_decode($near, true);
            if (is_array($o)) {
                $c = isset($o['city']['label']) ? trim((string) $o['city']['label']) : '';
                $b = isset($o['branch']['name']) ? trim((string) $o['branch']['name']) : '';
                $fu = isset($o['follow_up']) ? trim((string) $o['follow_up']) : '';
                $tail = $c !== '' || $b !== '' ? trim($c . ($c !== '' && $b !== '' ? ' · ' : '') . $b) : '';
                if ($tail !== '') {
                    $parts[] = $tail;
                }
                if ($fu !== '') {
                    $parts[] = match ($fu) {
                        'request_callback' => 'Request call',
                        'slot_booking' => 'Slot booking',
                        default => $fu,
                    };
                }
            }
        }

        return $parts !== [] ? implode(' · ', $parts) : 'Site chat — 30s+ on branch finder';
    }

    /**
     * @param array{chatbot_id: int, dwell_seconds: int, summary_line: string, payload_json: string, email_sent?: int} $row
     */
    public static function create(array $row): int
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare(
            'INSERT INTO chatbot_user (chatbot_id, dwell_seconds, summary_line, payload_json, email_sent)
             VALUES (:chatbot_id, :dwell_seconds, :summary_line, :payload_json, :email_sent)'
        );
        $stmt->execute([
            ':chatbot_id' => (int) $row['chatbot_id'],
            ':dwell_seconds' => (int) $row['dwell_seconds'],
            ':summary_line' => substr((string) $row['summary_line'], 0, 512),
            ':payload_json' => (string) $row['payload_json'],
            ':email_sent' => isset($row['email_sent']) ? (int) $row['email_sent'] : 0,
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
            'SELECT id, chatbot_id, dwell_seconds, summary_line, payload_json, email_sent, created_at
             FROM chatbot_user
             ORDER BY created_at DESC, id DESC'
        );

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function markEmailSent(int $id, bool $sent): bool
    {
        if ($id <= 0) {
            return false;
        }
        $pdo = Database::connection();
        $stmt = $pdo->prepare('UPDATE chatbot_user SET email_sent = :s WHERE id = :id');

        return $stmt->execute([':s' => $sent ? 1 : 0, ':id' => $id]) && $stmt->rowCount() > 0;
    }
}
