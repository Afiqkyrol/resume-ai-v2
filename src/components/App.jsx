"use client";

import { useState, useRef, useEffect } from "react"; // ✅ useEffect add kiya
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
  ArrowRight,
  Star,
  CheckCircle,
  Zap,
  Play,
  Rocket,
  Shield,
  Award,
  Users,
  Clock,
  Globe,
  Heart,
  ArrowUp, // ✅ ArrowUp icon add kiya
} from "lucide-react";
import { ResumePreview } from "./ResumePreview";
import { ResumeEditor } from "./ResumeEditor";
import { StyleControls } from "./StyleControl";
import PaymentModal from "./modals/PaymentModal";
import CustomerFormModal from "./modals/CustomerFormModal";
import Image from "next/image";

// ✅ BackToTop Component Function - Yahan define kiya
function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 p-3 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-full shadow-2xl shadow-blue-500/30 hover:shadow-3xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-110 group"
          aria-label="Back to top"
        >
          <ArrowUp
            size={24}
            className="group-hover:-translate-y-1 transition-transform"
          />
        </button>
      )}
    </>
  );
}

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
    // if (!process.env.VERCEL) {
    //   const data = generateResumeFromFreeForm(dummyFreeFormInput);
    //   console.log(data);

    //   setResumeData(data);
    //   setStep("edit");
    //   return;
    // }
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
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 scroll-smooth text-slate-50">
      {/* Background blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden opacity-40">
        <div className="absolute -top-24 -left-10 w-80 h-80 bg-blue-500/40 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-24 w-96 h-96 bg-emerald-500/30 rounded-full blur-[90px]" />
      </div>

      {/* Top bar */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-5 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-slate-900 border border-slate-700 p-1.5 shadow-sm">
              <Image
                src="/cerouno/logo-no-bg.png"
                alt="Cerouno logo"
                width={36}
                height={36}
                className="rounded-lg"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight text-slate-50">
                Resume <span className="text-blue-400">AI</span>{" "}
                <span className="text-xs font-normal text-slate-400">
                  by{" "}
                  <a
                    href="https://cerouno.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-300 hover:text-emerald-200 underline-offset-2 hover:underline"
                  >
                    Cerouno
                  </a>
                </span>
              </span>
              <span className="text-xs text-slate-500">
                Smart professional profiles
              </span>
            </div>
          </div>
          {step === "edit" && resumeData && (
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => {
                  setShowStyleControls(!showStyleControls);
                  setShowEditor(false);
                }}
                className={`hidden sm:inline-flex px-3 sm:px-4 py-2 rounded-lg text-xs font-medium transition-colors border ${
                  showStyleControls
                    ? "bg-blue-500 text-white border-blue-400 shadow-md"
                    : "bg-slate-900/80 text-slate-100 border-slate-700 hover:bg-slate-800"
                }`}
              >
                <Palette size={16} />
                <span className="ml-1">Style</span>
              </button>
              <button
                onClick={() => {
                  setShowEditor(!showEditor);
                  setShowStyleControls(false);
                }}
                className={`hidden sm:inline-flex px-3 sm:px-4 py-2 rounded-lg text-xs font-medium transition-colors border ${
                  showEditor
                    ? "bg-blue-500 text-white border-blue-400 shadow-md"
                    : "bg-slate-900/80 text-slate-100 border-slate-700 hover:bg-slate-800"
                }`}
              >
                <Edit3 size={16} />
                <span className="ml-1">Edit</span>
              </button>
              <button
                onClick={() => setShowPaymentModal(true)}
                className="inline-flex items-center gap-2 px-3 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold text-slate-950 bg-emerald-400 shadow-lg shadow-emerald-600/30 hover:shadow-xl hover:bg-emerald-300 transition-all"
              >
                <Download size={16} />
                <span className="hidden sm:inline">Export PDF</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-10 relative z-10">
        {/* HERO + INPUT STEP */}
        {step === "input" && (
          <>
            {/* Hero section */}
            <header className="relative mb-8 sm:mb-14">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800/70 shadow-2xl shadow-slate-950/70" />
              <div className="relative grid lg:grid-cols-2 gap-6 sm:gap-10 px-4 sm:px-8 py-8 sm:py-12 lg:px-12 lg:py-14 items-center rounded-3xl">
                {/* Left text */}
                <div className="space-y-4 sm:space-y-6">
                  <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 text-slate-100 px-3 py-1 text-xs sm:text-[11px] font-medium shadow-sm border border-slate-700">
                    <Sparkles size={14} className="text-amber-300" />
                    <span>AI-powered, ATS-friendly résumé builder</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold tracking-tight text-slate-50">
                    Turn your experience into a{" "}
                    <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-emerald-300 bg-clip-text text-transparent">
                      world-class resume
                    </span>{" "}
                    in minutes.
                  </h1>
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                    Paste your career story. The builder structures it into a
                    professional, ATS-friendly layout you can refine, style, and
                    export as a pixel-perfect A4 PDF.
                  </p>
                  <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-[11px] font-medium">
                    <span className="px-2 sm:px-3 py-1 rounded-full bg-blue-500/20 text-blue-100 border border-blue-400/40">
                      ✓ ATS-optimized layout
                    </span>
                    <span className="px-2 sm:px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-100 border border-emerald-400/40">
                      ✓ A4 pixel-perfect PDF export
                    </span>
                    <span className="px-2 sm:px-3 py-1 rounded-full bg-slate-900 text-slate-100 border border-slate-700">
                      ✓ No design skills needed
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                    <div className="flex -space-x-2">
                      <span className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-gradient-to-br from-blue-500 to-sky-400 border border-slate-900" />
                      <span className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-gradient-to-br from-emerald-500 to-lime-400 border border-slate-900" />
                      <span className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border border-slate-900" />
                    </div>
                    <p className="text-xs sm:text-[11px] text-slate-400">
                      Used by developers, PMs, designers and students.
                    </p>
                  </div>
                </div>

                {/* Right hero image */}
                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-3xl" />
                  <div className="relative rounded-2xl border border-slate-700 bg-slate-950/80 shadow-2xl shadow-slate-950/80 overflow-hidden w-full max-w-md">
                    <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                      <div className="text-center p-6">
                        <FileText
                          size={48}
                          className="text-slate-400 mx-auto mb-4"
                        />
                        <p className="text-slate-300 font-semibold">
                          Professional Resume Preview
                        </p>
                        <p className="text-slate-500 text-sm mt-2">
                          Real-time A4 layout
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {/* Trust Building Section */}
            <section className="mb-12 sm:mb-16">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8 sm:mb-12">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-50 mb-3 sm:mb-4">
                    Trusted by Professionals Worldwide
                  </h2>
                  <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto">
                    Join thousands of users who have transformed their careers
                    with our AI-powered resume builder
                  </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {[
                    {
                      icon: Users,
                      number: "5,000+",
                      label: "Resumes Created",
                      color: "blue",
                    },
                    {
                      icon: Star,
                      number: "4.9/5",
                      label: "User Rating",
                      color: "amber",
                    },
                    {
                      icon: Clock,
                      number: "< 2min",
                      label: "Average Time",
                      color: "emerald",
                    },
                    {
                      icon: Globe,
                      number: "50+",
                      label: "Countries",
                      color: "purple",
                    },
                  ].map((stat, index) => (
                    <div
                      key={index}
                      className="text-center p-4 sm:p-6 rounded-2xl border border-slate-800 bg-slate-950/80 backdrop-blur-sm hover:border-slate-700 transition-all duration-300"
                    >
                      <div
                        className={`w-12 h-12 sm:w-14 sm:h-14 bg-${stat.color}-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4`}
                      >
                        <stat.icon
                          size={24}
                          className={`text-${stat.color}-400`}
                        />
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-slate-50 mb-1">
                        {stat.number}
                      </div>
                      <div className="text-xs sm:text-sm text-slate-400">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Testimonials */}
                <div className="mt-8 sm:mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {[
                    {
                      name: "Sarah Chen",
                      role: "Product Manager",
                      content:
                        "This platform helped me land my dream job at Google. The AI structuring is incredible!",
                      avatar:
                        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
                    },
                    {
                      name: "Marcus Rodriguez",
                      role: "Software Engineer",
                      content:
                        "From messy notes to professional resume in minutes. Best tool I've used!",
                      avatar:
                        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
                    },
                    {
                      name: "Emily Watson",
                      role: "UX Designer",
                      content:
                        "The templates are beautiful and ATS-friendly. Got 3 interviews in first week!",
                      avatar:
                        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
                    },
                  ].map((testimonial, index) => (
                    <div
                      key={index}
                      className="p-4 sm:p-6 rounded-2xl border border-slate-800 bg-slate-950/80 backdrop-blur-sm hover:border-slate-700 transition-all duration-300"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className="text-amber-400 fill-current"
                          />
                        ))}
                      </div>
                      <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                        "{testimonial.content}"
                      </p>
                      <div className="flex items-center gap-3">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <div className="font-semibold text-slate-50 text-sm">
                            {testimonial.name}
                          </div>
                          <div className="text-slate-400 text-xs">
                            {testimonial.role}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Input + Tips */}
            <section className="max-w-6xl mx-auto mb-12 sm:mb-16">
              <div className="grid lg:grid-cols-[0.95fr,1.05fr] gap-6 sm:gap-8">
                {/* Left info card */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-4 sm:p-7 shadow-xl shadow-slate-950/70 space-y-4 sm:space-y-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-slate-50">
                    Step 1 — Tell us about your career
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300">
                    Paste your work history, skills, projects, education and
                    achievements in any format. The AI will turn it into a
                    structured, professional résumé.
                  </p>
                  <div className="space-y-3 sm:space-y-4 text-xs text-slate-300">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-blue-400" />
                      <p>
                        Use short bullet points for responsibilities and
                        achievements. Example: "Improved API latency by 30%".
                      </p>
                    </div>
                    <div className="flex items-start gap-2 sm:gap-3">
                      <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      <p>
                        Include technologies, tools and frameworks for each
                        role. Example: React, Next.js, Node, AWS.
                      </p>
                    </div>
                    <div className="flex items-start gap-2 sm:gap-3">
                      <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-amber-400" />
                      <p>
                        Separate sections (Work, Skills, Education, Projects)
                        using blank lines to help the AI organize them.
                      </p>
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 sm:p-4 text-xs text-slate-300 space-y-2">
                    <p className="font-semibold text-slate-100">
                      How it works:
                    </p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Paste your raw experience and details.</li>
                      <li>AI structures everything into sections.</li>
                      <li>Customize content & styling in the editor.</li>
                      <li>Export a pixel-perfect A4 PDF.</li>
                    </ol>
                  </div>
                </div>

                {/* Right input card */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-4 sm:p-7 shadow-xl shadow-slate-950/70 space-y-4 sm:space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-50">
                        Paste your details to start
                      </h2>
                      <p className="text-xs text-slate-400 mt-1">
                        You can fully edit and polish your résumé in the next
                        step.
                      </p>
                    </div>
                    <button
                      onClick={handleLoadDummy}
                      className="px-3 sm:px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 hover:bg-slate-800 transition w-full sm:w-auto"
                    >
                      Load sample content
                    </button>
                  </div>
                  <textarea
                    value={freeFormInput}
                    onChange={(e) => setFreeFormInput(e.target.value)}
                    placeholder={`Example:\n\nSenior Software Engineer, TechCorp (2019 - Present)\n- Led a team of 3 developers building React/Next.js applications.\n- Improved API response times by 30%.\n- Worked with React, Next.js, Node, PostgreSQL, AWS.\n\nPrevious Role...\nSkills...\nEducation...\nProjects...`}
                    rows={12}
                    className="w-full px-3 sm:px-4 py-3 rounded-xl border border-slate-700 bg-slate-900/80 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-blue-500/60 font-mono text-xs sm:text-sm text-slate-100 shadow-inner resize-vertical"
                  />
                  <button
                    onClick={handleGenerate}
                    disabled={!freeFormInput.trim() || isGenerating}
                    className={`group relative inline-flex items-center justify-center gap-2 w-full rounded-xl px-4 sm:px-6 py-3 text-sm sm:text-base font-semibold tracking-wide transition-all ${
                      !freeFormInput.trim() || isGenerating
                        ? "cursor-not-allowed bg-slate-700 text-slate-400"
                        : "bg-gradient-to-r from-blue-500 via-sky-400 to-emerald-400 text-slate-950 shadow-lg hover:shadow-blue-800/60 hover:scale-[1.01]"
                    }`}
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                        <span>Generating…</span>
                      </>
                    ) : (
                      <>
                        <Sparkles
                          size={18}
                          className="group-hover:scale-110 transition-transform"
                        />
                        <span>Generate my resume</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </section>

            {/* Why use section */}
            <section className="mt-12 sm:mt-16 space-y-6 sm:space-y-8">
              <div className="text-center max-w-2xl mx-auto space-y-2 sm:space-y-3">
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-50 tracking-tight">
                  Why use this builder?
                </h2>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  Designed for speed and clarity. Go from raw career notes to a
                  clean, ATS-friendly résumé without wrestling with formatting.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[
                  {
                    title: "Fast AI Structuring",
                    desc: "Convert unformatted career notes into organized sections instantly.",
                    icon: <Sparkles size={20} className="text-blue-300" />,
                  },
                  {
                    title: "Live Styling Controls",
                    desc: "Adjust typography, spacing and layout without breaking the A4 preview.",
                    icon: <Palette size={20} className="text-emerald-300" />,
                  },
                  {
                    title: "Multiple Templates",
                    desc: "Switch between modern, minimal, classic and creative designs.",
                    icon: <FileText size={20} className="text-indigo-300" />,
                  },
                  {
                    title: "High-Quality PDF Export",
                    desc: "Generate pixel-perfect, professional PDF output ready for applications.",
                    icon: <Download size={20} className="text-pink-300" />,
                  },
                  {
                    title: "Privacy First",
                    desc: "Nothing stored server-side beyond payment verification; your data stays local.",
                    icon: <Edit3 size={20} className="text-slate-200" />,
                  },
                  {
                    title: "ATS Friendly Markup",
                    desc: "Structured content improves parsing in applicant tracking systems.",
                    icon: <FileText size={20} className="text-amber-300" />,
                  },
                ].map((f, i) => (
                  <div
                    key={i}
                    className="group relative rounded-xl border border-slate-800 bg-slate-950/80 backdrop-blur p-4 sm:p-5 shadow-sm hover:shadow-xl hover:border-sky-500/70 transition-shadow overflow-hidden"
                  >
                    <div className="flex items-start gap-3 relative z-10">
                      <div className="shrink-0 rounded-md bg-slate-900 p-2 shadow-inner border border-slate-700">
                        {f.icon}
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-sm font-semibold text-slate-50">
                          {f.title}
                        </h3>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {f.desc}
                        </p>
                      </div>
                    </div>
                    <div className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-blue-500/15 to-emerald-400/15" />
                  </div>
                ))}
              </div>
            </section>

            {/* Enhanced Contact Section */}
            <section className="mt-12 sm:mt-16" id="contact">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8 sm:mb-12">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-50 mb-3">
                    Get in Touch
                  </h2>
                  <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto">
                    Have questions or need assistance? We're here to help you
                    create the perfect resume.
                  </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
                  {/* Contact Info Cards */}
                  <div className="space-y-4 sm:space-y-6">
                    {[
                      {
                        icon: User,
                        title: "Your Expert",
                        content: "Afiq",
                        description: "Resume Specialist & Career Advisor",
                        color: "blue",
                        href: null,
                      },
                      {
                        icon: Mail,
                        title: "Email Us",
                        content: "afiq@cerouno.dev",
                        description: "We typically reply within 2 hours",
                        color: "emerald",
                        href: "mailto:afiq@cerouno.dev",
                      },
                      {
                        icon: Phone,
                        title: "Call/WhatsApp",
                        content: "+60142271936",
                        description: "Available 9AM - 6PM (GMT+8)",
                        color: "cyan",
                        href: "https://wa.me/60142271936",
                      },
                      {
                        icon: Heart,
                        title: "Support",
                        content: "24/7 Help Center",
                        description: "Comprehensive guides & documentation",
                        color: "pink",
                        href: "#",
                      },
                    ].map((item, index) => {
                      const Component = item.href ? "a" : "div";
                      return (
                        <Component
                          key={index}
                          href={item.href}
                          target={item.href ? "_blank" : undefined}
                          rel={item.href ? "noopener noreferrer" : undefined}
                          className="block p-4 sm:p-6 rounded-2xl border border-slate-800 bg-slate-950/80 hover:border-slate-700 hover:bg-slate-900/80 transition-all duration-300 group hover:scale-105"
                        >
                          <div className="flex items-start gap-4">
                            <div
                              className={`w-12 h-12 bg-${item.color}-500/20 rounded-2xl flex items-center justify-center border border-${item.color}-400/30 group-hover:bg-${item.color}-500/30 transition-colors`}
                            >
                              <item.icon
                                size={24}
                                className={`text-${item.color}-400`}
                              />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-slate-50 text-lg mb-1">
                                {item.title}
                              </h3>
                              <p className="text-slate-100 text-sm font-medium mb-2">
                                {item.content}
                              </p>
                              <p className="text-slate-400 text-xs">
                                {item.description}
                              </p>
                            </div>
                            {item.href && (
                              <ArrowRight
                                size={20}
                                className="text-slate-400 group-hover:text-slate-300 group-hover:translate-x-1 transition-all"
                              />
                            )}
                          </div>
                        </Component>
                      );
                    })}
                  </div>

                  {/* Contact Form/Info */}
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6 sm:p-8">
                    <h3 className="text-xl font-bold text-slate-50 mb-4">
                      Why Choose Us?
                    </h3>
                    <div className="space-y-4">
                      {[
                        "🎯 100% Satisfaction Guarantee",
                        "⚡ Instant AI Processing",
                        "🔒 Secure & Private",
                        "💼 Professional Templates",
                        "📱 Mobile Responsive",
                        "🌍 Global Support",
                      ].map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 text-slate-300"
                        >
                          <CheckCircle
                            size={16}
                            className="text-emerald-400 flex-shrink-0"
                          />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                      <div className="flex items-center gap-3">
                        <Shield size={20} className="text-emerald-400" />
                        <div>
                          <p className="text-slate-100 text-sm font-semibold">
                            Secure & Trusted
                          </p>
                          <p className="text-slate-400 text-xs">
                            Your data is protected with enterprise-grade
                            security
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-center gap-4 text-slate-400">
                      <Award size={20} className="text-amber-400" />
                      <span className="text-sm">Certified Resume Experts</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* EDIT STEP */}
        {step === "edit" && resumeData && (
          <div className="space-y-8 sm:space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <button
                onClick={() => setStep("input")}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 hover:bg-slate-900 transition text-sm w-full sm:w-auto justify-center"
              >
                <span className="text-lg leading-none">&larr;</span>
                <span>Back</span>
              </button>
              <span className="text-[11px] font-medium text-slate-400 text-center sm:text-right">
                Customize your content and styling, then export a professional
                PDF.
              </span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-50 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                Templates
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {templates.map((template) => (
                  <button
                    key={template.value}
                    onClick={() => setSelectedTemplate(template.value)}
                    className={`group p-4 sm:p-5 rounded-xl border relative overflow-hidden text-left ${
                      selectedTemplate === template.value
                        ? "border-blue-500 bg-slate-950/90"
                        : "border-slate-800 bg-slate-950/80 hover:border-blue-400 hover:bg-slate-900/90"
                    }`}
                  >
                    <div className="absolute -top-12 -right-12 w-28 h-28 rounded-full bg-gradient-to-tr from-blue-500/25 to-emerald-500/20 blur-2xl" />
                    <div className="relative space-y-1">
                      <h4 className="font-semibold text-slate-50 text-sm flex items-center gap-2">
                        {template.label}
                        {selectedTemplate === template.value && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500 text-slate-950">
                            Active
                          </span>
                        )}
                      </h4>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        {template.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4 sm:gap-8">
              {showEditor && (
                <div className="col-span-12 lg:col-span-4 space-y-4 sm:space-y-6">
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-4 sm:p-5 shadow-lg shadow-slate-950/70">
                    <ResumeEditor data={resumeData} onUpdate={setResumeData} />
                  </div>
                </div>
              )}
              {showStyleControls && !showEditor && (
                <div className="col-span-12 lg:col-span-3 space-y-4 sm:space-y-6">
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-4 sm:p-5 shadow-lg shadow-slate-950/70">
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
                <div className="rounded-2xl border border-slate-800 bg-slate-950/90 shadow-2xl shadow-slate-950/70 p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 mb-3">
                    <div>
                      <p className="text-xs font-semibold text-slate-50">
                        Live A4 résumé preview
                      </p>
                      <p className="text-[11px] text-slate-400">
                        The scaling and A4 dimensions you see here are exactly
                        what the PDF will use.
                      </p>
                    </div>
                    <button
                      onClick={handleExportPDF}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-[11px] text-slate-100 hover:bg-slate-800 transition w-full sm:w-auto justify-center"
                    >
                      <Download size={13} />
                      Quick export
                    </button>
                  </div>
                  <div
                    ref={previewRef}
                    className="rounded-xl border border-slate-800 bg-slate-900/90 p-3 sm:p-4 max-w-full overflow-auto"
                  >
                    <ResumePreview
                      data={resumeData}
                      template={selectedTemplate}
                      style={resumeStyle}
                    />
                  </div>
                </div>
              </div>
              {/* Mobile editor + style controls */}
              <div className="col-span-12 space-y-4 sm:space-y-6 lg:hidden">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-4 sm:p-5 shadow-lg shadow-slate-950/70">
                  <ResumeEditor data={resumeData} onUpdate={setResumeData} />
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-4 sm:p-5 shadow-lg shadow-slate-950/70">
                  <StyleControls
                    style={resumeStyle}
                    onUpdate={setResumeStyle}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modals */}
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

      {/* Beautiful Footer */}
      <footer className="mt-20 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          {/* Main Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Brand Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-emerald-400 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/25">
                  <FileText className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white">
                    Resume<span className="text-blue-400">AI</span>
                  </h3>
                  <p className="text-slate-400">
                    Craft Your Career Masterpiece
                  </p>
                </div>
              </div>
              <p className="text-slate-300 text-lg leading-relaxed max-w-md">
                Transform your experience into a professional, ATS-friendly
                résumé that gets you hired. Powered by AI, perfected by design.
              </p>

              {/* Social Links */}
              <div className="flex gap-3">
                {[
                  {
                    icon: Mail,
                    href: "mailto:afiq@cerouno.dev",
                    color: "hover:bg-blue-500",
                    label: "Email",
                  },
                  {
                    icon: Phone,
                    href: "https://wa.me/60142271936",
                    color: "hover:bg-green-500",
                    label: "WhatsApp",
                  },
                  {
                    icon: Users,
                    href: "#",
                    color: "hover:bg-purple-500",
                    label: "Community",
                  },
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-slate-300 transition-all duration-300 hover:scale-110 group"
                  >
                    <social.icon size={20} />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                <Sparkles size={18} className="text-amber-400" />
                Product
              </h4>
              <ul className="space-y-3">
                {[
                  "Features",
                  "Templates",
                  "Examples",
                  "Pricing",
                  "Testimonials",
                ].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-slate-400 hover:text-blue-400 transition-all duration-300 flex items-center gap-2 group"
                    >
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                <Heart size={18} className="text-pink-400" />
                Support
              </h4>
              <ul className="space-y-3">
                {["Help Center", "Contact Us", "Privacy", "Terms", "FAQ"].map(
                  (item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-slate-400 hover:text-emerald-400 transition-all duration-300 flex items-center gap-2 group"
                      >
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        {item}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              {
                icon: Shield,
                text: "Secure & Private",
                color: "text-emerald-400",
              },
              { icon: Zap, text: "AI Powered", color: "text-amber-400" },
              { icon: Award, text: "Professional", color: "text-blue-400" },
              { icon: Clock, text: "Fast Results", color: "text-purple-400" },
            ].map((badge, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50"
              >
                <badge.icon size={20} className={badge.color} />
                <span className="text-slate-300 text-sm font-medium">
                  {badge.text}
                </span>
              </div>
            ))}
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-800 pt-8">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
              <div className="text-slate-400 text-sm">
                © {new Date().getFullYear()} ResumeAI by{" "}
                <a
                  href="https://cerouno.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline-offset-2 hover:underline transition-colors font-semibold"
                >
                  Cerouno
                </a>
                . Crafted with 💙 for your success.
              </div>

              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <span>Made with</span>
                <Sparkles size={14} className="text-amber-400" />
                <span>for job seekers worldwide</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* ✅ BACK TO TOP BUTTON - Yahan add kiya */}
      <BackToTop />
    </div>
  );
}

export default App;
