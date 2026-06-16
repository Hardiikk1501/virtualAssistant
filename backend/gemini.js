

// import axios from "axios";

// const geminiResponse = async (command, assistantName, userName) => {
//   try {
//     const apiUrl = process.env.GEMINI_API_URL;

//     if (!apiUrl) {
//       throw new Error("GEMINI_API_URL is missing in .env");
//     }

//     const prompt = `
// You are a smart virtual voice assistant named "${assistantName}" created by "${userName}".

// You behave like a friendly AI assistant, not like Google.

// Your task:
// Understand the user's message and return ONLY a valid JSON object.

// Response format:
// {
//   "type": general | google_search| youtube_search | youtube_play | weather_info | news_update | joke | quote | reminder_set | alarm_set | instagram_open | facebook_open | twitter_open | linkedin_open | github_open | gmail_open | youtube_open | spotify_open | netflix_open | whatsapp_open | date_time_info | math_calculation | code_generation | programming_help | general_conversation | other",

//   "userInput": "cleaned user message",

//   "response": "short natural voice reply"
// }

// Rules:
// 1. Return ONLY valid JSON.
// 2. No markdown.
// 3. No explanation.
// 4. Keep response short and voice-friendly.
// 5. Remove assistant name from userInput if present.
// 6. If user wants Google search:
//    - type = "google_search"
//    - userInput = only search query
// 7. If user wants YouTube search:
//    - type = "youtube_search"
// 8. If user wants to play something:
//    - type = "youtube_play"
// 9. If user wants to open apps/websites:
//    - return matching type
// 10. For coding questions:
//    - type = "programming_help"
// 11. For normal chat:
//    - type = "general"

// Special Rules:
// - If someone asks "who created you":
//   mention "${userName}"
// - If someone asks your name:
//   mention "${assistantName}"

// Examples:

// User: "Play Arijit Singh songs on YouTube"

// Response:
// {
//   "type": "youtube_play",
//   "userInput": "Arijit Singh songs",
//   "response": "Playing Arijit Singh songs on YouTube."
// }

// User: "Open Instagram"

// Response:
// {
//   "type": "instagram_open",
//   "userInput": "Instagram",
//   "response": "Opening Instagram."
// }

// Now process this user input:
// "${command}"
// `;

//     const result = await axios.post(apiUrl, {
//       contents: [
//         {
//           parts: [{ text: prompt }],
//         },
//       ],
//     },
    
   
//   );

//     let text =
//       result?.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

//     // Remove markdown if Gemini returns ```json
//     text = text.replace(/```json/g, "").replace(/```/g, "").trim();

//     // Convert string response into JSON object
//     const parsedData = JSON.parse(text);

//     return parsedData;

//   } catch (error) {
//     console.error(
//       "Error in geminiResponse:",
//       error?.response?.data || error.message
//     );

//     return {
//       type: "general",
//       userInput: command,
//       response: "Sorry, something went wrong.",
//     };
//   }
// };

// export default geminiResponse;


import axios from "axios";

const geminiResponse = async (
  command,
  assistantName,
  userName
) => {
  try {

    // Validate environment variable
    const apiUrl = process.env.GEMINI_API_URL;

    if (!apiUrl) {
      throw new Error(
        "GEMINI_API_URL is missing in .env"
      );
    }

    // Clean command
    const cleanCommand = command?.trim();

    if (!cleanCommand) {
      return {
        type: "general",
        userInput: "",
        response: "Please say something.",
      };
    }

    // AI Prompt
    const prompt = `
You are a smart AI voice assistant named "${assistantName}" created by "${userName}".

You are friendly, helpful, and conversational.

IMPORTANT:
Return ONLY valid JSON.

Response JSON format:
{
  "type": "general",
  "userInput": "cleaned user message",
  "response": "short assistant reply"
}

Allowed "type" values:
- general
- google_search
- youtube_search
- youtube_play
- weather_info
- news_update
- joke
- quote
- reminder_set
- alarm_set
- instagram_open
- facebook_open
- twitter_open
- linkedin_open
- github_open
- gmail_open
- youtube_open
- spotify_open
- netflix_open
- whatsapp_open
- date_time_info
- math_calculation
- code_generation
- programming_help
- general_conversation
- other

Rules:
1. Return ONLY JSON.
2. No markdown.
3. No explanation.
4. Keep response short.
5. Make response voice-friendly.
6. Remove assistant name from userInput.
7. If user asks who created you:
   mention "${userName}"
8. If user asks your name:
   mention "${assistantName}"

   If the user's message starts with the assistant name,
ignore the assistant name and process only the actual command.

Examples:

"hardik search react tutorial on youtube"
→ youtube_search

"hardik open whatsapp"
→ open_whatsapp

"hardik who are you"
→ general_conversation

Never include the assistant name in userInput.

Examples:

User: "Open YouTube"
Response:
{
  "type": "youtube_open",
  "userInput": "YouTube",
  "response": "Opening YouTube."
}

User: "Search React tutorials on Google"
Response:
{
  "type": "google_search",
  "userInput": "React tutorials",
  "response": "Searching React tutorials on Google."
}

Now process this user input:
"${cleanCommand}"
`;

    // Gemini API Request
    const result = await axios.post(
      apiUrl,
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      },
      {
        timeout: 30000,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Extract response text
    let text =
      result?.data?.candidates?.[0]?.content?.parts?.[0]
        ?.text || "";

    // Remove markdown formatting
    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // Parse JSON safely
    let parsedData;

    try {
      parsedData = JSON.parse(text);
    } catch (parseError) {

      console.error(
        "JSON Parse Error:",
        parseError.message
      );

      return {
        type: "general",
        userInput: cleanCommand,
        response:
          "Sorry, I could not understand the response.",
      };
    }

    // Final validation
    if (
      !parsedData ||
      typeof parsedData !== "object"
    ) {
      return {
        type: "general",
        userInput: cleanCommand,
        response: "Invalid assistant response.",
      };
    }

    // Ensure required fields
    return {
      type: parsedData.type || "general",
      userInput:
        parsedData.userInput || cleanCommand,
      response:
        parsedData.response ||
        "Sorry, I couldn't understand.",
    };

  } catch (error) {

    console.error(
      "Error in geminiResponse:",
      error?.response?.data || error.message
    );

    // Quota exceeded
    if (
      error?.response?.status === 429
    ) {
      return {
        type: "quota_exceeded",
        userInput: command,
        response:
          "API quota exceeded. Please try again later.",
      };
    }

    // Timeout error
    if (error.code === "ECONNABORTED") {
      return {
        type: "network_error",
        userInput: command,
        response:
          "Request timeout. Please try again.",
      };
    }

    // Network error
    if (
      error.code === "ECONNRESET" ||
      error.code === "ETIMEDOUT"
    ) {
      return {
        type: "network_error",
        userInput: command,
        response:
          "Network error. Please check your internet.",
      };
    }

    // Default error
    return {
      type: "general",
      userInput: command,
      response:
        "Sorry, something went wrong.",
    };
  }
};

export default geminiResponse;