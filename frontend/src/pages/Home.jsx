
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import axios from "axios";
import { UserDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import {
  FaRobot,
  FaSignOutAlt,
  FaMagic,
} from "react-icons/fa";

function Home() {

  const {
    userData,
    setUserData,
    getGeminiResponse,
    serverUrl,
  } = useContext(UserDataContext);

 const [assistantMessage, setAssistantMessage] =
  useState("Say my name to start talking...");
  const navigate = useNavigate();
  console.log("User Data:", userData);
  useEffect(() => {
  if (userData === null) {
    navigate("/signup");
  }
}, [userData, navigate]);
  console.log("User Data:", userData);
  
  // Speech Recognition Ref
  const recognitionRef = useRef(null);
  const isListeningRef =
  useRef(false);

const isSpeakingRef =
  useRef(false);

  // =========================
  // Logout
  // =========================
   const handleLogout = async () => {
  try {
    await axios.post(
      `${serverUrl}/api/auth/logout`,
      {},
      {
        withCredentials: true,
      }
    );

    localStorage.removeItem("token");
    localStorage.removeItem("userData");

    window.speechSynthesis.cancel();

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
    }

    setUserData(null);

    navigate("/signin");
  } catch (error) {
    console.log(error);
  }
};
  // =========================
  // Navigate Customize
  // =========================
  const handleCustomize = () => {
    navigate("/customize");
  };

  // =========================
  // Speak Function
  // =========================


const speak = (text) => {

  if (!text) return;
  setAssistantMessage(`🤖${text}`);


  // Stop listening BEFORE speaking
  try {

    recognitionRef.current?.stop();

  } catch (error) {
    console.log(error);
  }

  // Stop old speech
  window.speechSynthesis.cancel();

  const utterance =
    new SpeechSynthesisUtterance(text);

  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.volume = 1;

  utterance.lang = "en-IN";

  // Better voice
  const voices =
    window.speechSynthesis.getVoices();

  const selectedVoice =
    voices.find(
      (voice) =>
        voice.lang.includes("en")
    ) || voices[0];

  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }

  // Restart listening AFTER speaking
 utterance.onend = () => {
  console.log(
    "Speech completed"
  );
};

  window.speechSynthesis.speak(
    utterance
  );
};



const handleCommand = (data) => {
  try {
    if (!data?.type) {
      console.warn("Invalid command data:", data);
      speak("Invalid command received");
      return;
    }

    const {
      type,
      userInput = "",
      response = "",
    } = data;

    const cleanType = type.trim().toLowerCase();
    const query = encodeURIComponent(userInput);

    console.log("Command Type:", cleanType);
    console.log("Command Input:", userInput);
    console.log("Command Response:", response);

    const navigateTo = (url, message) => {
      if (message) speak(message);

      console.log("Navigating to:", url);

      setTimeout(() => {
        //window.location.href = url;
         window.open(url, "_blank");
      }, 1000);
    };

    const commands = {
      // Conversation
      general: () => speak(response),

      conversation: () => speak(response),

      general_conversation: () => speak(response),

      // Google
      google_search: () => {
        navigateTo(
          `https://www.google.com/search?q=${query}`,
          `Searching ${userInput} on Google`
        );
      },

      // YouTube
      youtube_search: () => {
        navigateTo(
          `https://www.youtube.com/results?search_query=${query}`,
          `Searching ${userInput} on YouTube`
        );
      },

      // WhatsApp
      open_whatsapp: () => {
        navigateTo(
          "https://web.whatsapp.com/",
          "Opening WhatsApp"
        );
      },

      // Instagram
      open_instagram: () => {
        navigateTo(
          "https://www.instagram.com/",
          "Opening Instagram"
        );
      },

      instagram_open: () => {
        navigateTo(
          "https://www.instagram.com/",
          "Opening Instagram"
        );
      },

      // GitHub
      open_github: () => {
        navigateTo(
          "https://github.com/",
          "Opening GitHub"
        );
      },

      github_open: () => {
        navigateTo(
          "https://github.com/",
          "Opening GitHub"
        );
      },

      // Spotify
      play_music: () => {
        navigateTo(
          `https://open.spotify.com/search/${query}`,
          `Playing ${userInput}`
        );
      },

      // Maps
      open_maps: () => {
        navigateTo(
          `https://www.google.com/maps/search/${query}`,
          `Opening maps for ${userInput}`
        );
      },

      // Weather
      weather_search: () => {
        navigateTo(
          `https://www.google.com/search?q=weather+${query}`,
          `Checking weather for ${userInput}`
        );
      },

      // News
      news_search: () => {
        navigateTo(
          `https://news.google.com/search?q=${query}`,
          `Showing news about ${userInput}`
        );
      },

      // Open Website
      open_website: () => {
        let website = userInput
          .replace(/^open\s+/i, "")
          .trim()
          .toLowerCase();

        website = website.replace(/\s+/g, "");

        if (
          !website.startsWith("http") &&
          !website.includes(".")
        ) {
          website += ".com";
        }

        const url = website.startsWith("http")
          ? website
          : `https://${website}`;

        navigateTo(
          url,
          `Opening ${website}`
        );
      },
    };

    const action = commands[cleanType];

    if (action) {
      console.log(
        "Executing Command:",
        cleanType
      );

      action();
    } else {
      console.warn(
        "Unknown command:",
        cleanType
      );

      if (response) {
        speak(response);
      } else {
        speak(
          "Sorry, I don't understand this command."
        );
      }
    }
  } catch (error) {
    console.error(
      "handleCommand Error:",
      error
    );

    speak("Something went wrong");
  }
};


  // =========================
  // Speech Recognition
  // =========================
 useEffect(() => {
  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    console.log(
      "Speech Recognition not supported"
    );
    return;
  }

  const recognition =
    new SpeechRecognition();

  recognitionRef.current =
    recognition;

  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.lang = "en-IN";

  // =====================
  // Result
  // =====================
  recognition.onresult = async (
    event
  ) => {
    try {
      const lastIndex =
        event.results.length - 1;

      let transcript =
        event.results[lastIndex][0]
          .transcript
          .trim();

      const assistantName =
        userData?.assistantName?.toLowerCase();

      if (!assistantName) return;

      console.log(
        "Heard:",
        transcript
      );
      setAssistantMessage(`you: ${transcript} `);

      const lowerTranscript =
        transcript.toLowerCase();

      // Wake word required
      if (
        !lowerTranscript.includes(
          assistantName
        )
      ) {
        return;
      }

      // Remove wake word
      transcript =
        lowerTranscript
          .replace(
            assistantName,
            ""
          )
          .trim();

      if (!transcript) return;

      console.log(
        "Command Sent:",
        transcript
      );

      const data =
        await getGeminiResponse(
          transcript
        );

      console.log(
        "Assistant Response:",
        data
      );

      if (data) {
        handleCommand(data);
      }
    } catch (error) {
      console.error(
        "Speech Result Error:",
        error
      );
    }
  };

  // =====================
  // Errors
  // =====================
  recognition.onerror = (
    event
  ) => {
    console.log(
      "Recognition Error:",
      event.error
    );

    if (
      event.error === "aborted" ||
      event.error === "no-speech"
    ) {
      return;
    }

    if (
      event.error === "network"
    ) {
      setTimeout(() => {
        try {
          if (
            !isListeningRef.current
          ) {
            recognition.start();
          }
        } catch {}
      }, 3000);
    }
  };

  // =====================
  // Start
  // =====================
  recognition.onstart = () => {
    isListeningRef.current = true;

    console.log(
      "Recognition Started"
    );
  };

  // =====================
  // Restart
  // =====================
  recognition.onend = () => {
    isListeningRef.current = false;

    console.log(
      "Recognition Ended"
    );

    setTimeout(() => {
      try {
        if (
          !isListeningRef.current &&
          !window.speechSynthesis
            .speaking
        ) {
          recognition.start();
        }
      } catch (error) {
        console.log(
          "Restart Error:",
          error.message
        );
      }
    }, 1000);
  };

  // =====================
  // Start Listening
  // =====================
  try {
    recognition.start();
  } catch (error) {
    console.log(
      "Recognition Start Error:",
      error
    );
  }

  // =====================
  // Cleanup
  // =====================
  return () => {
    if (recognitionRef.current) {
      recognitionRef.current
        .onresult = null;

      recognitionRef.current
        .onerror = null;

      recognitionRef.current
        .onstart = null;

      recognitionRef.current
        .onend = null;

      try {
        recognitionRef.current.abort();
      } catch (error) {
        console.log(error);
      }
    }

    window.speechSynthesis.cancel();
  };
}, [
  userData,
  getGeminiResponse,
  
]);
  return (

    <div className="w-full min-h-screen bg-linear-to-br from-black via-[#050160] to-[#0b0b45] flex items-center justify-center px-4 py-8">

      {/* Main Card */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-6 flex flex-col items-center">

        {/* Assistant Image */}
        <div className="relative">

          <img
            src={userData?.assistantImage}
            alt="Assistant Avatar"
            className="w-44 h-56 rounded-3xl object-cover border-4 border-cyan-400 shadow-lg"
          />

          {/* Online Dot */}
          <div className="absolute bottom-3 right-3 w-5 h-5 bg-green-400 border-2 border-white rounded-full animate-pulse"></div>

        </div>
        
        {/* Assistant Name */}
        <h1 className="text-3xl font-bold text-white mt-5 text-center font-serif">

          I'm {
            userData?.assistantName ||
            "Your Assistant"
          } 👋

        </h1>
        {/* Welcome Message */}
       <div className="mt-4 w-full">
  {/* <div className="bg-white/10 border border-cyan-400/30 rounded-xl p-3 min-h-80"> */}
    <p className="text-shadow-amber-950 text-center text-sm shadow-2xl font-semibold animate-bounce">
      {assistantMessage}
    </p>
  {/* </div> */}
</div>

        {/* Buttons */}
        <div className="w-full mt-6 flex flex-col gap-4">

          {/* Customize */}
          <button
            onClick={handleCustomize}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-2xl bg-linear-to-r from-cyan-500 to-blue-600 text-white font-semibold text-lg hover:scale-105 transition-all duration-300 shadow-lg cursor-pointer"
          >

            <FaMagic />

            Customize Assistant

          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-2xl bg-red-500 text-white font-semibold text-lg hover:bg-red-600 hover:scale-105 transition-all duration-300 shadow-lg cursor-pointer"
          >

            <FaSignOutAlt />

            Logout

          </button>

        </div>

        {/* Footer */}
        <div className="mt-8 flex items-center gap-2 text-cyan-300 text-sm">

          <FaRobot />

          <span>
            Developed by HARDIK
          </span>

        </div>

      </div>

    </div>
  );
}

export default Home;
