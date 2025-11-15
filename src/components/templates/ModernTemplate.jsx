import generateUniqueIds from "@/app/lib/generateUniqueIds";

export const ModernTemplate = ({ data, style }) => {
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
      <div className="border-l-4 border-blue-600 pl-6 mb-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {data.personalInfo.fullName}
        </h1>
        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>•</span>}
          {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
          {data.personalInfo.location && <span>•</span>}
          {data.personalInfo.location && (
            <span>{data.personalInfo.location}</span>
          )}
        </div>
        {(data.personalInfo.linkedin || data.personalInfo.website) && (
          <div className="flex flex-wrap gap-3 text-sm text-blue-600 mt-1">
            {data.personalInfo.linkedin && (
              <span>{data.personalInfo.linkedin}</span>
            )}
            {data.personalInfo.website && data.personalInfo.linkedin && (
              <span>•</span>
            )}
            {data.personalInfo.website && (
              <span>{data.personalInfo.website}</span>
            )}
          </div>
        )}
      </div>

      {data.personalInfo.summary && (
        <div style={{ marginBottom: `${style.sectionSpacing}px` }}>
          <h2 className="text-xl font-bold text-blue-600 mb-3 uppercase tracking-wide">
            Summary
          </h2>
          <p className="text-gray-700">{data.personalInfo.summary}</p>
        </div>
      )}

      {data.experience.length > 0 && (
        <div style={{ marginBottom: `${style.sectionSpacing}px` }}>
          <h2 className="text-xl font-bold text-blue-600 mb-3 uppercase tracking-wide">
            Experience
          </h2>
          {data.experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h3 className="font-bold text-gray-900">{exp.position}</h3>
                  <p className="text-gray-700">
                    {exp.company} {exp.location && `• ${exp.location}`}
                  </p>
                </div>
                <span className="text-sm text-gray-600 whitespace-nowrap ml-4">
                  {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                </span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2">
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
          <h2 className="text-xl font-bold text-blue-600 mb-3 uppercase tracking-wide">
            Education
          </h2>
          {data.education.map((edu) => (
            <div key={edu.id} className="mb-3">
              <div className="flex justify-between items-start">
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
                <span className="text-sm text-gray-600 whitespace-nowrap ml-4">
                  {edu.graduationDate}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {data.skills.length > 0 && (
        <div style={{ marginBottom: `${style.sectionSpacing}px` }}>
          <h2 className="text-xl font-bold text-blue-600 mb-3 uppercase tracking-wide">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill) => (
              <span
                key={skill.id}
                className="bg-gray-100 px-3 py-1 rounded text-gray-700"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {data.projects.length > 0 && (
        <div style={{ marginBottom: `${style.sectionSpacing}px` }}>
          <h2 className="text-xl font-bold text-blue-600 mb-3 uppercase tracking-wide">
            Projects
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
                <p className="text-sm text-blue-600">{project.link}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
