/****** Object:  Table [dbo].[authors]    Script Date: 1/12/2023 6:39:28 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[authors](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [varchar](255) NULL,
	[birthdate] [date] NULL,
	[bio] [text] NULL,
	[imageurl] [varchar](max) NULL,
 CONSTRAINT [PK__authors__3213E83FD792F176] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[books]    Script Date: 1/12/2023 6:39:28 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[books](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[title] [varchar](255) NULL,
	[authorId] [int] NOT NULL,
	[genre] [varchar](255) NULL,
	[publicationdate] [date] NULL,
	[imageurl] [varchar](max) NULL,
 CONSTRAINT [PK__books__3213E83F850352E7] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[authors] ON 

INSERT [dbo].[authors] ([id], [name], [birthdate], [bio], [imageurl]) VALUES (1, N'Lewis Carroll', CAST(N'1832-01-27' AS Date), N'Lewis Carroll was an English author, poet, and mathematician known for his word play, logic, and fantasy, particularly in his works ''Alice''s Adventures in Wonderland'' and ''Through the Looking-Glass'', as well as his poems ''Jabberwocky'' and ''The Hunting of the Snark'', which are classified as literary nonsense.', N'https://upload.wikimedia.org/wikipedia/commons/f/fb/LewisCarrollSelfPhoto.jpg')
INSERT [dbo].[authors] ([id], [name], [birthdate], [bio], [imageurl]) VALUES (2, N'Antoine de Saint-Exupéry', CAST(N'1900-06-29' AS Date), N'Antoine de Saint-Exupéry was a French writer, poet, aristocrat, journalist, and aviator known for his novella "The Little Prince" and his aviation writings "Wind, Sand and Stars" and "Night Flight", who received several French literary awards and the US National Book Award.', N'https://upload.wikimedia.org/wikipedia/commons/7/7f/11exupery-inline1-500.jpg')
SET IDENTITY_INSERT [dbo].[authors] OFF
GO
SET IDENTITY_INSERT [dbo].[books] ON 

INSERT [dbo].[books] ([id], [title], [authorId], [genre], [publicationdate], [imageurl]) VALUES (1, N'Alice''s Adventures in Wonderland', 1, N'Fantasy', NULL, N'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Alice%27s_Adventures_in_Wonderland_cover_%281865%29.jpg/220px-Alice%27s_Adventures_in_Wonderland_cover_%281865%29.jpg')
INSERT [dbo].[books] ([id], [title], [authorId], [genre], [publicationdate], [imageurl]) VALUES (2, N'Le Petit Prince', 2, NULL, NULL, N'https://upload.wikimedia.org/wikipedia/en/thumb/0/05/Littleprince.JPG/220px-Littleprince.JPG')
INSERT [dbo].[books] ([id], [title], [authorId], [genre], [publicationdate], [imageurl]) VALUES (11, N'Through the Looking-Glass', 1, N'Fantasy', NULL, N'https://upload.wikimedia.org/wikipedia/commons/6/6c/Through_the_looking_glass.jpg')
SET IDENTITY_INSERT [dbo].[books] OFF
GO
ALTER TABLE [dbo].[books]  WITH CHECK ADD  CONSTRAINT [FK_dbo.books_authors] FOREIGN KEY([authorId])
REFERENCES [dbo].[authors] ([id])
GO
ALTER TABLE [dbo].[books] CHECK CONSTRAINT [FK_dbo.books_authors]
GO
