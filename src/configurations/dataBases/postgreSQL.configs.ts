import { DataSource } from "typeorm";
import envValues from "../../utilities/env.config";

const connectionToPostgreSQL = async () => {
  try {
    new DataSource({
      type: "postgres",
      host: envValues.DB_HOST,
      port: envValues.DB_PORT,
      // username: "test",
      // password: "test",
      database: "test",
      synchronize: true,
      logging: true,
      entities: [],
      subscribers: [],
      migrations: [],
    });
    console.log(`App connected to ${envValues.DB_NAME} db on postgreSQL`);
    
  } catch (error) {
    console.log("When connecting to db: ", error);
  }
};

export default connectionToPostgreSQL;
