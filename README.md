<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Run in dev ⚙️
1. Clone repository

2. run
```
yarn install
```

3. Nest CLI must be installed
```
npm i -g @nestjs/cli
```

4. Run mongo DB
```
docker-compose up-d
```

5. Clone file __.env.template__ and rename to __.env__

6. Fill out all env vars defined in your __.env__

7. Run App (DEV)
```
yarn start:dev
```

8. Load data by seed
```
http://localhost:3000/api/v2/seed
```

# Production build
1. Create file ```.env.prod```
2. Fill out env prod vars
3. Create the new image:
```
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build
```

# App developed with 📋 
* Nest
* Mongo DB
* Docker