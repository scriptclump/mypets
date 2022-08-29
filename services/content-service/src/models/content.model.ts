import { Document, model, Schema } from "mongoose";
import { ObjectID } from "mongodb";
import { generatePassword } from "../util/Function";
import mongoose_delete from "mongoose-delete";
import mongoosePaginate from "mongoose-paginate-v2";
import { NextFunction } from "express";



export interface IContent extends Document {
    _id : ObjectID,
    centreHost : string,
    centrePort : string,
    centreUsername : string,
    centrePassword : string,
    vProxyHost : string,
    vProxyPort : string,
    vProxyUsername : string,
    vProxyPassword : string,
    vProxyID : string,
    vcIp : string,
    vcUsername : string,
    vcPassword : string,
    vcPort : string,
    vmIp : string,
    vmUsername : string,
    vmPassword : string,
    vmPort : string,
    vmId : string,
}

const ContentSchema = new Schema({
    centreHost : { type: String},
    centrePort : { type: String},
    centreUsername : { type: String},
    centrePassword : { type: String},
    vProxyHost : { type: String},
    vProxyPort : { type: String},
    vProxyUsername : { type: String},
    vProxyPassword : { type: String},
    vProxyID : { type: String},
    vcIp : { type: String},
    vcUsername : { type: String},
    vcPassword : { type: String},
    vcPort : { type: String},
    vmIp : { type: String},
    vmUsername : { type: String},
    vmPassword : { type: String},
    vmPort : { type: String},
    vmId : { type: String},
}, {timestamps: true});


ContentSchema.pre<IContent>("save", async function save(next: NextFunction) {
    // if (!this.isModified("centrePassword")) return next();
    try {
        this.centrePassword = generatePassword(this.centrePassword);
        this.vProxyPassword = generatePassword(this.vProxyPassword);
        this.vcPassword = generatePassword(this.vcPassword);
        this.vmPassword = generatePassword(this.vmPassword);
        return next();
    } catch (err) {
        return next(err);
    }
});



ContentSchema.plugin(mongoose_delete, { indexFields: ["deleted"], deletedAt : true , overrideMethods: ["findOne"]});
ContentSchema.plugin(mongoosePaginate);

export const Content = model<IContent>("Content", ContentSchema, "content");