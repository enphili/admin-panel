<?php
// Настройка времени жизни сессии
ini_set('session.gc_maxlifetime', 3600); // Время жизни сессии (в секундах, здесь 1 час)
session_set_cookie_params([
    'lifetime' => 3600, // Время жизни куки (в секундах, здесь 1 час)
    'path' => '/',
    'domain' => '', // домен, если нужно
    'secure' => true, // Только для HTTPS
    'httponly' => true, // Защита от доступа к куки через JavaScript
    'samesite' => 'Strict' // Ограничение отправки куки между сайтами
]);
session_start();