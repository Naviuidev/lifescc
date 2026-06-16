<?php

declare(strict_types=1);

namespace Lifescc;

use DateTimeImmutable;
use DateTimeZone;
use PDO;

final class FranchiseRepository
{
    /**
     * @param array{
     *   state: string,
     *   district: string,
     *   planning_option: string,
     *   planning_start: string,
     *   planning_end: string,
     *   full_name: string,
     *   email: string,
     *   mobile: string
     * } $row
     */
    public static function create(array $row): int
    {
        $pdo = Database::connection();
        $sql = 'INSERT INTO franchises (
                    state, district, planning_option, planning_start, planning_end,
                    full_name, email, mobile
                ) VALUES (
                    :state, :district, :planning_option, :planning_start, :planning_end,
                    :full_name, :email, :mobile
                )';
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':state' => $row['state'],
            ':district' => $row['district'],
            ':planning_option' => $row['planning_option'],
            ':planning_start' => $row['planning_start'],
            ':planning_end' => $row['planning_end'],
            ':full_name' => $row['full_name'],
            ':email' => $row['email'],
            ':mobile' => $row['mobile'],
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
            'SELECT id, state, district, planning_option, planning_start, planning_end,
                    full_name, email, mobile, created_at,
                    status, follow_up, contacted, customer_note
             FROM franchises
             ORDER BY created_at DESC, id DESC'
        );

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function find(int $id): ?array
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare(
            'SELECT id, state, district, planning_option, planning_start, planning_end,
                    full_name, email, mobile, created_at,
                    status, follow_up, contacted, customer_note
             FROM franchises WHERE id = :id LIMIT 1'
        );
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return $row === false ? null : $row;
    }

    /**
     * @param array<string, mixed> $fields
     */
    public static function update(int $id, array $fields): bool
    {
        $pdo = Database::connection();
        $parts = [];
        $params = [':id' => $id];

        if (array_key_exists('status', $fields)) {
            $parts[] = 'status = :status';
            $params[':status'] = (string) $fields['status'];
        }
        if (array_key_exists('follow_up', $fields)) {
            $fu = $fields['follow_up'];
            if ($fu === null || $fu === '') {
                $parts[] = 'follow_up = NULL';
            } else {
                $parts[] = 'follow_up = :follow_up';
                $params[':follow_up'] = (string) $fu;
            }
        }
        if (array_key_exists('contacted', $fields)) {
            $parts[] = 'contacted = :contacted';
            $params[':contacted'] = (string) $fields['contacted'];
        }
        if (array_key_exists('customer_note', $fields)) {
            $note = $fields['customer_note'];
            if ($note === null || $note === '') {
                $parts[] = 'customer_note = NULL';
            } else {
                $parts[] = 'customer_note = :customer_note';
                $params[':customer_note'] = (string) $note;
            }
        }

        if ($parts === []) {
            return false;
        }

        $sql = 'UPDATE franchises SET ' . implode(', ', $parts) . ' WHERE id = :id';
        $stmt = $pdo->prepare($sql);

        return $stmt->execute($params);
    }

    /**
     * @return array{0: string, 1: string} [start Y-m-d, end Y-m-d]
     */
    public static function resolvePlanningWindow(
        string $option,
        ?string $customDate,
    ): array {
        $tz = new DateTimeZone('Asia/Kolkata');
        $now = new DateTimeImmutable('now', $tz);

        if ($option === 'this_week') {
            $dow = (int) $now->format('N');
            $monday = $now->modify('-' . ($dow - 1) . ' days')->setTime(0, 0, 0);
            $sunday = $monday->modify('+6 days');

            return [$monday->format('Y-m-d'), $sunday->format('Y-m-d')];
        }

        if ($option === 'next_month') {
            $firstNext = $now->modify('first day of next month')->setTime(0, 0, 0);
            $lastNext = $firstNext->modify('last day of this month');

            return [$firstNext->format('Y-m-d'), $lastNext->format('Y-m-d')];
        }

        if ($option === 'custom') {
            $d = self::parseYmd($customDate);
            if ($d === null) {
                throw new \InvalidArgumentException('Invalid custom date');
            }
            $ymd = $d->format('Y-m-d');

            return [$ymd, $ymd];
        }

        throw new \InvalidArgumentException('Invalid planning option');
    }

    private static function parseYmd(?string $s): ?DateTimeImmutable
    {
        if ($s === null || trim($s) === '') {
            return null;
        }
        $tz = new DateTimeZone('Asia/Kolkata');
        $d = DateTimeImmutable::createFromFormat('Y-m-d', trim($s), $tz);

        return $d === false ? null : $d->setTime(0, 0, 0);
    }
}
