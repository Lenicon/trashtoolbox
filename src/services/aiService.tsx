import { GoogleGenerativeAI} from '@google/generative-ai';
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const generateContent = async (prompt:string) => {
    try {
        const model = genAI.getGenerativeModel({model: "gemini-1.5-flash"});

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text;
        return text;
    } catch (error) {
        console.error(error);
        return null;
    }
    
}