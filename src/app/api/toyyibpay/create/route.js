export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ToyyibPay: Create Bill
// Docs: https://toyyibpay.com/apireference

function requiredEnv(name) {
  const val = process.env[name];
  if (!val) throw new Error(`Missing env ${name}`);
  return val;
}

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const isDev = !process.env.VERCEL;

    // In development/local, mock ToyyibPay and return a success redirect URL
    if (isDev) {
      const proto = req.headers.get("x-forwarded-proto") || "http";
      const host = req.headers.get("host") || "localhost:3000";
      const origin = `${proto}://${host}`;
      const BillCode = `MOCK-${Date.now()}`;
      const paymentUrl = `${origin}/toyyibpay/return?billCode=${encodeURIComponent(
        BillCode
      )}`;
      return new Response(
        JSON.stringify({ BillCode, paymentUrl, mock: true }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const secretKey = requiredEnv("TOYYIBPAY_SECRET_KEY");
    const categoryCode = requiredEnv("TOYYIBPAY_CATEGORY_CODE");

    const base = process.env.TOYYIBPAY_BASE_URL || "https://toyyibpay.com";
    const createUrl = `${base}/index.php/api/createBill`;

    const amount = Number(body.amount || 2) * 100; // in cents
    const billName = body.billName || "Resume PDF";
    const billDescription = body.billDescription || "Resume PDF Download";
    const billExternalReferenceNo = body.referenceNo || `RES-${Date.now()}`;
    const billTo = body.name || "Guest";
    const billEmail = body.email || "guest@example.com";
    const billPhone = (body.phone || body.billPhone || "0123456789").toString();
    // ToyyibPay requires billPriceSetting (1=fixed price, 0=open price)
    const billPriceSetting =
      body.priceSetting === 0 || body.priceSetting === "0" ? 0 : 1;
    // Optional controls
    const billPaymentChannel = body.paymentChannel ?? 0; // 0 = FPX & Card (ToyyibPay default)
    const billChargeToCustomer = body.chargeToCustomer ?? ""; // "1" to charge fees to customer (optional)
    // ToyyibPay requires billPayorInfo (1=collect payor info at payment page, 0=do not)
    const billPayorInfo =
      body.payorInfo === 0 || body.payorInfo === "0" ? 0 : 1;

    const returnUrl =
      process.env.TOYYIBPAY_RETURN_URL ||
      `${req.headers.get("x-forwarded-proto") || "https"}://${req.headers.get(
        "host"
      )}/toyyibpay/return`;

    const callbackUrl = process.env.TOYYIBPAY_CALLBACK_URL || "";

    const form = new URLSearchParams();
    form.set("userSecretKey", secretKey);
    form.set("categoryCode", categoryCode);
    form.set("billName", billName);
    form.set("billDescription", billDescription);
    form.set("billAmount", String(amount));
    form.set("billPriceSetting", String(billPriceSetting));
    form.set("billExternalReferenceNo", billExternalReferenceNo);
    form.set("billTo", billTo);
    form.set("billEmail", billEmail);
    form.set("billPhone", billPhone);
    form.set("billPayorInfo", String(billPayorInfo));
    form.set("billPaymentChannel", String(billPaymentChannel));
    form.set("billReturnUrl", returnUrl);
    if (callbackUrl) form.set("billCallbackUrl", callbackUrl);
    if (billChargeToCustomer !== "")
      form.set("billChargeToCustomer", String(billChargeToCustomer));

    const resp = await fetch(createUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
      // next: { revalidate: 0 },
    });

    if (!resp.ok) {
      const t = await resp.text();
      return new Response(
        JSON.stringify({
          error: "ToyyibPay create failed",
          status: resp.status,
          body: t,
        }),
        { status: 500 }
      );
    }

    const json = await resp.json();
    if (!Array.isArray(json) || !json[0]?.BillCode) {
      return new Response(JSON.stringify({ error: "Invalid response", json }), {
        status: 500,
      });
    }

    const { BillCode } = json[0];
    const paymentUrl = `${base}/${BillCode}`;

    return new Response(JSON.stringify({ BillCode, paymentUrl }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
