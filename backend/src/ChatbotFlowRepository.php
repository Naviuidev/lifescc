<?php

declare(strict_types=1);

namespace Lifescc;

use PDO;
use PDOException;
use Throwable;

final class ChatbotFlowRepository
{
    /**
     * @return list<string>
     */
    public static function allowedFlowTypes(): array
    {
        return [
            'custom',
            'greeting',
            'greeting_name',
            'collect_email',
            'collect_phone',
            'collect_location',
            'query_menu',
            'core_features',
            'services_list',
            'contact',
            'book_slot',
            'fee_structure',
            'go_back',
            'end_chat',
        ];
    }

    public static function assertFlowType(string $t): void
    {
        if (!in_array($t, self::allowedFlowTypes(), true)) {
            throw new \InvalidArgumentException('invalid flow_type');
        }
    }

    public static function flowBelongsToChatbot(int $chatbotId, int $flowId): bool
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare(
            'SELECT 1 FROM chatbot_flows WHERE id = :fid AND chatbot_id = :cid LIMIT 1'
        );
        $stmt->execute([':fid' => $flowId, ':cid' => $chatbotId]);

        return $stmt->fetchColumn() !== false;
    }

    public static function hasGreetingNameFlow(int $chatbotId): bool
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare(
            'SELECT 1 FROM chatbot_flows WHERE chatbot_id = :cid AND flow_type = :ft LIMIT 1'
        );
        $stmt->execute([':cid' => $chatbotId, ':ft' => 'greeting_name']);

        return $stmt->fetchColumn() !== false;
    }

    /** Email / mobile flows must come after a name step; used for create + edge validation. */
    public static function flowTypeRequiresGreetingNameFirst(string $flowType): bool
    {
        return in_array($flowType, ['collect_email', 'collect_phone'], true);
    }

    /**
     * Enforces from → to order: name before email/mobile; never email/mobile → name.
     */
    public static function assertEdgeContactOrder(string $typeFrom, string $typeTo): void
    {
        if ($typeTo === 'greeting_name' && self::flowTypeRequiresGreetingNameFirst($typeFrom)) {
            throw new \InvalidArgumentException(
                'Greeting + name must come first. Do not connect email or mobile into Greeting + name.'
            );
        }
        if ($typeTo === 'collect_email' && $typeFrom !== 'greeting_name') {
            throw new \InvalidArgumentException(
                'Connect Ask email only from Greeting + name (name before email).'
            );
        }
        if ($typeTo === 'collect_phone' && !in_array($typeFrom, ['greeting_name', 'collect_email'], true)) {
            throw new \InvalidArgumentException(
                'Connect Ask mobile number from Greeting + name or from Ask email.'
            );
        }
    }

    /**
     * @return list<array<string, mixed>>
     */
    public static function listFlows(int $chatbotId): array
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare(
            'SELECT id, chatbot_id, heading, placeholder_text, flow_type, sort_order, created_at
             FROM chatbot_flows
             WHERE chatbot_id = :cid
             ORDER BY sort_order ASC, id ASC'
        );
        $stmt->execute([':cid' => $chatbotId]);

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * All menu/branch options for flows belonging to this chatbot.
     *
     * @return list<array<string, mixed>>
     */
    public static function listOptionsByChatbot(int $chatbotId): array
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare(
            'SELECT o.id, o.flow_id, o.option_key, o.label, o.target_flow_id, o.sort_order, o.created_at
             FROM chatbot_flow_options o
             INNER JOIN chatbot_flows f ON f.id = o.flow_id
             WHERE f.chatbot_id = :cid
             ORDER BY o.flow_id ASC, o.sort_order ASC, o.id ASC'
        );
        $stmt->execute([':cid' => $chatbotId]);

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * @param list<array{option_key: string, label: string, target_flow_id?: int|null, sort_order?: int}> $options
     */
    public static function replaceFlowOptions(int $chatbotId, int $flowId, array $options): void
    {
        if (!self::flowBelongsToChatbot($chatbotId, $flowId)) {
            throw new \InvalidArgumentException('flow not found');
        }

        foreach ($options as $o) {
            $tid = $o['target_flow_id'] ?? null;
            if ($tid !== null && (int) $tid > 0) {
                if (!self::flowBelongsToChatbot($chatbotId, (int) $tid)) {
                    throw new \InvalidArgumentException('target flow must belong to this chatbot');
                }
            }
        }

        $pdo = Database::connection();
        $pdo->beginTransaction();
        try {
            $del = $pdo->prepare('DELETE FROM chatbot_flow_options WHERE flow_id = :fid');
            $del->execute([':fid' => $flowId]);

            $ins = $pdo->prepare(
                'INSERT INTO chatbot_flow_options (flow_id, option_key, label, target_flow_id, sort_order)
                 VALUES (:fid, :ok, :lab, :tid, :ord)'
            );
            foreach ($options as $i => $o) {
                $key = trim((string) ($o['option_key'] ?? ''));
                $lab = trim((string) ($o['label'] ?? ''));
                if ($key === '' || $lab === '') {
                    throw new \InvalidArgumentException('option_key and label required');
                }
                $tid = isset($o['target_flow_id']) && $o['target_flow_id'] !== null && $o['target_flow_id'] !== ''
                    ? (int) $o['target_flow_id']
                    : null;
                $ins->execute([
                    ':fid' => $flowId,
                    ':ok' => substr($key, 0, 64),
                    ':lab' => substr($lab, 0, 512),
                    ':tid' => $tid,
                    ':ord' => (int) ($o['sort_order'] ?? $i),
                ]);
            }
            $pdo->commit();
        } catch (Throwable $e) {
            $pdo->rollBack();
            throw $e;
        }
    }

    /**
     * @return list<array<string, mixed>>
     */
    public static function listEdges(int $chatbotId): array
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare(
            'SELECT id, chatbot_id, from_flow_id, to_flow_id, created_at
             FROM chatbot_flow_edges
             WHERE chatbot_id = :cid
             ORDER BY id ASC'
        );
        $stmt->execute([':cid' => $chatbotId]);

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function createFlow(int $chatbotId, string $heading, string $placeholderText, string $flowType): int
    {
        self::assertFlowType($flowType);
        if (self::flowTypeRequiresGreetingNameFirst($flowType) && !self::hasGreetingNameFlow($chatbotId)) {
            throw new \InvalidArgumentException('Add a Greeting + name flow first before email or mobile.');
        }

        $pdo = Database::connection();
        $stmt = $pdo->prepare(
            'SELECT COALESCE(MAX(sort_order), -1) + 1 AS next_order FROM chatbot_flows WHERE chatbot_id = :cid'
        );
        $stmt->execute([':cid' => $chatbotId]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $next = (int) ($row['next_order'] ?? 0);

        $ins = $pdo->prepare(
            'INSERT INTO chatbot_flows (chatbot_id, heading, placeholder_text, flow_type, sort_order)
             VALUES (:cid, :heading, :placeholder, :ftype, :sort_order)'
        );
        $ins->execute([
            ':cid' => $chatbotId,
            ':heading' => $heading,
            ':placeholder' => $placeholderText,
            ':ftype' => $flowType,
            ':sort_order' => $next,
        ]);

        return (int) $pdo->lastInsertId();
    }

    public static function deleteFlow(int $chatbotId, int $flowId): bool
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare(
            'DELETE FROM chatbot_flows WHERE id = :fid AND chatbot_id = :cid'
        );

        return $stmt->execute([':fid' => $flowId, ':cid' => $chatbotId]) && $stmt->rowCount() > 0;
    }

    /**
     * @param list<int> $orderedFlowIds
     */
    public static function reorderFlows(int $chatbotId, array $orderedFlowIds): void
    {
        $pdo = Database::connection();
        $existing = self::listFlows($chatbotId);
        $existingIds = array_map(static fn (array $r): int => (int) $r['id'], $existing);
        sort($existingIds);
        $sorted = array_map('intval', $orderedFlowIds);
        sort($sorted);
        if ($existingIds !== $sorted || count($existingIds) !== count($orderedFlowIds)) {
            throw new \InvalidArgumentException('reorder must include each flow id exactly once');
        }

        $pdo->beginTransaction();
        try {
            $u = $pdo->prepare(
                'UPDATE chatbot_flows SET sort_order = :ord WHERE id = :fid AND chatbot_id = :cid'
            );
            foreach ($orderedFlowIds as $index => $fid) {
                $u->execute([
                    ':ord' => $index,
                    ':fid' => (int) $fid,
                    ':cid' => $chatbotId,
                ]);
            }
            $pdo->commit();
        } catch (PDOException $e) {
            $pdo->rollBack();
            throw $e;
        }
    }

    public static function addEdge(int $chatbotId, int $fromFlowId, int $toFlowId): void
    {
        if ($fromFlowId === $toFlowId) {
            throw new \InvalidArgumentException('cannot connect a flow to itself');
        }

        $pdo = Database::connection();
        $check = $pdo->prepare(
            'SELECT COUNT(*) FROM chatbot_flows
             WHERE chatbot_id = :cid AND (id = :f1 OR id = :f2)'
        );
        $check->execute([':cid' => $chatbotId, ':f1' => $fromFlowId, ':f2' => $toFlowId]);
        if ((int) $check->fetchColumn() !== 2) {
            throw new \InvalidArgumentException('flows must belong to this chatbot');
        }

        $ftStmt = $pdo->prepare(
            'SELECT flow_type FROM chatbot_flows WHERE chatbot_id = :cid AND id = :id LIMIT 1'
        );
        $ftStmt->execute([':cid' => $chatbotId, ':id' => $fromFlowId]);
        $typeFrom = (string) ($ftStmt->fetchColumn() ?: '');
        $ftStmt->execute([':cid' => $chatbotId, ':id' => $toFlowId]);
        $typeTo = (string) ($ftStmt->fetchColumn() ?: '');
        if (
            (self::flowTypeRequiresGreetingNameFirst($typeFrom) || self::flowTypeRequiresGreetingNameFirst($typeTo))
            && !self::hasGreetingNameFlow($chatbotId)
        ) {
            throw new \InvalidArgumentException(
                'Add a Greeting + name flow before connecting email or mobile flows.'
            );
        }

        self::assertEdgeContactOrder($typeFrom, $typeTo);

        $ins = $pdo->prepare(
            'INSERT INTO chatbot_flow_edges (chatbot_id, from_flow_id, to_flow_id)
             VALUES (:cid, :from_id, :to_id)'
        );
        try {
            $ins->execute([
                ':cid' => $chatbotId,
                ':from_id' => $fromFlowId,
                ':to_id' => $toFlowId,
            ]);
        } catch (PDOException $e) {
            if ($e->getCode() === '23000') {
                throw new \InvalidArgumentException('edge already exists', 0, $e);
            }
            throw $e;
        }
    }

    public static function removeEdge(int $chatbotId, int $fromFlowId, int $toFlowId): bool
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare(
            'DELETE FROM chatbot_flow_edges
             WHERE chatbot_id = :cid AND from_flow_id = :from_id AND to_flow_id = :to_id'
        );

        return $stmt->execute([
            ':cid' => $chatbotId,
            ':from_id' => $fromFlowId,
            ':to_id' => $toFlowId,
        ]) && $stmt->rowCount() > 0;
    }
}
