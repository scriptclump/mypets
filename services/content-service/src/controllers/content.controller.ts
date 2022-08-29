"use strict";

import logger from "../util/logger";
import { Response, Request, NextFunction } from "express";
import { BadRequest } from "../util/GeneralError";
import { Content, IContent } from "../models/content.model";
import {ObjectId} from "mongodb";
import * as ContentService from "../services/content.service";
import * as Constants from "../config/constants";

/**
 * Create Content
 * @route POST /content
 */
export const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const ContentRecord: IContent = new Content(req.body);
        const result: IContent = await ContentRecord.save();
        res.json(success("Content created", result));
    } catch(error) {
        logger.error(error);
        next(error);
    }
};

/**
 * Update Content
 * @route PUT /content/:id
 */
export const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const contentRecord: IContent = req.body;
        await Content.updateOne({_id : new ObjectId(id)}, {$set : contentRecord});
        const record = Object.assign({}, {...contentRecord, _id: id});
        res.json(success("Content updated", record));
    } catch(error) {
        logger.error(error);
        next(error);
    }
};



/**
 * FindOne Content
 * @route GET /content/:id
 */
export const findOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const content: IContent =  await ContentService.getContent(id);
        res.json(success("Content found", content));
    } catch (error) {
        logger.error(error);
        next(error);
    }
};

/**
 * Find Content By Proxy and VmId
 * @route POST /content/proxy
 */
export const findByProxyIdAndVmId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { proxyVMData } = req.body;
        const content: Array<IContent> =  await ContentService.getContentByProxyIdAndVmId(proxyVMData);
        res.json(success("Content found", content));
    } catch (error) {
        logger.error(error);
        next(error);
    }
};

/**
 * Find Content
 * @route GET /content/
 */
 export const findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, type } = req.query;

        let data: Array<IContent> = [];
        if (page === undefined) {
            if (type && type === Constants.FLAGS.HARD_DELETE) {
                data = await (Content as any).find({}).sort({_id : -1});
            } else {
                data = await Content.find({deleted: false}).sort({_id : -1});
            }
        } else {
            if (type && type === Constants.FLAGS.HARD_DELETE) {
                data = await (Content as any).paginate({}, {sort: { _id: -1 }, page: page, limit: Constants.PAGINATION.LIMIT, useCustomCountFn: "countWithDeleted"});
            } else {
                data = await (Content as any).paginate({deleted: false}, {sort: { _id: -1 }, page: page, limit: Constants.PAGINATION.LIMIT});
            }
        }
        res.json(success("Content found", data));
    } catch (error) {
        logger.error(error);
        next(error);
    }
};


/**
 * hard delete one Content
 * @route DELETE /content/:id
 */
export const deleteOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { type } = req.body;
        const content: IContent =  await ContentService.getContent(id);
        
        let status: any;
        if (type && type === Constants.FLAGS.HARD_DELETE) {
            status = await Content.deleteOne({ _id: new ObjectId(id) });
        } else {
            status = await content.delete();
        }
        if (status) {
            if(status["deletedCount"] || status["deleted"]) {
                res.json(success("Content deleted"));
            } else {
                throw new BadRequest("Unable to delete the content");
            }
        }

    } catch (error) {
        logger.error(error);
        next(error);
    }
};

/**
 * hard delete all Content
 * @route DELETE /content
 */
export const deleteAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { type } = req.body;
        
        let status: any;
        if (type && type === Constants.FLAGS.HARD_DELETE) {
            status = await Content.deleteMany({});
        } else {
            status = await (Content as any).delete();
        }
        console.log(status, "status");
        if (status) {
            if(status["deletedCount"] || status["nModified"]) {
                res.json(success("Content deleted"));
            } else {
                throw new BadRequest("Unable to delete the content");
            }
        }
    } catch (error) {
        logger.error(error);
        next(error);
    }
};