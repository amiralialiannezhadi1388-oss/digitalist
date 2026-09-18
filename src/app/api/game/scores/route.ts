import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { gameScores } from "@/db/schema";
import { desc } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const scores = await db
      .select()
      .from(gameScores)
      .orderBy(desc(gameScores.score))
      .limit(15);

    return NextResponse.json({ scores });
  } catch (error: any) {
    console.error("Failed to load game scores:", error);
    return NextResponse.json({ scores: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const { playerName, score, levelReached, coinsCollected } = await req.json();

    if (!score || typeof score !== "number") {
      return NextResponse.json({ error: "امتیاز نامعتبر است." }, { status: 400 });
    }

    const name = playerName?.trim() || user?.name || "بازیکن ناشناس";

    const [newScore] = await db
      .insert(gameScores)
      .values({
        userId: user?.id || null,
        playerName: name,
        score,
        levelReached: levelReached || 1,
        coinsCollected: coinsCollected || 0,
      })
      .returning();

    return NextResponse.json({ success: true, score: newScore });
  } catch (error: any) {
    console.error("Failed to save score:", error);
    return NextResponse.json({ error: "خطا در ثبت رکورد" }, { status: 500 });
  }
}
