import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ error: "DB not configured" }, { status: 503 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "24"), 50);
    const offset = (page - 1) * limit;

    let query = supabase
      .from("products")
      .select("id, barcode, name, price, total_quantity, product_type, description, image_url, requires_prescription, is_active", { count: "exact" })
      .order("name")
      .range(offset, offset + limit - 1);

    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    if (category) {
      query = query.eq("product_type", category);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    return NextResponse.json({
      products: data || [],
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit),
    });
  } catch (error) {
    console.error("Products API error:", error);
    return NextResponse.json(
      { error: "Məhsullar yüklənmədi." },
      { status: 500 }
    );
  }
}
