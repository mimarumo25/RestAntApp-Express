CREATE TABLE tipo_identificacion (
    id_tipo_identificacion INT PRIMARY KEY AUTO_INCREMENT,
    descripcion VARCHAR(50) NOT NULL
);


-- Tabla para almacenar información de personas
CREATE TABLE personas (
    id_persona INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255) NOT NULL,
    identificacion VARCHAR(20) NOT NULL,
    id_sexo INT NOT NULL,
    id_tipo_identificacion INT NOT NULL,
    telefono VARCHAR(20) NULL,
    direccion VARCHAR(255) NULL,
    correo_electronico VARCHAR(255) NULL,
    FOREIGN KEY (id_sexo) REFERENCES sexo(id_sexo),
    FOREIGN KEY (id_tipo_identificacion) REFERENCES tipo_identificacion(id_tipo_identificacion)
);

  CREATE TABLE usuario (
  id_usuario INT PRIMARY KEY AUTO_INCREMENT,
  id_persona INT NOT NULL,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  rol_id INT NOT NULL,
  FOREIGN KEY (id_persona) REFERENCES persona(id_persona),
  FOREIGN KEY (rol_id) REFERENCES rol(id_rol)
);
CREATE TABLE sexo (
    id_sexo INT PRIMARY KEY AUTO_INCREMENT,
    descripcion VARCHAR(50) NOT NULL
);
-- Tabla para relacionar usuarios con roles
CREATE TABLE usuario_rol (
    id_usuario_rol INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    id_rol INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (id_rol) REFERENCES rol(id_rol)
);
CREATE TABLE role (
  id_rol INT PRIMARY KEY AUTO_INCREMENT,
  descripcion VARCHAR(255) NOT NULL
);
CREATE TABLE empresa (
  id_empresa INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(255) NOT NULL,
  tipo_empresa VARCHAR(2) NOT NULL,
  descripcion VARCHAR(255) NULL,
  telefono VARCHAR(20) NULL,
  direccion VARCHAR(255) NULL,
  correo_electronico VARCHAR(255) NULL
);
CREATE TABLE categoria (
  id_categoria INT PRIMARY KEY AUTO_INCREMENT,
  descripcion VARCHAR(255) NOT NULL
);
CREATE TABLE producto (
  id_producto INT PRIMARY KEY AUTO_INCREMENT,
  id_categoria INT NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  descripcion VARCHAR(255) NULL,
  precio DECIMAL(10,2) NOT NULL,
  imagen VARCHAR(255) NULL,
  stock INT NOT NULL,
  estado VARCHAR(1) NOT NULL,
  FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria)
);
CREATE TABLE mesa (
  id_mesa INT PRIMARY KEY AUTO_INCREMENT,
  numero INT NOT NULL,
  capacidad INT NOT NULL,
  estado VARCHAR(1) NOT NULL
);
CREATE TABLE departamento (
  id_departamento INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(255) NOT NULL
);
CREATE TABLE municipios (
  id_municipio INT PRIMARY KEY AUTO_INCREMENT,
  id_departamento INT NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  FOREIGN KEY (id_departamento) REFERENCES departamento(id_departamento)
);
CREATE TABLE empresa_mesa (
  id_empresa_mesa INT PRIMARY KEY AUTO_INCREMENT,
  id_empresa INT NOT NULL,
  id_mesa INT NOT NULL,
  FOREIGN KEY (id_empresa) REFERENCES empresa(id_empresa),
  FOREIGN KEY (id_mesa) REFERENCES mesa(id_mesa)
);
CREATE TABLE pedido (
  id_pedido INT PRIMARY KEY AUTO_INCREMENT,
  id_mesa INT NOT NULL,
  id_usuario INT NOT NULL,
  fecha_hora DATETIME NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  estado VARCHAR(1) NOT NULL,
  FOREIGN KEY (id_mesa) REFERENCES mesa(id_mesa),
  FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);
CREATE TABLE producto_pedido (
  id_producto_pedido INT PRIMARY KEY AUTO_INCREMENT,
  id_pedido INT NOT NULL,
  id_producto INT NOT NULL,
  cantidad INT NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido),
  FOREIGN KEY (id_producto) REFERENCES producto(id_producto)
);
CREATE TABLE detalle_pago (
  id_detalle_pago INT PRIMARY KEY AUTO_INCREMENT,
  id_pago INT NOT NULL,
  id_forma_pago INT NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (id_pago) REFERENCES pago(id_pago),
  FOREIGN KEY (id_forma_pago) REFERENCES forma_pago(id_forma_pago)
);
CREATE TABLE forma_pago (
  id_forma_pago INT PRIMARY KEY AUTO_INCREMENT,
  descripcion VARCHAR(255) NOT NULL
);
CREATE TABLE pago (
  id_pago INT PRIMARY KEY AUTO_INCREMENT,
  id_pedido INT NOT NULL,
  fecha_hora DATETIME NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  estado VARCHAR(1) NOT NULL,
  FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido)
);
CREATE TABLE factura (
  id_factura INT PRIMARY KEY AUTO_INCREMENT,
  id_pedido INT NOT NULL,
  fecha_hora DATETIME NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  numero_factura VARCHAR(255) NOT NULL,
  FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido)
);
CREATE TABLE detalles_factura (
  id_detalle_factura INT PRIMARY KEY AUTO_INCREMENT,
  id_factura INT NOT NULL,
  id_producto INT NOT NULL,
  cantidad INT NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (id_factura) REFERENCES factura(id_factura),
  FOREIGN KEY (id_producto) REFERENCES producto(id_producto)
);
CREATE TABLE impuesto (
  id_impuesto INT PRIMARY KEY AUTO_INCREMENT,
  descripcion VARCHAR(255) NOT NULL,
  porcentaje DECIMAL(10,2) NOT NULL
);
CREATE TABLE productos_impuesto (
  id_producto_impuesto INT PRIMARY KEY AUTO_INCREMENT,
  id_producto INT NOT NULL,
  id_impuesto INT NOT NULL,
  FOREIGN KEY (id_producto) REFERENCES producto(id_producto),
  FOREIGN KEY (id_impuesto) REFERENCES impuesto(id_impuesto)
);












