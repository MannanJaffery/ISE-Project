import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState } from "react";
import { Loader2, Search, TrendingUp, Users, DollarSign, Target, Shield, Zap, Globe, Award, ExternalLink, AlertTriangle, Info, Sparkles , ChevronDown } from "lucide-react";




import Footer from "../../components/footer.";


import { useNavigate } from "react-router-dom";
import useUsername from "../../services/getcurrentUsername";

import { handleAIResponse } from "../../utils/aipreviewedit";

const CompetitorFinder = () => {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [openTools, setOpenTools] = useState(false);
  const [buttonLoading ,setButtonLoading ] = useState(false);
  const navigate = useNavigate();

  const prompt = `
<Role>
You are an Expert Market Research Analyst with 20+ years of experience in competitive intelligence, market mapping, and strategic positioning. You provide comprehensive competitor analysis for startups and businesses.
</Role>

<Context>
Understanding the competitive landscape is crucial for startup success. You help founders identify direct and indirect competitors, understand market positioning, and discover strategic opportunities and threats.
</Context>

<Instructions>
When a user submits a business idea, analyze the competitive landscape:

1. Identify 5-8 main competitors (mix of direct and indirect)
2. For each competitor provide:
   - Company name
   - Brief description (1-2 sentences)
   - Market position (Leader/Challenger/Niche)
   - Strengths (2-3 points)
   - Weaknesses (2-3 points)
   - Estimated funding/revenue stage
   - Website URL (if known, or "N/A")
3. Provide market insights:
   - Market maturity level
   - Market size estimate
   - Key trends
   - Entry barriers
4. Strategic recommendations:
   - Differentiation opportunities
   - Potential threats
   - Strategic positioning advice

Return ONLY valid JSON without any markdown formatting or code blocks.
</Instructions>

<Output_Format>
{
  "idea_summary": "string",
  "market_overview": {
    "market_maturity": "Emerging/Growing/Mature/Saturated",
    "estimated_market_size": "string",
    "key_trends": ["string", "string", "string"]
  },
  "competitors": [
    {
      "name": "string",
      "description": "string",
      "market_position": "Market Leader/Strong Challenger/Emerging Player/Niche Player",
      "strengths": ["string", "string"],
      "weaknesses": ["string", "string"],
      "funding_stage": "string",
      "website": "string or N/A"
    }
  ],
  "strategic_insights": {
    "differentiation_opportunities": ["string", "string", "string"],
    "potential_threats": ["string", "string"],
    "positioning_advice": "string"
  }
}
</Output_Format>
`;

  
const {username} = useUsername();
 const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });


  const handleAnalysis = async () => {
    if (!description.trim()) {
      setError("Please enter your business idea first!");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const fullPrompt = `${prompt}\n\n<User_Idea>\n${description}\n</User_Idea>`;
      const response = await model.generateContent(fullPrompt);
      const text = response.response.text();
      
      let cleanedText = text.trim();
      cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      const parsedResult = JSON.parse(cleanedText);
      setResult(parsedResult);
    } catch (err) {
      console.error("Analysis error:", err);
      setError("Failed to analyze competitors. Please check your API key and try again.");
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




  const getPositionColor = (position) => {
    if (position.includes("Leader")) return "#46AA72";
    if (position.includes("Challenger")) return "#90C1CA";
    if (position.includes("Emerging")) return "#f59e0b";
    return "#003F2F";
  };

  const getPositionBadge = (position) => {
    if (position.includes("Leader")) return { icon: Award, color: "#46AA72" };
    if (position.includes("Challenger")) return { icon: TrendingUp, color: "#90C1CA" };
    if (position.includes("Emerging")) return { icon: Sparkles, color: "#f59e0b" };
    return { icon: Target, color: "#003F2F" };
  };

  const getMaturityColor = (maturity) => {
    if (maturity === "Emerging") return "#46AA72";
    if (maturity === "Growing") return "#90C1CA";
    if (maturity === "Mature") return "#f59e0b";
    return "#ef4444";
  };

  return (

    <>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-4 ">
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
      <div className="max-w-7xl mx-auto mt-12">
        {/* Header */}
        <div className="text-center mb-12">

          <h1 className="text-5xl font-bold mb-4" style={{ color: '#003F2F' }}>
            Competitor Finder
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover your competition, understand the market landscape, and find your strategic advantage
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
              placeholder="Enter your business idea or industry... Include details about your product, target market, and key features."
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
              onClick={handleAnalysis}
              disabled={loading}
              className="mt-6 w-full py-5 rounded-2xl text-white font-bold text-xl transition-all transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
              style={{ backgroundColor: '#46AA72' }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Analyzing Market...
                </>
              ) : (
                <>
                  <Search className="w-6 h-6" />
                  Find Competitors
                </>
              )}
            </button>
          </div>
        )}


        {/* About / Explanation Section */}
{!result && (
  <section className="max-w-6xl mx-auto mt-16 bg-white rounded-3xl shadow-2xl p-10 border-t-4 border-[#46AA72]">
    <h2 className="text-3xl font-bold text-[#003F2F] text-center mb-6">
      What You’ll Get from the Competitor Finder
    </h2>

    <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-10 leading-relaxed">
      The <span className="text-[#46AA72] font-semibold">BloomQueue Competitor Finder</span> identifies, analyzes, and positions your startup idea within its competitive landscape. 
      It provides detailed intelligence on existing players, emerging threats, and market opportunities — all in one professional report.
    </p>

    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Summary Card */}
      <div className="bg-green-50 border border-green-100 rounded-2xl p-6 hover:shadow-md transition-all">
        <h3 className="text-xl font-semibold text-[#003F2F] mb-2">🧾 Summary Card</h3>
        <p className="text-gray-600">
          A concise overview of your idea’s position and competitive standing in the market.
        </p>
      </div>

      {/* Market Overview */}
      <div className="bg-green-50 border border-green-100 rounded-2xl p-6 hover:shadow-md transition-all">
        <h3 className="text-xl font-semibold text-[#003F2F] mb-2">🌍 Market Overview</h3>
        <p className="text-gray-600">
          A snapshot of your industry’s current landscape — market size, growth rate, and competitive density.
        </p>
      </div>

      {/* Key Trends */}
      <div className="bg-green-50 border border-green-100 rounded-2xl p-6 hover:shadow-md transition-all">
        <h3 className="text-xl font-semibold text-[#003F2F] mb-2">📈 Key Trends</h3>
        <p className="text-gray-600">
          Identifies emerging technologies, customer shifts, and macro trends shaping your competition.
        </p>
      </div>

      {/* Competitors */}
      <div className="bg-green-50 border border-green-100 rounded-2xl p-6 hover:shadow-md transition-all">
        <h3 className="text-xl font-semibold text-[#003F2F] mb-2">🏢 Competitors</h3>
        <p className="text-gray-600">
          Lists and analyzes both direct and indirect competitors — including their products, pricing, and positioning.
        </p>
      </div>

      {/* Strategic Insights & Opportunities */}
      <div className="bg-green-50 border border-green-100 rounded-2xl p-6 hover:shadow-md transition-all">
        <h3 className="text-xl font-semibold text-[#003F2F] mb-2">💡 Strategic Insights & Opportunities</h3>
        <p className="text-gray-600">
          Highlights untapped market gaps, differentiation angles, and innovation opportunities.
        </p>
      </div>

      {/* Potential Threats */}
      <div className="bg-green-50 border border-green-100 rounded-2xl p-6 hover:shadow-md transition-all">
        <h3 className="text-xl font-semibold text-[#003F2F] mb-2">⚠️ Potential Threats</h3>
        <p className="text-gray-600">
          Flags competitive risks, saturation indicators, and potential disruptions that could impact your idea.
        </p>
      </div>

      {/* Positioning Advice */}
      <div className="bg-green-50 border border-green-100 rounded-2xl p-6 hover:shadow-md transition-all sm:col-span-2 lg:col-span-3">
        <h3 className="text-xl font-semibold text-[#003F2F] mb-2">🎯 Positioning Advice</h3>
        <p className="text-gray-600">
          Actionable guidance on how to position your startup effectively — from brand differentiation to go-to-market strategy.
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
                Market Analysis
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">{result.idea_summary}</p>
            </div>

            {/* Market Overview */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl shadow-xl p-6" style={{ borderTop: '4px solid #46AA72' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: '#F7F8F3' }}>
                    <TrendingUp className="w-6 h-6" style={{ color: '#46AA72' }} />
                  </div>
                  <h3 className="text-lg font-bold" style={{ color: '#003F2F' }}>Market Maturity</h3>
                </div>
                <p className="text-2xl font-bold" style={{ color: getMaturityColor(result.market_overview.market_maturity) }}>
                  {result.market_overview.market_maturity}
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-6" style={{ borderTop: '4px solid #90C1CA' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: '#F7F8F3' }}>
                    <Globe className="w-6 h-6" style={{ color: '#90C1CA' }} />
                  </div>
                  <h3 className="text-lg font-bold" style={{ color: '#003F2F' }}>Market Size</h3>
                </div>
                <p className="text-xl font-semibold text-gray-700">
                  {result.market_overview.estimated_market_size}
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-6" style={{ borderTop: '4px solid #003F2F' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: '#F7F8F3' }}>
                    <Zap className="w-6 h-6" style={{ color: '#003F2F' }} />
                  </div>
                  <h3 className="text-lg font-bold" style={{ color: '#003F2F' }}>Key Trends</h3>
                </div>
                <p className="text-xl font-semibold text-gray-700">
                  {result.market_overview.key_trends.length} Active Trends
                </p>
              </div>
            </div>

            {/* Key Trends */}
            <div className="bg-white rounded-3xl shadow-2xl p-8" style={{ borderTop: '6px solid #90C1CA' }}>
              <h2 className="text-2xl font-bold mb-6" style={{ color: '#003F2F' }}>
                Key Market Trends
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                {result.market_overview.key_trends.map((trend, index) => (
                  <div key={index} className="p-4 rounded-xl flex items-start gap-3" style={{ backgroundColor: '#F7F8F3' }}>
                    <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: '#46AA72' }}>
                      {index + 1}
                    </div>
                    <p className="text-gray-700 leading-relaxed">{trend}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Competitors */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold" style={{ color: '#003F2F' }}>
                Competitor Landscape ({result.competitors.length} Companies)
              </h2>
              
              <div className="grid gap-6">
                {result.competitors.map((competitor, index) => {
                  const badge = getPositionBadge(competitor.market_position);
                  const BadgeIcon = badge.icon;
                  
                  return (
                    <div
                      key={index}
                      className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all"
                      style={{ borderLeft: `6px solid ${getPositionColor(competitor.market_position)}` }}
                    >
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-2xl font-bold" style={{ color: '#003F2F' }}>
                              {competitor.name}
                            </h3>
                            {competitor.website !== "N/A" && (
                              <a 
                                href={competitor.website.startsWith('http') ? competitor.website : `https://${competitor.website}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                              >
                                <ExternalLink className="w-5 h-5" />
                              </a>
                            )}
                          </div>
                          <p className="text-gray-600 mb-3">{competitor.description}</p>
                          
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full" style={{ backgroundColor: '#F7F8F3' }}>
                              <BadgeIcon className="w-4 h-4" style={{ color: badge.color }} />
                              <span className="text-sm font-semibold" style={{ color: badge.color }}>
                                {competitor.market_position}
                              </span>
                            </div>
                            <div className="px-3 py-1 rounded-full text-sm font-medium text-gray-700" style={{ backgroundColor: '#F7F8F3' }}>
                              <DollarSign className="w-3 h-3 inline mr-1" />
                              {competitor.funding_stage}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6 mt-6">
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <Shield className="w-5 h-5" style={{ color: '#46AA72' }} />
                            <h4 className="font-bold text-lg" style={{ color: '#003F2F' }}>Strengths</h4>
                          </div>
                          <ul className="space-y-2">
                            {competitor.strengths.map((strength, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: '#46AA72' }}></div>
                                <span className="text-gray-700">{strength}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <AlertTriangle className="w-5 h-5" style={{ color: '#f59e0b' }} />
                            <h4 className="font-bold text-lg" style={{ color: '#003F2F' }}>Weaknesses</h4>
                          </div>
                          <ul className="space-y-2">
                            {competitor.weaknesses.map((weakness, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: '#f59e0b' }}></div>
                                <span className="text-gray-700">{weakness}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Strategic Insights */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Differentiation Opportunities */}
              <div className="bg-white rounded-2xl shadow-xl p-6" style={{ borderTop: '4px solid #46AA72' }}>
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-6 h-6" style={{ color: '#46AA72' }} />
                  <h3 className="text-xl font-bold" style={{ color: '#003F2F' }}>
                    Differentiation Opportunities
                  </h3>
                </div>
                <ul className="space-y-3">
                  {result.strategic_insights.differentiation_opportunities.map((opp, i) => (
                    <li key={i} className="p-3 rounded-lg" style={{ backgroundColor: '#F7F8F3' }}>
                      <div className="flex items-start gap-2">
                        <Sparkles className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#46AA72' }} />
                        <span className="text-gray-700">{opp}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Potential Threats */}
              <div className="bg-white rounded-2xl shadow-xl p-6" style={{ borderTop: '4px solid #ef4444' }}>
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                  <h3 className="text-xl font-bold" style={{ color: '#003F2F' }}>
                    Potential Threats
                  </h3>
                </div>
                <ul className="space-y-3">
                  {result.strategic_insights.potential_threats.map((threat, i) => (
                    <li key={i} className="p-3 rounded-lg bg-red-50">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500" />
                        <span className="text-gray-700">{threat}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Positioning Advice */}
            <div className="bg-white rounded-3xl shadow-2xl p-8" style={{ borderTop: '6px solid #003F2F' }}>
              <div className="flex items-center gap-3 mb-4">
                <Info className="w-8 h-8" style={{ color: '#46AA72' }} />
                <h2 className="text-2xl font-bold" style={{ color: '#003F2F' }}>
                  Strategic Positioning Advice
                </h2>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                {result.strategic_insights.positioning_advice}
              </p>
            </div>

            {/* Try Again Button */}

<div className="flex flex-col sm:flex-row gap-3 mt-8 w-full max-w-md mx-auto">
  {/* Primary Button */}
  <button
    onClick={handlewaitlist}
    disabled={buttonLoading}
    className={`flex-1 px-5 py-3 rounded-lg font-semibold text-base transition-all duration-300 flex items-center justify-center gap-2 shadow-sm
      ${
        buttonLoading
          ? "bg-[#003F2F]/70 cursor-not-allowed text-white"
          : "bg-gradient-to-r from-[#005C44] to-[#008C6F] text-white hover:shadow-md hover:scale-[1.02]"
      }`}
  >
    {buttonLoading ? (
      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin font-bold"> </div>
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
    className="flex-1 px-5 py-3 rounded-lg font-semibold text-base border border-[#003F2F] text-[#003F2F] bg-white
               transition-all duration-300 flex items-center justify-center gap-2
               hover:bg-[#e3f8f3] hover:shadow-md hover:scale-[1.02]"
  >
    <Sparkles className="w-5 h-5" />
    Analyze Another Idea
  </button>
</div>

            
          </div>
        )}
      </div>
      
    </div>

    <div className="mt-4">  
  <Footer/>
  </div>

  </>
  );
};

export default CompetitorFinder;