create database tareashogardb;
use tareashogardb;

CREATE TABLE tarea (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    descripcion varchar(200),
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_vencimiento DATETIME,
    estado ENUM('Pendiente', 'Progreso', 'Completada', 'Cancelada') DEFAULT 'Pendiente',
    prioridad ENUM('Baja', 'Media', 'Alta') DEFAULT 'Media',
    responsable VARCHAR(200),
    notas VARCHAR(200)
);