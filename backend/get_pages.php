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

// Определение пути к папке админки
$adminFolderPath = __DIR__ . '/../'; // Путь к папке admin относительно api
$adminFolderName = basename(realpath($adminFolderPath)); // Имя папки админки (например, "admin")

// Определяем корневую директорию сайта
$directory = realpath($_SERVER['DOCUMENT_ROOT']);

// Проверяем, существует ли директория
if (!$directory || !is_dir($directory)) {
    http_response_code(404);
    echo json_encode(['error' => 'Директория не найдена']);
    exit;
}

/**
 * Рекурсивно получаем список HTML-файлов
 *
 * @param string $dir
 * @param string $rootDirectory
 * @param string $excludedFolder
 * @return string[]
 */
function getHtmlFiles(string $dir, string $rootDirectory, array $excludedFolders): array {
    $htmlFiles = [];
    $items = scandir($dir);

    foreach ($items as $item) {
        if ($item === '.' || $item === '..') {
            continue;
        }

        $path = $dir . DIRECTORY_SEPARATOR . $item;

        // Исключаем файлы и папки, начинающихся с точки (например, .osp, .git)
        if (strpos($item, '.') === 0) {
            continue;
        }

        // Исключаем файлы из указанных папок
        foreach ($excludedFolders as $excludedFolder) {
            if (strpos($path, DIRECTORY_SEPARATOR . $excludedFolder . DIRECTORY_SEPARATOR) !== false) {
                continue 2; // Пропускаем этот файл/папку и переходим к следующему элементу
            }
        }

        if (is_dir($path)) {
            // Рекурсивно обрабатываем поддиректории
            $htmlFiles = array_merge($htmlFiles, getHtmlFiles($path, $rootDirectory, $excludedFolders));
        } elseif (pathinfo($item, PATHINFO_EXTENSION) === 'html') {
            // Добавляем полный путь относительно корневой директории
            $relativePath = str_replace($rootDirectory, '', $path);
            $htmlFiles[] = $relativePath;
        }
    }

    return $htmlFiles;
}

// Определяем папки, которые нужно исключить
$excludedFolders = [$adminFolderName, '!temp-ba9818'];

// Получаем список HTML-файлов
$maxFiles = 100; // Максимальное количество файлов
$htmlFiles = getHtmlFiles($directory, $directory, $excludedFolders);
$htmlFiles = array_slice($htmlFiles, 0, $maxFiles);

// Возвращаем результат в формате JSON
echo json_encode([
    'success' => true,
    'data' => $htmlFiles
]);
