import mongoose, {Document, Schema } from "mongoose";

export interface IRandomName extends Document{
    name:string;
}

const RandomNameSchema : Schema = new mongoose.Schema({
    name:{
        type: String,
        required:true,
    }
});

const RandomName = mongoose.models.RandomName || mongoose.model<IRandomName>("RandomName", RandomNameSchema);

export default RandomName;