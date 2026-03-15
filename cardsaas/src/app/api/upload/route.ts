import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { uploadImage } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  try {
    const { image } = await req.json();

    if (!image || !image.startsWith("data:image")) {
      return NextResponse.json(
        { error: "Неверный формат изображения" },
        { status: 400 }
      );
    }

    const maxSize = 5 * 1024 * 1024;
    const base64Size = (image.length * 3) / 4;
    if (base64Size > maxSize) {
      return NextResponse.json(
        { error: "Файл слишком большой (макс 5MB)" },
        { status: 400 }
      );
    }

    const url = await uploadImage(image);

    return NextResponse.json({ url });
  } catch {
    return NextResponse.json(
      { error: "Ошибка загрузки изображения" },
      { status: 500 }
    );
  }
}
