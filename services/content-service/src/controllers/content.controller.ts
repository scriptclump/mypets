"use strict";

import logger from "../util/logger";
import { Response, Request, NextFunction } from "express";
import { BadRequest } from "../util/GeneralError";
import { generatePassword, success } from "../util/Function";
import { Content, IContent } from "../models/content.model";
import {ObjectId} from "mongodb";
import * as ContentService from "../services/content.service";
import * as Constants from "../config/constants";

/**
 * Create Content
 * @route POST /Content
 */
export const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const ContentRecord: IContent = new Content(req.body);
        const result: IContent = await ContentRecord.save();
        res.json(success("Content created successfully", result));
    } catch(error) {
        logger.error(error);
        next(error);
    }
};

/**
 * Update Content
 * @route PUT /Content/:id
 */
export const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const server_connection: IContent =  await ContentService.getContent(id);

        const server_connection_record: IContent = req.body;
        server_connection_record.centrePassword = generatePassword(server_connection.centrePassword);
        server_connection_record.vProxyPassword = generatePassword(server_connection.vProxyPassword);
        server_connection_record.vcPassword = generatePassword(server_connection.vcPassword);
        server_connection_record.vmPassword = generatePassword(server_connection.vmPassword);

        await Content.updateOne({_id : new ObjectId(id)}, {$set : server_connection_record});

        const record = Object.assign({}, {...server_connection_record, _id: id});
        res.json(success("Content updated successfully", record));
    } catch(error) {
        logger.error(error);
        next(error);
    }
};



/**
 * FindOne Content
 * @route GET /Content/:id
 */
export const findOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const server_connection: IContent =  await ContentService.getContent(id);
        res.json(success("Content found", server_connection));
    } catch (error) {
        logger.error(error);
        next(error);
    }
};

/**
 * Find Content By Proxy and VmId
 * @route POST /Content/proxy
 */
export const findByProxyIdAndVmId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { proxyVMData } = req.body;
        const server_connection: Array<IContent> =  await ContentService.getContentByProxyIdAndVmId(proxyVMData);
        res.json(success("Content found", server_connection));
    } catch (error) {
        logger.error(error);
        next(error);
    }
};

/**
 * Find Content
 * @route GET /Content/
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
        console.log(data, "data");
        res.json(success("Content found", data));
    } catch (error) {
        logger.error(error);
        next(error);
    }
};


/**
 * hard delete one Content
 * @route DELETE /Content/:id
 */
export const deleteOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { type } = req.body;
        const server_connection: IContent =  await ContentService.getContent(id);
        
        let status: any;
        if (type && type === Constants.FLAGS.HARD_DELETE) {
            status = await Content.deleteOne({ _id: new ObjectId(id) });
        } else {
            status = await server_connection.delete();
        }
        if (status) {
            if(status["deletedCount"] || status["deleted"]) {
                res.json(success("Content deleted successfully"));
            } else {
                throw new BadRequest("Unable to delete content");
            }
        }
    } catch (error) {
        logger.error(error);
        next(error);
    }
};

/**
 * hard delete all Content
 * @route DELETE /Content
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
                res.json(success("Content deleted successfully"));
            } else {
                throw new BadRequest("Unable to delete content");
            }
        }
    } catch (error) {
        logger.error(error);
        next(error);
    }
};