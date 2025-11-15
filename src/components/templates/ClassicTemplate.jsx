import generateUniqueIds from "@/app/lib/generateUniqueIds";

export const ClassicTemplate = ({ data, style }) => {
  const experienceWithIds = generateUniqueIds(data.experience);
  const educationWithIds = generateUniqueIds(data.education);
  const skillsWithIds = generateUniqueIds(data.skills);
  const projectsWithIds = generateUniqueIds(data.projects);

  data.experience = experienceWithIds;
  data.education = educationWithIds;
  data.skills = skillsWithIds;
  data.projects = projectsWithIds;

  return (
    <div
      className="bg-white text-gray-800"
      style={{
        fontSize: `${style.fontSize}px`,
        lineHeight: style.lineHeight,
        padding: `${style.contentPadding}px`,
      }}
    >
      <div className="text-center mb-6 border-b-2 border-gray-800 pb-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {data.personalInfo.fullName}
        </h1>
        <div className="text-sm text-gray-700 space-x-3">
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>|</span>}
          {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
          {data.personalInfo.location && <span>|</span>}
          {data.personalInfo.location && (
            <span>{data.personalInfo.location}</span>
          )}
        </div>
        {(data.personalInfo.linkedin || data.personalInfo.website) && (
          <div className="text-sm text-gray-600 space-x-3 mt-1">
            {data.personalInfo.linkedin && (
              <span>{data.personalInfo.linkedin}</span>
            )}
            {data.personalInfo.website && data.personalInfo.linkedin && (
              <span>|</span>
            )}
            {data.personalInfo.website && (
              <span>{data.personalInfo.website}</span>
            )}
          </div>
        )}
      </div>

      {data.personalInfo.summary && (
        <div style={{ marginBottom: `${style.sectionSpacing}px` }}>
          <h2 className="text-lg font-bold text-gray-900 mb-2 border-b border-gray-400 pb-1">
            PROFESSIONAL SUMMARY
          </h2>
          <p className="text-gray-700">{data.personalInfo.summary}</p>
        </div>
      )}

      {data.experience.length > 0 && (
        <div style={{ marginBottom: `${style.sectionSpacing}px` }}>
          <h2 className="text-lg font-bold text-gray-900 mb-2 border-b border-gray-400 pb-1">
            PROFESSIONAL EXPERIENCE
          </h2>
          {data.experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between mb-1">
                <h3 className="font-bold text-gray-900">{exp.position}</h3>
                <span className="text-sm text-gray-600 whitespace-nowrap">
                  {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                </span>
              </div>
              <p className="text-gray-700 italic mb-2">
                {exp.company} {exp.location && `• ${exp.location}`}
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {exp.responsibilities.map((resp, idx) => (
                  <li key={idx}>{resp}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {data.education.length > 0 && (
        <div style={{ marginBottom: `${style.sectionSpacing}px` }}>
          <h2 className="text-lg font-bold text-gray-900 mb-2 border-b border-gray-400 pb-1">
            EDUCATION
          </h2>
          {data.education.map((edu) => (
            <div key={edu.id} className="mb-3">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-bold text-gray-900">
                    {edu.degree} in {edu.field}
                  </h3>
                  <p className="text-gray-700">
                    {edu.institution} {edu.location && `• ${edu.location}`}
                  </p>
                  {edu.gpa && (
                    <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>
                  )}
                </div>
                <span className="text-sm text-gray-600 whitespace-nowrap">
                  {edu.graduationDate}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {data.skills.length > 0 && (
        <div style={{ marginBottom: `${style.sectionSpacing}px` }}>
          <h2 className="text-lg font-bold text-gray-900 mb-2 border-b border-gray-400 pb-1">
            SKILLS
          </h2>
          <p className="text-gray-700">
            {data.skills.map((s) => s.name).join(" • ")}
          </p>
        </div>
      )}

      {data.projects.length > 0 && (
        <div style={{ marginBottom: `${style.sectionSpacing}px` }}>
          <h2 className="text-lg font-bold text-gray-900 mb-2 border-b border-gray-400 pb-1">
            PROJECTS
          </h2>
          {data.projects.map((project) => (
            <div key={project.id} className="mb-3">
              <h3 className="font-bold text-gray-900">{project.name}</h3>
              <p className="text-gray-700 mb-1">{project.description}</p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Technologies:</span>{" "}
                {project.technologies.join(", ")}
              </p>
              {project.link && (
                <p className="text-sm text-gray-600">{project.link}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
