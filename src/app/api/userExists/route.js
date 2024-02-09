import { connectMongoDB } from "../../../../lib/mongodb";

import { NextResponse } from "next/server";
import Teacher from "../../../../models/teacher";

export async function POST(req) {
  try {
    await connectMongoDB();
    const { email } = await req.json();
    const teacher = await Teacher.findOne({ email }).select("_id");
    console.log("teacher: ", teacher);
    return NextResponse.json({ teacher });
  } catch (error) {
    console.log(error);
  }
}
