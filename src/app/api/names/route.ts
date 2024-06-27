import dbConnect from "@/app/lib/dbConnect";
import RandomName from "@/app/model/randomNames";
import { NextResponse } from "next/server";


export async function GET() {
    await dbConnect();
    try{
        const randomNames = await RandomName.find({});
        return NextResponse.json(randomNames);
    }
    catch(err:any) {
        return NextResponse.json({err: err.message});
    }
}