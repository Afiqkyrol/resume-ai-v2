export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    // Expect billCode in form-data body; allow graceful fallback to JSON
    let billCode = "";
    const ct = req.headers.get("content-type") || "";
    if (ct.includes("multipart/form-data")) {
      const form = await req.formData();
      billCode = form.get("billCode") || "";
    } else if (ct.includes("application/x-www-form-urlencoded")) {
      const text = await req.text();
      const params = new URLSearchParams(text);
      billCode = params.get("billCode") || "";
    } else if (ct.includes("application/json")) {
      const body = await req.json().catch(() => ({}));
      billCode = body.billCode || "";
    }
    if (!billCode)
      return new Response(JSON.stringify({ error: "billCode required" }), {
        status: 400,
      });

    const isDev = process.env.NODE_ENV !== "production" || !process.env.VERCEL;
    if (isDev && billCode.startsWith("MOCK-")) {
      // Immediately mark as paid for mock codes
      return new Response(
        JSON.stringify({
          paid: true,
          transactions: [
            {
              billpaymentStatus: "1",
              billpaymentAmount: 110,
              billpaymentDate: new Date().toISOString(),
              mock: true,
            },
          ],
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    const base = process.env.TOYYIBPAY_BASE_URL || "https://toyyibpay.com";
    const url = `${base}/index.php/api/getBillTransactions`;

    const form = new URLSearchParams();
    form.set("billCode", billCode);

    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
    });
    const json = await resp.json().catch(() => []);

    // Success heuristic: if transactions array is non-empty and has billpaymentStatus === '1'
    const paid =
      Array.isArray(json) && json.some((t) => t.billpaymentStatus === "1");

    return new Response(JSON.stringify({ paid, transactions: json }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
