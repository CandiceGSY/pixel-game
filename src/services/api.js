const GOOGLE_APP_SCRIPT_URL = import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL;
const PASS_THRESHOLD = parseInt(import.meta.env.VITE_PASS_THRESHOLD) || 3;
const QUESTION_COUNT = parseInt(import.meta.env.VITE_QUESTION_COUNT) || 5;

// Mock data (Question part only)
const MOCK_QUESTIONS = [
    { id: 1, question: "What is the capital of 8-bit?", A: "Mario", B: "Zelda", C: "Pixel", D: "Sprite" },
    { id: 2, question: "Which color is #FF00FF?", A: "Cyan", B: "Magenta", C: "Yellow", D: "Green" },
    { id: 3, question: "Best retro console?", A: "NES", B: "SNES", C: "Genesis", D: "GameBoy" },
    { id: 4, question: "Pixel Art uses?", A: "Vectors", B: "Polygons", C: "Raster", D: "Voxels" },
    { id: 5, question: "Konami Code start?", A: "Up Up", B: "Down Down", C: "Left Right", D: "B A" }
];

// Hidden answers for mock grading
const MOCK_ANSWERS = {
    1: "C", 2: "B", 3: "A", 4: "C", 5: "A"
};

export const fetchQuestions = async () => {
    if (!GOOGLE_APP_SCRIPT_URL) {
        console.warn("No VITE_GOOGLE_APP_SCRIPT_URL provided. Using mock data.");
        await new Promise(resolve => setTimeout(resolve, 500));
        return MOCK_QUESTIONS.slice(0, QUESTION_COUNT);
    }

    try {
        const response = await fetch(`${GOOGLE_APP_SCRIPT_URL}?action=getQuestions&count=${QUESTION_COUNT}`);
        const data = await response.json();
        if (data.status === 'success') {
            return data.questions;
        } else {
            throw new Error(data.message || 'Failed to fetch questions');
        }
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};

export const submitScore = async (userId, answers) => {
    if (!GOOGLE_APP_SCRIPT_URL) {
        console.warn("No VITE_GOOGLE_APP_SCRIPT_URL provided. using mock grading.");
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock Grading
        let score = 0;
        answers.forEach(a => {
            if (MOCK_ANSWERS[a.questionId] === a.answer) {
                score++;
            }
        });

        return {
            status: 'success',
            score,
            total: answers.length,
            passed: score >= PASS_THRESHOLD,
            message: 'Mock submission successful'
        };
    }

    try {
        const payload = JSON.stringify({
            action: 'submitScore',
            userId,
            answers // Server catches this, grades it, records it
        });

        const response = await fetch(GOOGLE_APP_SCRIPT_URL, {
            method: 'POST',
            body: payload
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Submission Error:", error);
        throw error;
    }
};
