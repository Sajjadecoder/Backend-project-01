import { type } from 'express/lib/response';
import mongoose, { model, Schema } from 'mongoose';
const subscriptionSchema = new mongoose.Schema({
    subscriber:{
        type: Schema.Types.ObjectId,//user who is subscribing
        ref: "User"
    },
    channel:{
        type: Schema.Types.ObjectId,//one to whom the user is subscribing
        ref: "User"
    }
},{timestamps: true})
export const Subscription = mongoose.model("Subscription",subscriptionSchema)