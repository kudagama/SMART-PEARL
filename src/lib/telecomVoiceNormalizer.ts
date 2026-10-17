/**
 * Telecom Voice Speech Normalizer & Phonetic Auto-Corrector
 * 
 * Accurately cleans up Speech-to-Text discrepancies from Web Speech API / browser engines
 * when Sri Lankan users speak English, Singlish, or Sinhala containing telecom terminology.
 */

interface PhoneticRule {
  pattern: RegExp;
  replacement: string;
}

// Ordered list of phonetic replacement rules (case-insensitive)
const TELECOM_PHONETIC_RULES: PhoneticRule[] = [
  // 1. LOS Indicator Faults
  { pattern: /\b(?:loss|laws|lows|lost|lowes|loes)\s+(?:red|rathu)\b/gi, replacement: 'LOS Red' },
  { pattern: /\b(?:loss|laws|lows)\s+(?:light|led|indicator|blinking|blink|off)\b/gi, replacement: 'LOS indicator' },
  { pattern: /\b(?:el\s*oh\s*es|l\s*o\s*s)\b/gi, replacement: 'LOS' },
  { pattern: /(?:ලොස්\s*රෙඩ්|ලොස්\s*ලයිට්|එල්\s*ඕ\s*එස්)/gi, replacement: 'LOS Red' },

  // 2. PON Indicator Faults
  { pattern: /\b(?:pond|pawn|farm|palm|bone)\s+(?:indicator|light|led|steady|solid|blinking)\b/gi, replacement: 'PON indicator' },
  { pattern: /\b(?:pee\s*oh\s*en|p\s*o\s*n)\b/gi, replacement: 'PON' },
  { pattern: /\b(?:pond|pawn)\s+(?:steady|solid)\b/gi, replacement: 'PON Steady' },
  { pattern: /(?:පොන්\s*ලයිට්|පොන්\s*ඉන්ඩිකේටර්|පී\s*ඕ\s*එන්)/gi, replacement: 'PON indicator' },

  // 3. ONT Hardware & Power Faults
  { pattern: /\b(?:o\s*and\s*t|o\s*n\s*t|on\s*t|auntie|anti|anty)\s+(?:router|device|box|power|charger|adapter|fault|not\s*working|wada\s*na)\b/gi, replacement: 'ONT router' },
  { pattern: /\b(?:o\s*n\s*t|o\s*and\s*t|on\s*t|auntie|anti)\b/gi, replacement: 'ONT' },
  { pattern: /(?:ඕ\s*එන්\s*ටී|ඔන්ටී|ඔන්ට්)/gi, replacement: 'ONT' },

  // 4. PEOTV IPTV Service
  { pattern: /\b(?:pure\s*tv|po\s*tv|pay\s*tv|bio\s*tv|p\s*o\s*tv|peo\s*tv)\b/gi, replacement: 'PEOTV' },
  { pattern: /(?:පියෝ\s*ටීවී|පියෝ\s*ටී\s*වී)/gi, replacement: 'PEOTV' },

  // 5. Wi-Fi & WLAN Module
  { pattern: /\b(?:w\s*lan|double\s*u\s*lan|wlan)\s+(?:led|light|indicator|button|off|on)\b/gi, replacement: 'WLAN indicator' },
  { pattern: /\b(?:w\s*lan|wlan)\b/gi, replacement: 'WLAN' },
  { pattern: /\b(?:y\s*pi|wai\s*fai|why\s*fi)\b/gi, replacement: 'Wi-Fi' },
  { pattern: /\b(?:wifi|wi-fi)\s+(?:wada\s*nah?|connect\s*wenne\s*nah?|dead)\b/gi, replacement: 'Wi-Fi not working' },
  { pattern: /(?:වයිෆයි|වයි\s*ෆයි)/gi, replacement: 'Wi-Fi' },

  // 6. Browsing Slow & Speed Degradation
  { pattern: /\b(?:browzing|browsing|broadband|broad\s*band)\s+(?:slow|slowness|slowly)\b/gi, replacement: 'Browsing slow' },
  { pattern: /\b(?:speed\s*(?:madi|bahi|baha|drop|aduyi)|speed\s*slow)\b/gi, replacement: 'speed slow' },
  { pattern: /(?:බ්‍රවුසින්\s*ස්ලෝ|ස්පීඩ්\s*මදි|ඉන්ටර්නෙට්\s*ස්ලෝ)/gi, replacement: 'Browsing slow' },

  // 7. OGB-DC & Billing Arrears
  { pattern: /\b(?:o\s*g\s*b\s*[-–—]?\s*d\s*c|og\s*bdc|og\s*b\s*dc|ogbdc|ogb\s*dc)\b/gi, replacement: 'OGB-DC' },

  // 8. Quota & Extra GB Top-up
  { pattern: /\b(?:extra\s*gb|ekstra\s*gb|extra\s*g\s*b|extra\s*gigabyte)\b/gi, replacement: 'Extra GB' },
  { pattern: /\b(?:data\s*iwarai|quota\s*iwarai|quota\s*exceeded)\b/gi, replacement: 'usage limit exceeded' },
  { pattern: /(?:එක්ස්ට්‍රා\s*ජීබී|ඩේටා\s*ඉවරයි)/gi, replacement: 'Extra GB' },

  // 9. Voice & Dial Tone Faults
  { pattern: /\b(?:dial\s*torn|dial\s*stone|dial\s*tonne|dial\s*tone\s*na)\b/gi, replacement: 'dial tone' },
  { pattern: /\b(?:voice\s*line\s*noise|voice\s*noise|voice\s*noisy|line\s*noisy)\b/gi, replacement: 'voice line noisy' },
  { pattern: /\b(?:kataganda|kata\s*handa|call\s*ganna\s*ba)\b/gi, replacement: 'voice line fault' },
  { pattern: /(?:ඩයල්\s*ටෝන්|කටහඬ|කෝල්\s*ගන්න\s*බෑ)/gi, replacement: 'voice line noisy' },

  // 10. Singlish Phrase Corrections
  { pattern: /\b(?:water\s*now|whatever\s*now|weather\s*now)\b/gi, replacement: 'wada na' },
  { pattern: /\b(?:wada\s*nah?|wada\s*nae)\b/gi, replacement: 'wada na' },

  // 11. Workgroups & TT Terminology
  { pattern: /\b(?:c\s*e\s*n\s*c\s*s\s*c|cen\s*csc|cen-csc\s*tech|cencsc)\b/gi, replacement: 'CEN-CSC-TECH' },
  { pattern: /\b(?:area\s*c\s*p\s*e|area\s*cpe|cpe\s*mtce)\b/gi, replacement: 'AREA-CPE-MTCE' },
  { pattern: /\b(?:area\s*m\s*t\s*c\s*e|area\s*mtce|area\s*maintenance)\b/gi, replacement: 'AREA-MTCE' },
  { pattern: /\b(?:default\s*work\s*group|default\s*workgroup|default\s*wg)\b/gi, replacement: 'Default Work Group' },
  { pattern: /\b(?:double\s*ticket|trouble\s*ticket|t\s*t)\b/gi, replacement: 'Trouble Ticket' }
];

/**
 * Normalizes speech recognition output using telecom phonetic rules.
 * @param rawText Raw transcript from SpeechRecognition engine
 * @param lang Current recognition language ('en-US', 'si-LK', etc.)
 * @returns Cleaned and telecom-normalized text string
 */
export function normalizeTelecomSpeech(rawText: string, lang: string = 'en-US'): string {
  if (!rawText) return '';
  let cleaned = rawText.trim();

  // Apply all phonetic corrections
  for (const rule of TELECOM_PHONETIC_RULES) {
    cleaned = cleaned.replace(rule.pattern, rule.replacement);
  }

  // Remove multiple consecutive spaces
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  return cleaned;
}

/**
 * List of supported speech recognition language configurations
 */
export const SUPPORTED_VOICE_LANGUAGES = [
  {
    code: 'en-US' as const,
    label: 'English / Singlish',
    flag: '🌐',
    subLabel: 'Optimized for telecom acronyms'
  },
  {
    code: 'si-LK' as const,
    label: 'සිංහල (Sinhala)',
    flag: '🇱🇰',
    subLabel: 'Native Sinhala Speech Engine'
  }
];
