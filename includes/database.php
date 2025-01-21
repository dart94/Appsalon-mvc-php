<?php
function connectToDatabase() {
    $maxAttempts = 3;
    $attempt = 1;
    
    while ($attempt <= $maxAttempts) {
        try {
            // Convertir el puerto a entero o usar el valor por defecto 3306
            $port = getenv('DB_PORT') ? intval(getenv('DB_PORT')) : 3306;
            
            // Intentar la conexión
            $conn = mysqli_connect(
                getenv('DB_HOST'),
                getenv('DB_USER'),
                getenv('DB_PASS'),
                getenv('DB_NAME'),
                $port
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
                error_log("Fatal database connection error after {$maxAttempts} attempts");
                return false;
            }
            
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
        echo "Error: No se pudo conectar a MySQL después de varios intentos.\n";
        exit(1);
    } else {
        header('HTTP/1.1 503 Service Temporarily Unavailable');
        header('Content-Type: application/json');
        echo json_encode([
            'error' => 'Database connection failed',
            'message' => 'El servicio no está disponible temporalmente. Por favor, intente más tarde.'
        ]);
        exit;
    }
}