<?php

function validateCsrfToken(): bool {
    // Получение CSRF-токена из заголовка
    $csrf_token = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? null;

    // Проверяем, что CSRF-токен передан и совпадает с токеном в сессии
    if (!$csrf_token || !isset($_SESSION['csrf_token']) || $csrf_token !== $_SESSION['csrf_token']) {
        http_response_code(403); // Forbidden
        header('Content-Type: application/json');
        echo json_encode([
            'success' => false,
            'message' => 'Неверный или отсутствующий CSRF-токен.',
            'isLogin' => false
        ]);
        exit;
    }

    return true; // Токен валиден
}