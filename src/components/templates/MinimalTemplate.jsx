export const MinimalTemplate = ({ data, style }) => {
  return (
    <div
      className="bg-white text-gray-900"
      style={{
        fontSize: `${style.fontSize}px`,
        lineHeight: style.lineHeight,
        padding: `${style.contentPadding}px`,
      }}
    >
      <div className="mb-8">
        <h1 className="text-4xl font-light text-gray-900 mb-3">
          {data.personalInfo.fullName}
        </h1>
        <div className="text-sm text-gray-600 space-x-4">
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
          {data.personalInfo.location && (
            <span>{data.personalInfo.location}</span>
          )}
          {data.personalInfo.linkedin && (
            <span>{data.personalInfo.linkedin}</span>
          )}
          {data.personalInfo.website && (
            <span>{data.personalInfo.website}</span>
          )}
        </div>
      </div>

      {data.personalInfo.summary && (
        <div style={{ marginBottom: `${style.sectionSpacing}px` }}>
          <p className="text-gray-700 leading-relaxed">
            {data.personalInfo.summary}
          </p>
        </div>
      )}

      {data.experience.length > 0 && (
        <div style={{ marginBottom: `${style.sectionSpacing}px` }}>
          <h2 className="text-sm font-semibold text-gray-900 mb-4 tracking-widest uppercase">
            Experience
          </h2>
          {data.experience.map((exp) => (
            <div key={exp.id} className="mb-5">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                  {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{exp.company}</p>
              <ul className="space-y-1 text-gray-700">
                {exp.responsibilities.map((resp, idx) => (
                  <li key={idx} className="text-sm leading-relaxed">
                    • {resp}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {data.education.length > 0 && (
        <div style={{ marginBottom: `${style.sectionSpacing}px` }}>
          <h2 className="text-sm font-semibold text-gray-900 mb-4 tracking-widest uppercase">
            Education
          </h2>
          {data.education.map((edu) => (
            <div key={edu.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {edu.degree} in {edu.field}
                  </h3>
                  <p className="text-sm text-gray-600">{edu.institution}</p>
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                  {edu.graduationDate}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {data.skills.length > 0 && (
        <div style={{ marginBottom: `${style.sectionSpacing}px` }}>
          <h2 className="text-sm font-semibold text-gray-900 mb-4 tracking-widest uppercase">
            Skills
          </h2>
          <div className="text-sm text-gray-700 leading-relaxed">
            {data.skills.map((s) => s.name).join(", ")}
          </div>
        </div>
      )}

      {data.projects.length > 0 && (
        <div style={{ marginBottom: `${style.sectionSpacing}px` }}>
          <h2 className="text-sm font-semibold text-gray-900 mb-4 tracking-widest uppercase">
            Projects
          </h2>
          {data.projects.map((project) => (
            <div key={project.id} className="mb-4">
              <h3 className="font-semibold text-gray-900">{project.name}</h3>
              <p className="text-sm text-gray-700 mb-1">
                {project.description}
              </p>
              <p className="text-xs text-gray-500">
                {project.technologies.join(" • ")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
