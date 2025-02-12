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
$originalFileName = $data['fileName'] ?? '';

if (empty($html) || empty($originalFileName)) {
    echo json_encode([
        'success' => false,
        'message' => 'HTML-контент или имя файла не переданы',
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

// Создаём уникальное имя для временной папки
$tempDirName = '!temp-ba9818';

// Полный путь к временной папке
$tempDir = $rootDirectory . DIRECTORY_SEPARATOR . $tempDirName;

// Создаём временную папку, если её ещё нет
if (!is_dir($tempDir)) {
    mkdir($tempDir, 0755, true);
}

// Формируем шаблон имени временного файла
$tempFileName = pathinfo($originalFileName, PATHINFO_FILENAME) . '-temp-' . uniqid() . '.html';
$tempFile = $tempDir . DIRECTORY_SEPARATOR . $tempFileName;

// Проверяем, существует ли уже временный файл для этого оригинального файла
$existingFiles = glob($tempDir . DIRECTORY_SEPARATOR . pathinfo($originalFileName, PATHINFO_FILENAME) . '-temp-*.html');
if (!empty($existingFiles)) {
    // Если найден существующий файл, используем его
    $tempFilePath = str_replace($rootDirectory, '', $existingFiles[0]);
    echo json_encode([
        'success' => true,
        'data' => $tempFilePath,
        'message' => 'Используется существующий временный файл',
    ]);
    exit;
}

// Если временного файла нет, создаем новый
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