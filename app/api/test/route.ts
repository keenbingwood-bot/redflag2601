import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "Rate limit test endpoint",
    timestamp: new Date().toISOString(),
    data: {
      status: "success",
      requestId: Math.random().toString(36).substring(7),
    },
  });
}

export async function POST() {
  return NextResponse.json({
    message: "POST request received",
    timestamp: new Date().toISOString(),
    data: {
      status: "success",
      requestId: Math.random().toString(36).substring(7),
    },
  });
}