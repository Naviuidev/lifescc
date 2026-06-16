<?php

declare(strict_types=1);

namespace Lifescc;

use InvalidArgumentException;

final class BlogBlocks
{
    /**
     * @param mixed $raw Decoded JSON (array of blocks)
     */
    public static function encodeValidated(mixed $raw): string
    {
        if (!is_array($raw)) {
            throw new InvalidArgumentException('Article blocks must be a JSON array');
        }
        $out = [];
        foreach ($raw as $b) {
            if (!is_array($b)) {
                continue;
            }
            $type = (string) ($b['type'] ?? '');
            $cols = (int) ($b['cols'] ?? 12);
            if ($cols < 1 || $cols > 12) {
                $cols = 12;
            }
            switch ($type) {
                case 'heading':
                    $out[] = [
                        'type' => 'heading',
                        'cols' => $cols,
                        'text' => trim((string) ($b['text'] ?? '')),
                    ];
                    break;
                case 'paragraph':
                    $out[] = [
                        'type' => 'paragraph',
                        'cols' => $cols,
                        'text' => trim((string) ($b['text'] ?? '')),
                    ];
                    break;
                case 'heading_paragraph':
                    $out[] = [
                        'type' => 'heading_paragraph',
                        'cols' => $cols,
                        'heading' => trim((string) ($b['heading'] ?? '')),
                        'text' => trim((string) ($b['text'] ?? '')),
                    ];
                    break;
                case 'image':
                    $out[] = [
                        'type' => 'image',
                        'cols' => $cols,
                        'src' => trim((string) ($b['src'] ?? '')),
                        'alt' => trim((string) ($b['alt'] ?? '')),
                    ];
                    break;
                default:
                    throw new InvalidArgumentException('Invalid block type: ' . $type);
            }
        }

        return json_encode($out, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE);
    }
}
