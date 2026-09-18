import { NextResponse } from "next/server";
import { runSeed } from "@/lib/seed";

export async function GET() {
  try {
    const res = await runSeed();
    return NextResponse.json({ success: true, ...res });
  } catch (error: any) {
    console.error("Seed error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST() {
  try {
    const res = await runSeed();
    return NextResponse.json({ success: true, ...res });
  } catch (error: any) {
    console.error("Seed error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
