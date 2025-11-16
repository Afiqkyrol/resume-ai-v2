import Chromium from "@sparticuz/chromium-min";
import puppeteer from "puppeteer-core";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const body = await req.json();
    let { html, filename = "resume.pdf", billCode } = body || {};

    // Require a valid payment before allowing server-side PDF export
    const isDev = !process.env.VERCEL;
    if (!billCode) {
      return new Response(
        JSON.stringify({ error: "billCode required for PDF export" }),
        { status: 400 }
      );
    }
    let isPaid = false;
    if (isDev && String(billCode).startsWith("MOCK-")) {
      isPaid = true;
    } else {
      try {
        const base = process.env.TOYYIBPAY_BASE_URL || "https://toyyibpay.com";
        const statusUrl = `${base}/index.php/api/getBillTransactions`;
        const form = new URLSearchParams();
        form.set("billCode", billCode);
        const resp = await fetch(statusUrl, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: form.toString(),
        });
        const json = await resp.json().catch(() => []);
        isPaid =
          Array.isArray(json) && json.some((t) => t.billpaymentStatus === "1");
      } catch (e) {
        isPaid = false;
      }
    }
    if (!isPaid) {
      return new Response(
        JSON.stringify({ error: "Payment not verified for this billCode" }),
        { status: 402 }
      );
    }

    if (!html) {
      return new Response(
        JSON.stringify({ error: "Missing html or (template + data)" }),
        { status: 400 }
      );
    }

    const cleanHtml = removeBreakLines(html);
    const htmlContent = buildHtml(cleanHtml);

    const isLocal = !process.env.VERCEL;
    const executablePath = isLocal
      ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
      : await Chromium.executablePath(process.env.CHROMIUM_REMOTE_EXEC_PATH);

    const browser = await puppeteer.launch({
      args: Chromium.args,
      defaultViewport: Chromium.defaultViewport,
      executablePath,
      headless: Chromium.headless,
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdf = await page.pdf({ format: "A4", printBackground: true });
    await browser.close();

    return new Response(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename=${filename || "preview.pdf"}`,
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

function buildHtml(element) {
  return `
    <html>
      <head>
        <title>Resume</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>
       ${element}
      </body>
    </html>
  `;
}

function removeBreakLines(outerHtml) {
  return outerHtml.replace(/<div id="break-line"[\s\S]*?<\/div>/, "");
}
