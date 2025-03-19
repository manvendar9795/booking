npx sequelize-cli model:generate --name agegroup --attributes age_group:string
npx sequelize-cli migration:generate --name=alter-Users 
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all

npx sequelize-cli seed:generate --name admin-user

npx sequelize-cli db:seed --seed 20230623062205-adminSeeder
npx sequelize-cli migration:generate --name any name of migration





SET FOREIGN_KEY_CHECKS = 0;
SET FOREIGN_KEY_CHECKS = 1;
TRUNCATE TABLE your_table_name;
