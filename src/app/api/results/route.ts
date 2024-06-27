import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/dbConnect";
import Result from "@/app/model/result";

export async function POST(request: Request) {
  await dbConnect();
  
  try {
    const { userId, score } = await request.json();

    const newResult = new Result({ userId, score });
    await newResult.save();

    return NextResponse.json(newResult, { status: 201 });
  } catch (err: any) {
    console.error("Error posting result:", err);
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
