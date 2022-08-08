/*

Uncomment if running locally and you need to create a new database for this sample

USE master;
GO
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'cms-db')
BEGIN
	PRINT N'cms-db does not exist, attempting to create...'; 
	CREATE DATABASE [cms-db];
END
GO

USE [cms-db];
GO
*/

DROP TABLE IF EXISTS dbo.user_article_link;
DROP TABLE IF EXISTS dbo.articles;
DROP TABLE IF EXISTS dbo.users;
DROP TABLE IF EXISTS dbo.article_statuses;

DROP PROCEDURE IF EXISTS dbo.GetUser;
DROP VIEW IF EXISTS dbo.articles_detailed;
DROP TRIGGER IF EXISTS dbo.article_date_update;
GO

/* Changes from V1
- Current state of hawaii AuthZ does not support the joins or nested policies needed for v1 schema design (or any many-to-many relation with authz enforcement)
- Simplifying the design, making articles to users/authors a many to one relation (an article can only have one author)
*/

-- DDL
CREATE TABLE dbo.article_statuses 
(
	[id] int IDENTITY(1, 1) PRIMARY KEY,
	[name] varchar(100) NOT NULL
);

CREATE TABLE dbo.users
(
	[guid] varchar(50) PRIMARY KEY,
	[fname] varchar(100) NOT NULL,
	[lname] varchar(100) NOT NULL,
	[email] varchar(100) NOT NULL CHECK([email] like '_%@_%._%')
);

CREATE TABLE dbo.articles
(
    [id] int IDENTITY(1, 1) PRIMARY KEY,
    [title] varchar(100) NOT NULL,
	[body] varchar(max) NOT NULL,
	[published] datetime2 DEFAULT GETUTCDATE(), 
	[status] int NOT NULL FOREIGN KEY REFERENCES article_statuses(id)
		ON UPDATE CASCADE, -- ON DELETE will reject/cannot delete a status from the database if an article is assigned to it
	[author_id] varchar(50) NOT NULL FOREIGN KEY REFERENCES users(guid)
		ON UPDATE CASCADE
		ON DELETE CASCADE -- ON DELETE of author from user table, all associated articles are trashed
);
GO

-- Stored procedure for testing
CREATE PROCEDURE dbo.GetUser @user_ids varchar(50) = '1'
AS
SELECT * FROM users WHERE users.guid = @user_ids;
GO

-- Ease-of-use view for article/author/status join
CREATE VIEW dbo.articles_detailed AS 
SELECT 
	a.id, a.title, a.body, a.published,
	u.fname + ' ' + u.lname AS author_name, u.email AS author_email, 
	s.name AS status
FROM 
	dbo.articles AS a 
JOIN 
	dbo.users AS u ON a.author_id = u.guid
JOIN 
	dbo.article_statuses AS s ON a.status = s.id;
GO

/*
-- Trigger to auto-update date any time article is changed (i.e. moved to published)
-- Note: Hawaii does not support triggers on update due to OUTPUT without INTO clause (see https://github.com/Azure/hawaii-engine/issues/452)
CREATE TRIGGER article_date_update ON articles
AFTER UPDATE
AS
BEGIN
SET NOCOUNT ON;
UPDATE articles set published = GETDATE()
WHERE id in 
(SELECT id FROM inserted)
END;
*/

-- DML
INSERT INTO article_statuses (name) VALUES ('draft'), ('published');
INSERT INTO users (guid, fname, lname, email) VALUES (1, 'Sean', 'Leonard', 'sean.leonard@microsoft.com');
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

