<?php
require_once __DIR__ . '/security_headers.php';
require_once __DIR__ . '/session_config.php';
require_once __DIR__ . '/csrf_validation.php';

header('Content-Type: application/json; charset=utf-8');

// Проверяем CSRF-токен
validateCsrfToken();

// Проверяем авторизацию
if (!isset($_SESSION['isLogin']) || !$_SESSION['isLogin']) {
    http_response_code(403);
    echo json_encode([
        'success' => false,
        'message' => 'Необходимо авторизоваться.',
        'isLogin' => false
    ]);
    exit;
}

// Получаем данные из тела запроса
$data = json_decode(file_get_contents('php://input'), true);
$html = $data['html'] ?? '';

if (empty($html)) {
    echo json_encode([
        'success' => false,
        'message' => 'HTML-контент не передан',
    ]);
    exit;
}

// Определяем корневую директорию сайта
$rootDirectory = realpath($_SERVER['DOCUMENT_ROOT']);
if (!$rootDirectory || !is_dir($rootDirectory)) {
    echo json_encode([
        'success' => false,
        'message' => 'Корневая директория не найдена',
    ]);
    exit;
}

// Создаём временный файл в корне сайта
$tempFile = $rootDirectory . '/temp-page-' . uniqid() . '.html';
if (file_put_contents($tempFile, $html) === false) {
    echo json_encode([
        'success' => false,
        'message' => 'Не удалось создать временный файл',
    ]);
    exit;
}

// Возвращаем путь к временному файлу относительно корня сайта
$tempFilePath = str_replace($rootDirectory, '', $tempFile);

echo json_encode([
    'success' => true,
    'data' => $tempFilePath,
    'message' => 'Временный файл успешно создан'
]);