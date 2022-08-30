import { Document, model, Schema } from "mongoose";
import { ObjectID } from "mongodb";
import mongoose_delete from "mongoose-delete";
import mongoosePaginate from "mongoose-paginate-v2";
// import { NextFunction } from "express";



export interface IContent extends Document {
    _id : ObjectID,
    contentTitle : string,
    contentDesc : string,
    metaKeyword : string,
    metaTitle : string,
    metaDesc : string,
 }

const ContentSchema = new Schema({
    contentTitle : {type: String},
    contentDesc : {type: String},
    metaKeyword : {type: String},
    metaTitle : {type: String},
    metaDesc : {type: String},
}, {timestamps: true});


// ContentSchema.pre<IContent>("save", async function save(next: NextFunction) {
//     // if (!this.isModified("centrePassword")) return next();
//     try {
//         this.centrePassword = generatePassword(this.centrePassword);
//         this.vProxyPassword = generatePassword(this.vProxyPassword);
//         this.vcPassword = generatePassword(this.vcPassword);
//         this.vmPassword = generatePassword(this.vmPassword);
//         return next();
//     } catch (err) {
//         return next(err);
//     }
// });



ContentSchema.plugin(mongoose_delete, { indexFields: ["deleted"], deletedAt : true , overrideMethods: ["findOne"]});
ContentSchema.plugin(mongoosePaginate);

export const Content = model<IContent>("Content", ContentSchema, "content");