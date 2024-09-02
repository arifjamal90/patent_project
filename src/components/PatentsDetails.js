import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
// import { MdOutlineBrowserUpdated } from "react-icons/md";
import { PatentContext } from "../context/PatentContextProvider";
import { BsCalendarDateFill } from "react-icons/bs";
import { FaUserTie } from "react-icons/fa6";
// import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { FaArrowUp } from "react-icons/fa6";
import { GoogleGenerativeAI } from "@google/generative-ai";

import Aos from "aos";
import "aos/dist/aos.css";
import  Navbar from "./Navbar";
import "./style/Patentdetails.css";
import  Chatbot from "./Chatbot/Chatbot";

const PatentDetails = () => {
  const { patentsData, selectedPatent, patentSelected } = useContext(
    PatentContext
  );
  const { patentId } = useParams();

  const [activeClaim, setActiveClaim] = useState(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  // const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [voiceType, setVoiceType] = useState(null);
  // const [currentIndex, setCurrentIndex] = useState(0);
  // const [displayedText, setDisplayedText] = useState("");
  const [showSummary,setShowSummary]=useState(false);

  

  useEffect(() => {
    patentSelected(patentId);
    setVoiceType(null);
  }, [patentId]);
  useEffect(() => {
    // setSummary(false);
    setVoiceType(null);
  }, [selectedPatent]);

  useEffect(() => {
    Aos.init({ duration: 1500 });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 130) {
        setShowScrollButton(true);
        setShowSummary(true)
      } else {
        setShowScrollButton(false);
        setShowSummary(false)
        
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setShowScrollButton(false);
  };

  const apiKey = process.env.REACT_APP_API_KEY;
  let genAI;
  let model;
  if (apiKey !== undefined) {
    genAI = new GoogleGenerativeAI(`${apiKey}`);
    model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }
  const speakSummary = (text, typeOfVoice) => {
    if (window.responsiveVoice) {
     

      const voiceList = window.responsiveVoice.getVoices();

      if (typeOfVoice === "Legal") {
        window.responsiveVoice.speak(text, voiceList[8].name);
      }
      if (typeOfVoice === "Business") {
        window.responsiveVoice.speak(text, voiceList[8].name);
      }
      if (typeOfVoice === "10th Grade") {
        window.responsiveVoice.speak(text, voiceList[8].name);
      }
    }
  };

  const generateSummary = async (claims, languageStyle) => {
    setIsLoading(true);
    setVoiceType(languageStyle);

    const combinedClaims = claims.join("\n");
    const prompt = `Analyze the following claims and provide a summary in ${languageStyle}:\n\n${combinedClaims}\n\nThe summary should concisely capture the essence of all claims combined, without being too large or too small. Do not include questions,summary in voice type and do not use special symbols. in the response. `;

    try {
      const result = await model.generateContent(prompt);
      const generatedSummary =
        result.response.candidates[0].content.parts[0].text;
      // setSummary(generatedSummary);

      setIsLoading(false);
      speakSummary(generatedSummary, languageStyle);
    } catch (error) {
      console.error("Error generating summary:", error);
      setIsLoading(false);
    }
  };






  return (
    <>
      <Navbar
        choosenPatent={selectedPatent}
        activePatentId={patentId}
        showScrollButton={showScrollButton}
      />
      <div id="top" className="relative " data-aos="fade-up">
        <div className="bg-black py-20">
          <div className="flex-col mb-10 px-14">
            <p
              className=" sm:text-3xl md:text-3xl lg:text-4xl font-bold text-center rounded-md text-white pb-3 font-roboto font-openfont"
              style={{ textShadow: "1px 0px 2px rgba(0,0,0,0.6)" }}
            >
              {selectedPatent?.title}
            </p>
            <p
              className="sm:text-lg md:text-xl  text-white text-center font-medium pb-8 font-openfont"
              style={{ textShadow: "1px 0px 2px rgba(0,0,0,0.6)" }}
            >
              {selectedPatent?.patentId}
            </p>
          </div>
        </div>
        <div className="relative right-0 left-0 w-[94%] px-5 mx-auto p-2 rounded-lg  bg-white lg:px-10">
          <div className="relative h-100vh w-full ">
            <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  gap-2 justify-between   font-semibold   my-4 sm:my-3 md:my-2 lg:my-4">
              <div className="flex  w-64 gap-4    items-center sm:justify-start lg:justify-center ">
                <span className="w-12 h-12  rounded-full text-center pl-3 pt-2.5 bg-white border border-black ">
                  <FaUserTie className="text-2xl font-extrabold " />
                </span>
                <div>
                  <p className="text-2xl">Inventor</p>
                  <p className="text-[0.8rem] text-[#3b4455]">
                    {selectedPatent.inventor}
                  </p>
                </div>
              </div>

              <div className="flex  w-64 gap-4 items-center  sm:justify-start lg:justify-center ">
                <span className="w-12 h-12  rounded-full text-center pl-2 pt-2.5 bg-white border border-black ">
                  <svg
                    class="w-7 h-7"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 576 512"
                  >
                    <path d="M0 96l576 0c0-35.3-28.7-64-64-64H64C28.7 32 0 60.7 0 96zm0 32V416c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V128H0zM64 405.3c0-29.5 23.9-53.3 53.3-53.3H234.7c29.5 0 53.3 23.9 53.3 53.3c0 5.9-4.8 10.7-10.7 10.7H74.7c-5.9 0-10.7-4.8-10.7-10.7zM176 192a64 64 0 1 1 0 128 64 64 0 1 1 0-128zm176 16c0-8.8 7.2-16 16-16H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H368c-8.8 0-16-7.2-16-16zm0 64c0-8.8 7.2-16 16-16H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H368c-8.8 0-16-7.2-16-16zm0 64c0-8.8 7.2-16 16-16H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H368c-8.8 0-16-7.2-16-16z"></path>
                  </svg>
                </span>
                <div>
                  <p className="text-2xl">Patent ID</p>
                  <p className="text-[0.8rem] text-[#3b4455]">
                    {selectedPatent.patentId}
                  </p>
                </div>
              </div>

              <div className="flex  w-64 gap-4  items-center sm:py-2 sm:justify-start lg:justify-center ">
                <span className="w-12 h-12  rounded-full text-center pl-3 pt-2.5 bg-white border border-black ">
                  <BsCalendarDateFill className="text-2xl font-extrabold " />
                </span>
                <div>
                  <p className="text-2xl">File Date</p>
                  <p className="text-[0.8rem] text-[#3b4455]">
                    {selectedPatent?.fileDate}
                  </p>
                </div>
              </div>
              <div className="flex  w-64 gap-4  items-center sm:py-2 sm:justify-start lg:justify-center ">
                <span className="w-12 h-12  rounded-full text-center pl-3 pt-2.5 bg-white border border-black ">
                  <BsCalendarDateFill className="text-2xl font-extrabold " />
                </span>
                <div>
                  <p className="text-2xl">Issued Date</p>
                  <p className="text-[0.8rem] text-[#3b4455]">
                    {selectedPatent.issued}
                  </p>
                </div>
              </div>
            </div>
            <p className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold leading-3 text-[#00A4E5] pt-4 pb-8 font-openfont  text-start">
              Abstract
            </p>
            <p className="text-md sm:text-lg leading-relaxed text-[#3b4455] text-[12px] font-roboto">
              {selectedPatent.abstract}
            </p>
            <p className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold leading-3 text-[#00A4E5] py-8 font-openfont">
              Field Of Inventor
            </p>
            <p className="text-md sm:text-lg leading-relaxed text-[#3b4455] text-[12px] font-roboto">
              {selectedPatent.fieldOfInventor}
            </p>
            <p className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold leading-3 text-[#00A4E5] py-8 font-openfont ">
              Claims
            </p>
          </div>
          <div className=" pb-32 md:pb-10">
          {selectedPatent?.claims?.map((claim, index) => (
            <div key={index} className="mb-3">
              <button
                className={`${
                  activeClaim === index ? "" : ""
                }sm:px-2 w-full text-left font-semibold text-[#3b4455] text-lg  py-0 rounded-lg    flex justify-between`}
              ></button>
              {
                <div className=" pt-2 text-md sm:text-lg leading-relaxed text-[#3b4455] text-[12px] font-roboto">
                  {claim}
                </div>
              }
            </div>
          ))}
            </div>
        </div>
      </div>
      <div className="">
        {showScrollButton && (
          <button
            className="fixed bottom-3 md:bottom-16 lg:bottom-3 right-4 sm:right-8 z-20   py-2 px-2  sm:py-2 sm-px-2 md:right-3 md:px-3 md:py-3 md:text-2xl  text-xl cursor-pointer hover:bg-[#00000098] bg-[#00000068] text-white rounded-full"
            onClick={scrollToTop}
          >
            <FaArrowUp />
          </button>
        )}

    <Chatbot />
     </div> 
        

     {
     showSummary  && (
     <div className="flex flex-col pt-5 w-9/10   md:flex-row justify-around md:w-full fixed bottom-0 items-center px-10  md:px-2 lg:px-5">
        <button
          className="bg-[#3b4455] font-normal md:font-semibold cursor-pointer text-white  hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 focus:font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 w-72 md:w-72"
          onClick={() => {
             window.responsiveVoice.cancel();

            generateSummary(selectedPatent?.claims, "Legal");
          }}
        >
         {isLoading && voiceType === "Legal" ? (
              <p className="px-12">
                <span class="w-3 h-3 border-2 border-t-transparent border-white rounded-full inline-block animate-spin mr-2"></span>
                <span>Loading Voice.....</span>
              </p>
            ) : (
              <p>Summary Of Claims in legal voice</p>
            )}
        </button>
        <button
          className="bg-[#3b4455] font-normal md:font-semibold cursor-pointer text-white  hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 focus:font-medium rounded-full text-sm px-2 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 md:w-72 w-72"
          onClick={() => {
             window.responsiveVoice.cancel();
            generateSummary(selectedPatent?.claims, "Business");
          }}
        >
     {isLoading && voiceType === "Business" ? (
              <p className="px-12">
                <span class="w-3 h-3 border-2 border-t-transparent border-white rounded-full inline-block animate-spin mr-2"></span>
                <span>Loading Voice.....</span>
              </p>
            ) : (
              <p>Summary Of Claims in Business Voice</p>
            )}
        </button>
        <button
          className="bg-[#3b4455] font-normal md:font-semibold cursor-pointer text-white  hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 focus:font-medium rounded-full text-sm px-1 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 md:w-72 w-72"
          onClick={() => {
             window.responsiveVoice.cancel();
            generateSummary(selectedPatent?.claims, "10th Grade");
          }}
        >
         {isLoading && voiceType === "10th Grade" ? (
              <p className="px-12">
                <span class="w-3 h-3 border-2 border-t-transparent border-white rounded-full inline-block animate-spin mr-2"></span>
                <span>Loading Voice.....</span>
              </p>
            ) : (
              <p>Summary Of Claims in 10th grade voice</p>
            )}
        </button>
        
      </div>

     )
     }
     
      
      
      
 
    </>
  );
};

export default PatentDetails;
