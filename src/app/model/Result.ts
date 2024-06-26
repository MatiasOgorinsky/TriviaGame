import mongoose, {Document, Schema } from "mongoose";

export interface IResult extends Document{
    username:string;
    score:number;
}

const ResultSchema: Schema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
  });

  const Result = mongoose.models.Result || mongoose.model<IResult>("Result", ResultSchema);

  export default Result;