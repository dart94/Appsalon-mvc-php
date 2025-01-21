<?php
function connectToDatabase() {
    $maxAttempts = 3;
    $attempt = 1;
    
    while ($attempt <= $maxAttempts) {
        try {
            // Intentar la conexión
            $conn = mysqli_connect(
                getenv('DB_HOST'),
                getenv('DB_USER'),
                getenv('DB_PASS'),
                getenv('DB_NAME'),
                getenv('DB_PORT') ?: 3306
            );
            
            if ($conn) {
                $conn->set_charset('utf8');
                return $conn;
            }
        } catch (Exception $e) {
            $error = [
                'message' => mysqli_connect_error(),
                'errno' => mysqli_connect_errno(),
                'attempt' => $attempt
            ];
            
            error_log("Database connection attempt {$attempt} failed: " . json_encode($error));
            
            if ($attempt == $maxAttempts) {
                // Si es el último intento, registra el error y retorna false
                error_log("Fatal database connection error after {$maxAttempts} attempts");
                return false;
            }
            
            // Espera 1 segundo antes del siguiente intento
            sleep(1);
            $attempt++;
        }
    }
    
    return false;
}

// Intentar la conexión
$db = connectToDatabase();

// Manejar el error si la conexión falla
if (!$db) {
    if (php_sapi_name() === 'cli') {
        // Si se ejecuta desde CLI
        echo "Error: No se pudo conectar a MySQL después de varios intentos.\n";
        exit(1);
    } else {
        // Si es una petición web
        header('HTTP/1.1 503 Service Temporarily Unavailable');
        header('Content-Type: application/json');
        echo json_encode([
            'error' => 'Database connection failed',
            'message' => 'El servicio no está disponible temporalmente. Por favor, intente más tarde.'
        ]);
        exit;
    }
}