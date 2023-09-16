import path from "path";
import dotenv from "dotenv";

// Parsing the env file.
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

interface ENV {
  APP_PORT: number;
  APP_MODE: string;
  DB_NAME: string;
  DB_PORT: number;
  DB_HOST: string;
  DB_USER_NAME: string | undefined;
  DB_PASSWORD: string | undefined;
  DEBUG: boolean;
}

// Loading process.env as ENV interface
const getEnvValues = (): ENV => {
  return {
    APP_PORT: process.env.APP_PORT ? +process.env.APP_PORT : 3200,
    APP_MODE: process.env.APP_MODE ? process.env.APP_MODE : 'development',
    DB_NAME: process.env.DB_NAME ? process.env.DB_NAME : 'test',
    DB_PORT: process.env.DB_PORT ? +process.env.DB_PORT : 27017,
    DB_HOST: process.env.DB_HOST ? process.env.DB_HOST : 'localhost',
    DB_USER_NAME: process.env.DB_USER_NAME ? process.env.DB_USER_NAME : undefined,
    DB_PASSWORD: process.env.DB_PASSWORD ? process.env.DB_PASSWORD : undefined,
    DEBUG: Boolean(process.env.DEBUG),
  };
};

// Throwing an Error if any field was undefined we don't
// want our app to run if it can't connect to DB and ensure
// that these fields are accessible. If all is good return
// it as Config which just removes the undefined from our type
// definition.
const getSanitizedEnvironments = (envValues: ENV): ENV => {
  for (const [key, value] of Object.entries(envValues)) {
    if (value === undefined) {
      throw new Error(`Missing key ${key} in config.env`);
    }
  }
  return envValues;
};

const envValues = getSanitizedEnvironments(getEnvValues());
export default envValues;
