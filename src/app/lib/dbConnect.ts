import mongoose from "mongoose";

const connection : {isConnected?:number} ={};

async function dbConnect(){
    if (connection.isConnected){
        return;
    }
    const db = await mongoose.connect(process.env.MONGODB_URL!);
    connection.isConnected = db.connections[0].readyState;

}
export default dbConnect;


// lo mejor para projectos grandes es hacer un cache de la connection asi no se conecta siempre