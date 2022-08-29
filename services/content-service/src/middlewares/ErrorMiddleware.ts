import { NextFunction,Request, Response, ErrorRequestHandler } from "express";
import { validationResult } from "express-validator";
import {GeneralError} from "../util/GeneralError";

const ErrorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof GeneralError) {
    return res.status(err.getCode()).json({
      status: "error",
      message: err.message
    });
  }

  return res.status(500).json({
    status: "error",
    message: err.message
  });
};

const throwValidationError = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(422).json({
          status: "error",
          errors: errors.array()
      });
  }
  next();
};

export {ErrorMiddleware, throwValidationError};

