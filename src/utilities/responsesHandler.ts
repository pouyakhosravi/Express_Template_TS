import { NextFunction, Request, Response } from "express";
import getEnvValues from "../utilities/env.config";
import HTTP_STATUS_CODE from "../utilities/constants/httpStatusCodes";
import Joi from "joi";

class ErrorHandler extends Error {
  public readonly statusCode: number;
  public readonly success: boolean;
  public readonly data: any;
  public readonly isOperational: boolean;

  constructor(statusCode: number, message: string) {
    super(message);

    this.statusCode = statusCode;
    this.success = false;
    this.message = message;
    this.data = null;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

const catchAsync = (fn: NextFunction) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(next)
  };
};

const resultHandler = async (
  res: Response,
  statusCode: number,
  message: string,
  data: any
) => {
  res.status(statusCode).json({
    success: true,
    message: message ? message : "",
    data: data ? data : null,
  });
};

const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { statusCode, success, message, data, stack } = error;

  if (!statusCode || !message || !success || !data) {
    data = data ? data : null;
    (success = success ? success : false),
      (statusCode = statusCode
        ? statusCode
        : error instanceof Joi.ValidationError
        ? 400
        : 500),
      (message = message ? message : "Something Went Wrong");
  }

  if (getEnvValues.APP_MODE === "development") {
    res.status(statusCode).json({
      success,
      message,
      data,
      stack,
    });
  } else if (getEnvValues.APP_MODE === "production") {
    if (error.isOperational) {
      return res.status(statusCode).json({
        success,
        message,
        data,
      });
    }
    console.log("Error", error);
    res
      .status(statusCode ? statusCode : HTTP_STATUS_CODE.INTERNAL_SERVER)
      .json({
        success: false,
        message: "Something went wrong",
        data: null,
      });
  }
};

export {
  ErrorHandler,
  resultHandler,
  errorHandler,
  catchAsync,
};
