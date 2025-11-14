export const CreativeTemplate = ({ data, style }) => {
  return (
    <div
      className="bg-white"
      style={{
        fontSize: `${style.fontSize}px`,
        lineHeight: style.lineHeight,
        padding: `${style.contentPadding}px`,
      }}
    >
      <div className="flex gap-6">
        <div className="w-1/3 bg-gray-800 text-white p-6 -m-8 mr-0">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2 break-words">
              {data.personalInfo.fullName}
            </h1>
          </div>

          <div className="mb-8">
            <h2 className="text-sm font-bold mb-3 text-gray-300 uppercase tracking-wider">
              Contact
            </h2>
            <div className="space-y-2 text-sm">
              {data.personalInfo.email && (
                <p className="break-words">{data.personalInfo.email}</p>
              )}
              {data.personalInfo.phone && <p>{data.personalInfo.phone}</p>}
              {data.personalInfo.location && (
                <p>{data.personalInfo.location}</p>
              )}
              {data.personalInfo.linkedin && (
                <p className="break-words text-gray-300">
                  {data.personalInfo.linkedin}
                </p>
              )}
              {data.personalInfo.website && (
                <p className="break-words text-gray-300">
                  {data.personalInfo.website}
                </p>
              )}
            </div>
          </div>

          {data.skills.length > 0 && (
            <div className="mb-8">
              <h2 className="text-sm font-bold mb-3 text-gray-300 uppercase tracking-wider">
                Skills
              </h2>
              <div className="space-y-2">
                {data.skills.map((skill) => (
                  <div key={skill.id} className="text-sm">
                    <span className="text-white">{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.education.length > 0 && (
            <div>
              <h2 className="text-sm font-bold mb-3 text-gray-300 uppercase tracking-wider">
                Education
              </h2>
              {data.education.map((edu) => (
                <div key={edu.id} className="mb-4 text-sm">
                  <h3 className="font-bold text-white mb-1">{edu.degree}</h3>
                  <p className="text-gray-300">{edu.field}</p>
                  <p className="text-gray-400 text-xs mt-1">
                    {edu.institution}
                  </p>
                  <p className="text-gray-400 text-xs">{edu.graduationDate}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 pt-8">
          {data.personalInfo.summary && (
            <div style={{ marginBottom: `${style.sectionSpacing}px` }}>
              <h2 className="text-lg font-bold text-gray-800 mb-3">About Me</h2>
              <p className="text-gray-700 leading-relaxed">
                {data.personalInfo.summary}
              </p>
            </div>
          )}

          {data.experience.length > 0 && (
            <div style={{ marginBottom: `${style.sectionSpacing}px` }}>
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                Experience
              </h2>
              {data.experience.map((exp) => (
                <div
                  key={exp.id}
                  className="mb-5 relative pl-4 border-l-2 border-gray-800"
                >
                  <div className="mb-1">
                    <h3 className="font-bold text-gray-900">{exp.position}</h3>
                    <p className="text-gray-700 text-sm">{exp.company}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                    </p>
                  </div>
                  <ul className="space-y-1 text-gray-700 mt-2">
                    {exp.responsibilities.map((resp, idx) => (
                      <li key={idx} className="text-sm">
                        • {resp}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {data.projects.length > 0 && (
            <div style={{ marginBottom: `${style.sectionSpacing}px` }}>
              <h2 className="text-lg font-bold text-gray-800 mb-4">Projects</h2>
              {data.projects.map((project) => (
                <div key={project.id} className="mb-4">
                  <h3 className="font-bold text-gray-900">{project.name}</h3>
                  <p className="text-sm text-gray-700 mt-1">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-gray-800 text-white px-2 py-1 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
