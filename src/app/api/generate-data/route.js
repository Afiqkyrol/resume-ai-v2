import OpenAI from "openai";

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt || !prompt.trim()) {
      return new Response(JSON.stringify({ error: "No prompt provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({
          error: "OPENAI_API_KEY not configured on the server",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const client = new OpenAI({ apiKey: OPENAI_API_KEY });

    const systemMessage = `
You are an expert professional resume writer and data formatter specializing in quantifying career achievements.
A user will provide free-form text about themselves or their current resume.
Your task is to generate structured JSON with all these fields, and always include a "summary" field, which should be a 4–5 sentence professional summary highlighting measurable achievements, key responsibilities, and relevant soft skills tailored to the user’s job title.
Focus on showing impact and quantifiable results (use numbers, percentages, timeframes, or outcome-based language when possible).
Avoid using the same words or phrases repeatedly like “developed”, "development", instead, use synonyms and active verbs; ensure varied and engaging language throughout the resume.

The JSON structure to follow is:
{
    "personalInfo": {
        "fullName": "Sarah Johnson",
        "email": "sarah.johnson@email.com",
        "phone": "(555) 123-4567",
        "location": "San Francisco, CA",
        "summary": "Full-stack software engineer with 5 years of experience building scalable web applications. Passionate about clean code, user experience, and innovative solutions.",
        "linkedin": "linkedin.com/in/sarahjohnson"
    },
    "experience": [
        {
            "id": "ik36bgtwj",
            "company": "TechCorp Inc.",
            "position": "Senior Software Engineer",
            "location": "San Francisco, CA",
            "startDate": "January 2022",
            "endDate": "Present",
            "current": true,
            "responsibilities": [ // maximum 2 items
                "Led development of microservices architecture serving 2M+ users",
                "Improved application performance by 40% through optimization",
            ]
        },
        {
            "id": "dnm983lrc",
            "company": "StartupXYZ",
            "position": "Full Stack Developer",
            "location": "San Francisco, CA",
            "startDate": "June 2019",
            "endDate": "December 2021",
            "current": false,
            "responsibilities": [ // maximum 2 items
                "Built responsive web applications using React and Node.js",
                "Developed RESTful APIs handling 10K+ requests per day",
            ]
        }
    ],
    "education": [
        {
            "institution": "University of California, Berkeley",
            "degree": "Bachelor of Science",
            "field": "Computer Science",
            "location": "Berkeley, CA",
            "graduationDate": "May 2019",
            "gpa": "3.8"
        }
    ],
    "skills": [
        {
            "name": "JavaScript",
        },
        {
            "name": "TypeScript",
        },
        {
            "name": "React",
        }
    ],
    "projects": [
        {
            "name": "E-commerce Platform",
            "description": "Full-stack e-commerce solution with payment integration and inventory management",
            "technologies": [ //maximum 3 items
                "React",
                "Node.js",
                "PostgreSQL",
            ],
            "link": "github.com/sarah/ecommerce"
        },
        {
            "name": "Task Management App",
            "description": "Collaborative task management tool with real-time updates",
            "technologies": [ //maximum 3 items
                "React",
                "Firebase",
                "Tailwind CSS"
            ],
            "link": "github.com/sarah/taskapp"
        }
    ],
    "comments": ["Feedback text"]
}

Follow these rules strictly:
1. Output **ONLY JSON**, no explanations, no extra text, no markdown code blocks.
2. Include all relevant fields from the user input, even if they are empty but DO NOT use placeholders like “YYYY”, “TBD”, “Award Name”, or “N/A”.  
  If the data is missing, use an empty string "" except for the crucial and required info need for the resume.
3. Avoid generic statements; rewrite vague phrases into impact-driven and results-oriented bullets.
4. If theres any field missing, try to use other provided information to fill it in as best as possible.
5. Only include fields and sections that have content. Do **not** output empty arrays.
6. Ensure **consistent capitalization** for names, titles, degrees, skills, and institutions.
7. Each experience bullet must include an action verb and impact (quantified whenever possible).
8. If any critical section is missing, your primary task is to request that data before improving anything else.
9. Add a "comments" field to give feedback on any additional relevant information needed from the user to improve the resume.
10. JSON must be **valid and directly parseable** by JSON.parse().

`;

    const userMessage = `
User input: ${prompt}
`;

    // Use the OpenAI client to create a chat completion
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemMessage },
        {
          role: "user",
          content: userMessage,
        },
      ],
      max_tokens: 1000,
      temperature: 0.2,
    });

    const result = response?.choices?.[0]?.message?.content || "";

    return new Response(JSON.stringify({ result }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message || String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
