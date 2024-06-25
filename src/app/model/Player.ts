import mongoose, {Document, Schema} from "mongoose";

export interface IPlayer extends Document{
    name:string;
    image:string;
}
const PlayerSchema: Schema = new mongoose.Schema({
    name:{
        type: String,
        required:true,
    },
    image:{
        type: String,
        required:true,
    }
    
});
const Player = mongoose.models.Player || mongoose.model<IPlayer>("Player",PlayerSchema);

export default Player;