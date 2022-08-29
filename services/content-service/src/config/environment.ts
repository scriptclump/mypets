import logger from "../util/logger";
import dotenv from "dotenv";
import fs from "fs";

if (fs.existsSync(".env")) {
    logger.debug("Using .env file to supply config environment variables");
    dotenv.config({ path: ".env" });
} else {
    logger.debug("Using .env.example file to supply config environment variables");
    dotenv.config({ path: ".env.example" });
}

export const ENVIRONMENT = process.env.NODE_ENV || "development";
export const PROD = ENVIRONMENT === "production";
export const STAGING = ENVIRONMENT === "staging";
export const DEV = ENVIRONMENT === "development";