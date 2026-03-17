

## Project setup




```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode / dev local
# App running on port http://localhost:3000
$ npm run start:dev


# production mode
$ npm run start:prod

# Generate migration (Opsional)
# ⚠️ Important Note:
If the migration file is already available in the project, there is no need to generate migration.

npm run migration:generate src/database/migrations/nama_migration

# Run Migration
npm run migration:run
