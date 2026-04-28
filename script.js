// --> Engineered Prompts Library
const prompts = {
    social: {
        formal: (input) =>
            `You are a professional social media manager for established businesses.
Write 3 Instagram captions for the following topic.
Each caption must: be under 150 characters, include a clear call-to-action, and maintain a professional tone.
Number each caption 1, 2, 3. Add a blank line between each.
Topic: ${input}`,

        casual: (input) =>
            `You are a friendly social media creator for small businesses.
Write 3 Instagram captions for the following topic.
Make them conversational, fun, and relatable. Include relevant emojis and a call-to-action.
Number each caption 1, 2, 3. Add a blank line between each.
Topic: ${input}`,

        persuasive: (input) =>
            `You are a conversion-focused social media copywriter.
Write 3 Instagram captions for the following topic designed to drive immediate action.
Use urgency, strong verbs, and a clear call-to-action in each.
Number each caption 1, 2, 3. Add a blank line between each.
Topic: ${input}`
    },

    email: {
        formal: (input) =>
            `You are a professional business communication expert.
Write a complete formal email reply for the following situation.
Include: Subject Line, Greeting, Body (3 short paragraphs), and a professional Sign-off.
Situation: ${input}`,

        casual: (input) =>
            `You are helping write a warm, friendly email reply.
Keep it brief, genuine, and conversational — like writing to a colleague you know well.
Include Subject Line and a friendly Sign-off.
Situation: ${input}`,

        persuasive: (input) =>
            `You are a persuasive business writer.
Write an email reply that addresses concerns, builds trust, and moves toward a positive outcome.
Include Subject Line, a clear value statement, and a specific next step.
Situation: ${input}`
    },

    product: {
        formal: (input) =>
            `You are a professional product copywriter for e-commerce.
Write a product description for the following product.
Structure: one headline, three key benefit bullet points, one closing sentence.
Keep it under 150 words. Use "•" for bullets.
Product: ${input}`,

        casual: (input) =>
            `You are a friendly e-commerce copywriter.
Write a relatable product description that sounds like a recommendation from a trusted friend.
Keep it under 120 words and focus on how the product makes life easier.
Product: ${input}`,

        persuasive: (input) =>
            `You are a conversion copywriter specializing in e-commerce.
Write a high-converting product description. Focus on benefits not features, create mild urgency, and end with a call-to-action.
Keep it under 150 words.
Product: ${input}`
    },

    blog: {
        formal: (input) =>
            `You are a professional content writer.
Write a blog introduction paragraph (100–150 words) for the following topic.
Hook the reader with a surprising statistic or bold question, identify the problem clearly, then preview what the article will cover.
Topic: ${input}`,

        casual: (input) =>
            `You are a conversational blogger who writes like they talk.
Write a friendly blog introduction (80–120 words) for the following topic.
Start with a relatable story or question. Make the reader feel understood immediately.
Topic: ${input}`,

        persuasive: (input) =>
            `You are a persuasive content strategist.
Write a blog introduction (100–150 words) that creates urgency around the following topic.
The reader should feel they cannot afford to skip this article. End with a strong transition sentence.
Topic: ${input}`
    }
};

// --> Elements
const generateBtn = document.getElementById("generateBtn");
const clearBtn = document.getElementById("clearBtn");
const copyBtn = document.getElementById("copyBtn");
const userInput = document.getElementById("userInput");
const outputDiv = document.getElementById("output");
const promptViewer = document.getElementById("promptViewer");
const promptDisplay = document.getElementById("promptDisplay");
const spinner = document.getElementById("spinner");
const genBtnIcon = document.getElementById("genBtnIcon");
const genBtnText = document.getElementById("genBtnText");
const copyText = document.getElementById("copyText");


// --> Generate
async function generate() {

    const input = userInput.value.trim();
    const useCase = document.getElementById("useCase").value;
    const tone = document.querySelector('input[name="tone"]:checked').value;

    if (!input) {
        userInput.style.borderColor = "#ef4444";
        setTimeout(() => userInput.style.borderColor = "", 1200);
        userInput.focus();
        return;
    }

    // Build engineered prompt
    const engineeredPrompt = prompts[useCase][tone](input);

    // Show prompt in viewer
    promptDisplay.textContent = engineeredPrompt;
    promptViewer.classList.add("visible");

    // Loading state
    setLoading(true);
    outputDiv.style.color = "#e8f0fe";
    outputDiv.classList.remove("has-content");
    outputDiv.innerHTML = '<span class="placeholder">Generating…</span>';
    copyBtn.classList.remove("show");

    try {
        const response = await fetch("/.netlify/functions/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: engineeredPrompt })
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        const result = data.result;

        outputDiv.textContent = result;
        outputDiv.classList.add("has-content");
        copyBtn.classList.add("show");

    } catch (error) {
        console.error("Error:", error);
        outputDiv.innerHTML = `<span class="placeholder">⚠️ Error: ${error.message}. Check your API key.</span>`;
    } finally {
        setLoading(false);
    }
}

// --> Loading toggle
function setLoading(on) {
    generateBtn.disabled = on;
    spinner.style.display = on ? "block" : "none";
    genBtnIcon.style.display = on ? "none" : "block";
    genBtnText.textContent = on ? "Generating…" : "Generate Response";
}

// --> Clear All
function clearAll() {
    userInput.value = "";
    outputDiv.innerHTML = `<p id="output" class="output-hint">
                            <strong>No output yet</strong>
                            Enter a prompt above and hit Generate
                        </p>`;
    outputDiv.classList.remove("has-content");
    promptViewer.classList.remove("visible");
    promptDisplay.textContent = "";
    copyBtn.classList.remove("show");
    userInput.focus();
}

// --> Copy Output
function copyOutput() {
    const text = outputDiv.textContent;
    navigator.clipboard.writeText(text).then(() => {
        copyBtn.classList.add("copied");
        copyText.textContent = "Copied!";
        setTimeout(() => {
            copyBtn.classList.remove("copied");
            copyText.textContent = "Copy";
        }, 2000);
    });
}

// --> Events
generateBtn.addEventListener("click", generate);
clearBtn.addEventListener("click", clearAll);
copyBtn.addEventListener("click", copyOutput);

// Ctrl+Enter shortcut
userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) generate();
});