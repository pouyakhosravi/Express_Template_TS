import path from "path";
import dotenv from "dotenv";

// Parsing the env file.
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// Interface to load env variables
// Note these variables can possibly be undefined
// as someone could skip these varibales or not setup a .env file at all
interface ENV {
  APP_PORT: number | undefined;
  APP_MODE: string | undefined;
  DB_NAME: string | undefined;
  DB_PORT: number | undefined;
  DB_HOST: string | undefined;
  DB_USER: string | undefined;
  DB_PASSWORD: string | undefined;
  DEBUG: boolean | undefined;
}

interface EnvironmentsInterface {
  APP_PORT: number;
  APP_MODE: string;
  DB_NAME: string;
  DB_PORT: number;
  DB_HOST: string;
  DB_USER: string | undefined;
  DB_PASSWORD: string | undefined;
  DEBUG: boolean;
}

// Loading process.env as ENV interface
const getEnvValues = (): ENV => {
  return {
    APP_PORT: Number(process.env.APP_PORT),
    APP_MODE: process.env.APP_MODE,
    DB_NAME: process.env.DB_NAME,
    DB_PORT: Number(process.env.DB_PORT),
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER ? process.env.DB_USER : undefined,
    DB_PASSWORD: process.env.DB_PASSWORD ? process.env.DB_USER : undefined,
    DEBUG: Boolean(process.env.DEBUG),
  };
};

// Throwing an Error if any field was undefined we don't
// want our app to run if it can't connect to DB and ensure
// that these fields are accessible. If all is good return
// it as Config which just removes the undefined from our type
// definition.
const getSanitizedEnvironments = (envValues: ENV): EnvironmentsInterface => {
  for (const [key, value] of Object.entries(envValues)) {
    if (value === undefined) {
      throw new Error(`Missing key ${key} in config.env`);
    }
  }
  return envValues as EnvironmentsInterface;
};

const envValues = getSanitizedEnvironments(getEnvValues());

export default envValues;
