"use strict";

import logger from "../util/logger";
import { Response, Request, NextFunction } from "express";
import { BadRequest } from "../util/GeneralError";
import { generatePassword, success } from "../util/Function";
import { Content, IContent } from "../models/content.model";
import {ObjectId} from "mongodb";
import { ProxyVMInterface } from "../models/dto/proxyvminterface";


/**
 * Get Content
 */
export const getContent = async (id: string): Promise<IContent> => {
    try {
        const content: IContent =  await (Content as any).findOneWithDeleted({_id : new ObjectId(id)});
        if (!content) {
            throw new BadRequest("Content ID does not exists");
        }
        return content;
    } catch(error) {
        throw error;
    }
};

/**
 * Get Content
 */
export const getContentByProxyIdAndVmId = async (vProxyAndVMIDData: Array<ProxyVMInterface>): Promise<Array<IContent>> => {
    try {
        const content: Array<IContent> =  await (Content as any).find({
            $or : vProxyAndVMIDData
        });
        return content;
    } catch(error) {
        throw error;
    }
};
