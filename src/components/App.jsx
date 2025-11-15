"use client";

import { useState, useRef } from "react";
import { generateResumeFromFreeForm } from "../services/resumeGenerator";
import { exportToPDF, exportToPdfServer } from "../services/pdfExport";
import { dummyFreeFormInput } from "../data/dummyData";
import { FileText, Sparkles, Download, Edit3, Palette } from "lucide-react";
import { ResumePreview } from "./ResumePreview";
import { ResumeEditor } from "./ResumeEditor";
import { StyleControls } from "./StyleControl";

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-3">
            <FileText size={40} className="text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              AI Resume Builder
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Generate professional resumes from free-form text
          </p>
        </header>

        {step === "input" && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Enter Your Information
                </h2>
                <button
                  onClick={handleLoadDummy}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                >
                  Load Sample Data
                </button>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-4">
                  Paste your resume information in any format. Include sections
                  like: Experience, Education, Skills, Projects, etc.
                </p>
                <textarea
                  value={freeFormInput}
                  onChange={(e) => setFreeFormInput(e.target.value)}
                  placeholder="Example: I'm a software engineer with 5 years of experience in React and Node.js. I worked at TechCorp as a Senior Developer and led a team of 3 people. I have a Bachelor's in Computer Science..."
                  rows={20}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={!freeFormInput.trim()}
                className={` ${
                  isGenerating ? "cursor-not-allowed " : " hover:bg-blue-700"
                } w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-lg font-semibold`}
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    Generate Resume
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {step === "edit" && resumeData && (
          <div>
            <div className="mb-6 flex justify-between items-center">
              <button
                onClick={() => setStep("input")}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                ← Back to Input
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowStyleControls(!showStyleControls);
                    setShowEditor(false);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    showStyleControls
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <Palette size={18} />
                  Style
                </button>
                <button
                  onClick={() => {
                    setShowEditor(!showEditor);
                    setShowStyleControls(false);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    showEditor
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <Edit3 size={18} />
                  Edit Content
                </button>
                <button
                  onClick={handleExportPDF}
                  className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                >
                  <Download size={18} />
                  Export PDF
                </button>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Choose Template
              </h3>
              <div className="grid grid-cols-4 gap-4">
                {templates.map((template) => (
                  <button
                    key={template.value}
                    onClick={() => setSelectedTemplate(template.value)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedTemplate === template.value
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 bg-white hover:border-blue-300"
                    }`}
                  >
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {template.label}
                    </h4>
                    <p className="text-xs text-gray-600">
                      {template.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
              {showEditor && (
                <div className="col-span-4">
                  <ResumeEditor data={resumeData} onUpdate={setResumeData} />
                </div>
              )}

              {showStyleControls && !showEditor && (
                <div className="col-span-3">
                  <StyleControls
                    style={resumeStyle}
                    onUpdate={setResumeStyle}
                  />
                </div>
              )}

              <div
                className={
                  showEditor
                    ? "col-span-8"
                    : showStyleControls
                    ? "col-span-9"
                    : "col-span-12"
                }
              >
                <div ref={previewRef}>
                  <ResumePreview
                    data={resumeData}
                    template={selectedTemplate}
                    style={resumeStyle}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
