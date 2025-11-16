"use client";

import { useState, useRef } from "react";
import { generateResumeFromFreeForm } from "../services/resumeGenerator";
import { exportToPDF, exportToPdfServer } from "../services/pdfExport";
import { dummyFreeFormInput } from "../data/dummyData";
import {
  FileText,
  Sparkles,
  Download,
  Edit3,
  Palette,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { ResumePreview } from "./ResumePreview";
import { ResumeEditor } from "./ResumeEditor";
import { StyleControls } from "./StyleControl";
import PaymentModal from "./modals/PaymentModal";
import CustomerFormModal from "./modals/CustomerFormModal";
import Image from "next/image";

function App() {
  const [step, setStep] = useState("input");
  const [isGenerating, setIsGenerating] = useState(false);
  const [freeFormInput, setFreeFormInput] = useState("");
  const [resumeData, setResumeData] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [resumeStyle, setResumeStyle] = useState({
    fontSize: 11,
    lineHeight: 1.5,
    sectionSpacing: 20,
    contentPadding: 40,
  });
  const [showEditor, setShowEditor] = useState(false);
  const [showStyleControls, setShowStyleControls] = useState(false);
  const previewRef = useRef(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showBuyerModal, setShowBuyerModal] = useState(false);
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [buyerError, setBuyerError] = useState("");

  const handleGenerate = async () => {
    if (!freeFormInput.trim() || isGenerating) return;
    setIsGenerating(true);
    try {
      const res = await fetch("/api/generate-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: freeFormInput }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("Generation error", err);
        setIsGenerating(false);
        return;
      }

      const dataObject = await res.json();
      const obj =
        typeof dataObject?.result === "string"
          ? JSON.parse(dataObject.result)
          : dataObject.result;

      // const data = generateResumeFromFreeForm(obj);
      setResumeData(obj);
      setStep("edit");
      setIsGenerating(false);
    } catch (e) {
      console.error(e);
      setIsGenerating(false);
    }
  };

  const handleLoadDummy = () => {
    setFreeFormInput(dummyFreeFormInput);
  };

  const handleExportPDF = async () => {
    if (previewRef.current) {
      const resumeElement = previewRef.current.querySelector(
        'div[style*="794px"]'
      );
      if (resumeElement) {
        await exportToPdfServer({
          html: resumeElement.outerHTML,
          filename: `${resumeData?.personalInfo.fullName.replace(
            /\s/g,
            "_"
          )}_Resume.pdf`,
        });
      }
    }
  };

  const handleCreateBill = async () => {
    const name = buyerName.trim();
    const email = buyerEmail.trim();
    const phone = buyerPhone.trim();
    if (!name) return setBuyerError("Please enter your name.");
    if (!email || !email.includes("@"))
      return setBuyerError("Please enter a valid email.");
    if (!phone || phone.replace(/\D/g, "").length < 7)
      return setBuyerError("Please enter a valid phone number.");

    const resumeElement = previewRef.current.querySelector(
      'div[style*="794px"]'
    );
    if (!resumeElement) {
      setBuyerError("Resume not found.");
      return;
    }
    const filename = `${resumeData?.personalInfo.fullName.replace(
      /\s/g,
      "_"
    )}_Resume.pdf`;

    try {
      setIsProcessingPayment(true);
      setBuyerError("");
      // Persist current resume template+data (not raw HTML) so return page can auto-download after payment
      try {
        localStorage.setItem("resume:data", resumeElement.outerHTML);
        localStorage.setItem("resume:filename", filename);
        localStorage.setItem("resume:paidFlag", "pending");
      } catch (e) {
        console.warn("Failed to persist resume before payment", e);
      }
      const res = await fetch("/api/toyyibpay/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: 2,
          billName: "Resume PDF",
          billDescription: "Resume PDF Download",
          name,
          email,
          phone,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to create payment");
      if (json?.paymentUrl) {
        window.location.href = json.paymentUrl;
        return;
      }
      throw new Error("Missing paymentUrl from server");
    } catch (e) {
      console.error("ToyyibPay create error", e);
      setBuyerError(e.message || "Payment error");
    } finally {
      setIsProcessingPayment(false);
      setShowBuyerModal(false);
    }
  };

  const templates = [
    {
      value: "modern",
      label: "Modern",
      description: "Clean and professional with blue accents",
    },
    {
      value: "classic",
      label: "Classic",
      description: "Traditional format with centered header",
    },
    {
      value: "minimal",
      label: "Minimal",
      description: "Simple and elegant typography",
    },
    {
      value: "creative",
      label: "Creative",
      description: "Two-column layout with sidebar",
    },
  ];

  return (
    <div className="min-h-screen hero-gradient scroll-smooth">
      {/* Action / nav bar */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 action-bar-shadow border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-5 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="pulse-border rounded-lg p-2 bg-white/60">
              <Image
                src="/cerouno/logo-no-bg.png"
                alt="Cerouno logo"
                width={36}
                height={36}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-wide text-slate-600">
                Resume AI{" "}
                <span className="gradient-text">
                  <a
                    href="https://cerouno.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    by Cerouno
                  </a>
                </span>
              </span>
              <span className="text-xs text-slate-500">
                Smart professional profiles
              </span>
            </div>
          </div>
          {step === "edit" && resumeData && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setShowStyleControls(!showStyleControls);
                  setShowEditor(false);
                }}
                className={`hidden sm:inline-flex px-4 py-2 rounded-md text-sm font-medium transition-colors border ${
                  showStyleControls
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white/70 hover:bg-blue-50 text-slate-700 border-slate-300"
                }`}
              >
                <Palette size={16} />
                <span className="ml-2">Style</span>
              </button>
              <button
                onClick={() => {
                  setShowEditor(!showEditor);
                  setShowStyleControls(false);
                }}
                className={`hidden sm:inline-flex px-4 py-2 rounded-md text-sm font-medium transition-colors border ${
                  showEditor
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white/70 hover:bg-blue-50 text-slate-700 border-slate-300"
                }`}
              >
                <Edit3 size={16} />
                <span className="ml-2">Edit</span>
              </button>
              <button
                onClick={() => setShowPaymentModal(true)}
                className="relative inline-flex items-center gap-2 px-5 py-2 rounded-md text-sm font-semibold text-white bg-emerald-600 shadow-lg shadow-blue-600/30 hover:shadow-xl hover:brightness-110 transition-all"
              >
                <Download size={16} />
                <span>Export PDF</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10">
        {/* Hero Section */}
        {step === "input" && (
          <header className="relative mb-14 fade-in">
            <div className="absolute inset-0 bg-pattern opacity-30 rounded-3xl" />
            <div className="relative text-center px-6 py-14 glass-panel rounded-3xl">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
                <div className="rounded-xl bg-gradient-to-tr from-gray-100 to-gray-200 p-3 shadow-lg shadow-indigo-500/30">
                  <Image
                    src="/cerouno/logo-no-bg.png"
                    alt="Cerouno logo"
                    width={46}
                    height={46}
                  />
                </div>
                <h1 className="gradient-text text-5xl font-extrabold tracking-tight">
                  AI Resume Builder
                </h1>
              </div>
              <p className="max-w-2xl mx-auto text-lg text-slate-600 leading-relaxed">
                Transform your career story into a polished, high-impact resume.
                Paste raw experience details and let intelligent structuring
                craft a professional layout.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3 text-xs font-medium">
                <span className="px-3 py-1 rounded-full bg-blue-600/10 text-blue-700 border border-blue-600/20">
                  ATS Friendly
                </span>
                <span className="px-3 py-1 rounded-full bg-indigo-600/10 text-indigo-700 border border-indigo-600/20">
                  Template Library
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-600/10 text-emerald-700 border border-emerald-600/20">
                  Live Styling
                </span>
                <span className="px-3 py-1 rounded-full bg-pink-600/10 text-pink-700 border border-pink-600/20">
                  PDF Export
                </span>
              </div>
            </div>
          </header>
        )}

        {step === "input" && (
          <div className="max-w-5xl mx-auto fade-in">
            <div className="glass-panel rounded-2xl p-10 border border-white/40">
              <div className="flex flex-col lg:flex-row gap-10">
                <div className="flex-1 space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
                      Fill in Your Experience
                    </h2>
                    <button
                      onClick={handleLoadDummy}
                      className="px-4 py-2 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors text-sm font-medium"
                    >
                      Load Sample
                    </button>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Provide informal or structured career details: roles,
                    responsibilities, achievements, skills, education,
                    certifications, projects. The AI will normalize and
                    structure this into a polished resume you can refine
                    further.
                  </p>
                  <textarea
                    value={freeFormInput}
                    onChange={(e) => setFreeFormInput(e.target.value)}
                    placeholder="I'm a software engineer with 5 years of experience in React and Node.js. I worked at TechCorp as a Senior Developer and led a team of 3 people. I have a Bachelor's in Computer Science..."
                    rows={18}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300/70 bg-white/70 backdrop-blur placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/60 font-mono text-sm shadow-inner"
                  />
                  <div className="subtle-divider" />
                  <button
                    onClick={handleGenerate}
                    disabled={!freeFormInput.trim()}
                    className={`group relative inline-flex items-center justify-center gap-2 w-full rounded-xl px-6 py-4 text-lg font-semibold tracking-wide transition-all ${
                      isGenerating
                        ? "cursor-not-allowed bg-slate-400 text-white"
                        : "bg-gradient-to-r from-blue-600 to-emerald-600 text-white hover:shadow-xl hover:shadow-blue-600/30"
                    }`}
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={22} className="animate-pulse" />
                        <span>Generate My Resume</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="w-full lg:max-w-sm space-y-6">
                  <div className="rounded-xl border border-slate-200 bg-white/70 backdrop-blur p-6 shadow-sm">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600 mb-4">
                      Tips
                    </h3>
                    <ul className="space-y-3 text-sm text-slate-600">
                      <li className="flex gap-2">
                        <span className="text-blue-600">•</span> Use action
                        verbs ("Optimized", "Led", "Implemented").
                      </li>
                      <li className="flex gap-2">
                        <span className="text-indigo-600">•</span> Quantify
                        impact ("Reduced latency by 32%").
                      </li>
                      <li className="flex gap-2">
                        <span className="text-emerald-600">•</span> Include
                        stack & tools (React, AWS, Terraform).
                      </li>
                      <li className="flex gap-2">
                        <span className="text-pink-600">•</span> Separate items
                        with blank lines for clarity.
                      </li>
                    </ul>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-blue-50 p-6 shadow-inner">
                    <h4 className="font-semibold text-slate-800 mb-2">
                      Workflow
                    </h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-slate-600">
                      <li>Filled in your experience.</li>
                      <li>Generate structured resume.</li>
                      <li>Tweak content & styling.</li>
                      <li>Export polished PDF.</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
            {/* Services / Features Section */}
            <section className="mt-16 space-y-8">
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                  Why Use This Builder?
                </h2>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Designed to reduce friction. These capabilities help you
                  progress from raw text to a polished, ATS-friendly PDF
                  quickly.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    title: "Fast AI Structuring",
                    desc: "Convert unformatted career notes into organized sections instantly.",
                    icon: <Sparkles size={20} className="text-blue-600" />,
                  },
                  {
                    title: "Live Styling Controls",
                    desc: "Adjust typography, spacing and layout without leaving the preview.",
                    icon: <Palette size={20} className="text-emerald-600" />,
                  },
                  {
                    title: "Multiple Templates",
                    desc: "Switch between modern, minimal, classic and creative designs.",
                    icon: <FileText size={20} className="text-indigo-600" />,
                  },
                  {
                    title: "High-Quality PDF Export",
                    desc: "Generate pixel-perfect, professional PDF output ready for applications.",
                    icon: <Download size={20} className="text-pink-600" />,
                  },
                  {
                    title: "Privacy First",
                    desc: "Nothing stored server-side beyond payment verification; your data stays local.",
                    icon: <Edit3 size={20} className="text-slate-600" />,
                  },
                  {
                    title: "ATS Friendly Markup",
                    desc: "Structured content improves parsing in applicant tracking systems.",
                    icon: <FileText size={20} className="text-amber-600" />,
                  },
                ].map((f, i) => (
                  <div
                    key={i}
                    className="group relative rounded-xl border border-slate-200 bg-white/70 backdrop-blur p-5 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 rounded-md bg-gradient-to-br from-white to-slate-100 p-2 shadow-inner">
                        {f.icon}
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-sm font-semibold text-slate-800">
                          {f.title}
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {f.desc}
                        </p>
                      </div>
                    </div>
                    <div className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-blue-50/40 to-emerald-50/40" />
                  </div>
                ))}
              </div>
            </section>
            {/* Contact Section */}
            <section className="mt-16" id="contact">
              <div className="max-w-3xl mx-auto glass-panel rounded-2xl p-8 border border-white/40">
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight text-center mb-6">
                  Contact
                </h2>
                <p className="text-center text-slate-600 text-sm leading-relaxed mb-6">
                  For enquiries or if you experience any issues, reach out using
                  the details below.
                </p>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white/70 backdrop-blur p-4">
                    <div className="rounded-md bg-blue-50 p-2">
                      <User size={18} className="text-blue-600" />
                    </div>
                    <div className="text-sm">
                      <div className="font-semibold text-slate-800">Name</div>
                      <div className="text-slate-600">Afiq</div>
                    </div>
                  </div>
                  <a
                    href="mailto:afiq@cerouno.dev"
                    className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white/70 backdrop-blur p-4 hover:bg-blue-50/50 transition-colors"
                  >
                    <div className="rounded-md bg-blue-50 p-2">
                      <Mail size={18} className="text-blue-600" />
                    </div>
                    <div className="text-sm">
                      <div className="font-semibold text-slate-800">Email</div>
                      <div className="text-slate-600 break-all">
                        afiq@cerouno.dev
                      </div>
                    </div>
                  </a>
                  <a
                    href="https://wa.me/60142271936"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Chat on WhatsApp"
                    className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white/70 backdrop-blur p-4 hover:bg-emerald-50/50 transition-colors"
                  >
                    <div className="rounded-md bg-emerald-50 p-2">
                      <Phone size={18} className="text-emerald-600" />
                    </div>
                    <div className="text-sm">
                      <div className="font-semibold text-slate-800">Phone</div>
                      <div className="text-slate-600">+60142271936</div>
                    </div>
                  </a>
                </div>
              </div>
            </section>
          </div>
        )}

        {step === "edit" && resumeData && (
          <div className="space-y-10 fade-in">
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={() => setStep("input")}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-white/70 border border-slate-300 text-slate-700 hover:bg-slate-100 transition-all"
              >
                Back
              </button>
              <span className="text-xs font-medium text-slate-500">
                Customize then export your professionally formatted PDF.
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                Templates
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                {templates.map((template) => (
                  <button
                    key={template.value}
                    onClick={() => setSelectedTemplate(template.value)}
                    className={`template-card group p-5 rounded-xl border relative overflow-hidden text-left ${
                      selectedTemplate === template.value
                        ? "border-blue-600 bg-blue-50"
                        : "border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50"
                    }`}
                  >
                    <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-tr from-blue-500/10 to-indigo-500/20 blur-2xl" />
                    <h4 className="font-semibold text-slate-800 mb-1 flex items-center gap-2">
                      {template.label}
                      {selectedTemplate === template.value && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-600 text-white">
                          Active
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {template.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-12 gap-8">
              {showEditor && (
                <div className="col-span-12 lg:col-span-4 space-y-6">
                  <div className="rounded-xl border border-slate-200 bg-white/80 backdrop-blur p-5 shadow-sm">
                    <ResumeEditor data={resumeData} onUpdate={setResumeData} />
                  </div>
                </div>
              )}
              {showStyleControls && !showEditor && (
                <div className="col-span-12 lg:col-span-3 space-y-6">
                  <div className="rounded-xl border border-slate-200 bg-white/80 backdrop-blur p-5 shadow-sm">
                    <StyleControls
                      style={resumeStyle}
                      onUpdate={setResumeStyle}
                    />
                  </div>
                </div>
              )}
              <div
                className={
                  showEditor
                    ? "col-span-12 lg:col-span-8"
                    : showStyleControls
                    ? "col-span-12 lg:col-span-9"
                    : "col-span-12"
                }
              >
                <div
                  ref={previewRef}
                  className="rounded-2xl border border-slate-200 bg-white shadow-lg p-6 max-w-screen"
                >
                  <ResumePreview
                    data={resumeData}
                    template={selectedTemplate}
                    style={resumeStyle}
                  />
                </div>
              </div>
              <div className="col-span-12 lg:col-span-4 space-y-6 sm:hidden">
                <div className="rounded-xl border border-slate-200 bg-white/80 backdrop-blur p-5 shadow-sm">
                  <ResumeEditor data={resumeData} onUpdate={setResumeData} />
                </div>
              </div>
              <div className="col-span-12 lg:col-span-3 space-y-6 sm:hidden">
                <div className="rounded-xl border border-slate-200 bg-white/80 backdrop-blur p-5 shadow-sm">
                  <StyleControls
                    style={resumeStyle}
                    onUpdate={setResumeStyle}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        {showPaymentModal && (
          <PaymentModal
            setShowPaymentModal={setShowPaymentModal}
            handleConfirmPayment={async () => {
              setShowBuyerModal(true);
              setShowPaymentModal(false);
            }}
            isProcessing={isProcessingPayment}
          />
        )}
        {showBuyerModal && (
          <CustomerFormModal
            setShowBuyerModal={setShowBuyerModal}
            buyerName={buyerName}
            setBuyerName={setBuyerName}
            buyerEmail={buyerEmail}
            setBuyerEmail={setBuyerEmail}
            buyerPhone={buyerPhone}
            setBuyerPhone={setBuyerPhone}
            buyerError={buyerError}
            handleCreateBill={handleCreateBill}
            isProcessing={isProcessingPayment}
          />
        )}
      </div>
      {/* Footer */}
      <footer className="mt-24 border-t border-slate-200/70 bg-white/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-10 grid gap-10 md:grid-cols-3">
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-800 flex items-center gap-2">
              <FileText size={18} className="text-blue-600" /> Resume AI{" "}
              <span className="gradient-text">
                <a
                  href="https://cerouno.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  by Cerouno
                </a>
              </span>
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Generate structured, elegant resumes from free-form text with
              real-time styling and professional export.
            </p>
          </div>
          <div className="space-y-3">
            <h5 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              Resources
            </h5>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>Templates Overview</li>
              <li>Styling Guide</li>
              <li>Payment & PDF Export</li>
              <li>Privacy</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h5 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              Get Started
            </h5>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>Paste Your Content</li>
              <li>Choose Template</li>
              <li>Refine & Style</li>
              <li>Export PDF</li>
            </ul>
          </div>
        </div>
        <div className="text-center text-xs text-slate-500 py-6">
          © {new Date().getFullYear()} Resume AI by{" "}
          <a
            href="https://cerouno.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="gradient-text"
          >
            Cerouno
          </a>
          . All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default App;
