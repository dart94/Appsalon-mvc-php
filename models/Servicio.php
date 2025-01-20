<?php

namespace Model;

class Servicio extends ActiveRecord{

    //Base de datos
    protected static $tabla = 'servicios';
    protected static $columnasDB = ['id','nombre','precio'];

    //Atributos de la clase
    public $id;
    public $nombre;
    public $precio;

    //Funciones getter y setter
    public function __construct($args =[])
    {
        $this->id = $args['id'] ?? null;
        $this->nombre = $args['nombre'] ?? null;
        $this->precio = $args['precio'] ?? null;
    }

    public function validar(){
        if(!$this->nombre){
            self::$alertas['error'][] = 'El campo nombre es requerido';
        }
        if(!$this->precio){
            self::$alertas['error'][] = 'El campo precio es requerido';
        }
        if(!is_numeric($this->precio)){
            self::$alertas['error'][] = 'El precio no es valido';
        }
        return self::$alertas;
    }
}