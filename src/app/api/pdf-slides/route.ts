import { NextResponse } from "next/server";
import { fromPath } from "pdf2pic";
import path from "path";
import fs from "fs";

// Кешируем результат в памяти на время жизни serverless-функции
let cachedUrls: string[] | null = null;

export async function GET() {
  // Вернуть кеш если уже конвертировали
  if (cachedUrls) {
    return NextResponse.json({ urls: cachedUrls });
  }

  const pdfPath   = path.join(process.cwd(), "public", "presentation.pdf");
  const outputDir = path.join(process.cwd(), "public", "slides");

  // Если PDF не положили — вернуть пустой массив (покажется фоллбэк)
  if (!fs.existsSync(pdfPath)) {
    return NextResponse.json({ urls: [] });
  }

  // Создать папку для слайдов если нет
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Проверить — может уже конвертировали ранее (есть файлы на диске)
  const existing = fs.readdirSync(outputDir)
    .filter((f) => f.endsWith(".png"))
    .sort();

  if (existing.length > 0) {
    cachedUrls = existing.map((f) => `/slides/${f}`);
    return NextResponse.json({ urls: cachedUrls });
  }

  // Конвертируем PDF → PNG
  const converter = fromPath(pdfPath, {
    density: 150,          // dpi — баланс качества и скорости
    saveFilename: "slide",
    savePath: outputDir,
    format: "png",
    width: 828,            // ~414px * 2x для ретины
    height: 1792,
  });

  // Считаем кол-во страниц через конвертацию первой и bulk
  try {
    const results = await converter.bulk(-1, { responseType: "image" });

    cachedUrls = results
      .filter((r) => r.path)
      .map((r) => {
        // r.path — абсолютный путь, превращаем в /slides/slide.N.png
        const filename = path.basename(r.path!);
        return `/slides/${filename}`;
      })
      .sort();

    return NextResponse.json({ urls: cachedUrls });
  } catch (err) {
    console.error("[pdf-slides] conversion error:", err);
    return NextResponse.json({ urls: [] });
  }
}
