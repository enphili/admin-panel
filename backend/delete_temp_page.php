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
$filePath = $data['filePath'] ?? '';

if (empty($filePath)) {
    echo json_encode([
        'success' => false,
        'message' => 'Путь к временному файлу не передан',
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

// Полный путь к временному файлу
$tempFilePath = $rootDirectory . DIRECTORY_SEPARATOR . ltrim($filePath, '/');

// Проверяем, что файл находится внутри временной папки
$tempDirName = '!temp-ba9818';
$tempDir = $rootDirectory . DIRECTORY_SEPARATOR . $tempDirName;

$realTempFilePath = realpath($tempFilePath);
if ($realTempFilePath === false || strpos($realTempFilePath, $tempDir) !== 0) {
    echo json_encode([
        'success' => false,
        'message' => 'Недопустимый путь к файлу',
    ]);
    exit;
}

// Проверяем, существует ли файл
if (!file_exists($tempFilePath)) {
    echo json_encode([
        'success' => false,
        'message' => 'Файл не существует',
    ]);
    exit;
}

// Удаляем файл и папку есл пустая
if (unlink($tempFilePath)) {
    // Проверяем, пуста ли временная папка
    $files = scandir($tempDir);
    if ($files !== false && count($files) <= 2) {
        // Папка пуста, удаляем ее
        if (rmdir($tempDir)) {
            echo json_encode([
                'success' => true,
                'message' => 'Файл и папка успешно удалены',
            ]);
            exit;
        } else {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Не удалось удалить временную папку, папка не пуста',
            ]);
            exit;
        }
    }

    echo json_encode([
            'success' => true,
            'message' => 'Файл успешно удален',
        ]);

} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Не удалось удалить файл',
    ]);
    exit;
}