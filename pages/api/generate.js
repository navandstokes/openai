import { Configuration, OpenAIApi } from "openai"

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

export default async function handler(req, res) {
    if (!configuration.apiKey) {
        res.status(500).json({
            error: {
                message:
                    "OpenAI API key not configured, please follow instructions in README.md",
            },
        })
        return
    }

    const { model, max_tokens, temperature, top_p } = req.body

    const prompt = req.body.prompt || ""
    if (prompt.trim().length === 0) {
        res.status(400).json({
            error: {
                message: "Please enter a valid prompt",
            },
        })
        return
    }

    try {
        const completion = await openai.createCompletion({
            model: model ? model : "text-davinci-003",
            prompt: prompt,
            temperature: temperature ? parseFloat(temperature) : 0.7,
            max_tokens: max_tokens ? parseInt(max_tokens) : 256,
            top_p: top_p ? parseFloat(top_p) : 1,
        })
        res.status(200).json({ result: completion.data.choices[0].text })
    } catch (error) {
        // Consider adjusting the error handling logic for your use case
        if (error.response) {
            console.error(error.response.status, error.response.data)
            res.status(error.response.status).json(error.response.data)
        } else {
            console.error(`Error with OpenAI API request: ${error.message}`)
            res.status(500).json({
                error: {
                    message: "An error occurred during your request.",
                },
            })
        }
    }
}
