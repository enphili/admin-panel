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

// Получение данных из тела запроса
$_POST = json_decode(file_get_contents('php://input'), true);
$path = isset($_POST["path"]) ? trim($_POST["path"]) : null;
$login = isset($_POST["login"]) ? trim($_POST["login"]) : null;
$password = isset($_POST["password"]) ? trim($_POST["password"]) : null;

// Читаем настройки из файла
$settingsFile = './setting.json';
if (!file_exists($settingsFile)) {
    echo json_encode([
        'success' => false,
        'message' => 'Файл настроек не найден.',
        'isLogin' => false
    ]);
    exit;
}

// Валидация данных
$errors = [];
if ($path && !preg_match('/^[a-zA-Z0-9_\/-]+$/', $path)) {
    $errors['path'] = 'Недопустимый формат пути';
}
if ($login && !preg_match('/^[a-zA-Z0-9_-]{3,}$/', $login)) {
    $errors['login'] = 'минимум 3 символа (латиница, цифры, `_`, `-`)';
}
if ($password && (!preg_match('/^(?=.*[a-zA-Z0-9!@#$%^&*-])[a-zA-Z0-9!@#$%^&*-]{5,}$/', $password))) {
    $errors['password'] = 'Пароль не меньше 5 символов, разрешены латиница, цифры, символы !@#$%^&*';
}
if (!empty($errors)) {
    echo json_encode([
        'success' => false,
        'message' => 'Ошибка валидации.',
        'errors' => $errors,
        'isLogin' => true
    ]);
    exit;
}

try {
    if ($path) { // Обработка пути (переименование папки)
        // Определение пути к папке админки
        $adminFolderPath = __DIR__ . '/../'; // Путь к папке admin относительно api
        $adminFolderName = basename(realpath($adminFolderPath)); // Имя папки админки (например, "admin")
        $rootPath = realpath(dirname(realpath($adminFolderPath))); // Корневой путь к сайту

        // Полный путь к текущей папке админки
        $currentPath = $rootPath . DIRECTORY_SEPARATOR . $adminFolderName;

        // Формируем новый путь
        $newPath = $rootPath . DIRECTORY_SEPARATOR . trim($_POST['path'], '/');

        // Проверка существования текущей папки
        if (!is_dir($currentPath)) {
            throw new Exception('Текущая папка админки не найдена.');
        }

        // Проверяем, что новая папка не существует
        if (file_exists($newPath)) {
            throw new Exception('Папка с таким именем уже существует.');
        }

        // Переименовываем папку
        if (!rename($currentPath, $newPath)) {
            $errorMessage = error_get_last()['message'] ?? 'Неизвестная ошибка';
            throw new Exception('Не удалось переименовать папку. Ошибка: ' . $errorMessage);
        }

        // Обновляем путь к файлу настроек
        $settingsFile = $newPath . '/api/setting.json'; // Новый путь к файлу настроек
    }

    // Обновление логина и пароля
    if ($login || $password) {
        // Читаем текущие настройки
        if (!file_exists($settingsFile)) {
            throw new Exception('Файл настроек не найден.');
        }
        $settings = json_decode(file_get_contents($settingsFile), true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception('Ошибка чтения файла настроек.');
        }

        // Обновляем логин и пароль
        if ($login) {
            $settings['login'] = $login;
        }
        if ($password) {
            $settings['password'] = password_hash($password, PASSWORD_DEFAULT);
        }

        // Атомарная запись
        $tempFile = $settingsFile . '.tmp';
        file_put_contents($tempFile, json_encode($settings, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        rename($tempFile, $settingsFile);
    }

    // Успешное завершение
    echo json_encode([
        'success' => true,
        'message' => 'Настройки успешно сохранены.',
        'isLogin' => true
    ]);
} catch (Exception $e) {
    // Возвращаем ошибку в формате JSON
    http_response_code(500); // Устанавливаем код ошибки
    echo json_encode([
        'success' => false,
        'message' => 'Ошибка: ' . $e->getMessage(),
        'isLogin' => true
    ]);

    // Логирование ошибки
    error_log('Ошибка при сохранении настроек: ' . $e->getMessage());
}
