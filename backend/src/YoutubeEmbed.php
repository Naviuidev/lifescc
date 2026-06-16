<?php

declare(strict_types=1);

namespace Lifescc;

/**
 * Parse pasted iframe or URL into a normalized YouTube embed URL.
 */
final class YoutubeEmbed
{
    public static function extractEmbedUrl(string $raw): ?string
    {
        $s = trim($raw);
        if ($s === '') {
            return null;
        }

        if (preg_match('/<iframe[^>]*\ssrc=["\']([^"\']+)["\']/i', $s, $m)) {
            $s = html_entity_decode($m[1], ENT_QUOTES | ENT_HTML5, 'UTF-8');
        }

        $s = trim($s);
        if ($s === '') {
            return null;
        }

        if (preg_match('#^(https?://)(?:www\.)?youtu\.be/([a-zA-Z0-9_-]{11})#', $s, $m)) {
            return 'https://www.youtube.com/embed/' . $m[2];
        }

        if (preg_match('#[?&]v=([a-zA-Z0-9_-]{11})#', $s, $m)) {
            return 'https://www.youtube.com/embed/' . $m[1];
        }

        if (preg_match('#youtube\.com/embed/([a-zA-Z0-9_-]{11})#', $s, $m)) {
            return 'https://www.youtube.com/embed/' . $m[1];
        }

        if (preg_match('#youtube-nocookie\.com/embed/([a-zA-Z0-9_-]{11})#', $s, $m)) {
            return 'https://www.youtube.com/embed/' . $m[1];
        }

        return null;
    }

    public static function isAllowedYoutubeEmbed(string $url): bool
    {
        $p = parse_url($url);
        if (!isset($p['scheme'], $p['host'], $p['path'])) {
            return false;
        }
        if (!in_array(strtolower($p['scheme']), ['http', 'https'], true)) {
            return false;
        }
        $h = strtolower($p['host']);
        if (!in_array($h, ['www.youtube.com', 'youtube.com', 'www.youtube-nocookie.com', 'youtube-nocookie.com'], true)) {
            return false;
        }

        return (bool) preg_match('#^/embed/[a-zA-Z0-9_-]{11}#', $p['path']);
    }
}
