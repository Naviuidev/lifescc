<?php

declare(strict_types=1);

namespace Lifescc;

use PHPMailer\PHPMailer\Exception as MailerException;
use PHPMailer\PHPMailer\PHPMailer;

final class BookingMailer
{
    public static function sendAdminNotification(string $slotDatetimeFormatted): void
    {
        $to = getenv('MAIL_TO') ?: 'naveenreddy.webdev@gmail.com';
        $host = getenv('SMTP_HOST') ?: 'smtp.gmail.com';
        $port = (int) (getenv('SMTP_PORT') ?: '587');
        $user = getenv('SMTP_USER') ?: '';
        $pass = getenv('SMTP_PASS') ?: '';
        $fromEmail = getenv('SMTP_FROM_EMAIL') ?: $user;
        $fromName = getenv('SMTP_FROM_NAME') ?: 'Lifescc Bookings';

        $body = sprintf(
            "You have a slot booking on %s.\n",
            $slotDatetimeFormatted
        );

        $mail = new PHPMailer(true);
        $mail->isSMTP();
        $mail->Host = $host;
        $mail->SMTPAuth = true;
        $mail->Username = $user;
        $mail->Password = $pass;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = $port;
        $mail->CharSet = 'UTF-8';

        $mail->setFrom($fromEmail, $fromName);
        $mail->addAddress($to);
        $mail->Subject = 'Slot booking: ' . $slotDatetimeFormatted;
        $mail->Body = $body;

        try {
            $mail->send();
        } catch (MailerException $e) {
            throw new \RuntimeException('Mail send failed: ' . $mail->ErrorInfo, 0, $e);
        }
    }

    /**
     * @param array{
     *   id?: int|string,
     *   first_name: string,
     *   last_name: string,
     *   email: string,
     *   country_code: string,
     *   phone: string,
     *   service: string,
     *   submit_method: string,
     *   message: string
     * } $c
     */
    public static function sendContactAdminNotification(array $c): void
    {
        $to = getenv('CONTACT_MAIL_TO') ?: getenv('MAIL_TO') ?: 'naveenreddyhosur921@gmail.com';
        $host = getenv('SMTP_HOST') ?: 'smtp.gmail.com';
        $port = (int) (getenv('SMTP_PORT') ?: '587');
        $user = getenv('SMTP_USER') ?: '';
        $pass = getenv('SMTP_PASS') ?: '';
        $fromEmail = getenv('SMTP_FROM_EMAIL') ?: $user;
        $fromName = getenv('SMTP_FROM_NAME') ?: 'Lifescc Contact';

        $id = isset($c['id']) ? (string) $c['id'] : '?';
        $body = sprintf(
            "New contact form submission (ID %s)\n\n" .
            "Name: %s %s\n" .
            "Email: %s\n" .
            "Phone: %s %s\n" .
            "Service: %s\n" .
            "Preferred reply: %s\n\n" .
            "Message:\n%s\n",
            $id,
            $c['first_name'],
            $c['last_name'],
            $c['email'],
            $c['country_code'],
            $c['phone'],
            $c['service'],
            $c['submit_method'],
            $c['message']
        );

        $mail = new PHPMailer(true);
        $mail->isSMTP();
        $mail->Host = $host;
        $mail->SMTPAuth = true;
        $mail->Username = $user;
        $mail->Password = $pass;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = $port;
        $mail->CharSet = 'UTF-8';

        $mail->setFrom($fromEmail, $fromName);
        $mail->addAddress($to);
        $mail->Subject = sprintf('Contact: %s %s — %s', $c['first_name'], $c['last_name'], $c['email']);
        $mail->Body = $body;

        try {
            $mail->send();
        } catch (MailerException $e) {
            throw new \RuntimeException('Mail send failed: ' . $mail->ErrorInfo, 0, $e);
        }
    }

    /**
     * Book-appointment / consultation + body checkup (details_slot table).
     *
     * @param array{
     *   id?: int|string,
     *   full_name: string,
     *   phone: string,
     *   location_id: string,
     *   treatment: string,
     *   message: string
     * } $d
     */
    public static function sendDetailsSlotAdminNotification(array $d): void
    {
        $to = getenv('MAIL_TO') ?: 'naveenreddy.webdev@gmail.com';
        $host = getenv('SMTP_HOST') ?: 'smtp.gmail.com';
        $port = (int) (getenv('SMTP_PORT') ?: '587');
        $user = getenv('SMTP_USER') ?: '';
        $pass = getenv('SMTP_PASS') ?: '';
        $fromEmail = getenv('SMTP_FROM_EMAIL') ?: $user;
        $fromName = getenv('SMTP_FROM_NAME') ?: 'Lifescc Bookings';

        $id = isset($d['id']) ? (string) $d['id'] : '?';
        $body = sprintf(
            "New consultation / body checkup request (ID %s)\n\n" .
            "Name: %s\n" .
            "Phone: %s\n" .
            "Location (id): %s\n" .
            "Treatment: %s\n\n" .
            "Message:\n%s\n",
            $id,
            $d['full_name'],
            $d['phone'],
            $d['location_id'],
            $d['treatment'],
            $d['message']
        );

        $mail = new PHPMailer(true);
        $mail->isSMTP();
        $mail->Host = $host;
        $mail->SMTPAuth = true;
        $mail->Username = $user;
        $mail->Password = $pass;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = $port;
        $mail->CharSet = 'UTF-8';

        $mail->setFrom($fromEmail, $fromName);
        $mail->addAddress($to);
        $mail->Subject = sprintf('Consultation request: %s — %s', $d['full_name'], $d['phone']);
        $mail->Body = $body;

        try {
            $mail->send();
        } catch (MailerException $e) {
            throw new \RuntimeException('Mail send failed: ' . $mail->ErrorInfo, 0, $e);
        }
    }

    /**
     * Skin-line consultation requests (skin_data table).
     *
     * @param array{
     *   id?: int|string,
     *   full_name: string,
     *   phone: string,
     *   location_id: string,
     *   message: string,
     *   service_label: string,
     *   source_page?: string
     * } $d
     */
    public static function sendSkinDataAdminNotification(array $d): void
    {
        $to = getenv('MAIL_TO') ?: 'naveenreddy.webdev@gmail.com';
        $host = getenv('SMTP_HOST') ?: 'smtp.gmail.com';
        $port = (int) (getenv('SMTP_PORT') ?: '587');
        $user = getenv('SMTP_USER') ?: '';
        $pass = getenv('SMTP_PASS') ?: '';
        $fromEmail = getenv('SMTP_FROM_EMAIL') ?: $user;
        $fromName = getenv('SMTP_FROM_NAME') ?: 'Lifescc Bookings';

        $id = isset($d['id']) ? (string) $d['id'] : '?';
        $source = isset($d['source_page']) ? (string) $d['source_page'] : '';
        $body = sprintf(
            "New skin consultation request (ID %s)\n\n" .
            "Name: %s\n" .
            "Phone: %s\n" .
            "Location (id): %s\n" .
            "Treatment: %s\n" .
            "Source page: %s\n\n" .
            "Message:\n%s\n",
            $id,
            $d['full_name'],
            $d['phone'],
            $d['location_id'],
            $d['service_label'],
            $source !== '' ? $source : '(default)',
            $d['message']
        );

        $mail = new PHPMailer(true);
        $mail->isSMTP();
        $mail->Host = $host;
        $mail->SMTPAuth = true;
        $mail->Username = $user;
        $mail->Password = $pass;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = $port;
        $mail->CharSet = 'UTF-8';

        $mail->setFrom($fromEmail, $fromName);
        $mail->addAddress($to);
        $mail->Subject = sprintf('Skin consultation: %s — %s', $d['full_name'], $d['phone']);
        $mail->Body = $body;

        try {
            $mail->send();
        } catch (MailerException $e) {
            throw new \RuntimeException('Mail send failed: ' . $mail->ErrorInfo, 0, $e);
        }
    }

    /**
     * Weight-loss consultation requests (weight_loss table).
     *
     * @param array{
     *   id?: int|string,
     *   full_name: string,
     *   phone: string,
     *   location_id: string,
     *   message: string,
     *   source_page?: string
     * } $d
     */
    public static function sendWeightLossAdminNotification(array $d): void
    {
        $to = getenv('MAIL_TO') ?: 'naveenreddy.webdev@gmail.com';
        $host = getenv('SMTP_HOST') ?: 'smtp.gmail.com';
        $port = (int) (getenv('SMTP_PORT') ?: '587');
        $user = getenv('SMTP_USER') ?: '';
        $pass = getenv('SMTP_PASS') ?: '';
        $fromEmail = getenv('SMTP_FROM_EMAIL') ?: $user;
        $fromName = getenv('SMTP_FROM_NAME') ?: 'Lifescc Bookings';

        $id = isset($d['id']) ? (string) $d['id'] : '?';
        $source = isset($d['source_page']) ? (string) $d['source_page'] : '';
        $body = sprintf(
            "New weight-loss consultation request (ID %s)\n\n" .
            "Name: %s\n" .
            "Phone: %s\n" .
            "Location (id): %s\n" .
            "Source page: %s\n\n" .
            "Message:\n%s\n",
            $id,
            $d['full_name'],
            $d['phone'],
            $d['location_id'],
            $source !== '' ? $source : '(default)',
            $d['message']
        );

        $mail = new PHPMailer(true);
        $mail->isSMTP();
        $mail->Host = $host;
        $mail->SMTPAuth = true;
        $mail->Username = $user;
        $mail->Password = $pass;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = $port;
        $mail->CharSet = 'UTF-8';

        $mail->setFrom($fromEmail, $fromName);
        $mail->addAddress($to);
        $mail->Subject = sprintf('Weight-loss consultation: %s — %s', $d['full_name'], $d['phone']);
        $mail->Body = $body;

        try {
            $mail->send();
        } catch (MailerException $e) {
            throw new \RuntimeException('Mail send failed: ' . $mail->ErrorInfo, 0, $e);
        }
    }

    /**
     * Customer support modal submissions — default recipient per product request.
     *
     * @param array{
     *   id?: int|string,
     *   full_name: string,
     *   email: string,
     *   mobile: string,
     *   branch_id: string,
     *   query: string
     * } $s
     */
    public static function sendSupportAdminNotification(array $s): void
    {
        $to = getenv('SUPPORT_MAIL_TO') ?: 'naveenreddy.webdev@gmail.com';
        $host = getenv('SMTP_HOST') ?: 'smtp.gmail.com';
        $port = (int) (getenv('SMTP_PORT') ?: '587');
        $user = getenv('SMTP_USER') ?: '';
        $pass = getenv('SMTP_PASS') ?: '';
        $fromEmail = getenv('SMTP_FROM_EMAIL') ?: $user;
        $fromName = getenv('SMTP_FROM_NAME') ?: 'Lifescc Support';

        $id = isset($s['id']) ? (string) $s['id'] : '?';
        $body = sprintf(
            "New customer support request (ID %s)\n\n" .
            "Name: %s\n" .
            "Email: %s\n" .
            "Mobile: %s\n" .
            "Branch (id): %s\n\n" .
            "Query:\n%s\n",
            $id,
            $s['full_name'],
            $s['email'],
            $s['mobile'],
            $s['branch_id'],
            $s['query']
        );

        $mail = new PHPMailer(true);
        $mail->isSMTP();
        $mail->Host = $host;
        $mail->SMTPAuth = true;
        $mail->Username = $user;
        $mail->Password = $pass;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = $port;
        $mail->CharSet = 'UTF-8';

        $mail->setFrom($fromEmail, $fromName);
        $mail->addAddress($to);
        $mail->Subject = sprintf('Support request: %s — %s', $s['full_name'], $s['email']);
        $mail->Body = $body;

        try {
            $mail->send();
        } catch (MailerException $e) {
            throw new \RuntimeException('Mail send failed: ' . $mail->ErrorInfo, 0, $e);
        }
    }

    /** Site widget: visitor stayed 30s+ on branch finder — snapshot for CRM. */
    public static function sendChatbotEngagementSnapshot(int $id, int $dwellSeconds, string $summaryLine, string $payloadJson): void
    {
        $to = getenv('CONTACT_MAIL_TO') ?: getenv('MAIL_TO') ?: 'naveenreddyhosur921@gmail.com';
        $host = getenv('SMTP_HOST') ?: 'smtp.gmail.com';
        $port = (int) (getenv('SMTP_PORT') ?: '587');
        $user = getenv('SMTP_USER') ?: '';
        $pass = getenv('SMTP_PASS') ?: '';
        $fromEmail = getenv('SMTP_FROM_EMAIL') ?: $user;
        $fromName = getenv('SMTP_FROM_NAME') ?: 'Lifescc Chat';

        $body = sprintf(
            "Chatbot engagement capture (row id %d)\n" .
            "Dwell on branch step: %d seconds\n" .
            "Summary: %s\n\n" .
            "Full payload (JSON):\n%s\n",
            $id,
            $dwellSeconds,
            $summaryLine,
            $payloadJson
        );

        $mail = new PHPMailer(true);
        $mail->isSMTP();
        $mail->Host = $host;
        $mail->SMTPAuth = true;
        $mail->Username = $user;
        $mail->Password = $pass;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = $port;
        $mail->CharSet = 'UTF-8';

        $mail->setFrom($fromEmail, $fromName);
        $mail->addAddress($to);
        $mail->Subject = sprintf('Chatbot visitor (30s+): %s', $summaryLine !== '' ? $summaryLine : 'id ' . $id);
        $mail->Body = $body;

        try {
            $mail->send();
        } catch (MailerException $e) {
            throw new \RuntimeException('Mail send failed: ' . $mail->ErrorInfo, 0, $e);
        }
    }
}
