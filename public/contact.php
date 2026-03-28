<?php
/**
 * Kontaktformular-Endpunkt für All-Inkl (oder anderes PHP-Hosting).
 *
 * Einrichtung:
 * 1. MAIL_TO = deine Empfänger-Adresse (wohin die Anfragen gehen).
 * 2. MAIL_FROM = eine bei All-Inkl angelegte E-Mail-Adresse (Absender, oft noreply@deine-domain.de).
 * 3. Datei liegt nach dem Build im Webroot (public/contact.php → mit ins Paket / per FTP hochladen).
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'method_not_allowed']);
    exit;
}

// ——— Konfiguration anpassen ———
const MAIL_TO   = 'aernnest89@gmail.com';
const MAIL_FROM = 'noreply@DEINE-DOMAIN.de';
const SITE_NAME = 'Portfolio Kontakt';

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'invalid_json']);
    exit;
}

$name = isset($data['name']) ? trim((string) $data['name']) : '';
$email = isset($data['email']) ? trim((string) $data['email']) : '';
$message = isset($data['message']) ? trim((string) $data['message']) : '';

if ($name === '' || mb_strlen($name) > 200) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'invalid_name']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'invalid_email']);
    exit;
}

if (mb_strlen($message) < 10 || mb_strlen($message) > 10000) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'invalid_message']);
    exit;
}

// Mail-Header-Injection verhindern
$nameSafe = str_replace(["\r", "\n", '%'], '', $name);
$emailSafe = str_replace(["\r", "\n", ' '], '', $email);

$ownerSubject = '[Kontakt] Neue Nachricht von ' . $nameSafe;
$ownerBody =
    "Neue Kontaktanfrage über " . SITE_NAME . "\r\n\r\n" .
    "Name: " . $name . "\r\n" .
    "E-Mail: " . $email . "\r\n\r\n" .
    "Nachricht:\r\n" . $message . "\r\n";

$confirmSubject = 'Deine Nachricht wurde übermittelt';
$confirmBody =
    "Hallo " . $name . ",\r\n\r\n" .
    "vielen Dank für deine Nachricht. Wir haben sie erhalten und melden uns bei Bedarf unter dieser Adresse: " . $email . "\r\n\r\n" .
    "Dein Text (Kopie):\r\n" . $message . "\r\n\r\n" .
    "Mit freundlichen Grüßen\r\n" .
    SITE_NAME . "\r\n";

$headersCommon =
    'MIME-Version: 1.0' . "\r\n" .
    'Content-Type: text/plain; charset=UTF-8' . "\r\n" .
    'Content-Transfer-Encoding: 8bit' . "\r\n";

$headersOwner =
    $headersCommon .
    'From: ' . MAIL_FROM . "\r\n" .
    'Reply-To: ' . $emailSafe . "\r\n" .
    'X-Mailer: PHP/' . PHP_VERSION;

$headersConfirm =
    $headersCommon .
    'From: ' . MAIL_FROM . "\r\n" .
    'Reply-To: ' . MAIL_FROM . "\r\n" .
    'X-Mailer: PHP/' . PHP_VERSION;

$okOwner = @mail(MAIL_TO, '=?UTF-8?B?' . base64_encode($ownerSubject) . '?=', $ownerBody, $headersOwner);
$okConfirm = @mail($emailSafe, '=?UTF-8?B?' . base64_encode($confirmSubject) . '?=', $confirmBody, $headersConfirm);

if (!$okOwner || !$okConfirm) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'mail_failed']);
    exit;
}

echo json_encode(['ok' => true]);
