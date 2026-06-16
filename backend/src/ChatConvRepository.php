<?php

declare(strict_types=1);

namespace Lifescc;

use PDO;

final class ChatConvRepository
{
    /**
     * @param list<array<string, mixed>> $messages
     */
    public static function saveCompleted(int $chatbotId, array $messages): int
    {
        if ($messages === []) {
            throw new \InvalidArgumentException('messages required');
        }

        $pdo = Database::connection();
        $json = json_encode($messages, JSON_THROW_ON_ERROR);
        $stmt = $pdo->prepare(
            'INSERT INTO chat_conv (chatbot_id, status, messages_json, ended_at)
             VALUES (:cid, :st, :msg, NOW())'
        );
        $stmt->execute([
            ':cid' => $chatbotId,
            ':st' => 'completed',
            ':msg' => $json,
        ]);

        return (int) $pdo->lastInsertId();
    }

    /**
     * Create or update an in-progress transcript (e.g. after user enters their name).
     *
     * @param list<array<string, mixed>> $messages
     */
    public static function upsertInProgress(int $chatbotId, ?int $conversationId, array $messages): int
    {
        if ($messages === []) {
            throw new \InvalidArgumentException('messages required');
        }

        $pdo = Database::connection();
        $json = json_encode($messages, JSON_THROW_ON_ERROR);

        if ($conversationId === null || $conversationId <= 0) {
            $stmt = $pdo->prepare(
                'INSERT INTO chat_conv (chatbot_id, status, messages_json, ended_at)
                 VALUES (:cid, :st, :msg, NULL)'
            );
            $stmt->execute([
                ':cid' => $chatbotId,
                ':st' => 'in_progress',
                ':msg' => $json,
            ]);

            return (int) $pdo->lastInsertId();
        }

        $stmt = $pdo->prepare(
            'UPDATE chat_conv
             SET messages_json = :msg, status = :st, ended_at = NULL
             WHERE id = :id AND chatbot_id = :cid'
        );
        $stmt->execute([
            ':msg' => $json,
            ':st' => 'in_progress',
            ':id' => $conversationId,
            ':cid' => $chatbotId,
        ]);
        if ($stmt->rowCount() === 0) {
            throw new \InvalidArgumentException('conversation not found');
        }

        return $conversationId;
    }

    /**
     * Mark an existing row as completed (same messages payload as final save).
     *
     * @param list<array<string, mixed>> $messages
     */
    public static function completeExisting(int $chatbotId, int $conversationId, array $messages): void
    {
        if ($messages === []) {
            throw new \InvalidArgumentException('messages required');
        }

        $pdo = Database::connection();
        $json = json_encode($messages, JSON_THROW_ON_ERROR);
        $stmt = $pdo->prepare(
            'UPDATE chat_conv
             SET messages_json = :msg, status = :st, ended_at = NOW()
             WHERE id = :id AND chatbot_id = :cid'
        );
        $stmt->execute([
            ':msg' => $json,
            ':st' => 'completed',
            ':id' => $conversationId,
            ':cid' => $chatbotId,
        ]);
        if ($stmt->rowCount() === 0) {
            throw new \InvalidArgumentException('conversation not found');
        }
    }

    /**
     * @return list<array<string, mixed>>
     */
    public static function listLatest(int $limit = 200): array
    {
        $lim = max(1, min(500, $limit));
        $pdo = Database::connection();
        $stmt = $pdo->query(
            "SELECT c.id, c.chatbot_id, b.name AS template_name, c.status, c.messages_json, c.created_at, c.ended_at
             FROM chat_conv c
             INNER JOIN chatbots b ON b.id = c.chatbot_id
             ORDER BY c.created_at DESC
             LIMIT {$lim}"
        );
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ($rows as &$r) {
            $raw = $r['messages_json'] ?? null;
            if (is_string($raw) && $raw !== '') {
                $decoded = json_decode($raw, true);
                $r['messages_json'] = is_array($decoded) ? $decoded : [];
            } elseif (!is_array($raw)) {
                $r['messages_json'] = [];
            }
        }
        unset($r);

        return $rows;
    }
}
