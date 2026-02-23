import { GoogleGenAI, Type } from "@google/genai";

export const CURRICULUM_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    degree: { type: Type.STRING },
    branch: { type: Type.STRING },
    specialization: { type: Type.STRING },
    semesters: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          semester: { type: Type.INTEGER },
          total_credits: { type: Type.INTEGER },
          analysis: { type: Type.STRING, description: "AI analysis specific to this semester's progression" },
          subjects: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                code: { type: Type.STRING },
                name: { type: Type.STRING },
                credits: { type: Type.INTEGER },
                type: { type: Type.STRING, description: "Core, Adaptive, Emerging, Elective, Non-Credit" },
                lab_required: { type: Type.BOOLEAN },
                future_scope: { type: Type.STRING },
                required_tools: { type: Type.ARRAY, items: { type: Type.STRING } },
                hours_per_week: { type: Type.INTEGER },
                future_jobs: { type: Type.ARRAY, items: { type: Type.STRING } },
                learning_outcomes: { type: Type.ARRAY, items: { type: Type.STRING } },
                units: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      topics: { type: Type.ARRAY, items: { type: Type.STRING } }
                    }
                  },
                  description: "Exactly 5 units with detailed topics"
                },
                suggested_projects: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                      difficulty: { type: Type.STRING }
                    }
                  }
                }
              },
              required: ["code", "name", "credits", "type", "hours_per_week", "future_jobs", "learning_outcomes", "units"]
            }
          }
        },
        required: ["semester", "total_credits", "subjects", "analysis"]
      }
    },
    total_credits: { type: Type.INTEGER },
    industry_score: { type: Type.INTEGER },
    sustainability_score: { type: Type.INTEGER },
    skill_mapping: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          skill: { type: Type.STRING },
          subjects: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      }
    },
    recommendations: { type: Type.STRING },
    explanation: { type: Type.STRING }
  },
  required: ["degree", "branch", "semesters", "total_credits", "industry_score", "sustainability_score"]
};

export async function generateCurriculum(params: any) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
  const { mode, details, file } = params;
  
  let prompt = "";
  const commonRules = `
    MANDATORY RULES:
    - For EVERY subject, provide EXACTLY 5 units with detailed topics.
    - Include hours_per_week, future_jobs, and learning_outcomes for each subject.
    - Provide a concise 'analysis' for EACH semester.
    - Provide a 'skill_mapping' showing which subjects contribute to which industry skills.
    - Output MUST be valid JSON. Avoid special control characters or unescaped backslashes in strings.
  `;

  if (mode === 'institutional') {
    prompt = `Generate a professional institutional curriculum for:
    Institution: ${details.institutionName}
    Accreditation: ${details.accreditationType}
    Degree: ${details.degreeType}
    Branch: ${details.branch || 'Engineering'}
    Specialization: ${details.specialization || 'None'}
    Duration: ${details.duration} years
    Total Credits: ${details.totalCredits}
    Industry Alignment Target: ${details.industryAlignment}%
    Include Internship: ${details.includeInternship}
    Include Capstone: ${details.includeCapstone}
    
    ${commonRules}
    - Include practical Lab subjects (1 credit).
    - Provide concise "future_scope" (career prospects).
    - Exactly 20 credits/semester.`;
  } else if (mode === 'corporate') {
    prompt = `Generate a Corporate Upskilling / Training Curriculum for:
    Target Role: ${details.targetRole}
    Company Context: ${details.companyContext}
    Current Skill Gap: ${details.skillGap}
    Industry Alignment: ${details.industryAlignment}%
    Specialization: ${details.specialization || 'None'}
    
    ${commonRules}
    - 4 semesters intensive.
    - Focus on "Emerging" & "Adaptive" types.`;
  } else {
    prompt = `Generate a student-focused external curriculum for:
    Degree: ${details.degreeType}
    Branch: ${details.branch}
    Specialization: ${details.specialization || 'None'}
    Industry Alignment: ${details.industryAlignment}%
    
    ${commonRules}
    - 8 Semesters, 20 Credits/Sem (160 Total).
    - Labs: 1 credit.
    - 1 Non-Credit Subject.
    - Progression: Foundation -> Advanced.`;
  }

  if (file) {
    prompt += `\n\nPlease use the attached file as context for the existing curriculum structure and subjects. Improve upon it based on the requirements above.`;
  }

  const contents: any = [{ parts: [{ text: prompt }] }];
  if (file) {
    contents[0].parts.push({
      inlineData: {
        data: file.data,
        mimeType: file.mimeType
      }
    });
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents,
    config: {
      responseMimeType: "application/json",
      responseSchema: CURRICULUM_SCHEMA,
    }
  });

  const text = response.text || "{}";
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Initial JSON parse failed, attempting cleanup...", e);
    // Clean common LLM JSON issues: markdown blocks, unescaped control chars
    const cleaned = text
      .replace(/```json\n?|```/g, "")
      .replace(/[\u0000-\u001F]+/g, " ") // Remove control characters
      .trim();
    try {
      return JSON.parse(cleaned);
    } catch (e2) {
      console.error("Cleanup parse failed:", e2);
      throw e2;
    }
  }
}
