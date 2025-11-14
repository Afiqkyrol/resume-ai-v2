export const generateResumeFromFreeForm = (input) => {
  const lines = input.split("\n").filter((line) => line.trim());

  const resume = {
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      summary: "",
    },
    experience: [],
    education: [],
    skills: [],
    projects: [],
  };

  let currentSection = "none";
  let currentExperience = null;
  let currentEducation = null;
  let currentProject = null;

  for (const line of lines) {
    const lowerLine = line.toLowerCase();

    if (lowerLine.includes("name:") || lowerLine.includes("full name:")) {
      resume.personalInfo.fullName = line.split(":")[1]?.trim() || "";
      currentSection = "personal";
    } else if (lowerLine.includes("email:")) {
      resume.personalInfo.email = line.split(":")[1]?.trim() || "";
      currentSection = "personal";
    } else if (lowerLine.includes("phone:")) {
      resume.personalInfo.phone = line.split(":")[1]?.trim() || "";
      currentSection = "personal";
    } else if (
      lowerLine.includes("location:") &&
      currentSection === "personal"
    ) {
      resume.personalInfo.location = line.split(":")[1]?.trim() || "";
    } else if (lowerLine.includes("linkedin:")) {
      resume.personalInfo.linkedin = line.split(":")[1]?.trim() || "";
    } else if (lowerLine.includes("website:")) {
      resume.personalInfo.website = line.split(":")[1]?.trim() || "";
    } else if (lowerLine.includes("summary:") || lowerLine.includes("about:")) {
      resume.personalInfo.summary = line.split(":")[1]?.trim() || "";
      currentSection = "personal";
    } else if (
      lowerLine.includes("experience") ||
      lowerLine.includes("work history")
    ) {
      currentSection = "experience";
    } else if (lowerLine.includes("education")) {
      currentSection = "education";
    } else if (lowerLine.includes("skills")) {
      currentSection = "skills";
    } else if (lowerLine.includes("projects")) {
      currentSection = "projects";
    } else if (currentSection === "experience") {
      if (lowerLine.includes("company:") || lowerLine.includes("employer:")) {
        if (currentExperience) {
          resume.experience.push(currentExperience);
        }
        currentExperience = {
          id: Math.random().toString(36).substr(2, 9),
          company: line.split(":")[1]?.trim() || "",
          position: "",
          location: "",
          startDate: "",
          endDate: "",
          current: false,
          responsibilities: [],
        };
      } else if (currentExperience) {
        if (
          lowerLine.includes("position:") ||
          lowerLine.includes("title:") ||
          lowerLine.includes("role:")
        ) {
          currentExperience.position = line.split(":")[1]?.trim() || "";
        } else if (lowerLine.includes("location:")) {
          currentExperience.location = line.split(":")[1]?.trim() || "";
        } else if (
          lowerLine.includes("start:") ||
          lowerLine.includes("from:")
        ) {
          currentExperience.startDate = line.split(":")[1]?.trim() || "";
        } else if (lowerLine.includes("end:") || lowerLine.includes("to:")) {
          const endDate = line.split(":")[1]?.trim() || "";
          currentExperience.endDate = endDate;
          currentExperience.current =
            endDate.toLowerCase().includes("present") ||
            endDate.toLowerCase().includes("current");
        } else if (line.trim().startsWith("-") || line.trim().startsWith("•")) {
          currentExperience.responsibilities.push(
            line.replace(/^[-•]\s*/, "").trim()
          );
        }
      }
    } else if (currentSection === "education") {
      if (
        lowerLine.includes("university:") ||
        lowerLine.includes("school:") ||
        lowerLine.includes("institution:")
      ) {
        if (currentEducation) {
          resume.education.push(currentEducation);
        }
        currentEducation = {
          id: Math.random().toString(36).substr(2, 9),
          institution: line.split(":")[1]?.trim() || "",
          degree: "",
          field: "",
          location: "",
          graduationDate: "",
        };
      } else if (currentEducation) {
        if (lowerLine.includes("degree:")) {
          currentEducation.degree = line.split(":")[1]?.trim() || "";
        } else if (
          lowerLine.includes("field:") ||
          lowerLine.includes("major:")
        ) {
          currentEducation.field = line.split(":")[1]?.trim() || "";
        } else if (lowerLine.includes("location:")) {
          currentEducation.location = line.split(":")[1]?.trim() || "";
        } else if (
          lowerLine.includes("graduation:") ||
          lowerLine.includes("graduated:")
        ) {
          currentEducation.graduationDate = line.split(":")[1]?.trim() || "";
        } else if (lowerLine.includes("gpa:")) {
          currentEducation.gpa = line.split(":")[1]?.trim() || "";
        }
      }
    } else if (currentSection === "skills") {
      const skillsList = line
        .split(/[,;]/)
        .map((s) => s.trim())
        .filter((s) => s && !s.toLowerCase().includes("skills"));
      skillsList.forEach((skill) => {
        if (skill && !skill.includes(":")) {
          resume.skills.push({
            id: Math.random().toString(36).substr(2, 9),
            name: skill,
            category: "General",
          });
        }
      });
    } else if (currentSection === "projects") {
      if (lowerLine.includes("project:") || lowerLine.includes("name:")) {
        if (currentProject) {
          resume.projects.push(currentProject);
        }
        currentProject = {
          id: Math.random().toString(36).substr(2, 9),
          name: line.split(":")[1]?.trim() || "",
          description: "",
          technologies: [],
          link: "",
        };
      } else if (currentProject) {
        if (lowerLine.includes("description:")) {
          currentProject.description = line.split(":")[1]?.trim() || "";
        } else if (
          lowerLine.includes("technologies:") ||
          lowerLine.includes("tech:")
        ) {
          currentProject.technologies =
            line
              .split(":")[1]
              ?.split(",")
              .map((t) => t.trim()) || [];
        } else if (lowerLine.includes("link:") || lowerLine.includes("url:")) {
          currentProject.link = line.split(":")[1]?.trim() || "";
        }
      }
    }
  }

  if (currentExperience) resume.experience.push(currentExperience);
  if (currentEducation) resume.education.push(currentEducation);
  if (currentProject) resume.projects.push(currentProject);

  console.log(resume);

  return resume;
};
