import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState , useEffect } from "react";
import React from 'react';
import { Loader2, TrendingUp, AlertCircle, CheckCircle2, XCircle, Lightbulb, Target, DollarSign, Users, Shield, Rocket, Wrench, UserCheck,ChevronDown } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';


import Footer from "../../components/footer.";


import { useNavigate } from "react-router-dom";
import { handleAIResponse } from "../../utils/aipreviewedit";
import useUsername from "../../services/getcurrentUsername";

import { useUsageLimit } from "../../hook/useUsageLimit";



const Scoring_Tool = () => {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [openTools, setOpenTools] = useState(false);

  const [buttonLoading ,setButtonLoading ] = useState(false);


    const {
    usageCount,
    limit,
    isLimited,
    hours,
    minutes,
    incrementUsage,
  } = useUsageLimit("CompetitorFinder", 2, 1);

  const [timeDisplay, setTimeDisplay] = useState("");



 useEffect(() => {
    const interval = setInterval(() => {
      if (isLimited) {
        const now = new Date();
        const totalMinutes = hours * 60 + minutes;
        const hrs = Math.floor(totalMinutes / 60);
        const mins = Math.floor(totalMinutes % 60);
        const secs = new Date().getSeconds();

        setTimeDisplay(`${hrs}h ${mins}m`);
      } else {
        setTimeDisplay("");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isLimited, hours, minutes]);

  const prompt = `
<Role>
You are The Brutal Business Idea Validator — a ruthless venture capitalist with 25+ years of experience who has seen thousands of startups fail. You provide harsh, evidence-based evaluations of startup ideas. Your goal is to expose fatal flaws and identify only the rare concepts with real potential.
</Role>

<Context>
Most startups fail due to poor problem validation, weak market understanding, overestimation of demand, and lack of differentiation. You have invested in unicorns and seen countless ideas crash. You help founders avoid wasting years chasing unviable ideas.
</Context>

<Instructions>
When a user submits a business idea, follow these steps:

1. Summarize the idea briefly.
2. Analyze it critically across the following areas:
   - Problem Validity
   - Solution Fit
   - Market Size
   - Revenue Model
   - Competitive Landscape
   - Defensibility
   - Go-to-Market Strategy
   - Execution Challenges
   - Founder-Market Fit
3. For each category:
   - Give a **score (0–10)**.
   - Write a **brutally honest critique**.
4. Calculate a **total score (0–100)** based on the sum of all categories.
5. Give a **final verdict**:
   - "LIKELY TO FAIL" (0–40)
   - "NEEDS SIGNIFICANT RETHINKING" (41–60)
   - "SHOWS PROMISE, BUT REQUIRES VALIDATION" (61–80)
   - "POTENTIALLY VIABLE" (81–100)
6. Suggest **3–5 next steps** to improve or validate the idea.
</Instructions>

<Output_Format>
Return ONLY valid JSON without any markdown formatting or code blocks:
{
  "idea_summary": "string",
  "analysis": [
    {
      "category": "Problem Validity",
      "score": 0-10,
      "critique": "string"
    },
    {
      "category": "Solution Fit",
      "score": 0-10,
      "critique": "string"
    },
    {
      "category": "Market Size",
      "score": 0-10,
      "critique": "string"
    },
    {
      "category": "Revenue Model",
      "score": 0-10,
      "critique": "string"
    },
    {
      "category": "Competitive Landscape",
      "score": 0-10,
      "critique": "string"
    },
    {
      "category": "Defensibility",
      "score": 0-10,
      "critique": "string"
    },
    {
      "category": "Go-to-Market Strategy",
      "score": 0-10,
      "critique": "string"
    },
    {
      "category": "Execution Challenges",
      "score": 0-10,
      "critique": "string"
    },
    {
      "category": "Founder-Market Fit",
      "score": 0-10,
      "critique": "string"
    }
  ],
  "total_score": 0-100,
  "final_verdict": "string",
  "critical_next_steps": [
    "string",
    "string",
    "string"
  ]
}
</Output_Format>
`;
const navigate = useNavigate();


  const categoryIcons = {
    "Problem Validity": AlertCircle,
    "Solution Fit": Target,
    "Market Size": TrendingUp,
    "Revenue Model": DollarSign,
    "Competitive Landscape": Users,
    "Defensibility": Shield,
    "Go-to-Market Strategy": Rocket,
    "Execution Challenges": Wrench,
    "Founder-Market Fit": UserCheck
  };


const {username} = useUsername();
 const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });


  const handleValidation = async () => {
    if (!description.trim() ) {
      setError("Please enter your business idea first!");
      return;
    }

    if(isLimited){
      console.log("limit reached");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
     
      const fullPrompt = `${prompt}\n\n<User_Idea>\n${description}\n</User_Idea>`;
      const response = await model.generateContent(fullPrompt);
      const text = response.response.text();
      
      // Clean the response text
      let cleanedText = text.trim();
      cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      const parsedResult = JSON.parse(cleanedText);
      setResult(parsedResult);
      incrementUsage();
    } catch (err) {
      console.error("Validation error:", err);
      setError("Failed to validate your idea. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  
  const handlewaitlist = async ()=>{


 handleAIResponse({
      description,
      model,
      navigate,
      username,
      setButtonLoading,
    });
    
  }

  const getVerdictColor = (verdict) => {
    if (verdict.includes("FAIL")) return "text-red-600";
    if (verdict.includes("RETHINKING")) return "text-orange-600";
    if (verdict.includes("PROMISE")) return "text-yellow-600";
    return "text-green-600";
  };

  const getVerdictIcon = (verdict) => {
    if (verdict.includes("FAIL")) return XCircle;
    if (verdict.includes("RETHINKING")) return AlertCircle;
    if (verdict.includes("PROMISE")) return CheckCircle2;
    return CheckCircle2;
  };

  const getScoreColor = (score) => {
    if (score <= 4) return "#ef4444";
    if (score <= 7) return "#f59e0b";
    return "#46AA72";
  };

  const pieData = result?.analysis.map(item => ({
    name: item.category,
    value: item.score,
    fill: getScoreColor(item.score)
  })) || [];

  return (
    <>


      <p className="text-gray-600 mb-4">
        Uses left: {limit - usageCount} / {limit}
      </p>


      {isLimited && (
        <>
          <p className="text-sm">
            Try again in <span className="font-medium">{timeDisplay}</span>
          </p>
        </>
      )}
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-4">
        <header className="bg-white/90 backdrop-blur-sm border-b border-green-100 shadow-sm w-full sticky top-0 z-50 transition-all duration-300 hover:shadow-md">
    <div className="px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex cursor-pointer" onClick={()=>navigate('/')}>
          <img src="./Bloomqueue_Logo_V2.png"
            alt="Logo"
            className="w-8 h-8 object-contain"
          />
          <span className="text-2xl font-bold ml-2">
            Bloom<span className="text-[#46AA72]">Queue</span>
          </span>
          </div>

          <ul className="hidden md:flex space-x-8 text-sm font-medium">
              <li>
              <a href='/' className="hover:text-green-600 transition">
                Home
              </a>
            </li>
                     
<li className="relative">
      {/* Button to toggle dropdown */}
      <button
        onClick={() => setOpenTools(!openTools)}
        className="flex items-center hover:text-green-600 transition text-sm font-medium"
      >
        Tools
        <ChevronDown
          size={16}
          className={`ml-1 transition-transform duration-300 ${
            openTools ? "rotate-180 text-green-600" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {openTools && (
        <ul
          className="absolute right-0 mt-3 w-60 rounded-xl bg-white/95 backdrop-blur-lg shadow-lg 
                     p-4 space-y-3 border border-gray-100 animate-dropdown"
        >
          <li>
            <a
              href="/idea-validator"
              className="block text-gray-800 font-medium hover:text-green-600 transition"
            >
              Idea Ranker
            </a>
          </li>
          <li>
            <a
              href="/competitor-finder"
              className="block text-gray-800 font-medium hover:text-green-600 transition"
            >
              Competitor Finder
            </a>
          </li>
          <li>
            <a
              href="/market-size-estimate"
              className="block text-gray-800 font-medium hover:text-green-600 transition"
            >
              Market Size Estimator
            </a>
          </li>
        </ul>
      )}

      <style jsx>{`
        @keyframes dropdownFade {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-dropdown {
          animation: dropdownFade 0.25s ease-out;
        }
      `}</style>
    </li>
          </ul>
        <div className="hidden sm:block">
          <span className="text-xs font-medium bg-green-100 text-green-800 px-2.5 py-1 rounded-full transition-all hover:bg-purple-200">
            BETA
          </span>
        </div>
      </div>
    </div>
  </header>

  
      <div className="max-w-6xl mx-auto mt-12">
        {/* Header */}
        <div className="text-center mb-12">
          {/* <div className="inline-block p-3 bg-white rounded-2xl shadow-lg mb-4">
            <Lightbulb className="w-12 h-12" style={{ color: '#46AA72' }} />
          </div> */}
          <h1 className="text-5xl font-bold mb-4" style={{ color: '#003F2F' }}>
            Idea Ranker
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get a professional, venture-capital-level analysis of your startup idea — grounded in real-world data and investor logic.
          </p>
        </div>

        {/* Input Section */}
        {!result && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8" style={{ borderTop: '6px solid #46AA72' }}>
            <label className="block text-2xl font-semibold mb-4" style={{ color: '#003F2F' }}>
              Describe Your Business Idea
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter your startup idea here... Be specific about the problem you're solving, your target market, and your solution."
              className="w-full h-48 p-6 border-2 rounded-2xl text-lg focus:outline-none transition-all"
              style={{ 
                borderColor: '#90C1CA',
                backgroundColor: '#F7F8F3'
              }}
              onFocus={(e) => e.target.style.borderColor = '#46AA72'}
              onBlur={(e) => e.target.style.borderColor = '#90C1CA'}
            />
            
            {error && (
              <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            )}

            <button
              onClick={handleValidation}
              disabled={loading || isLimited}
              className="mt-6 w-full py-5 rounded-2xl text-white font-bold text-xl transition-all transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
              style={{ backgroundColor: '#46AA72' }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Analyzing Your Idea...
                </>
              ) : (
                <>
                  <Target className="w-6 h-6" />
                  Validate My Idea
                </>
              )}
            </button>
          </div>
        )}


        {/* About / Explanation Section */}
{!result && (
  <section className="max-w-6xl mx-auto mt-16 bg-white rounded-3xl shadow-2xl p-10 border-t-4 border-[#46AA72]">
    <h2 className="text-3xl font-bold text-[#003F2F] text-center mb-6">
      What You’ll Get from the Idea Ranker
    </h2>

    <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-10 leading-relaxed">
      The <span className="text-[#46AA72] font-semibold">BloomQueue Idea Ranker</span> gives you a complete, venture-capital-grade analysis of your startup idea.
      It doesn’t just rate your concept — it breaks it down into actionable insights, visual feedback, and next steps to help you refine your business model.
    </p>

    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Summary Card */}
      <div className="bg-green-50 border border-green-100 rounded-2xl p-6 hover:shadow-md transition-all">
        <h3 className="text-xl font-semibold text-[#003F2F] mb-2">🧾 Summary Card</h3>
        <p className="text-gray-600">
          A quick, professional overview of your startup idea — written in investor-style tone.
        </p>
      </div>

      {/* Score Overview */}
      <div className="bg-green-50 border border-green-100 rounded-2xl p-6 hover:shadow-md transition-all">
        <h3 className="text-xl font-semibold text-[#003F2F] mb-2">📊 Score Overview</h3>
        <p className="text-gray-600">
          Each critical category (market fit, innovation, scalability, etc.) is scored individually.
        </p>
      </div>

      {/* Total Score */}
      <div className="bg-green-50 border border-green-100 rounded-2xl p-6 hover:shadow-md transition-all">
        <h3 className="text-xl font-semibold text-[#003F2F] mb-2">🏆 Total Score</h3>
        <p className="text-gray-600">
          Your idea gets a final 100-point rating, combining all weighted factors into one score.
        </p>
      </div>

      {/* Verdict */}
      <div className="bg-green-50 border border-green-100 rounded-2xl p-6 hover:shadow-md transition-all">
        <h3 className="text-xl font-semibold text-[#003F2F] mb-2">🧭 Verdict Card</h3>
        <p className="text-gray-600">
          A summarized verdict: whether your idea <span className="font-semibold">shows promise</span>, needs work, or is investor-ready.
        </p>
      </div>

      {/* Score Distribution */}
      <div className="bg-green-50 border border-green-100 rounded-2xl p-6 hover:shadow-md transition-all">
        <h3 className="text-xl font-semibold text-[#003F2F] mb-2">📈 Score Distribution</h3>
        <p className="text-gray-600">
          A visual chart showing how your idea performs across different evaluation categories.
        </p>
      </div>

      {/* Detailed Analysis */}
      <div className="bg-green-50 border border-green-100 rounded-2xl p-6 hover:shadow-md transition-all">
        <h3 className="text-xl font-semibold text-[#003F2F] mb-2">🔍 Detailed Analysis</h3>
        <p className="text-gray-600">
          Deep insights into what makes your idea strong — and what might hold it back from scaling.
        </p>
      </div>

      {/* Next Steps */}
      <div className="bg-green-50 border border-green-100 rounded-2xl p-6 hover:shadow-md transition-all sm:col-span-2 lg:col-span-3">
        <h3 className="text-xl font-semibold text-[#003F2F] mb-2">🚀 Next Steps</h3>
        <p className="text-gray-600">
          Actionable recommendations to move forward — from improving your pitch to validating market demand.
        </p>
      </div>
    </div>
  </section>
)}


        {/* Results Section */}
        {result && (
          <div className="space-y-8 animate-fadeIn">
            {/* Summary Card */}
            <div className="bg-white rounded-3xl shadow-2xl p-8" style={{ borderTop: '6px solid #003F2F' }}>
              <h2 className="text-3xl font-bold mb-4" style={{ color: '#003F2F' }}>
                Idea Summary
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">{result.idea_summary}</p>
            </div>

            {/* Score Overview */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Total Score Card */}
              <div className="bg-white rounded-3xl shadow-2xl p-8" style={{ borderTop: '6px solid #46AA72' }}>
                <h2 className="text-2xl font-bold mb-6" style={{ color: '#003F2F' }}>
                  Overall Score
                </h2>
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <div className="w-48 h-48 rounded-full flex items-center justify-center" style={{ 
                      backgroundColor: '#F7F8F3',
                      border: `8px solid ${result.total_score > 60 ? '#46AA72' : result.total_score > 40 ? '#f59e0b' : '#ef4444'}`
                    }}>
                      <div className="text-center">
                        <div className="text-6xl font-bold" style={{ 
                          color: result.total_score > 60 ? '#46AA72' : result.total_score > 40 ? '#f59e0b' : '#ef4444'
                        }}>
                          {result.total_score}
                        </div>
                        <div className="text-sm text-gray-600 font-medium">out of 100</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verdict Card */}
              <div className="bg-white rounded-3xl shadow-2xl p-8" style={{ borderTop: '6px solid #90C1CA' }}>
                <h2 className="text-2xl font-bold mb-6" style={{ color: '#003F2F' }}>
                  Final Verdict
                </h2>
                <div className="flex flex-col items-center justify-center h-40">
                  {React.createElement(getVerdictIcon(result.final_verdict), {
                    className: `w-20 h-20 mb-4 ${getVerdictColor(result.final_verdict)}`
                  })}
                  <p className={`text-2xl font-bold text-center ${getVerdictColor(result.final_verdict)}`}>
                    {result.final_verdict}
                  </p>
                </div>
              </div>
            </div>

            {/* Score Distribution Chart */}
            <div className="bg-white rounded-3xl shadow-2xl p-8" style={{ borderTop: '6px solid #003F2F' }}>
              <h2 className="text-2xl font-bold mb-6" style={{ color: '#003F2F' }}>
                Score Distribution
              </h2>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name.split(' ')[0]}: ${value}`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Detailed Analysis */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold" style={{ color: '#003F2F' }}>
                Detailed Analysis
              </h2>
              {result.analysis.map((item, index) => {
                const Icon = categoryIcons[item.category];
                return (
                  <div
                    key={index}
                    className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all"
                    style={{ borderLeft: `6px solid ${getScoreColor(item.score)}` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl" style={{ backgroundColor: '#F7F8F3' }}>
                        <Icon className="w-8 h-8" style={{ color: '#46AA72' }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-2xl font-bold" style={{ color: '#003F2F' }}>
                            {item.category}
                          </h3>
                          <div className="flex items-center gap-2">
                            <div className="text-3xl font-bold" style={{ color: getScoreColor(item.score) }}>
                              {item.score}
                            </div>
                            <div className="text-gray-500 text-sm">/10</div>
                          </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed text-lg">{item.critique}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Next Steps */}
            <div className="bg-white rounded-3xl shadow-2xl p-8" style={{ borderTop: '6px solid #46AA72' }}>
              <h2 className="text-3xl font-bold mb-6" style={{ color: '#003F2F' }}>
                Critical Next Steps
              </h2>
              <div className="space-y-4">
                {result.critical_next_steps.map((step, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 rounded-xl" style={{ backgroundColor: '#F7F8F3' }}>
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: '#46AA72' }}>
                      {index + 1}
                    </div>
                    <p className="text-lg text-gray-700 leading-relaxed pt-1">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Try Again Button */}

<div className="flex flex-col sm:flex-row gap-4 mt-8 w-full max-w-md mx-auto">
  {/* Primary Button */}
  <button
    onClick={handlewaitlist}
    disabled={buttonLoading}
    className={`flex-1 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-md
      ${
        buttonLoading
          ? "bg-[#003F2F]/70 cursor-not-allowed text-white"
          : "bg-gradient-to-r from-[#005C44] to-[#008C6F] text-white hover:shadow-xl hover:scale-[1.02]"
      }`}
  >
    {buttonLoading ? (
      <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
    ) : (
      "Generate Waitlist"
    )}
  </button>

  {/* Secondary Button */}
  <button
    onClick={() => {
      setResult(null);
      setDescription("");
      setError(null);
    }}
    className="flex-1 px-1 py-4 rounded-xl font-semibold text-lg text-[#003F2F] bg-white border border-[#003F2F] transition-all duration-300 flex items-center justify-center gap-2 hover:bg-[#eef9f6] hover:shadow-md"
  >
    <Lightbulb className="w-5 h-5" />
    Validate Another Idea
  </button>
</div>

          </div>
        )}
      </div>



    </div>

    
        <div className="mt-4">
          <Footer />
        </div>  
        </>
  );
};

export default Scoring_Tool;