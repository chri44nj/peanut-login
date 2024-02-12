import { connectMongoDB } from "../../../../lib/mongodb";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import Teacher from "../../../../models/teacher";

export async function POST(req) {
  try {
    const { name, email, password, phone, school, subjects } = await req.json();
    console.log("Received request with additional fields:", { name, email, password, phone, school, subjects });
    const hashedPassword = await bcrypt.hash(password, 10);
    await connectMongoDB();
    await Teacher.create({ name, email, password: hashedPassword, phone, school, subjects });

    return NextResponse.json({ message: "Teacher registered." }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "An error occurred while registering the teacher." }, { status: 500 });
  }
}
