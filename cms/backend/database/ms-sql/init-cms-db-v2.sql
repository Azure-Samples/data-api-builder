DROP TABLE IF EXISTS user_article_link;
DROP TABLE IF EXISTS articles;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS article_statuses;

-- DDL
CREATE TABLE article_statuses(
	id int IDENTITY(1, 1) PRIMARY KEY,
	name varchar(100) NOT NULL
);

CREATE TABLE users(
	guid varchar(50) PRIMARY KEY,
	fname varchar(100) NOT NULL,
	lname varchar(100) NOT NULL,
	email varchar(100) NOT NULL CHECK(email like '_%@_%._%')
);

CREATE TABLE articles(
    id int IDENTITY(1, 1) PRIMARY KEY,
    title varchar(100) NOT NULL,
	body varchar(max) NOT NULL,
	status int NOT NULL FOREIGN KEY REFERENCES article_statuses(id)
	ON UPDATE CASCADE, -- ON DELETE will reject/cannot delete a status from the database if an article is assigned to it
	author_id varchar(50) NOT NULL FOREIGN KEY REFERENCES users(guid)
	ON UPDATE CASCADE
	ON DELETE CASCADE -- ON DELETE of author from user table, all associated articles are trashed
);

-- DML
INSERT INTO article_statuses (name) VALUES ('draft'), ('published');
INSERT INTO users (guid, fname, lname, email) VALUES (1, 'Vinnie', 'Khanna', 't-vikhanna@microsoft.com');
INSERT INTO articles (title, body, status, author_id) 
VALUES ('lorem ipsum', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce tortor neque, elementum in porta et, dapibus ut lacus. 
Praesent nec justo felis. Nunc diam arcu, sagittis id ornare a, iaculis sed lorem. Fusce nisl erat, fringilla pulvinar tellus interdum, dignissim facilisis elit. 
Maecenas vulputate eu ipsum et vestibulum. Mauris vitae massa sed orci scelerisque lobortis. Ut sagittis diam ut arcu bibendum, a blandit quam gravida. Ut ut lacinia mi.

Vestibulum consectetur arcu ac enim aliquam, auctor venenatis felis vulputate. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. 
Ut eu massa vitae sapien dictum dignissim. Suspendisse interdum ullamcorper enim vitae finibus. Curabitur interdum dolor vel felis auctor, sit amet auctor nulla ultricies. 
Suspendisse hendrerit, lacus molestie tristique sagittis, orci sapien eleifend tellus, sed efficitur sem sem et magna. Etiam euismod, tortor id dignissim mattis, nulla libero sollicitudin libero, et posuere nunc ex vel lectus. 
Quisque condimentum fringilla gravida. Phasellus a massa sem. Donec nec congue odio. Aenean euismod vulputate lectus eu hendrerit. Sed non hendrerit ante. 
Phasellus ac vestibulum dolor, at feugiat massa. Nullam quam magna, iaculis a iaculis a, posuere non magna. Pellentesque et efficitur.', 2, 1);

-- Old tables from v1. 
-- Current state of hawaii AuthZ does not support the joins or nested policies needed for this schema design (or any many-to-many relation)
-- Simplifying the design, making articles to users/authors a many to one relation (an article can only have one author)
/*
CREATE TABLE articles(
    id int IDENTITY(1, 1) PRIMARY KEY,
    title varchar(100) NOT NULL,
	body varchar(max) NOT NULL,
	status int NOT NULL,
	CONSTRAINT FK_article_status FOREIGN KEY (status)
	REFERENCES article_statuses(id)
	ON UPDATE CASCADE -- ON DELETE will reject/cannot delete a status from the database if an article is assigned to it
);

CREATE TABLE user_article_link(
	id int IDENTITY(1,1) PRIMARY KEY,
	article_id int NOT NULL FOREIGN KEY REFERENCES articles(id) 
	ON DELETE CASCADE, 
	--ON UPDATE CASCADE,
	user_id int NOT NULL FOREIGN KEY REFERENCES users(guid)
	ON DELETE CASCADE

);


INSERT INTO article_statuses (name) VALUES ('draft'), ('published');
INSERT INTO users (guid, fname, lname, email) VALUES (1, 'Vinnie', 'Khanna', 't-vikhanna@microsoft.com');
INSERT INTO articles (title, body, status) 
VALUES ('lorem ipsum', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce tortor neque, elementum in porta et, dapibus ut lacus. 
Praesent nec justo felis. Nunc diam arcu, sagittis id ornare a, iaculis sed lorem. Fusce nisl erat, fringilla pulvinar tellus interdum, dignissim facilisis elit. 
Maecenas vulputate eu ipsum et vestibulum. Mauris vitae massa sed orci scelerisque lobortis. Ut sagittis diam ut arcu bibendum, a blandit quam gravida. Ut ut lacinia mi.

Vestibulum consectetur arcu ac enim aliquam, auctor venenatis felis vulputate. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. 
Ut eu massa vitae sapien dictum dignissim. Suspendisse interdum ullamcorper enim vitae finibus. Curabitur interdum dolor vel felis auctor, sit amet auctor nulla ultricies. 
Suspendisse hendrerit, lacus molestie tristique sagittis, orci sapien eleifend tellus, sed efficitur sem sem et magna. Etiam euismod, tortor id dignissim mattis, nulla libero sollicitudin libero, et posuere nunc ex vel lectus. 
Quisque condimentum fringilla gravida. Phasellus a massa sem. Donec nec congue odio. Aenean euismod vulputate lectus eu hendrerit. Sed non hendrerit ante. 
Phasellus ac vestibulum dolor, at feugiat massa. Nullam quam magna, iaculis a iaculis a, posuere non magna. Pellentesque et efficitur.', 2);
INSERT INTO user_article_link (article_id, user_id) VALUES (1, 1);
*/
