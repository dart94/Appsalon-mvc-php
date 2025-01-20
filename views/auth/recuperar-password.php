<h1 class="nombre-pagina">Recuperar contraseña</h1>

<p class="descripcion-pagina">Coloca tu nuevo password a continuación</p>

<?php
    include_once __DIR__ . "/../templates/alertas.php";
?>


<?php if($error) return; ?>
<form class="formulario" method="POST">

    <div class="campo">
        <label for="password">Passwod</label>
        <input
         type="password"
         name="password"
         placeholder="Tu nuevo password"
         />
        
    </div>
    <input type="submit" class="boton" value="Guardar Nuevo Password">
</form>

<div class="acciones">
    <a href="/">¿Ya tienes una cuenta? Iniciar sesión</a>
    <a href="/crear-cuenta">¿No tienes una cuenta? Crear una</a>
</div>