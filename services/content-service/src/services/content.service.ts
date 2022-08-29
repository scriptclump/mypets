"use strict";
import { BadRequest } from "../util/GeneralError";
import { Content, IContent } from "../models/content.model";
import {ObjectId} from "mongodb";

/**
 * Get Content
 */
export const getContent = async (id: string): Promise<IContent> => {
    try {
        const server_connection: IContent =  await (Content as any).findOneWithDeleted({_id : new ObjectId(id)});
        if (!server_connection) {
            throw new BadRequest("Content ID does not exists");
        }
        return server_connection;
    } catch(error) {
        throw error;
    }
};
