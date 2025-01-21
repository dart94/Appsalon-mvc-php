<?php 

require_once __DIR__ . '/../includes/app.php';

use Controllers\AdminController;
use Controllers\APIcontroller;
use Controllers\LoginController;
use Controllers\CitaController;
use Controllers\ServicioController;
use MVC\Router;

$router = new Router();

// Iniciar Sesion
$router->get('/',[LoginController::class,'login']);
$router->post('/',[LoginController::class,'login']);
$router->get('/logout',[LoginController::class,'logout']);

//Recuperar password
$router->get('/olvide',[LoginController::class,'olvide']);
$router->post('/olvide',[LoginController::class,'olvide']);
$router->get('/recuperar',[LoginController::class,'recuperar']);
$router->post('/recuperar',[LoginController::class,'recuperar']);

//Crear cuenta
$router->get('/crear-cuenta',[LoginController::class,'crear']);
$router->post('/crear-cuenta',[LoginController::class,'crear']);

//Confirmar cuenta
$router->get('/confirmar-cuenta',[LoginController::class,'confirmar']);
$router->get('/mensaje',[LoginController::class,'mensaje']);


//AREA PRIVADA
$router->get('/cita',[CitaController::class,'index']);
$router->get('/admin',[AdminController::class,'index']);

//API de citas
$router->get('/api/servicios',[APIcontroller::class,'index']);
$router->post('/api/citas',[APIcontroller::class,'guardar']);
$router->post('/api/eliminar',[APIcontroller::class,'eliminar']);

// CRUD de Servicios
$router->get('/servicios',[ServicioController::class,'index']);
$router->get('/servicios/crear',[ServicioController::class,'crear']);
$router->post('/servicios/crear',[ServicioController::class,'crear']);
$router->get('/servicios/actualizar',[ServicioController::class,'actualizar']);
$router->post('/servicios/actualizar',[ServicioController::class,'actualizar']);
$router->post('/servicios/eliminar',[ServicioController::class,'eliminar']);



// Comprueba y valida las rutas, que existan y les asigna las funciones del Controlador
$router->comprobarRutas();

// Health check endpoint
if ($_SERVER['REQUEST_URI'] === '/health') {
    $health = true;
    $status = ['database' => false];
    
    // Check database connection
    $conn = @mysqli_connect(
        getenv('DB_HOST'),
        getenv('DB_USER'),
        getenv('DB_PASSWORD'),
        getenv('DB_NAME')
    );
    
    if ($conn) {
        $status['database'] = true;
        mysqli_close($conn);
    } else {
        $health = false;
    }
    
    header('Content-Type: application/json');
    http_response_code($health ? 200 : 503);
    echo json_encode([
        'status' => $health ? 'healthy' : 'unhealthy',
        'checks' => $status,
        'timestamp' => date('c')
    ]);
    exit;
}