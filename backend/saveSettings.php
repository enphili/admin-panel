<?php
require_once __DIR__ . '/security_headers.php';
require_once __DIR__ . '/session_config.php';

header('Content-Type: application/json; charset=utf-8');

// Получение данных из тела запроса
$_POST = json_decode(file_get_contents('php://input'), true);
$csrf_token = isset($_POST["csrf_token"]) ? trim($_POST["csrf_token"]) : null;
$path = isset($_POST["path"]) ? trim($_POST["path"]) : null;
$login = isset($_POST["login"]) ? trim($_POST["login"]) : null;
$password = isset($_POST["password"]) ? trim($_POST["password"]) : null;

// Проверяем, что CSRF-токен передан
if (!$csrf_token || !isset($_SESSION['csrf_token']) || $csrf_token !== $_SESSION['csrf_token']) {
    echo json_encode([
        'success' => false,
        'message' => 'Неверный или отсутствующий CSRF-токен.',
        'isLogin' => false
    ]);
    exit;
}

// Проверяем авторизацию
if (!isset($_SESSION['isLogin']) || !$_SESSION['isLogin']) {
    echo json_encode([
        'success' => false,
        'message' => 'Необходимо авторизоваться.',
        'isLogin' => false
    ]);
    exit;
}

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
    // Обработка пути (переименование папки)
    if ($path) {
        // Путь к текущей папке приложения
        $currentFolder = basename(dirname(__DIR__)); // Получаем имя текущей папки админки

        // Корневая папка сайта
        $rootPath = realpath(__DIR__ . '/../../..');

        // Полный путь к текущей папке админки
        $currentPath = $rootPath . DIRECTORY_SEPARATOR . $currentFolder;

        // Формируем новый путь
        $newPath = realpath($rootPath) . DIRECTORY_SEPARATOR . trim($_POST['path'], '/');

        // Логирование путей
        error_log("currentFolder: " . $currentFolder);
        error_log("rootPath: " . $rootPath);
        error_log("currentPath: " . $currentPath);
        error_log("newPath: " . $newPath);

        // Проверка существования текущей папки
        if (!is_dir($currentPath)) {
            error_log("Current folder does not exist: " . $currentPath);
            echo json_encode([
                'success' => false,
                'message' => 'Текущая папка админки не найдена.',
                'isLogin' => true
            ]);
            exit;
        }

        // Проверяем, что новая папка не существует
        if (file_exists($newPath)) {
            echo json_encode([
                 'success' => false,
                 'message' => 'Папка с таким именем уже существует.',
                 'isLogin' => true
            ]);
            exit;
        }

        // Переименовываем папку
        if (!rename($currentPath, $newPath)) {
        $errorMessage = error_get_last()['message'] ?? 'Неизвестная ошибка';
            echo json_encode([
                'success' => false,
                'message' => 'Не удалось переименовать папку. Ошибка: ' . $errorMessage,
                'isLogin' => true
            ]);
            exit;
        }
    }

    // Обновление логина и пароля
    if ($login || $password) {
        // Читаем текущие настройки
        if (!file_exists($settingsFile)) {
            echo json_encode([
                'success' => false,
                'message' => 'Файл настроек не найден.',
                'isLogin' => true
            ]);
            exit;
        }
        $settings = json_decode(file_get_contents($settingsFile), true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            echo json_encode([
                'success' => false,
                'message' => 'Ошибка чтения файла настроек.',
                'isLogin' => true
            ]);
            exit;
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

        // Логирование изменений
        error_log("Настройки обновлены пользователем: " . json_encode($_POST));
    }

    echo json_encode([
        'success' => true,
        'message' => 'Настройки успешно сохранены.',
        'isLogin' => true
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Ошибка сервера: ' . $e->getMessage(),
        'isLogin' => true
    ]);
}







