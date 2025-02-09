<?php
require_once __DIR__ . '/security_headers.php';
require_once __DIR__ . '/session_config.php';

header('Content-Type: application/json; charset=utf-8');

// Получение данных из тела запроса
$_POST = json_decode(file_get_contents('php://input'), true);
$csrf_token = isset($_POST["csrf_token"]) ? trim($_POST["csrf_token"]) : null;

// Проверяем, что CSRF-токен передан
if (!$csrf_token || !isset($_SESSION['csrf_token']) || $csrf_token !== $_SESSION['csrf_token']) {
    echo json_encode([
        'success' => false,
        'message' => 'Неверный или отсутствующий CSRF-токен.',
    ]);
    exit;
}

// Уничтожение сессии
session_destroy();
session_unset();

// Очистка кук сессии
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(
        session_name(),
        '',
        time() - 42000, // Устанавливаем время в прошлое для удаления куки
        $params["path"],
        $params["domain"],
        $params["secure"],
        $params["httponly"]
    );

    // Если PHP версии 7.3 или выше, добавляем параметр SameSite
    if (PHP_VERSION_ID >= 70300) {
        // Получаем значение SameSite из конфигурации сессии
        $samesite = ini_get('session.cookie_samesite');
        if ($samesite) {
            // Добавляем SameSite через атрибуты
            header('Set-Cookie: ' . session_name() . '=; Path=' . $params["path"] . '; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Secure; HttpOnly; SameSite=' . $samesite);
        }
    }
}

// Отправка успешного ответа
echo json_encode([
    'success' => true,
    'message' => 'Вы успешно вышли.'
]);

exit;