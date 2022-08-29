import errorHandler from "errorhandler";
import app from "./app";
import logger from "./util/logger";

import { mongoBoot } from "./config/mongo";
/**
 * Error Handler. Provides full stack
 */
if (process.env.NODE_ENV === "development") {
    app.use(errorHandler());
}


/**
 * Start Express server.
 */
const server = app.listen(app.get("port"), () => {
    logger.info(`App is running at http://localhost:${app.get("port")} in ${app.get("env")} mode`);
});

(async () => {
    try {
        await mongoBoot();
    } catch(e) {
        logger.error(`Error in booting the startup services ${e}`);
    }
})();

export default server;
