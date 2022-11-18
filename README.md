# NodeJS_Angular13_NodeJs_Express

# Popallaw
Made by [`Santiago Soler Llin`](https://github.com/SantiSL5)  and  [`Salva Roig Bataller`](https://github.com/SalRB)

## Prerequisites

* [npm](https://www.npmjs.com/)
* [docker](https://www.docker.com/)
* [docker-compose](https://docs.docker.com/compose/)

## Starting up the app

1. Clone the repo.

2. Create an .env file on the main folder of the repo with this variables:

    * MONGODB_USER
    * MONGODB_PASSWORD
    * MONGODB_DATABASE

    * BACKEND_LOCAL_PORT=3000
    * BACKEND_DOCKER_PORT=3000

    * FRONTEND_LOCAL_PORT=4200
    * FRONTEND_DOCKER_PORT=4200

3. Create an variables.env file on the backend folder with this variables:

    * DB_MONGO='mongodb://(mongodb_user):(mongodb_password)@popallawMongodb:27017/(mongodb_database)?authSource=admin'
    * PORT=3000
    * SECRET
  
4. Go to repo main folder and do 'docker-compose up'

Following this steps, app is running on [localhost:4200](http://localhost:4200).

## Features

This application have the following modules.

Module | Description
:--- | :---
Home | Main page of the application where you can see a carousel and a infinite scroll with categories.
Shop | Show all the products and you can filter them by category and price. You can also like products if you are logged.
Item Details | Here you can see more detailed item information. Where if you are logged, you can like the item or comment.
Search | This module is implemented in all the app where you can search for an item and it automatically redirects you to the shop.
Login | It allows you to register and login in the application.
Profile | It allows you to change your user information if is your profile. You can see the followers, followings, products liked and comments of the ower of the profile.

## Technologies

### Deploy

The technology used for deploy is [docker](https://www.docker.com/)

  * Docker
  * docker-compose
  * Env files configuration

### Frontend

The technology used for the client is [Angular](https://angular.io/) in his 13 version. 

  * Typescrypt
  * Modules, Shared and Core based
  * Routes
  * Models
  * Components
      * Reusable Components
  * Angular Authentication
      * Guards
      * Interceptors
      * Services
      * JWT Token
      * Custom directives
  * Observables and subscriptions
  * Rxjs Subjects
      * BehaviourSubjects
      * ReplySubjects
  * Lazy Load
  * ngx-toastr
  * ngx-infinite-scroll
  * Reactive forms
    * Validation

### Backend

The technology used for the server is [ExpressJS](https://expressjs.com/) in his 4.17.1 version.

  * Nodejs
  * Javascript
  * Routes
  * Models
  * Controllers
  * Mongoose:
      * Relationships
      * Schemas (slug uniqueValidator)
      * Models methods
      * Controller
  * Middleware:
      * JWT Token
  * Env configuration files

### Database

Server uses a [MongoDB](https://www.mongodb.com/) database in his 6.0.1 version.
