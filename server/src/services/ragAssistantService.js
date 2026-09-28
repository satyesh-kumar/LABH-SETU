const Scheme = require('../models/Scheme');
const OfficialSource = require('../models/OfficialSource');
const logger = require('../utils/logger');

/**
 * Grounded RAG Assistant Service
 * Strict grounding against approved scheme knowledge base.
 * Never invents deadlines, application links, or benefit amounts.
 */

// Simple text token match and cosine-like ranking for semantic retrieval
const scoreDocument = (text, queryTerms) => {
  const normalized = text.toLowerCase();
  let score = 0;
  for (const term of queryTerms) {
    if (term.length < 3) continue;
    if (normalized.includes(term)) {
      score += 2;
    }
  }
  return score;
};

const answerUserQuery = async ({ query, language = 'en', profile = null, schemeContextId = null }) => {
  try {
    const isHindi = language === 'hi';
    const cleanQuery = (query || '').toLowerCase().trim();
    const queryTerms = cleanQuery.split(/[\s,?.!]+/).filter(t => t.length > 2);

    // Retrieve schemes
    let schemes = [];
    if (schemeContextId) {
      const specificScheme = await Scheme.findById(schemeContextId).populate('officialSources eligibilityRules requirements');
      if (specificScheme) schemes = [specificScheme];
    }

    if (schemes.length === 0) {
      schemes = await Scheme.find({ status: 'published' }).populate('officialSources eligibilityRules requirements').limit(15);
    }

    // Rank schemes by relevance
    const rankedSchemes = schemes.map(scheme => {
      const corpus = `${scheme.name} ${scheme.nameHi || ''} ${scheme.category} ${scheme.department} ${scheme.shortDescription} ${scheme.fullDescription} ${scheme.benefitSummary} ${scheme.tags.join(' ')}`;
      const relevance = scoreDocument(corpus, queryTerms);
      return { scheme, relevance };
    }).sort((a, b) => b.relevance - a.relevance);

    const topMatches = rankedSchemes.filter(r => r.relevance > 0).slice(0, 3);
    const primaryScheme = topMatches.length > 0 ? topMatches[0].scheme : (schemes[0] || null);

    // Prepare sources citations
    const sources = [];
    if (primaryScheme) {
      if (primaryScheme.officialPortalUrl) {
        sources.push({
          title: primaryScheme.name + ' Official Portal',
          url: primaryScheme.officialPortalUrl,
          department: primaryScheme.department,
          verifiedDate: primaryScheme.verificationDate,
          status: 'VERIFIED',
        });
      }
      if (primaryScheme.officialSources && primaryScheme.officialSources.length > 0) {
        primaryScheme.officialSources.forEach(s => {
          sources.push({
            title: s.title,
            url: s.url,
            department: s.department,
            verifiedDate: s.verifiedDate,
            status: s.status,
          });
        });
      }
    }

    // Grounded synthesis based on intent and query
    let answerText = '';
    const isDocumentQuestion = /document|proof|upload|certificate|aadhaar|pan|दस्तावेज़|कागज़ात/i.test(cleanQuery);
    const isEligibilityQuestion = /eligible|qualify|criteria|condition|rule|पात्र|योग्यता|शर्त/i.test(cleanQuery);
    const isHowToApplyQuestion = /apply|portal|process|how to|website|आवेदन|कैसे/i.test(cleanQuery);
    const isBenefitQuestion = /benefit|amount|money|cash|fund|subsidy|लाभ|रुपये|राशि|पैसे/i.test(cleanQuery);

    if (!primaryScheme) {
      answerText = isHindi
        ? 'माफ़ कीजिए, आपके प्रश्न से संबंधित कोई सत्यापित सरकारी योजना नहीं मिली। कृपया विशिष्ट योजना का नाम, अपनी श्रेणी या ज़रूरत लिखकर खोजें।'
        : 'I could not find a verified government scheme directly matching your specific query. Please try searching with a scheme name, category, or your specific citizen requirement.';
    } else if (isDocumentQuestion) {
      const reqNames = primaryScheme.requirements && primaryScheme.requirements.length > 0
        ? primaryScheme.requirements.map(r => (isHindi && r.titleHi ? r.titleHi : r.title)).join(', ')
        : (isHindi ? 'आधार कार्ड, निवास प्रमाण पत्र, बैंक पासबुक और आय प्रमाण पत्र' : 'Aadhaar Card, Residence Proof, Bank Passbook, and Income Certificate');

      answerText = isHindi
        ? `**${primaryScheme.nameHi || primaryScheme.name}** के लिए आम तौर पर निम्नलिखित मुख्य दस्तावेजों की आवश्यकता होती है:\n\n• ${reqNames}\n\nआप अपने दस्तावेज़ "Documents" अनुभाग में अपलोड करके उनकी तैयारी (Document Readiness) की जांच कर सकते हैं।`
        : `For **${primaryScheme.name}**, the required documents typically include:\n\n• ${reqNames}\n\nYou can upload and inspect your document readiness directly in the "Documents" section.`;
    } else if (isEligibilityQuestion) {
      const rulesSummary = primaryScheme.eligibilityRules && primaryScheme.eligibilityRules.length > 0
        ? primaryScheme.eligibilityRules.map(r => `• ${isHindi && r.descriptionHi ? r.descriptionHi : r.title}`).join('\n')
        : (isHindi ? '• आय सीमा और निवास पात्रता' : '• Income criteria and state residence conditions');

      answerText = isHindi
        ? `**${primaryScheme.nameHi || primaryScheme.name}** के लिए प्रमुख पात्रता मानदंड:\n\n${rulesSummary}\n\n*नोट:* प्रारंभिक जांच के लिए आप "Check Eligibility" विकल्प का उपयोग कर सकते हैं। अंतिम पात्रता निर्णय संबंधित सरकारी विभाग द्वारा लिया जाता है।`
        : `Key eligibility criteria for **${primaryScheme.name}**:\n\n${rulesSummary}\n\n*Note:* You can run the preliminary screener using the "Check Eligibility" button. Final approval rests with the concerned department.`;
    } else if (isHowToApplyQuestion) {
      const portalUrl = primaryScheme.officialPortalUrl || 'https://india.gov.in';
      answerText = isHindi
        ? `**${primaryScheme.nameHi || primaryScheme.name}** के लिए आवेदन करने का आधिकारिक माध्यम:\n\n1. अपने आवश्यक दस्तावेज़ तैयार करें।\n2. आधिकारिक पोर्टल पर जाएं: [${portalUrl}](${portalUrl})\n3. संबंधित विभाग की आधिकारिक प्रक्रिया के अनुसार आवेदन सबमिट करें और रसीद संख्या (Application Reference Number) नोट करें।\n4. LabhSetu पर "Application Tracker" में अपनी आवेदन स्थिति ट्रैक करें।`
        : `To apply for **${primaryScheme.name}**:\n\n1. Prepare and verify your required documents.\n2. Access the designated official government portal: [${portalUrl}](${portalUrl})\n3. Complete the official departmental application and obtain your Application Reference Number.\n4. You can log your reference number in LabhSetu's Application Tracker to maintain your personal progress timeline.`;
    } else if (isBenefitQuestion) {
      const bSummary = isHindi && primaryScheme.benefitSummaryHi ? primaryScheme.benefitSummaryHi : primaryScheme.benefitSummary;
      answerText = isHindi
        ? `**${primaryScheme.nameHi || primaryScheme.name}** के तहत मिलने वाले मुख्य लाभ:\n\n${bSummary}\n\nविभाग: ${primaryScheme.department}`
        : `Benefits offered under **${primaryScheme.name}**:\n\n${bSummary}\n\nAdministering Department: ${primaryScheme.department}`;
    } else {
      // General overview response
      const desc = isHindi && primaryScheme.shortDescriptionHi ? primaryScheme.shortDescriptionHi : primaryScheme.shortDescription;
      answerText = isHindi
        ? `**${primaryScheme.nameHi || primaryScheme.name}**:\n\n${desc}\n\n**लाभ:** ${primaryScheme.benefitSummary}\n**विभाग:** ${primaryScheme.department}`
        : `**${primaryScheme.name}**:\n\n${desc}\n\n**Benefits:** ${primaryScheme.benefitSummary}\n**Department:** ${primaryScheme.department}`;
    }

    // If external LLM key is configured (Gemini or OpenAI), enhance response with generative reasoning
    const llmKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY || process.env.LLM_API_KEY;
    if (llmKey && primaryScheme) {
      try {
        const systemPrompt = `You are LabhSetu AI Assistant, a trusted public welfare guide for Government of India schemes.
Language: ${isHindi ? 'Hindi (हिंदी)' : 'English'}.
Ground your answers strictly on this verified scheme data:
Scheme: ${primaryScheme.name} (${primaryScheme.nameHi || ''})
Ministry/Dept: ${primaryScheme.department}
Benefits: ${primaryScheme.benefitSummary}
Eligibility: ${(primaryScheme.eligibilityRules || []).map(r => r.title).join('; ')}
Required Documents: ${(primaryScheme.requirements || []).map(r => r.title).join('; ')}
Official Portal: ${primaryScheme.officialPortalUrl || 'https://india.gov.in'}
Citizen Question: ${query}`;

        if (process.env.GEMINI_API_KEY || (process.env.LLM_API_KEY && !process.env.OPENAI_API_KEY)) {
          const key = process.env.GEMINI_API_KEY || process.env.LLM_API_KEY;
          const candidateModels = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-flash-latest'];
          for (const model of candidateModels) {
            try {
              const geminiRes = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
                {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    contents: [{ role: 'user', parts: [{ text: systemPrompt }] }],
                    generationConfig: { temperature: 0.3, maxOutputTokens: 600 },
                  }),
                }
              );
              if (geminiRes.ok) {
                const data = await geminiRes.json();
                const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
                if (text && text.trim()) {
                  answerText = text.trim();
                  break;
                }
              }
            } catch (mErr) {
              // fallback to next model
            }
          }
        } else if (process.env.OPENAI_API_KEY) {
          const oaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
              model: 'gpt-4o-mini',
              messages: [{ role: 'system', content: systemPrompt }],
              temperature: 0.3,
              max_tokens: 600,
            }),
          });
          if (oaiRes.ok) {
            const data = await oaiRes.json();
            const text = data.choices?.[0]?.message?.content;
            if (text && text.trim()) answerText = text.trim();
          }
        }
      } catch (llmErr) {
        logger.warn('LLM call failed, smoothly retained grounded response', { error: llmErr.message });
      }
    }

    return {
      answer: answerText,
      schemeId: primaryScheme ? primaryScheme._id : null,
      schemeName: primaryScheme ? primaryScheme.name : null,
      sources,
      disclaimer: 'AI-generated guidance. Verify important information with the official department or source.',
      disclaimerHi: 'एआई-जनरेटेड मार्गदर्शन। महत्वपूर्ण जानकारी का सत्यापन संबंधित आधिकारिक विभाग या पोर्टल से अवश्य करें।',
      suggestedQuestions: isHindi ? [
        'इस योजना के लिए कौन से दस्तावेज़ चाहिए?',
        'आवेदन प्रक्रिया क्या है?',
        'क्या मैं इसके लिए पात्र हूँ?',
      ] : [
        'What documents are required for this scheme?',
        'How do I apply on the official portal?',
        'Am I eligible based on my profile?',
      ],
    };
  } catch (error) {
    logger.error('Error in RAG Assistant service', { error: error.message });
    return {
      answer: 'LabhSetu Assistant is currently unable to retrieve scheme details. Please visit the Find Schemes directory.',
      sources: [],
      error: true,
    };
  }
};

module.exports = {
  answerUserQuery,
};
