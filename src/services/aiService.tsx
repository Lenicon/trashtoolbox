import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const generateContent = async (prompt: string, image?: any, maxOutputTokens:number=5, temperature:number=1.0) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        candidateCount: 1,
        maxOutputTokens: maxOutputTokens,
        temperature: temperature,
      },
    });

    let result;

    if (image) result = await model.generateContent([prompt, ...image]);
    else result = await model.generateContent(prompt);

    const response = await result.response;
    const text = response?.candidates?.[0]?.content?.parts?.[0]?.text;
    return text;

  } catch (error) {
    console.error(error);
    return null;
  }
}

export const fileToGenerativePart = (image:any) => {

  return {
    inlineData: { ...image, data: image?.data.split(",")[1] },
  };
}

export const getBase64 = async (file: File): Promise<any> => {
  const reader = new FileReader();
  return new Promise((resolve) => {
    reader.onload = () => {
      const { result } = reader;

      if (typeof result === "string")
        resolve({ data: result, mimeType: file.type });
    };
    reader.readAsDataURL(file);
  });
};
