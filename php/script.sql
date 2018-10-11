DROP DATABASE masavasana;

CREATE DATABASE masavasana CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE masavasana;

CREATE TABLE admin(
	ID INT AUTO_INCREMENT NOT NULL,
	user VARCHAR(255) NOT NULL,
	passwordHash VARCHAR(128) NOT NULL,
  salt VARCHAR(32) NOT NULL,
	PRIMARY KEY(ID)
)Engine=InnoDB;

/**
  SHA512
  Password: masmas94
  salt: b$UOW43VCQ@6!AhtHL@|q2o9zw=rImeB
**/
INSERT INTO admin(user, passwordHash, salt) VALUES("admin", "f1d57ebbe872a9e59de18b9981007c69516c1312f34d7235c293c32aff9a83e38dad7451c2971003040efda5dcca9dc557ff5dc99bbe252017f1e26f54b7d25e", "b$UOW43VCQ@6!AhtHL@|q2o9zw=rImeB");
