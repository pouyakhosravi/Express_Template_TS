import envValues from "./utilities/env.config";
import express, { NextFunction } from "express";
import * as http from "http";
import cors from "cors";
import helmet from "helmet";
const rateLimiter = require("express-rate-limit");
import bodyParser from "body-parser";
import modulesRouter from "./modules.routing";
import hpp from "hpp";
import { ErrorHandler, errorHandler } from "./utilities/responsesHandler";
import connectionToPostgreSQL from "./configurations/dataBases/postgreSQL.configs";

const bootStrap = async (appPort: number, appMode: string): Promise<void> => {
  await connectionToPostgreSQL();
  
  const app: express.Application = express();
  const server: http.Server = http.createServer(app);

  app.use(cors({ origin: "*" }));
  app.use(helmet());
  app.use(
    rateLimiter({
      max: 100,
      windowMs: 60 * 1000,
      handler: function () {},
    })
  );

  app.use(
    bodyParser.urlencoded({
      extended: true,
      limit: "50mb",
    }),
    bodyParser.json({
      limit: "50mb",
      type: "application/json",
    })
  );

  app.use(hpp());

  app.use("/api/v1", modulesRouter);

  app.all("*", (req, res, next) => {
    try {
      throw new ErrorHandler(
        429,
        `Cannot find ${req.originalUrl} on this server`
      );
    } catch (error) {
      console.log("Request to wrong URL \n", error);
      next(error);
    }
  });

  app.use(
    async (
      err: Error,
      req: express.Request,
      res: express.Response,
      next: NextFunction
    ) => {
      return errorHandler(err, req, res, next);
    }
  );

  server.listen(appPort, () => {
    console.log(`App is run on port: ${appPort} And ${appMode} mode.`);
  });
};
bootStrap(envValues.APP_PORT, envValues.APP_MODE);
