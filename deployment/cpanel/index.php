<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

$applicationDirectory = dirname(__DIR__).'/malta-app';

if (file_exists($maintenance = $applicationDirectory.'/storage/framework/maintenance.php')) {
    require $maintenance;
}

require $applicationDirectory.'/vendor/autoload.php';

/** @var Application $app */
$app = require_once $applicationDirectory.'/bootstrap/app.php';

$app->handleRequest(Request::capture());
