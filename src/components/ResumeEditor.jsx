"use client";

import { useState } from 'react';
import { Pencil, Plus, Trash2, Save, X } from 'lucide-react';

export const ResumeEditor = ({ data, onUpdate }) => {
  const [editingSection, setEditingSection] = useState(null);
  const [tempData, setTempData] = useState(data);

  const handleSave = () => {
    onUpdate(tempData);
    setEditingSection(null);
  };

  const handleCancel = () => {
    setTempData(data);
    setEditingSection(null);
  };

  const updatePersonalInfo = (field, value) => {
    setTempData({
      ...tempData,
      personalInfo: { ...tempData.personalInfo, [field]: value }
    });
  };

  const addExperience = () => {
    setTempData({
      ...tempData,
      experience: [
        ...tempData.experience,
        {
          id: Math.random().toString(36).substr(2, 9),
          company: '',
          position: '',
          location: '',
          startDate: '',
          endDate: '',
          current: false,
          responsibilities: ['']
        }
      ]
    });
  };

  const updateExperience = (id, field, valu) => {
    setTempData({
      ...tempData,
      experience: tempData.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    });
  };

  const deleteExperience = (id) => {
    setTempData({
      ...tempData,
      experience: tempData.experience.filter(exp => exp.id !== id)
    });
  };

  const addResponsibility = (expId) => {
    setTempData({
      ...tempData,
      experience: tempData.experience.map(exp =>
        exp.id === expId ? { ...exp, responsibilities: [...exp.responsibilities, ''] } : exp
      )
    });
  };

  const updateResponsibility = (expId, index, value) => {
    setTempData({
      ...tempData,
      experience: tempData.experience.map(exp =>
        exp.id === expId
          ? {
              ...exp,
              responsibilities: exp.responsibilities.map((resp, i) => (i === index ? value : resp))
            }
          : exp
      )
    });
  };

  const deleteResponsibility = (expId, index) => {
    setTempData({
      ...tempData,
      experience: tempData.experience.map(exp =>
        exp.id === expId
          ? { ...exp, responsibilities: exp.responsibilities.filter((_, i) => i !== index) }
          : exp
      )
    });
  };

  const addEducation = () => {
    setTempData({
      ...tempData,
      education: [
        ...tempData.education,
        {
          id: Math.random().toString(36).substr(2, 9),
          institution: '',
          degree: '',
          field: '',
          location: '',
          graduationDate: '',
          gpa: ''
        }
      ]
    });
  };

  const updateEducation = (id, field, value) => {
    setTempData({
      ...tempData,
      education: tempData.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    });
  };

  const deleteEducation = (id) => {
    setTempData({
      ...tempData,
      education: tempData.education.filter(edu => edu.id !== id)
    });
  };

  const addSkill = () => {
    setTempData({
      ...tempData,
      skills: [
        ...tempData.skills,
        {
          id: Math.random().toString(36).substr(2, 9),
          name: '',
          category: 'General'
        }
      ]
    });
  };

  const updateSkill = (id, value) => {
    setTempData({
      ...tempData,
      skills: tempData.skills.map(skill =>
        skill.id === id ? { ...skill, name: value } : skill
      )
    });
  };

  const deleteSkill = (id) => {
    setTempData({
      ...tempData,
      skills: tempData.skills.filter(skill => skill.id !== id)
    });
  };

  const addProject = () => {
    setTempData({
      ...tempData,
      projects: [
        ...tempData.projects,
        {
          id: Math.random().toString(36).substr(2, 9),
          name: '',
          description: '',
          technologies: [],
          link: ''
        }
      ]
    });
  };

  const updateProject = (id, field, value) => {
    setTempData({
      ...tempData,
      projects: tempData.projects.map(proj =>
        proj.id === id ? { ...proj, [field]: value } : proj
      )
    });
  };

  const deleteProject = (id) => {
    setTempData({
      ...tempData,
      projects: tempData.projects.filter(proj => proj.id !== id)
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-h-[600px] overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Resume</h2>

      <div className="space-y-6">
        <div className="border-b pb-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
            {editingSection !== 'personal' && (
              <button
                onClick={() => setEditingSection('personal')}
                className="text-blue-600 hover:text-blue-700 p-2"
              >
                <Pencil size={18} />
              </button>
            )}
          </div>
          {editingSection === 'personal' ? (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Full Name"
                value={tempData.personalInfo.fullName}
                onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="Email"
                value={tempData.personalInfo.email}
                onChange={(e) => updatePersonalInfo('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Phone"
                value={tempData.personalInfo.phone}
                onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Location"
                value={tempData.personalInfo.location}
                onChange={(e) => updatePersonalInfo('location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="LinkedIn"
                value={tempData.personalInfo.linkedin || ''}
                onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Website"
                value={tempData.personalInfo.website || ''}
                onChange={(e) => updatePersonalInfo('website', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                placeholder="Summary"
                value={tempData.personalInfo.summary}
                onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex gap-2">
                <button onClick={handleSave} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                  <Save size={16} /> Save
                </button>
                <button onClick={handleCancel} className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
                  <X size={16} /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-600">
              <p><strong>Name:</strong> {data.personalInfo.fullName}</p>
              <p><strong>Email:</strong> {data.personalInfo.email}</p>
              <p><strong>Phone:</strong> {data.personalInfo.phone}</p>
            </div>
          )}
        </div>

        <div className="border-b pb-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-800">Experience</h3>
            {editingSection !== 'experience' ? (
              <button onClick={() => setEditingSection('experience')} className="text-blue-600 hover:text-blue-700 p-2">
                <Pencil size={18} />
              </button>
            ) : (
              <button onClick={addExperience} className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm">
                <Plus size={16} /> Add Experience
              </button>
            )}
          </div>
          {editingSection === 'experience' ? (
            <div className="space-y-4">
              {tempData.experience.map((exp, index) => (
                <div key={exp.id} className="border p-3 rounded bg-gray-50">
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-sm">Experience {index + 1}</span>
                    <button onClick={() => deleteExperience(exp.id)} className="text-red-600 hover:text-red-700">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Position"
                      value={exp.position}
                      onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Company"
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Location"
                      value={exp.location}
                      onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Start Date"
                        value={exp.startDate}
                        onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                      <input
                        type="text"
                        placeholder="End Date"
                        value={exp.endDate}
                        onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={exp.current}
                        onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                        className="mr-2"
                      />
                      <label className="text-sm">Current Position</label>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold">Responsibilities</span>
                        <button
                          onClick={() => addResponsibility(exp.id)}
                          className="text-blue-600 hover:text-blue-700 text-xs flex items-center gap-1"
                        >
                          <Plus size={14} /> Add
                        </button>
                      </div>
                      {exp.responsibilities.map((resp, respIndex) => (
                        <div key={respIndex} className="flex gap-2 mb-2">
                          <textarea
                            value={resp}
                            onChange={(e) => updateResponsibility(exp.id, respIndex, e.target.value)}
                            rows={2}
                            className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                          <button
                            onClick={() => deleteResponsibility(exp.id, respIndex)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex gap-2">
                <button onClick={handleSave} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                  <Save size={16} /> Save
                </button>
                <button onClick={handleCancel} className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
                  <X size={16} /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-600">
              {data.experience.map((exp) => (
                <p key={exp.id}>{exp.position} at {exp.company}</p>
              ))}
            </div>
          )}
        </div>

        <div className="border-b pb-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-800">Education</h3>
            {editingSection !== 'education' ? (
              <button onClick={() => setEditingSection('education')} className="text-blue-600 hover:text-blue-700 p-2">
                <Pencil size={18} />
              </button>
            ) : (
              <button onClick={addEducation} className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm">
                <Plus size={16} /> Add Education
              </button>
            )}
          </div>
          {editingSection === 'education' ? (
            <div className="space-y-4">
              {tempData.education.map((edu, index) => (
                <div key={edu.id} className="border p-3 rounded bg-gray-50">
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-sm">Education {index + 1}</span>
                    <button onClick={() => deleteEducation(edu.id)} className="text-red-600 hover:text-red-700">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Institution"
                      value={edu.institution}
                      onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Degree"
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Field of Study"
                      value={edu.field}
                      onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Location"
                      value={edu.location}
                      onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Graduation Date"
                      value={edu.graduationDate}
                      onChange={(e) => updateEducation(edu.id, 'graduationDate', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <input
                      type="text"
                      placeholder="GPA (optional)"
                      value={edu.gpa || ''}
                      onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                </div>
              ))}
              <div className="flex gap-2">
                <button onClick={handleSave} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                  <Save size={16} /> Save
                </button>
                <button onClick={handleCancel} className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
                  <X size={16} /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-600">
              {data.education.map((edu) => (
                <p key={edu.id}>{edu.degree} in {edu.field} - {edu.institution}</p>
              ))}
            </div>
          )}
        </div>

        <div className="border-b pb-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-800">Skills</h3>
            {editingSection !== 'skills' ? (
              <button onClick={() => setEditingSection('skills')} className="text-blue-600 hover:text-blue-700 p-2">
                <Pencil size={18} />
              </button>
            ) : (
              <button onClick={addSkill} className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm">
                <Plus size={16} /> Add Skill
              </button>
            )}
          </div>
          {editingSection === 'skills' ? (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {tempData.skills.map((skill) => (
                  <div key={skill.id} className="flex items-center gap-1 bg-gray-50 border rounded px-2 py-1">
                    <input
                      type="text"
                      value={skill.name}
                      onChange={(e) => updateSkill(skill.id, e.target.value)}
                      className="w-32 px-2 py-1 border-0 bg-transparent text-sm focus:outline-none"
                    />
                    <button onClick={() => deleteSkill(skill.id)} className="text-red-600 hover:text-red-700">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={handleSave} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                  <Save size={16} /> Save
                </button>
                <button onClick={handleCancel} className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
                  <X size={16} /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-600 flex flex-wrap gap-2">
              {data.skills.map((skill) => (
                <span key={skill.id} className="bg-gray-100 px-2 py-1 rounded">{skill.name}</span>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-800">Projects</h3>
            {editingSection !== 'projects' ? (
              <button onClick={() => setEditingSection('projects')} className="text-blue-600 hover:text-blue-700 p-2">
                <Pencil size={18} />
              </button>
            ) : (
              <button onClick={addProject} className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm">
                <Plus size={16} /> Add Project
              </button>
            )}
          </div>
          {editingSection === 'projects' ? (
            <div className="space-y-4">
              {tempData.projects.map((project, index) => (
                <div key={project.id} className="border p-3 rounded bg-gray-50">
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-sm">Project {index + 1}</span>
                    <button onClick={() => deleteProject(project.id)} className="text-red-600 hover:text-red-700">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Project Name"
                      value={project.name}
                      onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <textarea
                      placeholder="Description"
                      value={project.description}
                      onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                      rows={2}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Technologies (comma-separated)"
                      value={project.technologies.join(', ')}
                      onChange={(e) => updateProject(project.id, 'technologies', e.target.value.split(',').map((t) => t.trim()))}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Link (optional)"
                      value={project.link || ''}
                      onChange={(e) => updateProject(project.id, 'link', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                </div>
              ))}
              <div className="flex gap-2">
                <button onClick={handleSave} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                  <Save size={16} /> Save
                </button>
                <button onClick={handleCancel} className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
                  <X size={16} /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-600">
              {data.projects.map((project) => (
                <p key={project.id}>{project.name}</p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
