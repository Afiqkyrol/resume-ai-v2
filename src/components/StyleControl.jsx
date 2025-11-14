export const StyleControls = ({ style, onUpdate }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Styling Options
      </h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Font Size: {style.fontSize}px
        </label>
        <input
          type="range"
          min="8"
          max="16"
          step="1"
          value={style.fontSize}
          onChange={(e) =>
            onUpdate({ ...style, fontSize: parseInt(e.target.value) })
          }
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Line Height: {style.lineHeight.toFixed(1)}
        </label>
        <input
          type="range"
          min="1.2"
          max="2"
          step="0.1"
          value={style.lineHeight}
          onChange={(e) =>
            onUpdate({ ...style, lineHeight: parseFloat(e.target.value) })
          }
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Section Spacing: {style.sectionSpacing}px
        </label>
        <input
          type="range"
          min="8"
          max="40"
          step="4"
          value={style.sectionSpacing}
          onChange={(e) =>
            onUpdate({ ...style, sectionSpacing: parseInt(e.target.value) })
          }
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Content Padding: {style.contentPadding}px
        </label>
        <input
          type="range"
          min="20"
          max="60"
          step="5"
          value={style.contentPadding}
          onChange={(e) =>
            onUpdate({ ...style, contentPadding: parseInt(e.target.value) })
          }
          className="w-full"
        />
      </div>
    </div>
  );
};
