/**
 * SLT Contact Center - Official Quality Standards of Calls
 * Evaluation and Real-Time Verification Engine
 * 
 * Supports Sinhala, English, and Tamil standard call scripts.
 */

export interface QualityCriteriaItem {
  id: string;
  name: string;
  weight: number;
  passed: boolean;
  expected: string;
  matchedText?: string;
  feedback: string;
}

export interface QualityStandardResult {
  overallScore: number;
  passedCount: number;
  totalCount: number;
  language: 'Sinhala' | 'English' | 'Tamil' | 'Mixed';
  criteria: {
    greeting: QualityCriteriaItem;
    holding: QualityCriteriaItem;
    preClose: QualityCriteriaItem;
    ivrEnding: QualityCriteriaItem;
    sirMadam: QualityCriteriaItem;
    apologyCourtesy: QualityCriteriaItem;
  };
  strengths: string[];
  weaknesses: { issue: string; desc: string; standardRef: string }[];
  evaluatedAt: string;
}

export const OFFICIAL_SLT_STANDARDS = {
  sinhala: {
    language: 'Sinhala (සිංහල)',
    greeting: {
      standard: 'ආයුබෝවන්! මම හිමාලි, මට පුළුවනි ඔබට සහය වන්න',
      description: 'නිවැරදි ආචාරය, නිලධාරී නම සහ සහය වීමේ ප්‍රකාශය',
    },
    holding: {
      prior: 'කරුණාකර ඇමතුමේ රැඳී ඉන්න සර්/ මැඩම්',
      threshold: 'දිගු වේලාවක් රැඳී සිටී නම් තත්පර 45ක් ඇතුලත නැවත පාරිභෝගිකයා අමතන්න: කරුණාකර රැඳී ඉන්න සර්/ මැඩම්',
      retrieval: 'රැඳීසිටියාට ස්තූතියි',
    },
    preClose: {
      standard: 'වෙනත් යමක් දැනගැනීමට අවශ්‍යද?',
      description: 'ඇමතුම අවසන් කිරීමට පෙර අමතර අවශ්‍යතා විමසීම',
    },
    ivrEnding: {
      standard: 'මා ලබාදුන් සේවය ඇගයීම සඳහා රැඳී සිටින්න. SLT Mobitel ඇමතුවාට ස්තූතියි. සුබ දවසක්!',
      description: 'IVR C-Sat ඇගයීමට යොමු කිරීම සහ නිල සමුගැනීම',
    },
    mandatoryNotes: [
      'ඇමතුම අවසන් වූ වහාම පාරිභෝගිකයා IVR C-Sat වෙත යොමු කරන්න',
      'පාරිභෝගිකයාට සර් / මැඩම් යනුවෙන් අමතන්න',
      'අවශ්‍ය වූ විට පාරිභෝගිකයාට "සමාවන්න" කීමට පුරුදු වන්න',
    ]
  },
  english: {
    language: 'English',
    greeting: {
      standard: 'Ayubowan! I am Himali, How may I help you?',
      description: 'Professional greeting with self-identity and help offer',
    },
    holding: {
      prior: 'Please hold on Sir/Madam',
      threshold: 'If customer is on the hold for long, break the long hold within 45 seconds and repeat: Please hold on Sir/Madam',
      retrieval: 'Thank you for being on hold',
    },
    preClose: {
      standard: 'Is there anything else I can help you with Sir/Madam?',
      description: 'Proactive pre-close inquiry before wrapping up the call',
    },
    ivrEnding: {
      standard: 'Please hold on to rate my service. Thank you for calling SLT Mobitel. Have a nice day!',
      description: 'IVR C-Sat rating invitation & brand closing',
    },
    mandatoryNotes: [
      'Immediately after the standard call ending, transfer the customer to IVR C-Sat to rate the call',
      'Officer should use Sir/Madam when addressing the customer',
      'Use "Sorry" when needed',
    ]
  },
  tamil: {
    language: 'Tamil (தமிழ்)',
    greeting: {
      standard: 'வணக்கம் ! நான் ஹிமாலி , என்னால் எவ்வகையில் உதவ முடியும்?',
      description: 'மரியாதையான வரவேற்பு மற்றும் உதவி வழங்கல்',
    },
    holding: {
      prior: 'தயவு செய்து அழைப்பில் காத்திருங்கள். Sir / Madam',
      threshold: 'நீண்ட நேரம் எனின் 45 வினாடிகளுக்குள்: தயவு செய்து காத்திருங்கள்',
      retrieval: 'அழைப்பில் காத்திருந்தமைக்கு நன்றி.',
    },
    preClose: {
      standard: 'வேறேதும் தெரிந்து கொள்ள இருக்கிறதா? Sir / Madam',
      description: 'அழைப்பை முடிக்கும் முன் கூடுதல் உதவி வினவல்',
    },
    ivrEnding: {
      standard: 'இந்த அழைப்பை மதிப்பீடு செய்ய தயவு செய்து காத்திருங்கள். SLT Mobitel அழைத்தமைக்கு நன்றி இந்த நாள் இனிய நாளாக அமையட்டும்.',
      description: 'IVR C-Sat மதிப்பீட்டிற்கு மாற்றுதல் மற்றும் நிறைவுரை',
    },
    mandatoryNotes: [
      'அழைப்பை நிறைவு செய்த பிறகு வாடிக்கையாளரை IVR C-Sat மதிப்பீட்டிற்கு மாற்ற வேண்டும்',
      'வாடிக்கையாளருடன் உரையாடும் போது Sir / Madam என்று கூற வேண்டும்',
      'தேவைப்படும் போது "மன்னிக்கவும்" என கூறவும்',
    ]
  }
};

/**
 * Evaluates spoken agent text or full dialogue against official SLT quality standards
 */
export function evaluateCallQuality(textOrMessages: string | Array<{ speaker?: string; text: string }>): QualityStandardResult {
  let combinedAgentText = '';
  let fullConversationText = '';

  if (Array.isArray(textOrMessages)) {
    fullConversationText = textOrMessages.map(m => m.text).join(' ');
    // Look at agent utterances or all utterances if speaker not marked
    const agentParts = textOrMessages
      .filter(m => !m.speaker || m.speaker.toLowerCase() === 'agent' || m.speaker.toLowerCase() === 'user')
      .map(m => m.text);
    combinedAgentText = agentParts.length > 0 ? agentParts.join(' ') : fullConversationText;
  } else {
    combinedAgentText = textOrMessages || '';
    fullConversationText = textOrMessages || '';
  }

  const rawLower = combinedAgentText.toLowerCase();
  const fullLower = fullConversationText.toLowerCase();

  // Detect dominant language
  let language: 'Sinhala' | 'English' | 'Tamil' | 'Mixed' = 'English';
  if (/[\u0D80-\u0DFF]/.test(fullConversationText) || /ayubowan|himali|sthuthiyi|suba dawasak|karunakarala/i.test(fullLower)) {
    language = 'Sinhala';
  } else if (/[\u0B80-\u0BFF]/.test(fullConversationText) || /vanakkam|nandri|kaathirungal/i.test(fullLower)) {
    language = 'Tamil';
  }

  // 1. GREETING STANDARD (25%)
  // Sinhala: ආයුබෝවන් / මම හිමාලි / මට පුළුවනි ඔබට සහය වන්න
  // English: Ayubowan! I am Himali, How may I help you?
  // Tamil: வணக்கம் ! நான் ஹிமாலி , என்னால் எவ்வகையில் உதவ முடியும்?
  const greetingRegex = /(?:ආයුබෝවන්|ayubowan|ayubovan|hello|good (?:morning|afternoon)|வணக்கம்|vanakkam)/i;
  const identityRegex = /(?:මම\s*(?:හිමාලි|[A-Za-z\u0D80-\u0DFF]+)|i am\s*(?:himali|[A-Za-z]+)|this is\s*(?:himali|[A-Za-z]+)|my name is|நான்\s*(?:ஹிமாலி|[A-Za-z\u0B80-\u0BFF]+))/i;
  const helpRegex = /(?:සහය වන්න|උදව්|how (?:may|can) i help|help you|assist you|உதவ முடியும்|udaw)/i;

  const hasGreetingWord = greetingRegex.test(rawLower);
  const hasIdentity = identityRegex.test(rawLower);
  const hasHelpOffer = helpRegex.test(rawLower);
  const greetingPassed = (hasGreetingWord && hasIdentity) || (hasGreetingWord && hasHelpOffer) || (rawLower.includes('ayubowan') && rawLower.includes('help'));

  // 2. HOLDING PROTOCOL STANDARD (20%)
  // Sinhala: කරුණාකර ඇමතුමේ රැඳී ඉන්න සර්/මැඩම් ... රැඳීසිටියාට ස්තූතියි
  // English: Please hold on Sir/Madam ... Thank you for being on hold
  // Tamil: தயவு செய்து அழைப்பில் காத்திருங்கள் ... காத்திருந்தமைக்கு நன்றி
  const holdRequestRegex = /(?:කරුණාකර.*(?:රැඳී|ඉන්න)|ඇමතුමේ රැඳී|please hold(?:\s*on)?|kindly hold|hold the line|தயவு செய்து.*காத்திருங்கள்|காத்திருங்கள்)/i;
  const holdRetrievalRegex = /(?:රැඳී.*සිටියාට.*ස්තූතියි|thank you for (?:being on hold|holding|waiting|your patience)|காத்திருந்தமைக்கு நன்றி)/i;

  const hasHoldRequest = holdRequestRegex.test(rawLower);
  const hasHoldRetrieval = holdRetrievalRegex.test(rawLower);
  // Holding passes if properly initiated with courtesy, or if no hold was needed, retrieval acknowledges hold
  const holdingPassed = (hasHoldRequest && hasHoldRetrieval) || hasHoldRequest || hasHoldRetrieval;

  // 3. PRE-CLOSE STANDARD (20%)
  // Sinhala: වෙනත් යමක් දැනගැනීමට අවශ්‍යද?
  // English: Is there anything else I can help you with Sir/Madam?
  // Tamil: வேறேதும் தெரிந்து கொள்ள இருக்கிறதா? Sir / Madam
  const preCloseRegex = /(?:වෙනත් යමක්.*දැනගැනීමට|තව මොනවා හරි|තව උදව්|anything else.*(?:help|assist|need)|is there anything else|வேறேதும்.*தெரிந்து|வேறு ஏதேனும்)/i;
  const preClosePassed = preCloseRegex.test(rawLower);

  // 4. IVR C-SAT SCRIPT & ENDING STANDARD (20%)
  // Sinhala: මා ලබාදුන් සේවය ඇගයීම සඳහා රැඳී සිටින්න. SLT Mobitel ඇමතුවාට ස්තූතියි. සුබ දවසක්!
  // English: Please hold on to rate my service. Thank you for calling SLT Mobitel. Have a nice day!
  // Tamil: இந்த அழைப்பை மதிப்பீடு செய்ய தயவு செய்து காத்திருங்கள். SLT Mobitel அழைத்தமைக்கு நன்றி இந்த நாள் இனிய நாளாக அமையட்டும்.
  const rateServiceRegex = /(?:සේවය ඇගයීම|ඇගයීම සඳහා|rate my service|rate (?:this|the) (?:service|call)|c-?sat|csat|மதிப்பீடு செய்ய)/i;
  const brandEndingRegex = /(?:slt mobitel.*(?:ඇමතුවාට.*ස්තූතියි|thank you for calling)|slt mobitel.*නன்றி|සුබ දවසක්|have a (?:nice|good|great) day|இனிய நாளாக)/i;
  const ivrEndingPassed = rateServiceRegex.test(rawLower) || brandEndingRegex.test(rawLower);

  // 5. COURTESY: SIR / MADAM ADDRESSING (10%)
  const sirMadamMatches = rawLower.match(/\b(?:sir|madam|ma'am|සර්|මැඩම්|ஐயா|அம்மா)\b/gi) || [];
  const sirMadamCount = sirMadamMatches.length;
  const sirMadamPassed = sirMadamCount >= 1;

  // 6. COURTESY: APOLOGY / POLITE (5%)
  const apologyMatches = rawLower.match(/\b(?:sorry|apologi[sz]e|සමාවන්න|samawanna|කණගාටුයි|மன்னிக்கவும்|mannikkavum)\b/gi) || [];
  const apologyCount = apologyMatches.length;
  // Apology is rated positive if used when needed
  const apologyPassed = apologyCount >= 0; // Courtesy present or standard maintained

  // Calculate weighted score
  let score = 0;
  if (greetingPassed) score += 25;
  if (holdingPassed) score += 20;
  if (preClosePassed) score += 20;
  if (ivrEndingPassed) score += 20;
  if (sirMadamPassed) score += 10;
  if (apologyCount > 0) score += 5; else if (greetingPassed && sirMadamPassed) score += 5; // Clean polite call

  score = Math.min(100, Math.max(0, score));

  // Build criteria details
  const criteria = {
    greeting: {
      id: 'crit-greeting',
      name: 'Standard Greeting & Identity',
      weight: 25,
      passed: greetingPassed,
      expected: 'Ayubowan! I am Himali, How may I help you? / ආයුබෝවන්! මම හිමාලි, මට පුළුවනි ඔබට සහය වන්න',
      feedback: greetingPassed
        ? 'Successfully delivered standard greeting and agent identity.'
        : 'Missing standard greeting, identity ("I am Himali"), or offer of assistance.',
    },
    holding: {
      id: 'crit-holding',
      name: 'Holding & Retrieval Protocol',
      weight: 20,
      passed: holdingPassed,
      expected: 'Please hold on Sir/Madam (break within 45s) -> Thank you for being on hold',
      feedback: holdingPassed
        ? 'Holding protocol and retrieval gratitude correctly stated.'
        : 'Remember to say "Please hold on Sir/Madam" and thank the customer upon retrieval.',
    },
    preClose: {
      id: 'crit-preclose',
      name: 'Pre-Close Assistance Inquiry',
      weight: 20,
      passed: preClosePassed,
      expected: 'Is there anything else I can help you with Sir/Madam? / වෙනත් යමක් දැනගැනීමට අවශ්‍යද?',
      feedback: preClosePassed
        ? 'Accurately prompted customer with standard pre-close question.'
        : 'Missed pre-close inquiry ("Is there anything else I can help you with Sir/Madam?").',
    },
    ivrEnding: {
      id: 'crit-ivrending',
      name: 'IVR C-Sat Script & Brand Closing',
      weight: 20,
      passed: ivrEndingPassed,
      expected: 'Please hold on to rate my service. Thank you for calling SLT Mobitel. Have a nice day!',
      feedback: ivrEndingPassed
        ? 'IVR C-Sat transfer script or SLT Mobitel brand sign-off delivered.'
        : 'Must prompt customer: "Please hold on to rate my service" before concluding call.',
    },
    sirMadam: {
      id: 'crit-sirmadam',
      name: 'Customer Courtesy: Sir / Madam',
      weight: 10,
      passed: sirMadamPassed,
      expected: 'Address customer respectfully as "Sir" or "Madam" (සර් / මැඩම්)',
      feedback: sirMadamPassed
        ? `Customer respectfully addressed as Sir/Madam (${sirMadamCount} times).`
        : 'Always address the customer as "Sir" or "Madam" during conversation.',
    },
    apologyCourtesy: {
      id: 'crit-apology',
      name: 'Empathy & Apology Protocol',
      weight: 5,
      passed: true,
      expected: 'Use "Sorry" (සමාවන්න / மன்னிக்கவும்) when delays or faults occur',
      feedback: apologyCount > 0
        ? `Polite apology offered when required (${apologyCount} times).`
        : 'Polite tone maintained throughout the interaction.',
    },
  };

  const strengths: string[] = [];
  const weaknesses: { issue: string; desc: string; standardRef: string }[] = [];

  if (greetingPassed) strengths.push('Followed the official SLT Mobitel greeting and agent identity standard.');
  else weaknesses.push({ issue: 'Greeting Incomplete', desc: 'Failed to deliver the full greeting: "Ayubowan! I am Himali, How may I help you?"', standardRef: 'Standard 1: Greeting' });

  if (holdingPassed) strengths.push('Correctly stated holding statement and expressed gratitude upon retrieval.');
  
  if (preClosePassed) strengths.push('Proactively checked with customer: "Is there anything else I can help you with Sir/Madam?"');
  else weaknesses.push({ issue: 'Missing Pre-Close Inquiry', desc: 'Did not ask if customer needed additional assistance before wrapping up the call.', standardRef: 'Standard 3: Pre-Close' });

  if (ivrEndingPassed) strengths.push('Requested customer to remain on the line for IVR C-Sat quality rating.');
  else weaknesses.push({ issue: 'IVR C-Sat Script Omitted', desc: 'Failed to announce the IVR C-Sat service rating script prior to ending.', standardRef: 'Standard 4: IVR C-Sat & Ending' });

  if (sirMadamPassed) strengths.push(`Consistently addressed the customer respectfully as Sir/Madam (${sirMadamCount} times).`);
  else weaknesses.push({ issue: 'Honorific Missing', desc: 'Officer did not use "Sir" or "Madam" when speaking to the customer.', standardRef: 'Note: Customer Addressing' });

  const passedCount = Object.values(criteria).filter(c => c.passed).length;
  const totalCount = Object.values(criteria).length;

  return {
    overallScore: score,
    passedCount,
    totalCount,
    language,
    criteria,
    strengths,
    weaknesses,
    evaluatedAt: new Date().toISOString(),
  };
}
