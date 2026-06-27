import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db(process.env.MONGODB_DB);

    // User এর সব purchase + artwork details join করো
    const purchases = await db.collection("purchases").aggregate([
      {
        $match: { userId: session.user.id }
      },
      {
        $lookup: {
          from: "artworks",
          localField: "artworkId",
          foreignField: "_id",
          as: "artwork"
        }
      },
      {
        $unwind: "$artwork"
      },
      {
        $sort: { purchaseDate: -1 }
      }
    ]).toArray();

    await client.close();

    // Stats calculate করো
    const totalPurchases = purchases.length;
    const currentPlan = session.user.plan || "free"; // user table এ plan field add করো
    
    const planLimits = {
      free: 3,
      pro: 9,
      premium: 999
    };
    
    const purchasesLeft = planLimits[currentPlan] - totalPurchases;

    return NextResponse.json({ 
      purchases,
      stats: {
        totalPurchases,
        currentPlan,
        purchasesLeft: purchasesLeft > 0? purchasesLeft : 0
      }
    });
  } catch (error) {
    console.error("Fetch purchases error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
