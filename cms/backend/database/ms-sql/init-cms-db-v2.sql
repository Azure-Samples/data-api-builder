USE [cms-db];
--select * from INFORMATION_SCHEMA.PARAMETERS where SPECIFIC_NAME;

DROP TABLE IF EXISTS user_article_link;
DROP TABLE IF EXISTS articles;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS article_statuses;

DROP PROCEDURE IF EXISTS GetUser;
DROP VIEW IF EXISTS articles_detailed;
DROP TRIGGER IF EXISTS article_date_update;

GO

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
	published datetime DEFAULT getdate(), 
	status int NOT NULL FOREIGN KEY REFERENCES article_statuses(id)
	ON UPDATE CASCADE, -- ON DELETE will reject/cannot delete a status from the database if an article is assigned to it
	author_id varchar(50) NOT NULL FOREIGN KEY REFERENCES users(guid)
	ON UPDATE CASCADE
	ON DELETE CASCADE -- ON DELETE of author from user table, all associated articles are trashed
);

-- Stored procedure for testing
EXEC('CREATE PROCEDURE GetUser @user_id varchar(50)
AS
SELECT * FROM users WHERE users.guid = @user_id');

-- Ease-of-use view for article/author/status join
EXEC('CREATE VIEW articles_detailed AS 
SELECT a.id, a.title, a.body, a.published,
u.fname + '' '' + u.lname AS author_name, u.email AS author_email, 
s.name AS status
FROM dbo.articles AS a 
JOIN dbo.users AS u
ON a.author_id = u.guid
JOIN dbo.article_statuses AS s
ON a.status = s.id');

-- Trigger to auto-update date any time article is changed (i.e. moved to published)
EXEC('CREATE TRIGGER article_date_update ON articles
AFTER UPDATE
AS
BEGIN
SET NOCOUNT ON;
UPDATE articles set published = GETDATE()
WHERE id in 
(SELECT id FROM inserted)
END');


-- DML
INSERT INTO article_statuses (name) VALUES ('draft'), ('published');
INSERT INTO users (guid, fname, lname, email) VALUES (1, 'Vinnie', 'Khanna', 't-vikhanna@microsoft.com');
INSERT INTO articles (title, body, status, author_id) 
VALUES ('lorem ipsum', '# Thebis meae grege prima de apertas invitumque

## Precor sibi

Lorem markdownum spemque aetas Olympum saevit, Hippothousque recurvas loquenti
attulit a. Multa ora nam mea albentibus heros *foedantem Memnonis* notas; me
tibi peregit! Increpat deserti; ire tua ars
[cunctisque](http://sensim-pugnae.org/discite.html) locus, pudet caligine, mihi
poplite. Capillos rubore.

- Studiis visumque
- Veteris nostras sit heros est abstinet terris
- Exsiluere infuso scopulos traditque iunctim cura
- Tamen est cessura venisset constiterant cives iratus
- Succedere demens gutture affata
- Nec tamen

## Verti laeta pedes mea nubibus tenet

*Fugat* obortae. Sidera ratibusque precantia viro est Phorcidas; certe in in
cetera, guttis nec. Quam fortunaque antrum carbasa responsa promittet summasque
tympana *carchesia* nubibus? Aliqua accipiunt illo parente tuae eripitur bibulis
abstulit natis iuvenci. Inemptum et nervis postquam at longo tuo idem antiquum
meruisse in.

    publishing_program(5);
    fios = lock_commerce_uml;
    thyristor += 1;
    if (-1 >= artificial) {
        webOpacity = brouter + 95;
    }
    snippet(bug);

## Piget sanguine numen est

Fixus ita munere optantemque parte, velox inproba: Amnis *ibi invidiosa senex*
necis nox! Antemnas maxima uni videor, voce fures cecidit altis navigiis genis,
victorem in *ictus coloni* pendens. Post ira velle tempusque sospes miranti,
homines contermina invita distuleratque Elide corpore! Aliquid nec sanguis
tardior Alcimedon; **debes serta** vipereasque veste celeberrima vultus *Ardea*?

> Inania tuus altos sinat; stringit suamque tempora
> [incessere](http://et-sed.net/duo.html) resilire, unda. Lignoque timeri, vale
> pater dolet nec procerum siquem quibus: militia sanctique, mente. Sua iners
> huic bene. Quod *aede*, Peneia motu [arripit
> fumos](http://corpore-aderant.net/), rabiemque Phryges me quemque metus
> subductaque cervo: quantum plumas, a. Cervi seriemque postquam genetivaque
> umerique: Ilus vir, forma litus celeberrimus feminea at relabi et spirat
> stridores si.

Dicta templa illi auctor mansit tura aether dat umbram temptemus maluit
**Hyleusque**, nox excussit sed patet aequatam perlucidus menso. Fretaque
fibula, maduere dixerat rapienda; illi ipse, ut si vel volucrum fateor
patriumque! Tibi pronaque, heu vincar, conata densior movit, nova ipse, turba
nec inclusa mortale annis caput!

Spectans silva et milia, dare mediam, optari instigant ingenti fortuna
**fugientibus questa lingua** memori sorores *potentia*. Nec inprovisoque sunt
aequoreos mentis tua, magnos medicas, casu, errabant. Sincera hic teneros haec
Emathiis, quamvis et terris terrae non animalia utque; est. Stant novi, Parnasi,
Solem facies. Movere tamen, avitum abstuleris in inde properare refert memorata
poste, Aeas.', 2, 1);

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
