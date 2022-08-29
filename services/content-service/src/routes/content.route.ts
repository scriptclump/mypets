
import * as content from "../controllers/content.controller";
import express from "express";
import auth from "../middlewares/Auth";
import { ContentCreateValidator, ContentDeleteAllValidator, ContentFindAllValidator, ContentFindOneValidator, ContentFindProxyVMDataValidator, ContentUpdateValidator } from "../validators/content.validator";
import { throwValidationError } from "../middlewares/ErrorMiddleware";

const router: express.Router = express.Router();

router.post("/content", ContentCreateValidator, throwValidationError, content.create);
router.put("/content/:id", ContentUpdateValidator, throwValidationError, content.update);
router.get("/content/:id", ContentFindOneValidator, throwValidationError, content.findOne);
router.get("/content", ContentFindAllValidator, throwValidationError, content.findAll);
router.delete("/content/:id", ContentFindOneValidator, throwValidationError, content.deleteOne);
router.delete("/content", ContentDeleteAllValidator, throwValidationError, content.deleteAll);

export = router;