<?php

declare(strict_types=1);

namespace Lifescc;

use PDO;

final class CustomChatbotRepository
{
    /** Fixed id for the site widget flow loaded from `web/src/constants/siteEmbeddedChatbot.json` (not stored in DB). */
    public const SITE_EMBEDDED_CHATBOT_ID = 900000001;

    /**
     * @param list<array<string, mixed>> $steps
     */
    public static function validateSteps(array $steps): void
    {
        if ($steps === []) {
            return;
        }
        $seenIds = [];
        foreach ($steps as $idx => $st) {
            if (!is_array($st)) {
                throw new \InvalidArgumentException('Each step must be an object');
            }
            $id = trim((string) ($st['id'] ?? ''));
            if ($id === '') {
                throw new \InvalidArgumentException('Each step needs a non-empty id');
            }
            if (isset($seenIds[$id])) {
                throw new \InvalidArgumentException('Duplicate step id: ' . $id);
            }
            $seenIds[$id] = true;

            $type = (string) ($st['type'] ?? '');
            if (!in_array($type, ['message', 'text', 'textarea', 'choice', 'location', 'branches', 'call_specialist', 'services', 'loop', 'nav_service_select', 'main_service_carousel', 'site_near_me'], true)) {
                throw new \InvalidArgumentException('Invalid step type at index ' . $idx);
            }

            if ($type === 'message') {
                $c = trim((string) ($st['content'] ?? ''));
                if ($c === '') {
                    throw new \InvalidArgumentException('Message steps need content');
                }
            } elseif ($type === 'location') {
                $src = trim((string) ($st['location_source'] ?? 'custom'));
                if ($src === 'lifescc_site') {
                    $ui = trim((string) ($st['location_ui'] ?? 'grid'));
                    if ($ui !== '' && $ui !== 'grid') {
                        throw new \InvalidArgumentException('Site location steps only support grid UI');
                    }
                } else {
                    $branches = $st['branches'] ?? [];
                    if (!is_array($branches) || count($branches) < 1) {
                        throw new \InvalidArgumentException('Location steps need at least one branch');
                    }
                    foreach ($branches as $b) {
                        if (!is_array($b)) {
                            throw new \InvalidArgumentException('Each branch must be an object');
                        }
                        if (trim((string) ($b['name'] ?? '')) === '') {
                            throw new \InvalidArgumentException('Each branch needs a name');
                        }
                        if (trim((string) ($b['address'] ?? '')) === '') {
                            throw new \InvalidArgumentException('Each branch needs an address');
                        }
                        if (trim((string) ($b['phone'] ?? '')) === '') {
                            throw new \InvalidArgumentException('Each branch needs a phone number');
                        }
                        $reg = $b['region'] ?? null;
                        if ($reg !== null && $reg !== '' && !is_string($reg)) {
                            throw new \InvalidArgumentException('Branch region must be a string if set');
                        }
                        $lat = $b['lat'] ?? null;
                        $lng = $b['lng'] ?? null;
                        if ($lat !== null && $lat !== '' && !is_numeric($lat)) {
                            throw new \InvalidArgumentException('Branch latitude must be numeric if set');
                        }
                        if ($lng !== null && $lng !== '' && !is_numeric($lng)) {
                            throw new \InvalidArgumentException('Branch longitude must be numeric if set');
                        }
                    }
                }
            } elseif ($type === 'branches') {
                $branches = $st['branches'] ?? [];
                if (!is_array($branches) || count($branches) < 1) {
                    throw new \InvalidArgumentException('Branches steps need at least one branch');
                }
                foreach ($branches as $b) {
                    if (!is_array($b)) {
                        throw new \InvalidArgumentException('Each branch must be an object');
                    }
                    if (trim((string) ($b['name'] ?? '')) === '') {
                        throw new \InvalidArgumentException('Each branch needs a name');
                    }
                    if (trim((string) ($b['address'] ?? '')) === '') {
                        throw new \InvalidArgumentException('Each branch needs an address');
                    }
                    if (trim((string) ($b['phone'] ?? '')) === '') {
                        throw new \InvalidArgumentException('Each branch needs a phone number');
                    }
                    $lat = $b['lat'] ?? null;
                    $lng = $b['lng'] ?? null;
                    if ($lat !== null && $lat !== '' && !is_numeric($lat)) {
                        throw new \InvalidArgumentException('Branch latitude must be numeric if set');
                    }
                    if ($lng !== null && $lng !== '' && !is_numeric($lng)) {
                        throw new \InvalidArgumentException('Branch longitude must be numeric if set');
                    }
                }
            } elseif ($type === 'site_near_me') {
                $title = trim((string) ($st['title'] ?? ''));
                $label = trim((string) ($st['label'] ?? ''));
                if ($title === '' && $label === '') {
                    throw new \InvalidArgumentException('site_near_me steps need a title or label');
                }
                $pid = trim((string) ($st['service_step_id'] ?? ''));
                if ($pid === '') {
                    throw new \InvalidArgumentException('site_near_me needs service_step_id');
                }
                $locs = $st['location_cities'] ?? [];
                if (!is_array($locs) || count($locs) < 1) {
                    throw new \InvalidArgumentException('site_near_me needs location_cities');
                }
                foreach ($locs as $c) {
                    if (!is_array($c)) {
                        throw new \InvalidArgumentException('Each location_cities entry must be an object');
                    }
                    if (trim((string) ($c['id'] ?? '')) === '' || trim((string) ($c['label'] ?? '')) === '') {
                        throw new \InvalidArgumentException('Each city needs id and label');
                    }
                }
                $branches = $st['branches'] ?? [];
                if (!is_array($branches) || count($branches) < 1) {
                    throw new \InvalidArgumentException('site_near_me needs at least one branch');
                }
                foreach ($branches as $b) {
                    if (!is_array($b)) {
                        throw new \InvalidArgumentException('Each branch must be an object');
                    }
                    if (trim((string) ($b['id'] ?? '')) === '') {
                        throw new \InvalidArgumentException('Each branch needs an id');
                    }
                    if (trim((string) ($b['name'] ?? '')) === '') {
                        throw new \InvalidArgumentException('Each branch needs a name');
                    }
                    if (trim((string) ($b['address'] ?? '')) === '') {
                        throw new \InvalidArgumentException('Each branch needs an address');
                    }
                    if (trim((string) ($b['phone'] ?? '')) === '') {
                        throw new \InvalidArgumentException('Each branch needs a phone number');
                    }
                    $reg = $b['region'] ?? null;
                    if ($reg !== null && $reg !== '' && !is_string($reg)) {
                        throw new \InvalidArgumentException('Branch region must be a string if set');
                    }
                    $lat = $b['lat'] ?? null;
                    $lng = $b['lng'] ?? null;
                    if ($lat !== null && $lat !== '' && !is_numeric($lat)) {
                        throw new \InvalidArgumentException('Branch latitude must be numeric if set');
                    }
                    if ($lng !== null && $lng !== '' && !is_numeric($lng)) {
                        throw new \InvalidArgumentException('Branch longitude must be numeric if set');
                    }
                }
            } elseif ($type === 'call_specialist') {
                $msg = trim((string) ($st['message'] ?? ''));
                if ($msg === '') {
                    throw new \InvalidArgumentException('Call specialist steps need a response message');
                }
            } elseif ($type === 'nav_service_select') {
                if (trim((string) ($st['label'] ?? '')) === '') {
                    throw new \InvalidArgumentException('nav_service_select steps need a label');
                }
                $pid = trim((string) ($st['pillar_step_id'] ?? ''));
                if ($pid === '') {
                    throw new \InvalidArgumentException('nav_service_select needs pillar_step_id');
                }
            } elseif ($type === 'main_service_carousel') {
                if (trim((string) ($st['label'] ?? '')) === '') {
                    throw new \InvalidArgumentException('main_service_carousel steps need a label');
                }
            } elseif ($type === 'services') {
                if (trim((string) ($st['label'] ?? '')) === '') {
                    throw new \InvalidArgumentException('Services steps need a label');
                }
                $catalog = trim((string) ($st['services_catalog'] ?? ''));
                if ($catalog === 'default') {
                    $catalog = 'treatments';
                }
                if ($catalog === 'treatments' || $catalog === 'segments') {
                    if ($catalog === 'treatments') {
                        $spm = $st['services_page_map'] ?? null;
                        if ($spm !== null && !is_array($spm)) {
                            throw new \InvalidArgumentException('services_page_map must be an object if set');
                        }
                        if (is_array($spm)) {
                            foreach ($spm as $k => $v) {
                                if (!is_string($k) || trim($k) === '') {
                                    throw new \InvalidArgumentException('services_page_map keys must be non-empty strings');
                                }
                                if (!is_string($v) || trim($v) === '') {
                                    throw new \InvalidArgumentException('services_page_map values must be non-empty path strings');
                                }
                            }
                        }
                    }
                    if ($catalog === 'segments') {
                        $segs = $st['service_segments'] ?? null;
                        if ($segs !== null) {
                            if (!is_array($segs)) {
                                throw new \InvalidArgumentException('service_segments must be an array if set');
                            }
                            if (count($segs) < 1) {
                                throw new \InvalidArgumentException('service_segments needs at least one label when set');
                            }
                            foreach ($segs as $seg) {
                                if (!is_string($seg) || trim($seg) === '') {
                                    throw new \InvalidArgumentException('Each service segment label must be a non-empty string');
                                }
                            }
                        }
                    }
                    continue;
                }
                $opts = $st['options'] ?? [];
                if (!is_array($opts) || count($opts) < 2) {
                    throw new \InvalidArgumentException('Services steps need at least two options (or use segment / treatment catalog)');
                }
                foreach ($opts as $o) {
                    if (!is_string($o) || trim($o) === '') {
                        throw new \InvalidArgumentException('Service options must be non-empty strings');
                    }
                }
            } elseif ($type === 'loop') {
                $lines = $st['animated_lines'] ?? [];
                if (!is_array($lines) || count($lines) < 1) {
                    throw new \InvalidArgumentException('Loop steps need at least one animated line');
                }
                foreach ($lines as $ln) {
                    if (!is_string($ln) || trim($ln) === '') {
                        throw new \InvalidArgumentException('Loop animated lines must be non-empty strings');
                    }
                }
            } elseif ($type === 'choice') {
                if (trim((string) ($st['label'] ?? '')) === '') {
                    throw new \InvalidArgumentException('Choice steps need a label');
                }
                $opts = $st['options'] ?? [];
                if (!is_array($opts) || count($opts) < 2) {
                    throw new \InvalidArgumentException('Choice steps need at least two options');
                }
                foreach ($opts as $o) {
                    if (!is_string($o) || trim($o) === '') {
                        throw new \InvalidArgumentException('Choice options must be non-empty strings');
                    }
                }
                $cMap = $st['mapTo'] ?? null;
                if ($cMap === '') {
                    $cMap = null;
                }
                if ($cMap !== null && $cMap !== 'service') {
                    throw new \InvalidArgumentException('Choice steps may only map to service (or leave unmapped)');
                }
            } else {
                $label = trim((string) ($st['label'] ?? ''));
                if ($label === '') {
                    throw new \InvalidArgumentException('Text/textarea steps need a label');
                }
                $mapTo = $st['mapTo'] ?? null;
                if ($mapTo === '') {
                    $mapTo = null;
                }
                if ($mapTo !== null && !in_array($mapTo, ['full_name', 'email', 'phone', 'service'], true)) {
                    throw new \InvalidArgumentException('Invalid mapTo for step ' . $id);
                }
            }
        }

        foreach ($steps as $st) {
            if (!is_array($st) || (string) ($st['type'] ?? '') !== 'loop') {
                continue;
            }
            $tid = trim((string) ($st['target_step_id'] ?? ''));
            if ($tid === '') {
                continue;
            }
            if (!isset($seenIds[$tid])) {
                throw new \InvalidArgumentException('Loop step references unknown target step id: ' . $tid);
            }
        }
    }

    /**
     * Lead fields that must each be covered by at least one mapped step before save/publish.
     *
     * @return list<string> keys among full_name, email, phone, service
     */
    public static function missingMandatoryLeadMapKeys(array $steps): array
    {
        $need = ['full_name', 'email', 'phone', 'service'];
        $have = array_fill_keys($need, false);
        foreach ($steps as $st) {
            if (!is_array($st)) {
                continue;
            }
            $type = (string) ($st['type'] ?? '');
            if ($type === 'text' || $type === 'textarea') {
                $mt = $st['mapTo'] ?? null;
                if ($mt === '') {
                    $mt = null;
                }
                if (is_string($mt) && isset($have[$mt])) {
                    $have[$mt] = true;
                }
            } elseif ($type === 'choice') {
                $mt = $st['mapTo'] ?? null;
                if ($mt === '') {
                    $mt = null;
                }
                if ($mt === 'service') {
                    $have['service'] = true;
                }
            } elseif ($type === 'services') {
                $have['service'] = true;
            }
        }

        $out = [];
        foreach ($need as $k) {
            if (!$have[$k]) {
                $out[] = $k;
            }
        }

        return $out;
    }

    /**
     * Allowed service labels when services_catalog is "treatments" or legacy "default" (must match web/src/constants/chatbotServiceCatalog.js).
     *
     * @return list<string>
     */
    public static function defaultServiceCatalogLabels(): array
    {
        return [
            // Weight (see web WEIGHT_DROPDOWN_ITEMS)
            'Weight Loss',
            'Coolsculpting',
            'Zimmer',
            'Non Surgical Liposuction',
            'Inch Loss',
            'Figure Correction',
            'Cool Mini',
            'HIFU Liposonix',
            'BMI Overview',
            'Cryolipolysis Treatment',
            // Skin (see web SKIN_DROPDOWN_ITEMS)
            'Hydra Facial',
            'Anti Ageing',
            'Anti Tan',
            'Acne Scar',
            'Stretch Marks',
            'Skin Lightening',
            'Skin Tightening',
            'Skin Pigmentation',
            'Laser Hair Removal',
            'Acne/Pimple Treatment',
            'Qlaser',
            'Medifacial',
            // Hair (see web HAIR_DROPDOWN_ITEMS)
            'Service 3 a',
            'Service 3 b',
            'Service 3 c',
        ];
    }

    /**
     * Allowed answers when services_catalog is "segments" (must match web LIFESCC_DEFAULT_SERVICE_CATALOG category labels).
     *
     * @return list<string>
     */
    public static function defaultServiceCatalogCategoryLabels(): array
    {
        return ['Weight', 'Skin', 'Hair'];
    }

    /**
     * @param list<array<string, mixed>> $steps
     */
    public static function assertMandatoryLeadMappings(array $steps): void
    {
        if ($steps === []) {
            throw new \InvalidArgumentException('Add at least one flow step before saving.');
        }
        $missing = self::missingMandatoryLeadMapKeys($steps);
        if ($missing === []) {
            return;
        }
        $labels = [
            'full_name' => 'Full name',
            'email' => 'Email',
            'phone' => 'Mobile number',
            'service' => 'Service',
        ];
        $parts = [];
        foreach ($missing as $k) {
            $parts[] = $labels[$k] ?? $k;
        }
        throw new \InvalidArgumentException(
            'Map steps to all required lead fields: ' . implode(', ', $parts) . '.'
        );
    }

    /**
     * @return array<string, mixed>|null
     */
    public static function find(int $id): ?array
    {
        if ($id <= 0) {
            return null;
        }
        $pdo = Database::connection();
        $stmt = $pdo->prepare(
            'SELECT id, name, published, steps_json, created_at, updated_at
             FROM custom_chatbots WHERE id = :id LIMIT 1'
        );
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return $row === false ? null : self::decodeRow($row);
    }

    /**
     * @return array<string, mixed>|null
     */
    public static function findPublishedForSite(): ?array
    {
        $pdo = Database::connection();
        $stmt = $pdo->query(
            'SELECT id, name, published, steps_json, created_at, updated_at
             FROM custom_chatbots WHERE published = 1 ORDER BY updated_at DESC, id DESC LIMIT 1'
        );
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return $row === false ? null : self::decodeRow($row);
    }

    public static function siteEmbeddedFilePath(): string
    {
        $fromEnv = trim((string) (getenv('SITE_CHATBOT_JSON') ?: ''));
        if ($fromEnv !== '') {
            return $fromEnv;
        }

        $candidates = [
            LIFESCC_ROOT . '/data/siteEmbeddedChatbot.json',
            dirname(__DIR__, 2) . '/web/src/constants/siteEmbeddedChatbot.json',
        ];
        foreach ($candidates as $path) {
            if (is_file($path)) {
                return $path;
            }
        }

        return LIFESCC_ROOT . '/data/siteEmbeddedChatbot.json';
    }

    /**
     * @return array<string, mixed>|null
     */
    private static function readSiteEmbeddedFileData(): ?array
    {
        $path = self::siteEmbeddedFilePath();
        if (!is_file($path) || !is_readable($path)) {
            return null;
        }
        $raw = file_get_contents($path);
        if ($raw === false || $raw === '') {
            return null;
        }
        try {
            $data = json_decode($raw, true, 512, JSON_THROW_ON_ERROR);
        } catch (\JsonException) {
            return null;
        }

        return is_array($data) ? $data : null;
    }

    public static function siteEmbeddedWebsiteEnabled(): bool
    {
        $data = self::readSiteEmbeddedFileData();
        if ($data === null) {
            return false;
        }
        if (array_key_exists('website_enabled', $data)) {
            return ((int) $data['website_enabled']) === 1;
        }

        return ((int) ($data['published'] ?? 0)) === 1;
    }

    public static function setSiteEmbeddedWebsiteEnabled(bool $enabled): void
    {
        $path = self::siteEmbeddedFilePath();
        $data = self::readSiteEmbeddedFileData();
        if ($data === null) {
            throw new \RuntimeException('Site chatbot config file is missing or invalid');
        }
        $data['website_enabled'] = $enabled ? 1 : 0;
        $data['published'] = $enabled ? 1 : 0;
        $data['updated_at'] = gmdate('c');
        $encoded = json_encode($data, JSON_THROW_ON_ERROR | JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        if (file_put_contents($path, $encoded . "\n") === false) {
            throw new \RuntimeException('Could not save site chatbot settings');
        }
    }

    /**
     * Site widget flow: single JSON file in the repo (same steps the Vite bundle imports).
     * Public config + submit use this instead of a published DB row.
     *
     * @return array<string, mixed>|null
     */
    public static function siteEmbeddedFromFile(): ?array
    {
        $data = self::readSiteEmbeddedFileData();
        if ($data === null) {
            return null;
        }
        $id = (int) ($data['id'] ?? 0);
        if ($id !== self::SITE_EMBEDDED_CHATBOT_ID) {
            return null;
        }
        $steps = $data['steps'] ?? [];
        if (!is_array($steps)) {
            return null;
        }
        try {
            self::validateSteps($steps);
            self::assertMandatoryLeadMappings($steps);
        } catch (\InvalidArgumentException) {
            return null;
        }
        $name = trim((string) ($data['name'] ?? ''));
        if ($name === '') {
            $name = 'Life SCC Assistant';
        }
        $enabled = self::siteEmbeddedWebsiteEnabled();

        return [
            'id' => $id,
            'name' => $name,
            'published' => $enabled ? 1 : 0,
            'website_enabled' => $enabled ? 1 : 0,
            'steps' => array_values($steps),
            'created_at' => $data['created_at'] ?? null,
            'updated_at' => $data['updated_at'] ?? null,
        ];
    }

    /**
     * @return list<array<string, mixed>>
     */
    public static function allLatestFirst(): array
    {
        $pdo = Database::connection();
        $stmt = $pdo->query(
            'SELECT id, name, published, steps_json, created_at, updated_at
             FROM custom_chatbots ORDER BY created_at DESC, id DESC'
        );
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $out = [];
        foreach ($rows as $row) {
            $out[] = self::decodeRow($row);
        }

        return $out;
    }

    /**
     * @param list<array<string, mixed>> $steps
     */
    public static function create(string $name, array $steps): int
    {
        self::validateSteps($steps);
        if ($steps !== []) {
            self::assertMandatoryLeadMappings($steps);
        }
        $pdo = Database::connection();
        $stmt = $pdo->prepare(
            'INSERT INTO custom_chatbots (name, steps_json, published) VALUES (:name, :steps, 0)'
        );
        $stmt->execute([
            ':name' => $name,
            ':steps' => json_encode(array_values($steps), JSON_THROW_ON_ERROR),
        ]);

        return (int) $pdo->lastInsertId();
    }

    /**
     * @param list<array<string, mixed>>|null $steps
     */
    public static function update(int $id, ?string $name, ?array $steps): bool
    {
        if ($id <= 0) {
            return false;
        }
        $ex = self::find($id);
        if ($ex === null) {
            return false;
        }
        $finalName = $name !== null ? trim($name) : (string) $ex['name'];
        if ($finalName === '' || strlen($finalName) > 255) {
            throw new \InvalidArgumentException('invalid name');
        }
        $finalSteps = $steps !== null ? $steps : $ex['steps'];
        if (!is_array($finalSteps)) {
            throw new \InvalidArgumentException('invalid steps');
        }
        self::validateSteps($finalSteps);
        if ($steps !== null) {
            self::assertMandatoryLeadMappings($finalSteps);
        }

        $pdo = Database::connection();
        $stmt = $pdo->prepare(
            'UPDATE custom_chatbots SET name = :name, steps_json = :steps WHERE id = :id'
        );
        $stmt->execute([
            ':name' => $finalName,
            ':steps' => json_encode(array_values($finalSteps), JSON_THROW_ON_ERROR),
            ':id' => $id,
        ]);

        return $stmt->rowCount() > 0;
    }

    public static function deleteById(int $id): bool
    {
        if ($id <= 0) {
            return false;
        }
        $pdo = Database::connection();
        $stmt = $pdo->prepare('DELETE FROM custom_chatbots WHERE id = :id');

        return $stmt->execute([':id' => $id]) && $stmt->rowCount() > 0;
    }

    public static function publishOnSite(int $id): void
    {
        $pdo = Database::connection();
        $row = self::find($id);
        if ($row === null) {
            throw new \InvalidArgumentException('Chatbot not found');
        }
        $steps = $row['steps'] ?? [];
        if (!is_array($steps)) {
            $steps = [];
        }
        self::validateSteps($steps);
        self::assertMandatoryLeadMappings($steps);

        $pdo->beginTransaction();
        try {
            $pdo->exec('UPDATE custom_chatbots SET published = 0');
            $u = $pdo->prepare('UPDATE custom_chatbots SET published = 1 WHERE id = :id');
            $u->execute([':id' => $id]);
            $pdo->commit();
        } catch (\Throwable $e) {
            $pdo->rollBack();
            throw $e;
        }
    }

    public static function unpublish(int $id): bool
    {
        if ($id <= 0) {
            return false;
        }
        if (self::find($id) === null) {
            return false;
        }
        $pdo = Database::connection();
        $stmt = $pdo->prepare('UPDATE custom_chatbots SET published = 0 WHERE id = :id');
        $stmt->execute([':id' => $id]);

        return true;
    }

    /**
     * Validate visitor answers against published steps and build contact + transcript.
     *
     * @param list<array<string, mixed>> $steps
     * @param array<string, mixed>     $answers keyed by step id
     *
     * @return array{first_name: string, last_name: string, email: string, country_code: string, phone: string, service: string, submit_method: string, transcript: list<array<string, mixed>>}
     */
    public static function buildLeadFromAnswers(array $steps, array $answers): array
    {
        $mapped = ['full_name' => null, 'email' => null, 'phone' => null, 'service' => null];
        $transcript = [];

        foreach ($steps as $st) {
            if (!is_array($st)) {
                continue;
            }
            $id = (string) ($st['id'] ?? '');
            $type = (string) ($st['type'] ?? '');
            if ($id === '') {
                continue;
            }

            if ($type === 'message') {
                $raw = (string) ($st['content'] ?? '');
                $forTranscript = preg_replace('/(?:\r\n|\n|\r)+\s*---\s*(?:\r\n|\n|\r)+/', "\n\n", $raw);
                $transcript[] = [
                    'role' => 'bot',
                    'step' => $id,
                    'content' => $forTranscript,
                ];

                continue;
            }

            if ($type === 'location') {
                $branches = $st['branches'] ?? [];
                $transcript[] = [
                    'role' => 'bot',
                    'step' => $id,
                    'type' => 'location',
                    'title' => (string) ($st['title'] ?? ''),
                    'branch_count' => is_array($branches) ? count($branches) : 0,
                ];
                $ack = isset($answers[$id]) && is_string($answers[$id]) ? trim((string) $answers[$id]) : '';
                $transcript[] = [
                    'role' => 'user',
                    'step' => $id,
                    'type' => 'location',
                    'value' => $ack,
                ];

                continue;
            }

            if ($type === 'branches') {
                $branches = $st['branches'] ?? [];
                $transcript[] = [
                    'role' => 'bot',
                    'step' => $id,
                    'type' => 'branches',
                    'title' => (string) ($st['title'] ?? ''),
                    'branch_count' => is_array($branches) ? count($branches) : 0,
                ];
                $ack = isset($answers[$id]) && is_string($answers[$id]) ? trim((string) $answers[$id]) : '';
                $transcript[] = [
                    'role' => 'user',
                    'step' => $id,
                    'type' => 'branches',
                    'value' => $ack,
                ];

                continue;
            }

            if ($type === 'site_near_me') {
                $branches = $st['branches'] ?? [];
                $transcript[] = [
                    'role' => 'bot',
                    'step' => $id,
                    'type' => 'site_near_me',
                    'title' => (string) ($st['title'] ?? ''),
                    'branch_count' => is_array($branches) ? count($branches) : 0,
                ];
                $ack = isset($answers[$id]) && is_string($answers[$id]) ? trim((string) $answers[$id]) : '';
                $req = (bool) ($st['required'] ?? true);
                $stepLabel = trim((string) ($st['title'] ?? ''));
                if ($stepLabel === '') {
                    $stepLabel = trim((string) ($st['label'] ?? ''));
                }
                if ($stepLabel === '') {
                    $stepLabel = $id;
                }
                if ($req && $ack === '') {
                    throw new \InvalidArgumentException('Please complete: ' . $stepLabel);
                }
                if ($ack !== '') {
                    if (strlen($ack) > 8192) {
                        throw new \InvalidArgumentException('Invalid near-me selection');
                    }
                    self::assertValidSiteNearMeAnswer($ack, $st);
                }
                $transcript[] = [
                    'role' => 'user',
                    'step' => $id,
                    'type' => 'site_near_me',
                    'value' => $ack,
                ];

                continue;
            }

            if ($type === 'call_specialist') {
                $transcript[] = [
                    'role' => 'bot',
                    'step' => $id,
                    'type' => 'call_specialist',
                    'content' => (string) ($st['message'] ?? ''),
                ];
                $ack = isset($answers[$id]) && is_string($answers[$id]) ? trim((string) $answers[$id]) : '';
                $transcript[] = [
                    'role' => 'user',
                    'step' => $id,
                    'type' => 'call_specialist',
                    'value' => $ack,
                ];

                continue;
            }

            if ($type === 'loop') {
                $ack = isset($answers[$id]) && is_string($answers[$id]) ? trim((string) $answers[$id]) : '';
                $transcript[] = [
                    'role' => 'user',
                    'step' => $id,
                    'type' => 'loop',
                    'value' => $ack,
                ];

                continue;
            }

            $raw = $answers[$id] ?? null;
            $val = is_string($raw) ? trim($raw) : '';

            if ($type === 'services') {
                $req = (bool) ($st['required'] ?? true);
                if ($req && $val === '') {
                    throw new \InvalidArgumentException('Please choose a service: ' . ($st['label'] ?? $id));
                }
                if ($val !== '') {
                    $catalog = trim((string) ($st['services_catalog'] ?? ''));
                    if ($catalog === 'default') {
                        $catalog = 'treatments';
                    }
                    if ($catalog === 'treatments') {
                        $allowed = self::defaultServiceCatalogLabels();
                        if (!in_array($val, $allowed, true)) {
                            throw new \InvalidArgumentException('Invalid service option for: ' . ($st['label'] ?? $id));
                        }
                    } elseif ($catalog === 'segments') {
                        $allowed = self::defaultServiceCatalogCategoryLabels();
                        $customSegs = $st['service_segments'] ?? null;
                        if (is_array($customSegs) && count($customSegs) > 0) {
                            $allowed = [];
                            foreach ($customSegs as $seg) {
                                if (is_string($seg) && trim($seg) !== '') {
                                    $allowed[] = trim($seg);
                                }
                            }
                        }
                        if (!in_array($val, $allowed, true)) {
                            throw new \InvalidArgumentException('Invalid service segment for: ' . ($st['label'] ?? $id));
                        }
                    } else {
                        $opts = $st['options'] ?? [];
                        if (!is_array($opts) || !in_array($val, $opts, true)) {
                            throw new \InvalidArgumentException('Invalid service option for: ' . ($st['label'] ?? $id));
                        }
                    }
                    $mapped['service'] = $val;
                }
                $transcript[] = [
                    'role' => 'user',
                    'step' => $id,
                    'type' => 'services',
                    'label' => (string) ($st['label'] ?? ''),
                    'mapTo' => 'service',
                    'value' => $val,
                ];
            } elseif ($type === 'nav_service_select') {
                $req = (bool) ($st['required'] ?? true);
                if ($req && $val === '') {
                    throw new \InvalidArgumentException('Please select a service: ' . ($st['label'] ?? $id));
                }
                if ($val !== '') {
                    if (strlen($val) > 512) {
                        throw new \InvalidArgumentException('Invalid service selection for: ' . ($st['label'] ?? $id));
                    }
                    $decoded = json_decode($val, true);
                    if (!is_array($decoded) || !isset($decoded['label']) || trim((string) $decoded['label']) === '') {
                        throw new \InvalidArgumentException('Invalid service selection for: ' . ($st['label'] ?? $id));
                    }
                }
                $transcript[] = [
                    'role' => 'user',
                    'step' => $id,
                    'type' => 'nav_service_select',
                    'label' => (string) ($st['label'] ?? ''),
                    'value' => $val,
                ];
            } elseif ($type === 'main_service_carousel') {
                $req = (bool) ($st['required'] ?? true);
                if ($req && $val === '') {
                    throw new \InvalidArgumentException('Please complete: ' . ($st['label'] ?? $id));
                }
                if ($val !== '') {
                    if (strlen($val) > 768) {
                        throw new \InvalidArgumentException('Invalid selection for: ' . ($st['label'] ?? $id));
                    }
                    $decoded = json_decode($val, true);
                    if (!is_array($decoded)) {
                        throw new \InvalidArgumentException('Invalid selection for: ' . ($st['label'] ?? $id));
                    }
                    $pillar = trim((string) ($decoded['pillar'] ?? ''));
                    if ($pillar === '') {
                        throw new \InvalidArgumentException('Invalid selection for: ' . ($st['label'] ?? $id));
                    }
                    $svc = $decoded['service'] ?? null;
                    if (!is_array($svc) || !isset($svc['label']) || trim((string) $svc['label']) === '') {
                        throw new \InvalidArgumentException('Invalid selection for: ' . ($st['label'] ?? $id));
                    }
                }
                $transcript[] = [
                    'role' => 'user',
                    'step' => $id,
                    'type' => 'main_service_carousel',
                    'label' => (string) ($st['label'] ?? ''),
                    'value' => $val,
                ];
            } elseif ($type === 'choice') {
                $req = (bool) ($st['required'] ?? true);
                if ($req && $val === '') {
                    throw new \InvalidArgumentException('Please make a selection: ' . ($st['label'] ?? $id));
                }
                if ($val !== '') {
                    $opts = $st['options'] ?? [];
                    if (!is_array($opts) || !in_array($val, $opts, true)) {
                        throw new \InvalidArgumentException('Invalid choice for: ' . ($st['label'] ?? $id));
                    }
                }
                $cMt = $st['mapTo'] ?? null;
                if ($cMt === '') {
                    $cMt = null;
                }
                if ($cMt === 'service' && $val !== '') {
                    $mapped['service'] = $val;
                }
                $transcript[] = [
                    'role' => 'user',
                    'step' => $id,
                    'type' => 'choice',
                    'label' => (string) ($st['label'] ?? ''),
                    'mapTo' => is_string($cMt) ? $cMt : null,
                    'value' => $val,
                ];
            } elseif ($type === 'text' || $type === 'textarea') {
                $req = (bool) ($st['required'] ?? false);
                if ($req && $val === '') {
                    throw new \InvalidArgumentException('Please fill: ' . ($st['label'] ?? $id));
                }
                $mt = $st['mapTo'] ?? null;
                if ($mt === '') {
                    $mt = null;
                }
                if (is_string($mt) && in_array($mt, ['full_name', 'email', 'phone', 'service'], true) && $val !== '') {
                    $mapped[$mt] = $val;
                }
                $transcript[] = [
                    'role' => 'user',
                    'step' => $id,
                    'type' => $type,
                    'label' => (string) ($st['label'] ?? ''),
                    'mapTo' => is_string($mt) ? $mt : null,
                    'value' => $val,
                ];
            }
        }

        foreach (['full_name', 'email', 'phone', 'service'] as $k) {
            $v = $mapped[$k];
            if ($v === null || trim((string) $v) === '') {
                throw new \InvalidArgumentException(
                    'This bot must collect full name, email, phone, and service so leads can be saved.'
                );
            }
        }

        $full = trim((string) $mapped['full_name']);
        $parts = preg_split('/\s+/', $full, 2, PREG_SPLIT_NO_EMPTY);
        $firstName = (string) ($parts[0] ?? '');
        $lastName = isset($parts[1]) ? trim((string) $parts[1]) : '';
        if ($firstName === '') {
            $firstName = 'Site';
            $lastName = 'Chat visitor';
        } elseif ($lastName === '') {
            $lastName = 'Chat visitor';
        }

        $email = trim((string) $mapped['email']);
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new \InvalidArgumentException('Invalid email address');
        }

        $phoneRaw = trim((string) $mapped['phone']);
        $digits = preg_replace('/\D+/', '', $phoneRaw);
        if (str_starts_with($digits, '91') && strlen($digits) >= 12) {
            $digits = substr($digits, -10);
        } elseif (strlen($digits) > 10) {
            $digits = substr($digits, -10);
        }
        if (strlen($digits) < 10) {
            throw new \InvalidArgumentException('Please enter a valid mobile number (at least 10 digits)');
        }

        $service = trim((string) $mapped['service']);
        if (strlen($service) > 255) {
            $service = substr($service, 0, 255);
        }

        return [
            'first_name' => $firstName,
            'last_name' => $lastName,
            'email' => $email,
            'country_code' => '+91',
            'phone' => $digits,
            'service' => $service,
            'submit_method' => 'email',
            'transcript' => $transcript,
        ];
    }

    /**
     * @param array<string, mixed> $st site_near_me step
     */
    private static function assertValidSiteNearMeAnswer(string $val, array $st): void
    {
        $decoded = json_decode($val, true);
        if (!is_array($decoded)) {
            throw new \InvalidArgumentException('Invalid branch visit data');
        }
        $fu = trim((string) ($decoded['follow_up'] ?? ''));
        if (!in_array($fu, ['request_callback', 'slot_booking'], true)) {
            throw new \InvalidArgumentException('Invalid follow-up action');
        }
        $city = $decoded['city'] ?? null;
        if (!is_array($city) || trim((string) ($city['label'] ?? '')) === '') {
            throw new \InvalidArgumentException('Invalid city selection');
        }
        $cityId = trim((string) ($city['id'] ?? ''));
        $brIn = $decoded['branch'] ?? null;
        if (!is_array($brIn)) {
            throw new \InvalidArgumentException('Invalid branch selection');
        }
        $bid = trim((string) ($brIn['id'] ?? ''));
        if ($bid === '') {
            throw new \InvalidArgumentException('Invalid branch selection');
        }
        $branches = $st['branches'] ?? [];
        if (!is_array($branches)) {
            throw new \InvalidArgumentException('Invalid branch selection');
        }
        $found = null;
        foreach ($branches as $bb) {
            if (!is_array($bb)) {
                continue;
            }
            if (trim((string) ($bb['id'] ?? '')) === $bid) {
                $found = $bb;
                break;
            }
        }
        if ($found === null) {
            throw new \InvalidArgumentException('Unknown branch');
        }
        if ($cityId !== '') {
            $reg = trim((string) ($found['region'] ?? ''));
            if ($reg !== $cityId) {
                throw new \InvalidArgumentException('Branch does not match selected city');
            }
        }
    }

    /**
     * @param array<string, mixed> $row
     * @return array<string, mixed>
     */
    private static function decodeRow(array $row): array
    {
        $raw = $row['steps_json'] ?? '[]';
        $steps = is_string($raw) ? json_decode($raw, true) : $raw;
        if (!is_array($steps)) {
            $steps = [];
        }
        unset($row['steps_json']);
        $row['steps'] = $steps;
        $row['published'] = isset($row['published']) ? (int) $row['published'] : 0;

        return $row;
    }
}
