
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
    // ================================
// DIRECT COMMAND HANDLER
// ================================

const lower = cleanCommand.toLowerCase();

if (
  lower.includes("who created you") ||
  lower.includes("who made you")||
   lower.includes("tane kone banayu") 
) {
  return {
    type: "general",
    userInput: cleanCommand,
    response: `I was created by ${userName}.`,
  };
}

if (
  lower.includes("what is your name") ||
  lower.includes("what is this") ||
  lower.includes("who are you")
) {
  return {
    type: "general",
    userInput: cleanCommand,
    response: `I am ${assistantName},Ai assistant created by ${userName}.`
  ,
  };
}
  if (
     lower.includes("hello") ||
  lower.includes("hi") ||
  lower.includes("hey") ||
  lower.includes("how are you") ||
  lower.includes("what's up")
) {
  return {
    type: "general",
    userInput: cleanCommand,
    response: `Hello ${userName}! How can I help you today ?`,
  };
}

if (
  lower.includes("what time is it") ||
  lower.includes("current time") ||
  lower.includes("what is time") ||
  lower.includes("time now")
) {
  const now = new Date();
  const timeString = now.toLocaleTimeString(
    [],
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );
  return {
    type: "date_time_info",
    userInput: cleanCommand,
    response: `The current time is ${timeString}.`,
  };
}
if (
  lower.includes("what is the date") ||
  lower.includes("current date") ||
  lower.includes("date now")
) {
  const now = new Date();
  const dateString = now.toLocaleDateString(
    [],
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );
  return {
    type: "date_time_info",
    userInput: cleanCommand,
    response: `Today's date is ${dateString}.`,
  };
}
const directCommands = [
  {
    keywords: [
      "open whatsapp",
      "opening whatsapp",
      "start whatsapp",
    ],
    data: {
      type: "open_whatsapp",
      userInput: "whatsapp",
      response: "Opening WhatsApp",
    },
  },

  {
    keywords: [
      "open instagram",
      "opening instagram",
      "start instagram",
    ],
    data: {
      type: "open_instagram",
      userInput: "instagram",
      response: "Opening Instagram",
    },
  },

  {
    keywords: [
      "open github",
      "opening github",
      "start github",
    ],
    data: {
      type: "open_github",
      userInput: "github",
      response: "Opening GitHub",
    },
  },

  {
    keywords: [
      "open youtube",
      "opening youtube",
    ],
    data: {
      type: "open_youtube",
      userInput: "youtube",
      response: "Opening YouTube",
    },
  },

  {
    keywords: [
      "open gmail",
      "opening gmail",
    ],
    data: {
      type: "open_gmail",
      userInput: "gmail",
      response: "Opening Gmail",
    },
  },
  {
    keywords: [
      "open facebook",
      "opening facebook",
    ],
    data: {
      type: "open_facebook",
      userInput: "facebook",
      response: "Opening Facebook",
    },
  },

  {
    keywords: [
      "open amazon",
      "opening amazon",
    ],
    data: {
      type: "open_amazon",
      userInput: "amazon",
      response: "Opening Amazon",
    },
  },

  {
    keywords: [
      "open flipkart",
      "opening flipkart",
    ],
    data: {
      type: "open_flipkart",
      userInput: "flipkart",
      response: "Opening Flipkart",
    },
  },
  {
    keywords: [
      "open spotify",
      "opening spotify",
    ],
    data: {
      type: "open_spotify",
      userInput: "spotify",
      response: "Opening Spotify",
    },
  },
];

// Check direct commands

for (const cmd of directCommands) {
  if (
    cmd.keywords.some(keyword =>
      lower.includes(keyword)
    )
  ) {
    console.log(
      "Direct Command Matched:",
      cmd.data.type
    );

    return cmd.data;
  }
}

// YouTube Search

if (
  lower.includes("youtube") &&
  (
    lower.includes("search") ||
    lower.includes("play")
  )
) {
  return {
    type: "youtube_search",
    userInput: cleanCommand
      .replace(/search/gi, "")
      .replace(/play/gi, "")
      .replace(/on youtube/gi, "")
      .replace(/youtube/gi, "")
      .trim(),
    response: "Searching on YouTube",
  };
}

// Google Search

if (
  lower.includes("google") &&
  lower.includes("search")
) {
  return {
    type: "google_search",
    userInput: cleanCommand
      .replace(/search/gi, "")
      .replace(/on google/gi, "")
      .replace(/google/gi, "")
      .trim(),
    response: "Searching on Google",
  };
}

// Weather

if (
  lower.includes("weather")
) {
  return {
    type: "weather_search",
    userInput: cleanCommand,
    response: "Checking weather",
  };
}

// News

if (
  lower.includes("news")
) {
  return {
    type: "news_search",
    userInput: cleanCommand,
    response: "Fetching latest news",
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
open_instagram
open_facebook
open_twitter
open_linkedin
open_github
open_gmail
open_youtube
open_spotify
open_netflix
open_whatsapp
open_amazon
open_flipkart
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

Command Detection Rules:

If user says:

"search ... on youtube"
→ youtube_search

"search ... on google"
→ google_search

"open whatsapp"
→ open_whatsapp

"open instagram"
→ open_instagram

"open github"
→ open_github

"play music"
→ play_music

"open maps"
→ open_maps

"weather in delhi"
→ weather_search

"latest news"
→ news_search

Otherwise:
→ general_conversation

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
    console.log(
  "Gemini Raw Response:",
  JSON.stringify(result.data, null, 2)
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
     // parsedData = JSON.parse(text);
    const jsonMatch =
  text.match(/\{[\s\S]*\}/);

if (!jsonMatch) {
  throw new Error(
    "No JSON found in Gemini response"
  );
}

parsedData = JSON.parse(
  jsonMatch[0]
);
console.log(
  "Gemini Raw Response:",
  text
);

console.log(
  "Gemini Parsed Response:",
  parsedData
);
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

   console.error("========== GEMINI ERROR ==========");
  console.error(error);
  console.error("Message:", error.message);
  console.error("Code:", error.code);
  console.error("Response:", error?.response?.data);
  console.error("=================================");

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