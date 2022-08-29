import express, { Response } from "express";
import compression from "compression";
import lusca from "lusca";
import path from "path";
import  {ErrorMiddleware} from "./middlewares/ErrorMiddleware";
import { includeFolder } from "./config/initiator";
import cors from "cors";



// Create Express server
const app = express();

// Express configuration
app.set("port", process.env.PORT || 9000);

app.use(compression());
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));

const routes: Array<any> = Object.values(includeFolder(path.join(__dirname, "routes/")));
app.use(routes);

app.use(ErrorMiddleware);

export default app;

