"use strict";

import { BadRequest } from "../util/GeneralError";
import { Content, IContent } from "../models/content.model";
import {ObjectId} from "mongodb";

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