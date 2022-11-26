# Popallaw - Doker
Hecho por [`Salva Roig Bataller`](https://github.com/SalRB)

## Prerequisitos

* [docker](https://www.docker.com/)
* [docker-compose](https://docs.docker.com/compose/)

## Iniciando la aplicación

1. Clonar esta rama del repositorio

2. Crear el archivo .env en la carpeta general del proyecto:

    * MONGODB_USER
    * MONGODB_PASSWORD
    * MONGODB_DATABASE

    * BACKEND_LOCAL_PORT=3000
    * BACKEND_DOCKER_PORT=3000

    * FRONTEND_LOCAL_PORT=4200
    * FRONTEND_DOCKER_PORT=4200

3. Crear el archivo variables.env en la carpeta del backend, el usuario y la contraseña no deben ponerse a menos que se hagan cambios al docker-compose.yml:

    * DB_MONGO='mongodb://(mongodb_user):(mongodb_password)@popallawMongodb:27017/(mongodb_database)?authSource=admin'
    * PORT=3000
    * SECRET
  
4. Ir a la carpeta general y ejecutar 'docker-compose up --build'

De esta forma la app debería funcionar perfectamente en el puerto 4200 [localhost:4200](http://localhost:4200).
El servidor mongo-express estará en el 8081 [localhost:8081](http://localhost:8081).

# Proceso de dockerizado


## docker-compose.yml:

Es el archivo principal y que orquestrará el desplegado de la app, se divide en los servicios que harán falta para que todo funcione.
Los servicios utilizados son los siguientes:

- backend_container
- frontend_container
- mongo_container
- adminMongo_container

## Servicio de mongo

Es el que se encargará de la base de datos, por ello, deberá ser el primero en estar disponible y el servicio de backend y el de mongo-espress deberán depender de él para poder arrancar. A este le pasaremos una carpeta donde se encuentran los archivos para importar la base de datos y un script que ejecutará el comando para que la base de datos se importe correctamente. Al igual que todos los demás servicios, deberá estar en la red que hemos creado para que se puedan comunicar entre ellos.

```
  mongo_container:
    container_name: mongo_container
    image: mongo:6.0.1
    environment:
      - MONGO_INITDB_DATABASE=popallaw
    volumes:
      - ./backend/data:/data/db
      - ./mongo/import.sh:/docker-entrypoint-initdb.d/import.sh
      - ./mongo/dump/popallaw:/dump
    networks:
      - popallawNetwork
```

## Servicio de mongo-express

Será utilizado como una herramienta de administradores para gestionar la base de datos, debe estar en la misma red que los demás y le pasamos como variable de entorno el nombre del servicio de la base de datos para que se conecte a esta.

```
  adminMongo_container:
    image: mongo-express
    container_name: adminMongo_container
    ports:
      - 8081:8081
    environment:
      - ME_CONFIG_MONGODB_SERVER=mongo_container
    restart: always
    networks:
      - popallawNetwork
    depends_on:
      - mongo_container
```

## Servicio de express

Será el backend de la aplicación, aquel que se encargue de hacer las peticiones a base de datos, al igual que el de angular, utiliza un dockerfile con multi-stage build para generar su imagen, este archivo se encuentra en la carpeta de backend y no hace mucho mas que obtener la imagen de node e iniciar el proyecto, tras ello toma los archivos necesarios de la máquina local y levanta el servidor.

Compose:
```
  backend_container:
    container_name: backend_container
    build: ./backend
    tty: true
    working_dir: /home/node/app
    ports:
      - $BACKEND_LOCAL_PORT:$BACKEND_DOCKER_PORT
    volumes:
      - ./backend:/home/node/app
    networks:
      - popallawNetwork
    depends_on: 
      - mongo_container
    command: /bin/bash -c "usermod -u `stat -c '%u' .` node && groupmod -g `stat -c '%g' .` node && su node -c 'npm install && npm run dev'"
```
Dockerfile:
```
# STAGE 1 
FROM node:16.17.0 AS install
WORKDIR /home/node/app
COPY package.json .
RUN npm install

# STAGE 2
FROM node:16.17.0
WORKDIR /home/node/app
COPY --from=install /home/node/app/node_modules ./node_modules
COPY package.json .
COPY package-lock.json .
COPY config .
COPY controllers .
COPY models .
COPY routes .
COPY utils .
COPY index.js .
COPY ./variables.env ./variables.env
EXPOSE 3000
```


## Servicio de angular

Será el frontend de la aplicación, como tal hará las peticiones al servidor y pintará los datos como deba, también construye la imagen con un dockerfile de forma similar.  

Compose:
```
  frontend_container:
    container_name: frontend_container
    build: ./frontend
    tty: true
    working_dir: /home/node/app
    ports:
      - $FRONTEND_LOCAL_PORT:$FRONTEND_DOCKER_PORT
    volumes:
      - ./frontend:/home/node/app
    networks:
      - popallawNetwork
    command: /bin/bash -c "usermod -u `stat -c '%u' .` node && groupmod -g `stat -c '%g' .` node && su node -c 'npm install && npm start'"
```
Dockerfile:
```
# STAGE 1
FROM node:16.17.0 AS install
WORKDIR /home/node/app
COPY package.json .
RUN npm install

# STAGE 2
FROM node:16.17.0
WORKDIR /home/node/app
COPY --from=install /home/node/app/node_modules ./node_modules
COPY . .
EXPOSE 4200

```