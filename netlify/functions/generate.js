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



exports.handler = async (event) => {
    try {
        const { prompt } = JSON.parse(event.body);

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-goog-api-key": process.env.GEMINI_API_KEY
                },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            }
        );

        const data = await response.json();

        // Log full response so we can debug
        console.log("API status:", response.status);
        console.log("Full response:", JSON.stringify(data));

        // Check for API error
        if (data.error) {
            return {
                statusCode: 400,
                body: JSON.stringify({ result: `API Error: ${data.error.message}` })
            };
        }

        const result = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!result) {
            return {
                statusCode: 200,
                body: JSON.stringify({ result: `Debug: ${JSON.stringify(data)}` })
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ result })
        };

    } catch (err) {
        console.log("Handler error:", err.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ result: `Server error: ${err.message}` })
        };
    }
};