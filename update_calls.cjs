const fs = require('fs');
const path = 'd:/PROJECTS/SLT-Smart-Directory-Assistant-/src/app/dashboard/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const newScripts = `
const sinhalaCallScript = [
  { delay: 1000, speaker: 'agent', text: 'ආයුබෝවන්! මම හිමාලි, මට පුළුවනි ඔබට සහය වන්න.' },
  { delay: 4000, speaker: 'customer', text: 'මට Kandy Hospital එකේ අංකය දැනගන්න පුළුවන්ද?' },
  { delay: 9000, speaker: 'agent', text: 'කරුණාකර රැඳී ඉන්න සර්/ මැඩම්.' },
  { delay: 12000, speaker: 'agent', text: 'රැඳීසිටියාට ස්තූතියි. අංකය 081 222 2222. වෙනත් යමක් දැනගැනීමට අවශ්‍යද?' },
  { delay: 17000, speaker: 'customer', text: 'නෑ, එච්චරයි. ස්තූතියි.' },
  { delay: 20000, speaker: 'agent', text: 'මා ලබාදුන් සේවය ඇගයීම සඳහා රැඳී සිටින්න. SLT Mobitel ඇමතුවාට ස්තූතියි. සුභ දවසක්!' }
];

const englishCallScript = [
  { delay: 1000, speaker: 'agent', text: 'Ayubowan! I am Himali. How may I help you?' },
  { delay: 4000, speaker: 'customer', text: 'Hello, I am looking to get a new broadband connection.' },
  { delay: 9000, speaker: 'agent', text: 'Please hold on Sir/Madam while I check the details.' },
  { delay: 13000, speaker: 'agent', text: 'Thank you for being on hold. The Fibre packages start at Rs. 5,900. Is there anything else I can help you with Sir/Madam?' },
  { delay: 19000, speaker: 'customer', text: 'No, that is all. Thanks!' },
  { delay: 22000, speaker: 'agent', text: 'Please hold on to rate my service. Thank you for calling SLT Mobitel. Have a nice day!' }
];

const tamilCallScript = [
  { delay: 1000, speaker: 'agent', text: 'வணக்கம் ! நான் ஹிமாலி , என்னால் எவ்வகையில் உதவ முடியும்?' },
  { delay: 4000, speaker: 'customer', text: 'நான் Kandy Bank of Ceylon இலக்கத்தை அறிய விரும்புகிறேன்.' },
  { delay: 9000, speaker: 'agent', text: 'தயவு செய்து அழைப்பில் காத்திருங்கள். Sir / Madam.' },
  { delay: 13000, speaker: 'agent', text: 'அழைப்பில் காத்திருந்தமைக்கு நன்றி. இலக்கம் 081 222 2222. வேறேதும் தெரிந்து கொள்ள இருக்கிறதா? Sir / Madam.' },
  { delay: 19000, speaker: 'customer', text: 'இல்லை, நன்றி.' },
  { delay: 22000, speaker: 'agent', text: 'இந்த அழைப்பை மதிப்பீடு செய்ய தயவு செய்து காத்திருங்கள். SLT Mobitel அழைத்தமைக்கு நன்றி இந்த நாள் இனிய நாளாக அமையட்டும்.' }
];
`;

const oldScriptsStart = content.indexOf('const productCallScript = [');
const oldScriptsEnd = content.indexOf('export default function DashboardPage()');
if (oldScriptsStart !== -1 && oldScriptsEnd !== -1) {
  content = content.substring(0, oldScriptsStart) + newScripts + '\\n' + content.substring(oldScriptsEnd);
}

// Update the type of activeCallType
content = content.replace("useState<'product' | 'directory' | null>(null)", "useState<'sinhala' | 'english' | 'tamil' | null>(null)");

// Update startCallSimulation signature
content = content.replace("startCallSimulation = (type: 'product' | 'directory')", "startCallSimulation = (type: 'sinhala' | 'english' | 'tamil')");

// Update script selection
content = content.replace("const activeScript = type === 'product' ? productCallScript : directoryCallScript;", "const activeScript = type === 'sinhala' ? sinhalaCallScript : type === 'english' ? englishCallScript : tamilCallScript;");

// Update buttons in UI
const oldButtons = \`<button
              onClick={() => startCallSimulation('product')}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#005696] to-[#00A3E0] hover:from-[#00467a] hover:to-[#008bc0] text-white rounded-lg font-bold shadow-lg hover:shadow-xl transition-all active:scale-95"
            >
              <PhoneCall className="w-4 h-4" /> Simulate Product Call
            </button>
            <button
              onClick={() => startCallSimulation('directory')}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-400 hover:from-emerald-700 hover:to-emerald-500 text-white rounded-lg font-bold shadow-lg hover:shadow-xl transition-all active:scale-95"
            >
              <PhoneCall className="w-4 h-4" /> Simulate Directory Call
            </button>\`;

const newButtons = \`<button
              onClick={() => startCallSimulation('sinhala')}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-600 to-rose-400 hover:from-rose-700 hover:to-rose-500 text-white rounded-lg font-bold shadow-lg transition-all active:scale-95"
            >
              <PhoneCall className="w-4 h-4" /> සිංහල Call
            </button>
            <button
              onClick={() => startCallSimulation('english')}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white rounded-lg font-bold shadow-lg transition-all active:scale-95"
            >
              <PhoneCall className="w-4 h-4" /> English Call
            </button>
            <button
              onClick={() => startCallSimulation('tamil')}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-400 hover:from-emerald-700 hover:to-emerald-500 text-white rounded-lg font-bold shadow-lg transition-all active:scale-95"
            >
              <PhoneCall className="w-4 h-4" /> தமிழ் Call
            </button>\`;

content = content.replace(oldButtons, newButtons);

// Make sure to add Tamil / Sinhala intent detection in analyzeRealTimeAudio
const oldAnalysis = \`if (lowerText.includes('broadband') || lowerText.includes('fibre')) {\`;
const newAnalysis = \`if (lowerText.includes('hospital') || lowerText.includes('kandy')) {
      newSuggestions.push({
        id: 'hospital-dir',
        type: 'intent',
        title: 'Directory Search: Kandy Hospital',
        content: (
          <div className="space-y-2">
            <p className="text-sm font-bold text-slate-800">Kandy General Hospital</p>
            <p className="text-xs text-slate-600 flex items-center gap-1"><Phone className="w-3 h-3"/> 081 222 2222</p>
          </div>
        )
      });
    }
    
    if (lowerText.includes('broadband') || lowerText.includes('fibre') || lowerText.includes('ceylon')) {\`;

content = content.replace(oldAnalysis, newAnalysis);

fs.writeFileSync(path, content);
console.log('Updated call scripts successfully');
