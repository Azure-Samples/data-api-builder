# Many To Many

Samples on how to use many-to-many relationships with Data API builder.

## Sample 1

Many-to-many relationship between `Book` and `Author` entities, using an intermediate linking table (`books_authors`) that is not exposed via Data API Builder

You can use the provided sample configuration file `./dab-config-m2m-1.jsonc` to run the sample.

## Samples 2

Many-to-many relationship between `Book` and `Author` entities via an intermediate linking entity `BookAuthor`. The many-to-many relatioship is therefore created as the combination of two One-To-Many relationships: 

1. `Book` and `BookAuthor`
2. `Author` and `BookAuthor` 

You can use the provided sample configuration file `./dab-config-m2m-2.jsonc` to run the sample.