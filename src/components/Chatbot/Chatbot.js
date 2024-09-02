import React, { useState } from 'react';
import { LuSendHorizonal } from "react-icons/lu";
import { FaRocketchat } from 'react-icons/fa';
import { MdOutlineCancel } from 'react-icons/md';
import { GoogleGenerativeAI } from "@google/generative-ai";

const Chatbot = () => {
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const apiKey = process.env.REACT_APP_API_KEY;
  let genAI;
  let model;
  if (apiKey !== undefined) {
    genAI = new GoogleGenerativeAI(`${apiKey}`);
    model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  const handleChatbotOpen = () => {
    setShowChatbot(true);
  };

  const handleChatbotClose = () => {
    setShowChatbot(false);
  };

  const handleSendMessage = async () => {
    if (chatInput.trim() === '') return;

    const newMessage = { sender: 'user', text: chatInput };
    setChatHistory([...chatHistory, newMessage]);
    setChatInput('');
    setIsLoading(true);

    try {
      const response = await model.generateContent(chatInput);
      const botResponse = response.response.candidates[0].content.parts[0].text;
      setChatHistory([...chatHistory, newMessage, { sender: 'bot', text: botResponse }]);
    } catch (error) {
      console.error("Error generating response:", error);
      setChatHistory([...chatHistory, newMessage, { sender: 'bot', text: "Sorry, I couldn't process that." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Chatbot Toggle Button */}
      <button
        className="fixed bottom-[4.1rem] md:bottom-[7.5rem] lg:bottom-[4.1rem] right-4 z-20 py-2 px-2 sm:right-2 sm:py-2 sm:px-2 md:right-3 md:px-3 md:py-3 md:text-2xl text-xl cursor-pointer hover:bg-[#00000098] bg-[#00000068] text-white rounded-full"
        onClick={handleChatbotOpen}
      >
        <FaRocketchat className="text-[20px] md:text-[30px]" />
      </button>

      {/* Chatbot Modal */}
      {showChatbot && (
        <div className="fixed inset-0 z-30 flex items-start justify-center md:justify-end md:items-start md:top-0 md:right-0 bg-black bg-opacity-50">
          <div className="bg-white h-[330px] sm:h-[680px] lg:h-[400px] w-[90%] sm:w-[70%] md:w-[100%] lg:w-[40%] xl:w-[30%] rounded-md border border-black  relative top-[8rem] md:top-[8rem] lg:top-[6rem]">

          
            <div className="h-full flex flex-col">
            <div className='bg-blue-600 w-full h-10 px-4 items-center  flex gap-5 py-4  rounded-t-md'>
            <div><FaRocketchat className='text-white text-[22px]'/> </div>
           <p className='text-white text-xl font-normal'>How can i help you</p>
          </div>
              {/* Chat History */}
              <div className="flex-grow overflow-y-auto mb-4">
                {chatHistory.map((message, index) => (
                  <div key={index} className={`mb-2 flex ${message.sender === 'user' ? 'justify-end px-4 py-2' : 'justify-start px-4'}`}>
                    <div className={`inline-block px-4 py-2 rounded-lg ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}>
                      {message.text}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start items-center text-gray-500">
                    <div className="w-5 h-5 border-4 border-solid border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="pl-2">Generating response...</span>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="flex justify-center mb-1">
                <input
                  type="text"
                  placeholder="Type Here"
                  className="flex-grow px-4 py-2 rounded-l-full border border-gray-500 md-py-5 md:text-lg"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button onClick={handleSendMessage} className="px-3 py-2 bg-blue-500 text-white rounded-r-full">
                  <LuSendHorizonal className="text-[27px]" />
                </button>
              </div>
            </div>

            {/* Close Button */}
            <button
              className="absolute top-0 right-0 text-xl cursor-pointer hover:bg-[#00000098] bg-[#00000068] text-white rounded-full "
              onClick={handleChatbotClose}
            >
              <MdOutlineCancel className="text-[25px]" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
