CREATE DATABASE IF NOT EXISTS `fuelmap_db`;
USE `fuelmap_db`;

CREATE TABLE IF NOT EXISTS `users` (
  `id`            INT NOT NULL AUTO_INCREMENT,
  `name`          VARCHAR(150) NOT NULL,
  `email`         VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role`          ENUM('admin','gestor','viewer') NOT NULL DEFAULT 'gestor',
  `created_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `stations` (
  `id`         INT NOT NULL AUTO_INCREMENT,
  `name`       VARCHAR(200) NOT NULL,
  `address`    VARCHAR(255) NOT NULL,
  `city`       VARCHAR(100) NOT NULL DEFAULT 'Maputo',
  `district`   VARCHAR(100),
  `provider`   VARCHAR(100),
  `latitude`   DECIMAL(10, 8),
  `longitude`  DECIMAL(11, 8),
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `fuels` (
  `id`           INT NOT NULL AUTO_INCREMENT,
  `station_id`   INT NOT NULL,
  `type`         ENUM('Gasolina','Gasóleo','GPL','Jet A1') NOT NULL,
  `price`        DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `stock_liters` INT NOT NULL DEFAULT 0,
  `max_capacity` INT NOT NULL DEFAULT 15000,
  `updated_at`   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_station_fuel` (`station_id`, `type`),
  CONSTRAINT `fk_fuels_station` FOREIGN KEY (`station_id`) REFERENCES `stations` (`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `refueling_records` (
  `id`           INT NOT NULL AUTO_INCREMENT,
  `station_id`   INT NOT NULL,
  `fuel_type`    ENUM('Gasolina','Gasóleo','GPL','Jet A1') NOT NULL,
  `quantity`     INT NOT NULL,
  `operator_id`  INT DEFAULT NULL,
  `refuel_date`  DATE NOT NULL,
  `refuel_time`  TIME NOT NULL,
  `observations` TEXT,
  `created_at`   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_refuel_station` (`station_id`),
  KEY `idx_refuel_operator` (`operator_id`),
  CONSTRAINT `fk_refuel_station` FOREIGN KEY (`station_id`) REFERENCES `stations` (`id`) ON DELETE CASCADE
);

INSERT IGNORE INTO `users` (`id`, `name`, `email`, `password_hash`, `role`) VALUES
(1, 'Administrador FuelMap', 'admin@fuelmap.co.mz', '$2a$12$tqHV4O3GNKSa8D6pV0rB5.hkQm6xZzUlbXnZ7kzNp1Qa3XeN5GNEG', 'admin');

INSERT IGNORE INTO `stations` (`id`, `name`, `address`, `city`, `district`, `provider`, `latitude`, `longitude`) VALUES
(1, 'Petromoc — Av. Julius Nyerere', 'Av. Julius Nyerere, 1234', 'Maputo', 'Sommerschield', 'petromoc', -25.9625, 32.5832),
(2, 'Galp — Av. Eduardo Mondlane',   'Av. Eduardo Mondlane, 567', 'Maputo', 'Alto Maé',      'galp',     -25.9669, 32.5857);

INSERT IGNORE INTO `fuels` (`station_id`, `type`, `price`, `stock_liters`, `max_capacity`) VALUES
(1, 'Gasolina', 89.50,  8400,  15000),
(1, 'Gasóleo',  75.00, 12100,  20000),
(2, 'Gasolina', 89.50,   900,  15000),
(2, 'Gasóleo',  75.00,  5200,  20000),
(2, 'GPL',      45.00,   200,   5000);
