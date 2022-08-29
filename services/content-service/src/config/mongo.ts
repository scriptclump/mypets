 

import { PROD, STAGING, DEV } from "./environment";
import logger from "../util/logger";
import mongoose from "mongoose";
import bluebird from "bluebird";

let MONGODB_URI: string;

if (PROD) {
    MONGODB_URI = process.env["MONGODB_URI_PROD"];
} else if (STAGING) {
    MONGODB_URI = process.env["MONGODB_URI_STAGING"];
} else {
    MONGODB_URI = process.env["MONGODB_URI_DEV"];
}

if (!MONGODB_URI) {
    if (PROD) {
        logger.error("No mongo connection string. Set MONGODB_URI_PROD environment variable.");
    } else if (STAGING) {
        logger.error("No mongo connection string. Set MONGODB_URI_STAGING environment variable.");
    } else {
        logger.error("No mongo connection string. Set MONGODB_URI_DEV environment variable.");
    }
}

mongoose.Promise = bluebird;
// mongoose.set("debug", true);

let MONGO_CONNECTION_STATUS: boolean = false;

async function mongoBoot() {
    try {
        await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
        MONGO_CONNECTION_STATUS = true;
        logger.info("MongoDB is connected");
    } catch (e) {
        logger.error(`MongoDB connection error : ${e}`);
        MONGO_CONNECTION_STATUS = false;
        setTimeout(await mongoBoot, 3000);
    }
}

export { mongoBoot, MONGO_CONNECTION_STATUS };





