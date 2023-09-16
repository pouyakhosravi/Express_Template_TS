import express, { Router } from "express";
import * as swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
const swaggerConfigs = require("./configurations/swaggerConfigs.json");


const modulesRouter: express.Router = Router();
const swaggerDoc = swaggerJsDoc(swaggerConfigs);
modulesRouter.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

export default modulesRouter;
