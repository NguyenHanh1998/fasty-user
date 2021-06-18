# Fasty
- Website for user

#### Purchase products with ETH of Ethereum 
- **API** built with Nestjs, TypeORM and JWT Auth
- **WebApp** built with React and Redux along with Server Side Rendering (SSR) / SEO friendly

## Setup and Running
- Prerequisites
  - Node
  - MySQL (or Postgres / Sqlite / MSSQL)
- Switch to `code` directory `cd code`
- Configurations
  - Modify `/api-nest/.env` for PORT and Database Information
  - Modify `/web/.env` for PORT / API URL
- Setup
  - API: Install packages and database setup (migrations and seed) `cd api-nest` and `npm install`
  - Webapp: Install packages `cd web` and `npm install`
- Development
  - Run API `cd api-nest` and `npm run start:dev`, browse Swagger UI at http://localhost:8001/
  - Run Web for User `cd web` and `npm run start`, browse web for user at http://localhost:3000/