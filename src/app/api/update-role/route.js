import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email, role } = await request.json();

    console.log("Updating role for:", email, "to:", role); // Debug

    if (role!== "user" && role!== "artist") {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db(process.env.MONGODB_DB);

    const result = await db.collection("user").updateOne(
      { email: email.toLowerCase() }, // lowercase করে match করো
      { $set: { role } }
    );

    console.log("Update result:", result);

    await client.close();
    
    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: "User not found or role not changed" }, { status: 404 });
    }

    return NextResponse.json({ success: true, modified: result.modifiedCount });
  } catch (error) {
    console.error("Update role error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
