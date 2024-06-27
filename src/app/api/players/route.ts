import dbConnect from "@/app/lib/dbConnect";
import Player from "@/app/model/Player";
import { NextResponse } from "next/server";


export async function GET(){
    await dbConnect();
    try {
        const players = await Player.find({});
        return NextResponse.json(players);
    } catch(err:any) {
        return NextResponse.json({error: err.message})
    }   
}