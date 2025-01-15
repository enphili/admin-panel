<?php
session_start();

header('Content-Type: application/json; charset=utf-8');

// Получение данных из тела запроса
$_POST = json_decode(file_get_contents('php://input'), true);

$login = isset($_POST["login"]) ? trim($_POST["login"]) : null;
$password = isset($_POST["password"]) ? trim($_POST["password"]) : null;


// Проверяем, что логин переданы
if (!$login) {
    echo json_encode([
        'success' => false,
        'message' => 'Логин обязателен.',
        'isLogin' => false
    ]);
    exit;
}

// Проверяем, что пароль переданы
if (!$password) {
    echo json_encode([
        'success' => false,
        'message' => 'Пароль обязателен.',
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

$settings = json_decode(file_get_contents($settingsFile), true);
if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode([
        'success' => false,
        'message' => 'Ошибка чтения файла настроек.',
        'isLogin' => false
    ]);
    exit;
}

// Проверяем на существование ключей login или password в setting.json
if (!isset($settings["login"]) || !isset($settings["password"])) {
    echo json_encode([
        'success' => false,
        'message' => 'Некорректный формат файла настроек.',
        'isLogin' => false
    ]);
    exit;
}

// Проверяем логин и пароль
if (password_verify($password, $settings["password"]) && $login === $settings["login"]) {
    $_SESSION['isLogin'] = true;
    echo json_encode([
        'success' => true,
        'message' => 'Авторизация успешна.',
        'isLogin' => true
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Неверный логин или пароль.',
        'isLogin' => false
    ]);
}