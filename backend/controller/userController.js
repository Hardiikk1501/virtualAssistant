import User from '../model/user.js';
import  uploadCloudinary  from '../config/cloudinary.js';
import geminiResponse from '../gemini.js';
import moment from 'moment';

export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).select('-password'); // Exclude password from the response
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

       return res.json(user);
    } catch (error) {
        console.error('Error fetching current user:', error);
        res.status(500).json({ message: 'Error fetching current user' });
    }
};

export const updateAssistant = async (req, res) => {
    try{
         const {assistantName, imageUrl} = req.body;
            let assistantImage;

     if(req.file){
           console.log("File:", req.file);
          console.log("Path:", req.file.path);
         console.log("req.file =", req.file);
          assistantImage =  await  uploadCloudinary(req.file.path);
     }else{
        assistantImage = imageUrl; // Use existing image URL if no new file is uploaded
     }
        const user = await User.findByIdAndUpdate(req.userId, {
            assistantName,
            assistantImage
        }, { new: true }).select('-password'); // Exclude password from the response

           console.log(req.body);
           console.log(imageUrl);
        return res.json(user);
     
    }
    catch(error){
      console.error("updateAssistant error:", error);

      return
        res.status(500).json({
          success: false,
          message:error.message,
        stack: error.stack,
      });
    }

};



export const askToAssistant = async (req, res) => {
  try {
    const { command } = req.body;

    // Validate command
    if (!command || typeof command !== "string") {
      return res.status(400).json({
        success: false,
        message: "Command is required",
      });
    }

    const cleanCommand = command.trim();

    if (cleanCommand.length < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid command",
      });
    }

    // Find logged in user
    const user = await User.findById(req.userId);

if (!user) {
  return res.status(404).json({
    success: false,
    message: "User not found",
  });
}
    
     // IMPORTANT FIX
    if (!user.history) {
      user.history = [];
    }



    const userName = user.name || "User";
    const assistantName = user.assistantName || "Assistant";

    // Get Gemini response
    const gemResult = await geminiResponse(
      cleanCommand,
      assistantName,
      userName
    );

    // Validate Gemini response
    if (!gemResult || typeof gemResult !== "object") {
      return res.status(500).json({
        success: false,
        message: "Invalid assistant response",
      });
    }

    const {
      type = "general",
      userInput = cleanCommand,
      response = "Sorry, I couldn't understand that.",
    } = gemResult;

    let responseText = response;

    // Handle assistant actions
    switch (type) {

      // Date & Time
      case "get-date":
        responseText = `Today's date is ${moment().format("MMMM Do YYYY")}`;
        break;

      case "get-time":
        responseText = `Current time is ${moment().format(
          "hh:mm A"
        )}`;
        break;
 
      case "get-day":
        responseText = `Today is ${moment().format("dddd")}`;
        break;

      case "get-month":
        responseText = `Current month is ${moment().format(
          "MMMM"
        )}`;
        break;

      case "get-year":
        responseText = `Current year is ${moment().format(
          "YYYY"
        )}`;
        break;

      // Browser / Search Actions
      case "google_search":
      case "wikipedia_search":
      case "youtube_search":
      case "youtube_play":
      case "open_whatsapp":
      case "open_instagram":
      case "open_github":
      case "open_youtube":
      case "open_gmail":
      case "open_amazon":
      case "open_flipkart":
        case"open_netflix":
      case "open_facebook":
      case "open_twitter":
      case "open_linkedin":
      case "open_spotify":
      case "open_snapchat":
        responseText = response;
        break;

      // Weather
      case "weather_search":
        responseText = response;
        break;

      // News
      case "news_search":
        responseText = response;
        break;  
      case "general":
      case "other":
        responseText = response;
        break;

      default:
        responseText =
          response ||
          "Sorry, I couldn't process your request.";
        break;
    }
      // Save assistant response
      user.history.push({
  role: "user",
  text: cleanCommand,
});

user.history.push({
  role: "assistant",
  text: responseText,
});

await user.save();

    // Final Response
    return res.status(200).json({
      success: true,
      type,
      userInput,
      response: responseText,
    });

  } catch (error) {

    console.error(
      "Error asking assistant:",
      error?.response?.data || error.message
    );

    // Gemini Quota Error
    if (
      error?.response?.status === 429 ||
      error?.status === 429
    ) {
      return res.status(429).json({
        success: false,
        type: "quota_exceeded",
        response:
          "API quota exceeded. Please wait a few seconds and try again.",
      });
    }

    // Network Error
    if (
      error.code === "ECONNRESET" ||
      error.code === "ETIMEDOUT"
    ) {
      return res.status(500).json({
        success: false,
        message: "Network error. Please try again.",
      });
    }

    // Generic Error
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};