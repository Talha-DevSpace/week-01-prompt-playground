
// Get references to the DOM elements
const userPromptInput = document.getElementById('userPromptInput');
const btnGenerate = document.getElementById('btnGenerate');
const btnClear = document.getElementById('btnClear');
const divOutput = document.getElementById('divOutput');


// "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent"


async function callGemini(userPrompt) {
    const MODEL_NAME = "gemini-flash-latest";
    const URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent`;

    const requestBody = {
        contents: [{
            parts: [{ text: userPrompt }]
        }]
    };

    try {
        const response = await fetch(URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'X-goog-api-key': API_KEY,
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        const aiResponse = data.candidates[0].content.parts[0].text;
        console.log("AI Response:", aiResponse);
        return aiResponse;

    } catch (error) {
        console.error("Error:", error);
        return "Sorry, there was an error processing your request.";
    }
}

btnGenerate.addEventListener('click', async () => {
    const userInput = userPromptInput.value;
    if (userInput.trim() !== "") {

        divOutput.style.color = "#e8f0fe";
        divOutput.innerHTML = `Thinking...`;
        console.log("prompt:", userInput);
        const reply = await callGemini(userInput);
        divOutput.innerHTML = `${reply}`;

    } else {
        alert("Please enter a prompt!");
    }
});

btnClear.addEventListener('click', () => {
    window.location.reload();
});

// callGemini("What is the capital of France?").then(response => {
//     console.log("AI Response:", response);
// }).catch(error => {
//     console.error("Error:", error);
// }   );

