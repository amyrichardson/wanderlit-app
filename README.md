# Wanderlit

Wanderlit is a full-stack application that promotes lovers of literature to read more books from continents other than the one which they are from. The app utlizes the Goodreads API to add books and additional information regarding continental origin to a database. Users are then able to search for books by continent, add books to reading lists, and view a report that provides a breakdown of the books they have read by continent.

## Built With
- Node.js
- Express
- AngularJS
- Goodreads API
- PostgreSQL
- Passport.js
- Sass
- Chart.js

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

- npm install (installs app dependencies)
- Spin up database using the name 'wanderlit-app.'
- Set up tables as listed in the 'Installing' section below.
- Start PostgreSQL server.
- npm start (port 5000)


### Prerequisites

Link to software that is required to install the app (e.g. node).

- [Node.js](https://nodejs.org/en/)
- [PostgreSQL] (https://www.postgresql.org/)

### Installing

Steps to get the development environment running.

```sql
CREATE TABLE "users" (
  id serial primary key,
  username varchar(80) not null UNIQUE,
  password varchar(240) not null,
  is_admin boolean default 'false' 
);

CREATE TABLE books (
	id serial primary key,
	title varchar(240) not null,
	author varchar(100) not null,
	continent varchar(50),
	cover_url varchar(240),
	average_rating decimal,
	year_published int,
	description text
);

CREATE TABLE users_books (
	id serial primary key,
	user_id int references users(id),
	book_id int references books(id),
	status varchar(30)
);
```

## Documentation

https://docs.google.com/document/d/1hGKw3sZOcG7JEPhAyQchfPDYMKCIISOFh6eWuDl6d50/edit?usp=sharing

## Authors

* Amy Richardson
