import { ClassicTemplate } from "@/components/templates/ClassicTemplate";
import { CreativeTemplate } from "@/components/templates/CreativeTemplate";
import { MinimalTemplate } from "@/components/templates/MinimalTemplate";
import { ModernTemplate } from "@/components/templates/ModernTemplate";

// Server component rendering a resume for PDF capture via Puppeteer.
export default function PrintPage({ searchParams }) {
  const { payload } = searchParams || {};
  let parsed;
  try {
    if (!payload) throw new Error("Missing payload");
    const json = Buffer.from(payload, "base64").toString("utf-8");
    parsed = JSON.parse(json);
  } catch (e) {
    return (
      <html>
        <body style={{ fontFamily: "Arial, sans-serif", padding: "2rem" }}>
          <h1>Invalid or missing payload</h1>
          <p>{String(e)}</p>
        </body>
      </html>
    );
  }

  const { data, style, template } = parsed || {};
  const templates = {
    classic: ClassicTemplate,
    creative: CreativeTemplate,
    minimal: MinimalTemplate,
    modern: ModernTemplate,
  };
  const TemplateComponent =
    templates[String(template).toLowerCase()] || ClassicTemplate;

  // Constrain to A4 printable width; allow content to flow vertically.
  const pageStyle = {
    width: "210mm",
    // Provide generous min-height; actual height can exceed and will paginate.
    minHeight: "297mm",
    boxSizing: "border-box",
    margin: "0 auto",
    background: "#ffffff",
    color: "#000000",
  };

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <title>Resume Print</title>
        {/* Basic minimal reset for better consistency in PDF */}
        <style
          dangerouslySetInnerHTML={{
            __html: `html,body{margin:0;padding:0;background:#ffffff;} *{box-sizing:border-box;}`,
          }}
        />
      </head>
      <body>
        <div id="resume-print-root" style={pageStyle}>
          <TemplateComponent data={data} style={style} />
        </div>
      </body>
    </html>
  );
}
