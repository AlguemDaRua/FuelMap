DROP TABLE IF EXISTS `refueling_records`;
DROP TABLE IF EXISTS `fuels`;
DROP TABLE IF EXISTS `stations`;
DROP TABLE IF EXISTS `users`;

-- =============================================
-- TABELA DE UTILIZADORES
-- Suporta: admin, gestor, usuario
-- =============================================
CREATE TABLE `users` (
  `id`            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`          VARCHAR(150) NOT NULL,
  `email`         VARCHAR(255) NOT NULL UNIQUE,
  `phone`         VARCHAR(20) DEFAULT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role`          ENUM('admin','gestor','usuario') NOT NULL DEFAULT 'usuario',
  `created_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) AUTO_ID_CACHE=1;

-- =============================================
-- TABELA DE POSTOS DE COMBUSTÍVEL
-- =============================================
CREATE TABLE `stations` (
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
) AUTO_ID_CACHE=1;

-- =============================================
-- TABELA DE COMBUSTÍVEIS POR POSTO
-- =============================================
CREATE TABLE `fuels` (
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
) AUTO_ID_CACHE=1;

-- =============================================
-- TABELA DE REGISTOS DE ABASTECIMENTO
-- =============================================
CREATE TABLE `refueling_records` (
  `id`           INT NOT NULL AUTO_INCREMENT,
  `station_id`   INT NOT NULL,
  `fuel_type`    ENUM('Gasolina','Gasóleo','GPL','Jet A1') NOT NULL,
  `quantity`     INT NOT NULL,
  `operator_id`  INT UNSIGNED DEFAULT NULL,
  `refuel_date`  DATE NOT NULL,
  `refuel_time`  TIME NOT NULL,
  `observations` TEXT,
  `created_at`   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_refuel_station` (`station_id`),
  KEY `idx_refuel_operator` (`operator_id`),
  CONSTRAINT `fk_refuel_station` FOREIGN KEY (`station_id`) REFERENCES `stations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_refuel_operator` FOREIGN KEY (`operator_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) AUTO_ID_CACHE=1;

-- =============================================
-- DADOS ESSENCIAIS (Apenas Admin)
-- Nenhuma estação ou combustível é injetado. Tudo será criado via API.
-- =============================================

-- Admin padrão (password: admin123)
INSERT INTO `users` (`name`, `email`, `password_hash`, `role`) VALUES
('Administrador FuelMap', 'admin@fuelmap.co.mz', '$2a$12$tqHV4O3GNKSa8D6pV0rB5.hkQm6xZzUlbXnZ7kzNp1Qa3XeN5GNEG', 'admin');
