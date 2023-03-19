# Many To Many

Samples on how to use many-to-many relationships with Data API builder.

## Sample 1

Many-to-many relationship between `Book` and `Author` entities, using an intermediate linking table (`books_authors`) that is not exposed via Data API Builder

## Samples 2

Many-to-many relationship between `Book` and `Author` entities via an intermediate linking entity `BookAuthor`. The many-to-many relatioship is therefore created as the combination of two One-To-Many relationships: 

1. `Book` and `BookAuthor`
2. `Author` and `BookAuthor` 

