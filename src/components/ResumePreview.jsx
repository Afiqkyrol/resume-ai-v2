"use client";

import { useEffect, useRef, useState } from "react";
import { ModernTemplate } from "./templates/ModernTemplate";
import { ClassicTemplate } from "./templates/ClassicTemplate";
import { MinimalTemplate } from "./templates/MinimalTemplate";
import { CreativeTemplate } from "./templates/CreativeTemplate";
import { AlertCircle } from "lucide-react";

const A4_HEIGHT_PX = 1123;

export const ResumePreview = ({ data, template, style }) => {
  const previewRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    if (previewRef.current) {
      const height = previewRef.current.scrollHeight;
      const numPages = Math.ceil(height / A4_HEIGHT_PX);
      setPages(numPages);
      setIsOverflowing(numPages > 1);
    }
  }, [data, template, style]);

  const renderTemplate = () => {
    switch (template) {
      case "modern":
        return <ModernTemplate data={data} style={style} />;
      case "classic":
        return <ClassicTemplate data={data} style={style} />;
      case "minimal":
        return <MinimalTemplate data={data} style={style} />;
      case "creative":
        return <CreativeTemplate data={data} style={style} />;
      default:
        return <ModernTemplate data={data} style={style} />;
    }
  };

  return (
    <div className="relative">
      {isOverflowing && (
        <div className="mb-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <div className="flex items-start">
            <AlertCircle
              className="text-yellow-600 mr-3 flex-shrink-0"
              size={20}
            />
            <div>
              <p className="text-yellow-800 font-semibold">
                Resume exceeds 1 page
              </p>
              <p className="text-yellow-700 text-sm mt-1">
                Your resume is currently {pages} pages. Consider reducing
                content or adjusting spacing to fit on one page.
              </p>
            </div>
          </div>
        </div>
      )}

      <div
        className="bg-gray-100 p-8 rounded-lg shadow-inner overflow-y-auto"
        style={{ maxHeight: "800px" }}
      >
        <div
          ref={previewRef}
          className="mx-auto shadow-2xl"
          style={{
            width: "794px",
            minHeight: `${A4_HEIGHT_PX}px`,
            position: "relative",
          }}
        >
          <div className="relative">
            {renderTemplate()}
            {pages > 1 && (
              <div
                className="absolute left-0 right-0 border-t-2 border-red-500 border-dashed"
                style={{ top: `${A4_HEIGHT_PX}px` }}
              >
                <span className="absolute right-0 -top-6 bg-red-500 text-white text-xs px-2 py-1 rounded">
                  Page break
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
