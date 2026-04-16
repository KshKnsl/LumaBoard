import { NextRequest, NextResponse } from "next/server";
import { fetchLiveMusicItems } from "@/lib/music-provider";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query") ?? undefined;
  const term = query ?? "indie";

  try {
    const items = await fetchLiveMusicItems(term);

    return NextResponse.json(items);
  } catch {
    return NextResponse.json(
      { error: "Unable to fetch live music data at the moment." },
      { status: 502 },
    );
  }
}
