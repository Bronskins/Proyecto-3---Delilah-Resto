start transaction; # Si el script falla, sql hace un rollback de todos los cambios antes de ejecutar el script.

# ------- DATABASE -------

create database if not exists proyecto3;

use proyecto3;

# ------- TABLAS -------

create table if not exists usuarios (
	id_usuarios int not null primary key auto_increment,
	usuario varchar(255) not null,
	contraseña varchar(255) not null,
	email varchar(255) not null,
	createdAt datetime not null default CURRENT_TIMESTAMP,
	updatedAt datetime not null default CURRENT_TIMESTAMP,
	nombreCompleto varchar(255) not null,
	direccion varchar(255) not null,
	roles varchar(255) not null
);

create table if not exists productos (
	id_productos int not null primary key auto_increment,
	nombre varchar(255) not null,
	precio int(11) not null,
	createdAt datetime not null default CURRENT_TIMESTAMP,
	updatedAt datetime not null default CURRENT_TIMESTAMP
);

create table if not exists pedidos (
	id_pedidos int not null primary key auto_increment,
	estado varchar(255) not null,
	createdAt datetime not null default CURRENT_TIMESTAMP,
	updatedAt datetime not null default CURRENT_TIMESTAMP,
	tipoDePago varchar(255) not null,
	pago int(11) not null,
	id_usuarios int(11) not null
);


# ------- REGISTROS -------

insert into usuarios (usuario, nombreCompleto, direccion, contraseña, roles, email)
values ('Bronskins', 'Pablo Correa', 'Av. Manuel Belgrano 1187', '$2a$10$AXfhl5THhCXuUbqACnJ1P.CFPCQfNat4L7inYQJ58vYYdIOpSTyR2', 'admin', 'bronskins@hotmail.com');

INSERT INTO productos (nombre, precio) VALUES ('Bagel de salmon', 425);

INSERT INTO productos (nombre, precio) VALUES ('Hamburguesa clasica', 350);

INSERT INTO productos (nombre, precio) VALUES ('Sandwich Veggie', 310);

INSERT INTO productos (nombre, precio) VALUES ('Ensalada Veggie', 310);

INSERT INTO productos (nombre, precio) VALUES ('Focaccia', 300);

INSERT INTO productos (nombre, precio) VALUES ('Sandiwch Focaccia', 440);

# ------- FOREIGN KEYS -------

ALTER TABLE pedidos
ADD FOREIGN KEY (id_usuarios) REFERENCES usuarios(id_usuarios);

# ------- QUERIES -------

commit; # final del script
