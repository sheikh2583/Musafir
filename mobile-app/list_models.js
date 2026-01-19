const axios = require('axios');

const API_KEY = 'AIzaSyAHgBcVSJQ-C0BMtqHIw42hwcdenYHPURs';
const URL = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

async function listModels() {
    try {
        const response = await axios.get(URL);
        const geminiModels = response.data.models
            .filter(m => m.name.includes('gemini'))
            .map(m => m.name);

        console.log(JSON.stringify(geminiModels, null, 2));
    } catch (error) {
        console.error("Error:", error.message);
    }
}

listModels();
