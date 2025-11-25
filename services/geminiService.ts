import { GoogleGenAI, Type } from "@google/genai";
import { UserData, LifeExpectancyResult } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const calculateLifeExpectancy = async (data: UserData): Promise<LifeExpectancyResult> => {
  if (!data.birthDate) {
    throw new Error("Birth date is required");
  }

  const birthDate = new Date(data.birthDate);
  const now = new Date();
  const ageInMillis = now.getTime() - birthDate.getTime();
  const currentAge = ageInMillis / (1000 * 60 * 60 * 24 * 365.25);

  // Default fallback if API fails or key is missing
  const fallbackAge = 80;

  try {
    const prompt = `
      Act as a medical actuary and human life analyst.
      Based on the following user data, estimate life expectancy and map out significant biological, psychological, and sociological milestones.
      
      User Data:
      - Current Age: ${currentAge.toFixed(1)} years
      - Ethnicity: ${data.ethnicity || 'Not specified'}
      - Gender: ${data.gender || 'Not specified'}
      - BMI Context: Height ${data.heightCm || '?'}cm, Weight ${data.weightKg || '?'}kg
      - Blood Pressure: ${data.bloodPressureSys || '?'} / ${data.bloodPressureDia || '?'}
      - Blood Sugar: ${data.bloodSugar || '?'} mg/dL
      - Activity Level: ${data.activityLevel || 'Not specified'}

      Task:
      1. Estimate life expectancy (integer years) based on health factors.
      2. Provide a short, insightful analysis (1 sentence).
      3. Give 3 actionable, specific health tips.
      4. Define life stages (Youth, Growth, Prime, Wisdom, Legacy).
      5. IDENTIFY MILESTONES (ages are integers). You MUST include these SPECIFIC BIOLOGICAL/SOCIOLOGICAL MARKERS with their corresponding EMOJIS:
         - "Frontal Lobe Maturity" (Brain fully developed, ~25) -> 🧠
         - "Physical Peak" (Max strength/speed, ~27-30) -> 💪
         - "Bone Density Peak" (Peak skeletal mass, ~30) -> 🦴
         - "Sarcopenia Onset" (Muscle mass decline begins, usually ~30-40) -> 📉
         - "Fertility Changes" (Biological shifts, ~35-40) -> 🧬
         - "Presbyopia" (Need reading glasses, ~45) -> 👓
         - "Cognitive Decline Onset" (Processing speed slows, usually ~45-50) -> 🧩
         - "Parental Loss" (Statistical estimate of parents passing, ~50-65) -> 🕯️
         - "Empty Nest" (Kids leaving home, statistical estimate) -> 🐦
         - "Grandparenthood" (~55-65) -> 🍼
         - "Retirement" (~60-67) -> 🌅
         - "Peak Happiness" (U-curve upswing, ~70+) -> 😊
      
      Return JSON only.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            estimatedAge: { type: Type.INTEGER },
            analysis: { type: Type.STRING },
            healthTips: { type: Type.ARRAY, items: { type: Type.STRING } },
            lifeStages: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  stage: { type: Type.STRING },
                  startAge: { type: Type.INTEGER },
                  endAge: { type: Type.INTEGER },
                  color: { type: Type.STRING },
                  description: { type: Type.STRING }
                }
              }
            },
            milestones: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  age: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  emoji: { type: Type.STRING },
                  description: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    const estimatedAge = result.estimatedAge || fallbackAge;

    const weeksLived = Math.floor(currentAge * 52.1775);
    const totalWeeks = Math.floor(estimatedAge * 52.1775);

    // Ensure we have a valid color palette for the returned stages
    const defaultColors = ["#22d3ee", "#4ade80", "#facc15", "#f472b6", "#a78bfa"];
    const stages = (result.lifeStages || []).map((stage: any, index: number) => ({
      ...stage,
      color: stage.color || defaultColors[index % defaultColors.length]
    }));

    // Process AI milestones - ensure emojis exist
    const rawAiMilestones = result.milestones || [];
    const aiMilestones = rawAiMilestones.map((m: any) => ({
      ...m,
      emoji: m.emoji || '📍' // Fallback emoji if AI misses it
    }));

    // If AI returns empty milestones for some reason, use the rich fallback list
    if (aiMilestones.length === 0) {
      aiMilestones.push(
        { age: 25, title: "Frontal Lobe Maturity", emoji: "🧠", description: "Brain fully developed." },
        { age: 30, title: "Physical Peak", emoji: "💪", description: "Peak muscle mass and bone density." },
        { age: 35, title: "Sarcopenia", emoji: "📉", description: "Muscle mass naturally begins to decrease." },
        { age: 45, title: "Presbyopia", emoji: "👓", description: "Reading glasses often needed." },
        { age: 50, title: "Cognitive Shift", emoji: "🧩", description: "Processing speed changes." },
        { age: 60, title: "Empty Nest", emoji: "🐦", description: "Children leave home." },
        { age: 65, title: "Retirement", emoji: "🌅", description: "Standard retirement age." },
        { age: 70, title: "Peak Happiness", emoji: "😊", description: "Happiness U-curve upswing." }
      );
    }

    // Hindu Sanskaras (16 Sacraments) - Cultural Milestones
    const sanskarasMilestones = [
      // Pre-natal Sanskaras
      { age: 0, title: "Garbhadhana", emoji: "🌱", description: "The ritual for conception." },
      { age: 0, title: "Pumsavana", emoji: "🤰", description: "A ceremony for fetal protection and well-being." },
      { age: 0, title: "Simantonnayana", emoji: "🙏", description: "A ritual during pregnancy to ensure mother's and child's well-being." },

      // Childhood Sanskaras
      { age: 0, title: "Jatakarma", emoji: "👶", description: "Birth rituals performed immediately after a child is born." },
      { age: 0, title: "Namakarana", emoji: "📜", description: "The naming ceremony for the child." },
      { age: 0, title: "Nishkramana", emoji: "🚪", description: "The child's first outing from the home." },
      { age: 1, title: "Annaprashana", emoji: "🍚", description: "The ceremony for the child's first solid food." },
      { age: 3, title: "Chudakarana", emoji: "✂️", description: "The first haircutting ceremony (Mundan)." },
      { age: 5, title: "Karnavedha", emoji: "💎", description: "The piercing of the earlobes." },

      // Educational Sanskaras
      { age: 5, title: "Vidyarambha", emoji: "📖", description: "The initiation into learning the alphabet." },
      { age: 8, title: "Upanayana", emoji: "🧵", description: "The sacred thread ceremony." },
      { age: 12, title: "Vedarambha", emoji: "📿", description: "The commencement of Vedic studies." },
      { age: 16, title: "Keshant", emoji: "🪒", description: "The ceremony for shaving the beard (Godaan)." },
      { age: 20, title: "Samavartan", emoji: "🎓", description: "The ritual marking the completion of studentship." },

      // Post-educational and Death Sanskaras
      { age: 25, title: "Vivaha", emoji: "💍", description: "The marriage ceremony." },
      { age: 80, title: "Antyeshti", emoji: "🕯️", description: "The final rites or funeral rituals performed after death." }
    ];

    // Process Custom Milestones from user input
    const customMilestones = (data.customMilestones || []).map(m => ({
      age: m.age,
      title: m.title,
      emoji: m.emoji || '🎯',
      description: "Personal Goal"
    }));

    // Combine and sort milestones: AI + Sanskaras + Custom
    const allMilestones = [...aiMilestones, ...sanskarasMilestones, ...customMilestones].sort((a: any, b: any) => a.age - b.age);

    return {
      estimatedAge,
      weeksLived,
      totalWeeks,
      remainingWeeks: totalWeeks - weeksLived,
      analysis: result.analysis || "Based on general population averages.",
      healthTips: result.healthTips || ["Maintain a balanced diet.", "Exercise regularly.", "Get enough sleep."],
      lifeStages: stages.length > 0 ? stages : [
        { stage: "Youth", startAge: 0, endAge: 18, color: "#22d3ee", description: "Learning & Growth" },
        { stage: "Prime", startAge: 19, endAge: 60, color: "#facc15", description: "Building & Creating" },
        { stage: "Wisdom", startAge: 61, endAge: estimatedAge, color: "#f472b6", description: "Reflection & Legacy" }
      ],
      milestones: allMilestones
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    const weeksLived = Math.floor(currentAge * 52.1775);
    const totalWeeks = Math.floor(fallbackAge * 52.1775);

    // Rich Fallback milestones in case of error
    const aiMilestones = [
      { age: 25, title: "Frontal Lobe Maturity", emoji: "🧠", description: "Brain fully developed." },
      { age: 30, title: "Physical Peak", emoji: "💪", description: "Peak muscle mass and bone density." },
      { age: 35, title: "Sarcopenia", emoji: "📉", description: "Muscle mass naturally begins to decrease." },
      { age: 45, title: "Presbyopia", emoji: "👓", description: "Reading glasses often needed." },
      { age: 50, title: "Cognitive Shift", emoji: "🧩", description: "Processing speed changes." },
      { age: 60, title: "Empty Nest", emoji: "🐦", description: "Children leave home." },
      { age: 65, title: "Retirement", emoji: "🌅", description: "Standard retirement age." },
      { age: 70, title: "Peak Happiness", emoji: "😊", description: "Happiness U-curve upswing." }
    ];

    // Hindu Sanskaras (16 Sacraments) - Cultural Milestones
    const sanskarasMilestones = [
      // Pre-natal Sanskaras
      { age: 0, title: "Garbhadhana", emoji: "🌱", description: "The ritual for conception." },
      { age: 0, title: "Pumsavana", emoji: "🤰", description: "A ceremony for fetal protection and well-being." },
      { age: 0, title: "Simantonnayana", emoji: "🙏", description: "A ritual during pregnancy to ensure mother's and child's well-being." },

      // Childhood Sanskaras
      { age: 0, title: "Jatakarma", emoji: "👶", description: "Birth rituals performed immediately after a child is born." },
      { age: 0, title: "Namakarana", emoji: "📜", description: "The naming ceremony for the child." },
      { age: 0, title: "Nishkramana", emoji: "🚪", description: "The child's first outing from the home." },
      { age: 1, title: "Annaprashana", emoji: "🍚", description: "The ceremony for the child's first solid food." },
      { age: 3, title: "Chudakarana", emoji: "✂️", description: "The first haircutting ceremony (Mundan)." },
      { age: 5, title: "Karnavedha", emoji: "💎", description: "The piercing of the earlobes." },

      // Educational Sanskaras
      { age: 5, title: "Vidyarambha", emoji: "📖", description: "The initiation into learning the alphabet." },
      { age: 8, title: "Upanayana", emoji: "🧵", description: "The sacred thread ceremony." },
      { age: 12, title: "Vedarambha", emoji: "📿", description: "The commencement of Vedic studies." },
      { age: 16, title: "Keshant", emoji: "🪒", description: "The ceremony for shaving the beard (Godaan)." },
      { age: 20, title: "Samavartan", emoji: "🎓", description: "The ritual marking the completion of studentship." },

      // Post-educational and Death Sanskaras
      { age: 25, title: "Vivaha", emoji: "💍", description: "The marriage ceremony." },
      { age: 80, title: "Antyeshti", emoji: "🕯️", description: "The final rites or funeral rituals performed after death." }
    ];

    const customMilestones = (data.customMilestones || []).map(m => ({
      age: m.age,
      title: m.title,
      emoji: m.emoji || '🎯',
      description: "Personal Goal"
    }));
    const allMilestones = [...aiMilestones, ...sanskarasMilestones, ...customMilestones].sort((a, b) => a.age - b.age);

    return {
      estimatedAge: fallbackAge,
      weeksLived,
      totalWeeks,
      remainingWeeks: totalWeeks - weeksLived,
      analysis: "Could not generate precise estimate. Using global average.",
      healthTips: ["Focus on cardio.", "Reduce sugar intake.", "Stay hydrated."],
      lifeStages: [
        { stage: "Past", startAge: 0, endAge: Math.floor(currentAge), color: "#94a3b8", description: "Time already lived" },
        { stage: "Future", startAge: Math.floor(currentAge), endAge: fallbackAge, color: "#e2e8f0", description: "Time remaining" }
      ],
      milestones: allMilestones
    };
  }
};