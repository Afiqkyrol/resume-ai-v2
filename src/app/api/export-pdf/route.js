import Chromium from "@sparticuz/chromium-min";
import puppeteer from "puppeteer-core";

// Map template names to dynamic import paths to keep this route lean.
// We will navigate to /print?payload=... instead of rendering HTML here to leverage existing styling.

// export async function POST(req) {
//   try {
//     const body = await req.json();
//     const { data, style, template, filename = "resume.pdf" } = body || {};
//     if (!data || !style || !template) {
//       return new Response(
//         JSON.stringify({ error: "Missing data, style or template" }),
//         { status: 400 }
//       );
//     }

//     const htmlContent = buildHtml(data);

//     // Encode payload for the /print page
//     const payload = Buffer.from(
//       JSON.stringify({ data, style, template }),
//       "utf-8"
//     ).toString("base64");

//     // Derive origin
//     const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
//     const protocol = req.headers.get("x-forwarded-proto") || "http";
//     if (!host) {
//       return new Response(
//         JSON.stringify({ error: "Unable to determine host" }),
//         { status: 400 }
//       );
//     }
//     const targetUrl = `${protocol}://${host}/print?payload=${payload}`;

//     // Attempt to launch bundled chromium; fallback to system Chrome if needed.
//     let browser;
//     let executablePath;
//     if (!process.env.VERCEL) {
//       executablePath =
//         "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
//     } else {
//       executablePath = process.env.CHROMIUM_REMOTE_EXEC_PATH;
//     }
//     try {
//       executablePath = await chromium.executablePath();
//       browser = await puppeteer.launch({
//         args: chromium.args,
//         defaultViewport: chromium.defaultViewport,
//         executablePath,
//         headless: chromium.headless,
//       });
//     } catch (e) {
//       const fallbackPath = process.env.CHROME_PATH;
//       if (!fallbackPath) {
//         console.error("Chromium launch failed and CHROME_PATH not set:", e);
//         return new Response(
//           JSON.stringify({
//             error: "Unable to launch Chromium. Set CHROME_PATH for local dev.",
//           }),
//           { status: 500 }
//         );
//       }
//       browser = await puppeteer.launch({
//         headless: "new",
//         executablePath: fallbackPath,
//       });
//     }

//     const page = await browser.newPage();
//     await page.goto(targetUrl, { waitUntil: "networkidle0" });

//     // Generate PDF
//     const pdfBuffer = await page.pdf({
//       format: "A4",
//       printBackground: true,
//       margin: { top: "10mm", bottom: "10mm", left: "10mm", right: "10mm" },
//       // Prefer single page, but allow overflow to additional pages automatically
//     });

//     await browser.close();

//     return new Response(pdfBuffer, {
//       status: 200,
//       headers: {
//         "Content-Type": "application/pdf",
//         "Content-Disposition": `attachment; filename="${filename}"`,
//       },
//     });
//   } catch (err) {
//     console.error("PDF export failed:", err);
//     return new Response(
//       JSON.stringify({ error: "PDF generation failed", detail: String(err) }),
//       { status: 500 }
//     );
//   }
// }

export async function POST(req) {
  try {
    const body = await req.json();
    let { html, filename = "resume.pdf" } = body || {};

    // Determine whether the user has paid by checking ToyyibPay transactions.
    // Client cannot control watermark removal directly.
    const isDev = process.env.NODE_ENV !== "production" || !process.env.VERCEL;
    // let isPaid = false;
    // if (billCode) {
    //   if (isDev && String(billCode).startsWith("MOCK-")) {
    //     isPaid = true;
    //   } else {
    //     try {
    //       const base =
    //         process.env.TOYYIBPAY_BASE_URL || "https://toyyibpay.com";
    //       const statusUrl = `${base}/index.php/api/getBillTransactions`;
    //       const form = new URLSearchParams();
    //       form.set("billCode", billCode);
    //       const resp = await fetch(statusUrl, {
    //         method: "POST",
    //         headers: { "Content-Type": "application/x-www-form-urlencoded" },
    //         body: form.toString(),
    //       });
    //       const json = await resp.json().catch(() => []);
    //       isPaid =
    //         Array.isArray(json) &&
    //         json.some((t) => t.billpaymentStatus === "1");
    //     } catch (e) {
    //       // If verification fails, default to unpaid (watermark stays)
    //       isPaid = false;
    //     }
    //   }
    // }

    if (!html) {
      return new Response(
        JSON.stringify({ error: "Missing html or (template + data)" }),
        { status: 400 }
      );
    }

    const htmlContent = buildHtml(html);

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
