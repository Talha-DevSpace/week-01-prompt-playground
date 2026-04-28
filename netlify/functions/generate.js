exports.handler = async (event) => {
    const { prompt } = JSON.parse(event.body);

    const MODEL = "gemini-flash-latest";
    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        }
    );

    const data = await response.json();
    const result = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";

    return {
        statusCode: 200,
        body: JSON.stringify({ result })
    };
};