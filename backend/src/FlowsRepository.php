<?php

declare(strict_types=1);

namespace Lifescc;

use PDO;

final class FlowsRepository
{
    private static ?bool $hasOptionsJsonColumn = null;

    /** True when migration 012 (flows.options_json) has been applied. Cached per request. */
    private static function hasOptionsJsonColumn(): bool
    {
        if (self::$hasOptionsJsonColumn !== null) {
            return self::$hasOptionsJsonColumn;
        }
        try {
            $pdo = Database::connection();
            $stmt = $pdo->query(
                "SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
                 WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'flows' AND COLUMN_NAME = 'options_json'
                 LIMIT 1"
            );
            self::$hasOptionsJsonColumn = $stmt !== false && $stmt->fetchColumn() !== false;
        } catch (\Throwable) {
            self::$hasOptionsJsonColumn = false;
        }

        return self::$hasOptionsJsonColumn;
    }

    /** SELECT list for flows joined to chatbots (template name). */
    private static function selectFlowRowColumns(): string
    {
        return self::hasOptionsJsonColumn()
            ? 'f.id, f.chatbot_id, c.name AS template_name, f.flow_key, f.greeting_text, f.name_placeholder, f.prompt_text, f.options_json, f.created_at, f.updated_at'
            : 'f.id, f.chatbot_id, c.name AS template_name, f.flow_key, f.greeting_text, f.name_placeholder, f.prompt_text, f.created_at, f.updated_at';
    }

    /**
     * @param array<string, mixed> $row
     * @return array<string, mixed>
     */
    private static function normalizeFlowRow(array $row): array
    {
        if (!array_key_exists('options_json', $row)) {
            $row['options_json'] = null;
        } elseif (is_string($row['options_json']) && $row['options_json'] !== '') {
            $decoded = json_decode($row['options_json'], true);
            if (json_last_error() === JSON_ERROR_NONE) {
                $row['options_json'] = $decoded;
            }
        }

        return $row;
    }

    /** @return list<string> */
    public static function allowedFlowKeys(): array
    {
        return ['greeting_name', 'collect_email', 'collect_phone', 'business_query'];
    }

    /** @return list<string> */
    public static function allowedBusinessBadgeKeys(): array
    {
        return ['services', 'fee_structure', 'locations', 'request_callback', 'book_slot'];
    }

    /**
     * @return list<array<string, mixed>>
     */
    public static function listByTemplate(int $chatbotId): array
    {
        $pdo = Database::connection();
        $cols = self::selectFlowRowColumns();
        $stmt = $pdo->prepare(
            "SELECT {$cols}
             FROM flows f
             INNER JOIN chatbots c ON c.id = f.chatbot_id
             WHERE f.chatbot_id = :cid
             ORDER BY f.updated_at DESC, f.id DESC"
        );
        $stmt->execute([':cid' => $chatbotId]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return array_map(static fn (array $r): array => self::normalizeFlowRow($r), $rows);
    }

    /**
     * @return list<array<string, mixed>>
     */
    public static function listAllLatestFirst(): array
    {
        $pdo = Database::connection();
        $cols = self::selectFlowRowColumns();
        $stmt = $pdo->query(
            "SELECT {$cols}
             FROM flows f
             INNER JOIN chatbots c ON c.id = f.chatbot_id
             ORDER BY f.updated_at DESC, f.id DESC"
        );
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return array_map(static fn (array $r): array => self::normalizeFlowRow($r), $rows);
    }

    /**
     * @return array<string, mixed>|null
     */
    public static function find(int $id): ?array
    {
        $pdo = Database::connection();
        $cols = self::selectFlowRowColumns();
        $stmt = $pdo->prepare(
            "SELECT {$cols}
             FROM flows f
             INNER JOIN chatbots c ON c.id = f.chatbot_id
             WHERE f.id = :id
             LIMIT 1"
        );
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return $row === false ? null : self::normalizeFlowRow($row);
    }

    /**
     * @return array<string, mixed>|null
     */
    public static function findByChatbotAndKey(int $chatbotId, string $flowKey): ?array
    {
        $pdo = Database::connection();
        $cols = self::selectFlowRowColumns();
        $stmt = $pdo->prepare(
            "SELECT {$cols}
             FROM flows f
             INNER JOIN chatbots c ON c.id = f.chatbot_id
             WHERE f.chatbot_id = :cid AND f.flow_key = :fkey
             LIMIT 1"
        );
        $stmt->execute([':cid' => $chatbotId, ':fkey' => $flowKey]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return $row === false ? null : self::normalizeFlowRow($row);
    }

    public static function upsertGreetingNameFlow(int $chatbotId, string $greetingText, string $namePlaceholder): int
    {
        $pdo = Database::connection();
        $find = $pdo->prepare(
            'SELECT id FROM flows WHERE chatbot_id = :cid AND flow_key = :fkey LIMIT 1'
        );
        $find->execute([':cid' => $chatbotId, ':fkey' => 'greeting_name']);
        $existingId = $find->fetchColumn();

        if ($existingId !== false) {
            if (self::hasOptionsJsonColumn()) {
                $u = $pdo->prepare(
                    'UPDATE flows
                     SET greeting_text = :greet, name_placeholder = :ph, prompt_text = NULL, options_json = NULL, updated_at = CURRENT_TIMESTAMP
                     WHERE id = :id'
                );
            } else {
                $u = $pdo->prepare(
                    'UPDATE flows
                     SET greeting_text = :greet, name_placeholder = :ph, prompt_text = NULL, updated_at = CURRENT_TIMESTAMP
                     WHERE id = :id'
                );
            }
            $u->execute([
                ':greet' => $greetingText,
                ':ph' => $namePlaceholder,
                ':id' => (int) $existingId,
            ]);

            return (int) $existingId;
        }

        if (self::hasOptionsJsonColumn()) {
            $ins = $pdo->prepare(
                'INSERT INTO flows (chatbot_id, flow_key, greeting_text, name_placeholder, prompt_text, options_json)
                 VALUES (:cid, :fkey, :greet, :ph, NULL, NULL)'
            );
        } else {
            $ins = $pdo->prepare(
                'INSERT INTO flows (chatbot_id, flow_key, greeting_text, name_placeholder, prompt_text)
                 VALUES (:cid, :fkey, :greet, :ph, NULL)'
            );
        }
        $ins->execute([
            ':cid' => $chatbotId,
            ':fkey' => 'greeting_name',
            ':greet' => $greetingText,
            ':ph' => $namePlaceholder,
        ]);

        return (int) $pdo->lastInsertId();
    }

    public static function upsertPromptFlow(int $chatbotId, string $flowKey, string $promptText): int
    {
        if (!in_array($flowKey, ['collect_email', 'collect_phone'], true)) {
            throw new \InvalidArgumentException('invalid flow_key for prompt flow');
        }

        $pdo = Database::connection();
        $find = $pdo->prepare(
            'SELECT id FROM flows WHERE chatbot_id = :cid AND flow_key = :fkey LIMIT 1'
        );
        $find->execute([':cid' => $chatbotId, ':fkey' => $flowKey]);
        $existingId = $find->fetchColumn();

        if ($existingId !== false) {
            if (self::hasOptionsJsonColumn()) {
                $u = $pdo->prepare(
                    'UPDATE flows
                     SET prompt_text = :pt, greeting_text = NULL, name_placeholder = NULL, options_json = NULL, updated_at = CURRENT_TIMESTAMP
                     WHERE id = :id'
                );
            } else {
                $u = $pdo->prepare(
                    'UPDATE flows
                     SET prompt_text = :pt, greeting_text = NULL, name_placeholder = NULL, updated_at = CURRENT_TIMESTAMP
                     WHERE id = :id'
                );
            }
            $u->execute([
                ':pt' => $promptText,
                ':id' => (int) $existingId,
            ]);

            return (int) $existingId;
        }

        if (self::hasOptionsJsonColumn()) {
            $ins = $pdo->prepare(
                'INSERT INTO flows (chatbot_id, flow_key, greeting_text, name_placeholder, prompt_text, options_json)
                 VALUES (:cid, :fkey, NULL, NULL, :pt, NULL)'
            );
        } else {
            $ins = $pdo->prepare(
                'INSERT INTO flows (chatbot_id, flow_key, greeting_text, name_placeholder, prompt_text)
                 VALUES (:cid, :fkey, NULL, NULL, :pt)'
            );
        }
        $ins->execute([
            ':cid' => $chatbotId,
            ':fkey' => $flowKey,
            ':pt' => $promptText,
        ]);

        return (int) $pdo->lastInsertId();
    }

    public static function updateGreetingNameFlow(int $id, string $greetingText, string $namePlaceholder): bool
    {
        $pdo = Database::connection();
        if (self::hasOptionsJsonColumn()) {
            $u = $pdo->prepare(
                'UPDATE flows
                 SET greeting_text = :greet, name_placeholder = :ph, prompt_text = NULL, options_json = NULL, updated_at = CURRENT_TIMESTAMP
                 WHERE id = :id AND flow_key = :fkey'
            );
        } else {
            $u = $pdo->prepare(
                'UPDATE flows
                 SET greeting_text = :greet, name_placeholder = :ph, prompt_text = NULL, updated_at = CURRENT_TIMESTAMP
                 WHERE id = :id AND flow_key = :fkey'
            );
        }
        $u->execute([
            ':greet' => $greetingText,
            ':ph' => $namePlaceholder,
            ':id' => $id,
            ':fkey' => 'greeting_name',
        ]);

        return $u->rowCount() > 0;
    }

    public static function updatePromptFlow(int $id, string $promptText): bool
    {
        $pdo = Database::connection();
        if (self::hasOptionsJsonColumn()) {
            $u = $pdo->prepare(
                'UPDATE flows
                 SET prompt_text = :pt, greeting_text = NULL, name_placeholder = NULL, options_json = NULL, updated_at = CURRENT_TIMESTAMP
                 WHERE id = :id AND flow_key IN (\'collect_email\', \'collect_phone\')'
            );
        } else {
            $u = $pdo->prepare(
                'UPDATE flows
                 SET prompt_text = :pt, greeting_text = NULL, name_placeholder = NULL, updated_at = CURRENT_TIMESTAMP
                 WHERE id = :id AND flow_key IN (\'collect_email\', \'collect_phone\')'
            );
        }
        $u->execute([
            ':pt' => $promptText,
            ':id' => $id,
        ]);

        return $u->rowCount() > 0;
    }

    /**
     * Validates POST/PATCH body for Business Query and returns JSON-ready document.
     * Legacy storage was a bare array of badge keys; new shape includes badge_keys + per-badge data.
     *
     * @param array<string, mixed> $in
     * @return array<string, mixed>
     */
    public static function normalizeBusinessQueryDocument(array $in): array
    {
        $allowed = self::allowedBusinessBadgeKeys();
        $badgeKeysRaw = $in['badge_keys'] ?? null;
        if (!is_array($badgeKeysRaw)) {
            throw new \InvalidArgumentException('badge_keys must be an array');
        }
        $clean = [];
        foreach ($badgeKeysRaw as $k) {
            $k = trim((string) $k);
            if (in_array($k, $allowed, true) && !in_array($k, $clean, true)) {
                $clean[] = $k;
            }
        }

        $servicesIn = $in['services'] ?? [];
        if (!is_array($servicesIn)) {
            throw new \InvalidArgumentException('services must be an array');
        }
        $servicesOut = [];
        foreach ($servicesIn as $row) {
            if (!is_array($row)) {
                continue;
            }
            $name = trim((string) ($row['name'] ?? ''));
            $url = trim((string) ($row['url'] ?? ''));
            if ($name === '' && $url === '') {
                continue;
            }
            $servicesOut[] = ['name' => $name, 'url' => $url];
        }

        $locationsIn = $in['locations'] ?? [];
        if (!is_array($locationsIn)) {
            throw new \InvalidArgumentException('locations must be an array');
        }
        $locationsOut = [];
        foreach ($locationsIn as $row) {
            if (is_string($row)) {
                $lab = trim($row);
            } elseif (is_array($row)) {
                $lab = trim((string) ($row['label'] ?? ''));
            } else {
                continue;
            }
            if ($lab === '') {
                continue;
            }
            $locationsOut[] = ['label' => $lab];
        }

        $feePh = '';
        if (isset($in['fee_structure']) && is_array($in['fee_structure'])) {
            $feePh = trim((string) ($in['fee_structure']['placeholder'] ?? ''));
        }

        if (in_array('services', $clean, true)) {
            if ($servicesOut === []) {
                throw new \InvalidArgumentException('Add at least one service with a name and landing page URL when Services is enabled.');
            }
            foreach ($servicesOut as $s) {
                if ($s['name'] === '' || $s['url'] === '') {
                    throw new \InvalidArgumentException('Each service needs a name and a URL.');
                }
                if (strlen($s['url']) > 2048) {
                    throw new \InvalidArgumentException('A service URL is too long.');
                }
                if (!self::isValidServiceUrl($s['url'])) {
                    throw new \InvalidArgumentException('Each service URL must be a valid http(s) address or a path starting with /.');
                }
            }
        }

        if (in_array('locations', $clean, true)) {
            if ($locationsOut === []) {
                throw new \InvalidArgumentException('Add at least one location when Locations is enabled.');
            }
        }

        if (in_array('fee_structure', $clean, true)) {
            if ($feePh === '') {
                throw new \InvalidArgumentException('Fee structure requires placeholder text for the content area.');
            }
            if (strlen($feePh) > 2048) {
                throw new \InvalidArgumentException('Fee structure placeholder is too long (max 2048).');
            }
        }

        return [
            'badge_keys' => $clean,
            'services' => in_array('services', $clean, true) ? $servicesOut : [],
            'locations' => in_array('locations', $clean, true) ? $locationsOut : [],
            'fee_structure' => ['placeholder' => in_array('fee_structure', $clean, true) ? $feePh : ''],
        ];
    }

    private static function isValidServiceUrl(string $url): bool
    {
        if ($url === '') {
            return false;
        }
        if (preg_match('#^/#', $url)) {
            return strlen($url) <= 2048;
        }

        return filter_var($url, FILTER_VALIDATE_URL) !== false;
    }

    /**
     * @param array<string, mixed> $document Fields: badge_keys, services, locations, fee_structure (same as API body)
     */
    public static function upsertBusinessQueryFlow(int $chatbotId, array $document): int
    {
        if (!self::hasOptionsJsonColumn()) {
            throw new \InvalidArgumentException(
                'Add column flows.options_json (run backend/migrations/012_flows_options_json.sql) before saving Business Query.'
            );
        }

        $doc = self::normalizeBusinessQueryDocument($document);
        $json = json_encode($doc, JSON_THROW_ON_ERROR);

        $pdo = Database::connection();
        $find = $pdo->prepare(
            'SELECT id FROM flows WHERE chatbot_id = :cid AND flow_key = :fkey LIMIT 1'
        );
        $find->execute([':cid' => $chatbotId, ':fkey' => 'business_query']);
        $existingId = $find->fetchColumn();

        if ($existingId !== false) {
            $u = $pdo->prepare(
                'UPDATE flows
                 SET options_json = :opt, greeting_text = NULL, name_placeholder = NULL, prompt_text = NULL, updated_at = CURRENT_TIMESTAMP
                 WHERE id = :id'
            );
            $u->execute([
                ':opt' => $json,
                ':id' => (int) $existingId,
            ]);

            return (int) $existingId;
        }

        $ins = $pdo->prepare(
            'INSERT INTO flows (chatbot_id, flow_key, greeting_text, name_placeholder, prompt_text, options_json)
             VALUES (:cid, :fkey, NULL, NULL, NULL, :opt)'
        );
        $ins->execute([
            ':cid' => $chatbotId,
            ':fkey' => 'business_query',
            ':opt' => $json,
        ]);

        return (int) $pdo->lastInsertId();
    }

    /**
     * @param array<string, mixed> $document
     */
    public static function updateBusinessQueryFlow(int $id, array $document): bool
    {
        if (!self::hasOptionsJsonColumn()) {
            throw new \InvalidArgumentException(
                'Add column flows.options_json (run backend/migrations/012_flows_options_json.sql) before saving Business Query.'
            );
        }

        $doc = self::normalizeBusinessQueryDocument($document);
        $json = json_encode($doc, JSON_THROW_ON_ERROR);

        $pdo = Database::connection();
        $u = $pdo->prepare(
            'UPDATE flows
             SET options_json = :opt, greeting_text = NULL, name_placeholder = NULL, prompt_text = NULL, updated_at = CURRENT_TIMESTAMP
             WHERE id = :id AND flow_key = :fkey'
        );
        $u->execute([
            ':opt' => $json,
            ':id' => $id,
            ':fkey' => 'business_query',
        ]);

        return true;
    }

    /**
     * @return array{nodes: list<array<string, mixed>>, edges: list<array<string, mixed>>}
     */
    public static function getCanvas(int $chatbotId): array
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare(
            'SELECT canvas_json FROM chatbot_flow_canvas WHERE chatbot_id = :cid LIMIT 1'
        );
        $stmt->execute([':cid' => $chatbotId]);
        $raw = $stmt->fetchColumn();
        if ($raw === false) {
            return ['nodes' => [], 'edges' => []];
        }
        $decoded = json_decode((string) $raw, true);
        if (!is_array($decoded)) {
            return ['nodes' => [], 'edges' => []];
        }
        $nodes = $decoded['nodes'] ?? [];
        $edges = $decoded['edges'] ?? [];

        return [
            'nodes' => is_array($nodes) ? $nodes : [],
            'edges' => is_array($edges) ? $edges : [],
        ];
    }

    /**
     * @param array{nodes: list<array<string, mixed>>, edges: list<array<string, mixed>>} $canvas
     */
    public static function saveCanvas(int $chatbotId, array $canvas): void
    {
        $pdo = Database::connection();
        $payload = json_encode($canvas, JSON_THROW_ON_ERROR);
        $ins = $pdo->prepare(
            'INSERT INTO chatbot_flow_canvas (chatbot_id, canvas_json)
             VALUES (:cid, :canvas)
             ON DUPLICATE KEY UPDATE canvas_json = VALUES(canvas_json), updated_at = CURRENT_TIMESTAMP'
        );
        $ins->execute([
            ':cid' => $chatbotId,
            ':canvas' => $payload,
        ]);
    }
}
