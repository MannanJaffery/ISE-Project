// src/utils/handleAIResponse.js
export const handleAIResponse = async ({
  description,
  model,
  navigate,
  username,
  setButtonLoading,
}) => {
  if (!description.trim()) return;

  setButtonLoading(true);

  // --- Generate Product Name ---
  const generateProductName = async () => {
    try {
      const prompt = `Generate a catchy product name based on this description: "${description}".
Rules:
- The name must be only 2 to 3 words.
- Use normal title-style words (no hyphens, no underscores, no numbers).
- Return only ONE name, nothing else.`;

      const result = await model.generateContent(prompt);
      let name = result.response.text().trim();
      name = name.replace(/\s+/g, "-").toLowerCase();
      return name;
    } catch (error) {
      console.error("Error generating product name:", error);
      return "default-product";
    }
  };

  try {
    const name = await generateProductName();

    if (!name || name === "default-product") {
      console.warn("Invalid product name — navigation stopped.");
      setButtonLoading(false);
      return;
    }

    const prompt_product = `
You are required to extract structured data from the provided product information. Do not include any explanations, comments, or extra words. Your output must be strictly and only the following in **valid JSON format**:
{
 "heading": "(Describe what the product actually is, not just the name , 5 to 6 words only , unique )",
 "subheading": "(Provide a bit more detail explaining the heading ,at least 15 words )",
 "why_use": {
   "line": "(A one-line summary of the main benefit , atleast 15 words )",
   "points": [
     "(First reason , at least 20 words)",
     "(Second reason , at least 20 words)",
     "(Third reason , at least 20 words)",
     "(Fourth reason , at least 20 words)"
   ]
 },
 "features_and_benefits": [
   "(Feature 1 , short and clear)",
   "(Feature 2, short and clear)",
   "(Feature 3, short and clear)"
 ],
 "features_explanation": [
   "(Explanation for feature 1 , at least 20 words)",
   "(Explanation for feature 2 , at least 20 words)",
   "(Explanation for feature 3 , at least 20 words)"
 ]
}

Use the product name and description below to generate the required content:
PRODUCT NAME: ${name}
PRODUCT DESCRIPTION: ${description}`;

    const result = await model.generateContent(prompt_product);
    const text = result.response.text().trim()
      .replace(/^```json\n?/, '')
      .replace(/```\n?$/, '');

    console.log("Text of response of AI:", text);

  
    setButtonLoading(false);

    navigate(`/${username}/${name}/preview+edit`, {
      state: {
        productName: name,
        aiResponse: text,
      },
    });

    console.log("Description:", description);
    console.log("AI Generated Name:", name);
  } catch (err) {
    console.error("Error in handleAIResponse:", err);
    setButtonLoading(false);
  }
};
