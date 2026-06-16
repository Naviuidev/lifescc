<?php

declare(strict_types=1);

namespace Lifescc;

use PDO;
use PDOException;

final class ChatbotConversationRepository
{
    /**
     * Create a closed conversation and persist all messages (end-of-chat save).
     *
     * @param list<array{role: string, content: string, flow_id?: int|null, option_key?: string|null}> $messages
     * @return array{conversation_id: int}
     */
    public static function saveCompletedConversation(int $chatbotId, array $messages): array
    {
        if ($messages === []) {
            throw new \InvalidArgumentException('messages required');
        }

        $pdo = Database::connection();
        $pdo->beginTransaction();
        try {
            $stmt = $pdo->prepare(
                'INSERT INTO chatbot_conversations (chatbot_id, status, ended_at)
                 VALUES (:cid, :st, NOW())'
            );
            $stmt->execute([
                ':cid' => $chatbotId,
                ':st' => 'closed',
            ]);
            $convId = (int) $pdo->lastInsertId();

            $ins = $pdo->prepare(
                'INSERT INTO chatbot_conversation_messages
                 (conversation_id, role, content, flow_id, option_key, sort_order)
                 VALUES (:conv, :role, :content, :fid, :ok, :ord)'
            );
            $ord = 0;
            foreach ($messages as $m) {
                $role = (string) ($m['role'] ?? '');
                if (!in_array($role, ['user', 'assistant'], true)) {
                    throw new \InvalidArgumentException('invalid message role');
                }
                $content = (string) ($m['content'] ?? '');
                $flowId = isset($m['flow_id']) && $m['flow_id'] !== null && $m['flow_id'] !== ''
                    ? (int) $m['flow_id']
                    : null;
                $optKey = isset($m['option_key']) && $m['option_key'] !== null && $m['option_key'] !== ''
                    ? substr((string) $m['option_key'], 0, 64)
                    : null;

                $ins->execute([
                    ':conv' => $convId,
                    ':role' => $role,
                    ':content' => $content,
                    ':fid' => $flowId,
                    ':ok' => $optKey,
                    ':ord' => $ord++,
                ]);
            }

            $pdo->commit();

            return ['conversation_id' => $convId];
        } catch (PDOException | \InvalidArgumentException $e) {
            $pdo->rollBack();
            throw $e;
        }
    }
}
