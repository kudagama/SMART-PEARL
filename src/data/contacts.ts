export interface Contact {
  id: string;
  name: string;
  nameSinhala?: string;
  nameTamil?: string;
  department: string;
  hotline: string;
  extension?: string;
  operatingHours: string;
  location: string;
  type: string;
  keywords: string[];
}

export const dummyContacts: Contact[] = [
  // --- SLT Regional Telecom Offices (RTOs) ---
  {
    id: "RTO-001",
    name: "Regional Telecom Office (RTO) - Colombo Central",
    nameSinhala: "මධ්‍යම කොළඹ ප්‍රාදේශීය විදුලි සංදේශ කාර්යාලය",
    nameTamil: "கொழும்பு மத்தி பிராந்திய தொலைத்தொடர்பு அலுவலகம்",
    department: "Customer Care & Billing",
    hotline: "011 2 328 328",
    operatingHours: "08:30 AM - 05:00 PM",
    location: "Lotus Road, Colombo 01",
    type: "RTO",
    keywords: ["colombo", "rto", "billing", "bill", "kotuwa", "fort", "colombo 1", "main"]
  },
  {
    id: "RTO-002",
    name: "Regional Telecom Office (RTO) - Kandy",
    nameSinhala: "මහනුවර ප්‍රාදේශීය විදුලි සංදේශ කාර්යාලය",
    nameTamil: "கண்டி பிராந்திய தொலைத்தொடர்பு அலுவலகம்",
    department: "Customer Care & Billing",
    hotline: "081 2 222 222",
    operatingHours: "08:30 AM - 05:00 PM",
    location: "15, Peradeniya Road, Kandy",
    type: "RTO",
    keywords: ["kandy", "rto", "billing", "mahanuwara", "nuwara", "central", "dalada"]
  },
  {
    id: "RTO-003",
    name: "Regional Telecom Office (RTO) - Galle",
    nameSinhala: "ගාල්ල ප්‍රාදේශීය විදුලි සංදේශ කාර්යාලය",
    nameTamil: "காலி பிராந்திய தொலைத்தொடர்பு அலுவலகம்",
    department: "Customer Care & Technical Support",
    hotline: "091 2 222 222",
    operatingHours: "08:30 AM - 05:00 PM",
    location: "Wakwella Road, Galle",
    type: "RTO",
    keywords: ["galle", "rto", "south", "galla", "wakwella", "billing", "tech", "support"]
  },
  {
    id: "RTO-004",
    name: "Regional Telecom Office (RTO) - Kurunegala",
    nameSinhala: "කුරුණෑගල ප්‍රාදේශීය විදුලි සංදේශ කාර්යාලය",
    nameTamil: "குருநாகல் பிராந்திய தொலைத்தொடர்பு அலுவலகம்",
    department: "Customer Care",
    hotline: "037 2 222 222",
    operatingHours: "08:30 AM - 05:00 PM",
    location: "Negombo Road, Kurunegala",
    type: "RTO",
    keywords: ["kurunegala", "rto", "north western", "kurunegala branch", "bill"]
  },
  {
    id: "RTO-005",
    name: "Regional Telecom Office (RTO) - Jaffna",
    nameSinhala: "යාපනය ප්‍රාදේශීය විදුලි සංදේශ කාර්යාලය",
    nameTamil: "யாழ்ப்பாணம் பிராந்திய தொலைத்தொடர்பு அலுவலகம்",
    department: "Customer Care",
    hotline: "021 2 222 222",
    operatingHours: "08:30 AM - 05:00 PM",
    location: "Hospital Road, Jaffna",
    type: "RTO",
    keywords: ["jaffna", "rto", "north", "yalpanam", "yapanaya", "tamil"]
  },
  {
    id: "RTO-006",
    name: "Regional Telecom Office (RTO) - Anuradhapura",
    nameSinhala: "අනුරාධපුර ප්‍රාදේශීය විදුලි සංදේශ කාර්යාලය",
    nameTamil: "அனுராதபுரம் பிராந்திய தொலைத்தொடர்பு அலுவலகம்",
    department: "Technical & Billing",
    hotline: "025 2 222 222",
    operatingHours: "08:30 AM - 05:00 PM",
    location: "Maithripala Senanayake Mawatha, Anuradhapura",
    type: "RTO",
    keywords: ["anuradhapura", "rto", "north central", "rajarata", "billing"]
  },
  {
    id: "RTO-007",
    name: "Regional Telecom Office (RTO) - Batticaloa",
    nameSinhala: "මඩකලපුව ප්‍රාදේශීය විදුලි සංදේශ කාර්යාලය",
    nameTamil: "மட்டக்களப்பு பிராந்திய தொலைத்தொடர்பு அலுவலகம்",
    department: "Customer Care",
    hotline: "065 2 222 222",
    operatingHours: "08:30 AM - 05:00 PM",
    location: "Bar Road, Batticaloa",
    type: "RTO",
    keywords: ["batticaloa", "rto", "east", "madakalapuwa", "mattam"]
  },

  // --- SLT Teleshops ---
  {
    id: "TS-001",
    name: "SLT Teleshop - Liberty Plaza",
    nameSinhala: "ටෙලිෂොප් - ලිබර්ටි ප්ලාසා",
    nameTamil: "டெலிஷாப் - லிபர்டி பிளாசா",
    department: "Sales & Payments",
    hotline: "011 2 573 573",
    operatingHours: "10:00 AM - 07:00 PM",
    location: "Liberty Plaza, Colombo 03",
    type: "Teleshop",
    keywords: ["liberty plaza", "colombo 3", "kollupitiya", "teleshop", "sales", "pay bill"]
  },
  {
    id: "TS-002",
    name: "SLT Teleshop - Kandy City Centre",
    nameSinhala: "ටෙලිෂොප් - KCC",
    nameTamil: "டெலிஷாப் - KCC",
    department: "Sales & Customer Support",
    hotline: "081 2 203 203",
    operatingHours: "10:00 AM - 08:00 PM",
    location: "KCC, Dalada Veediya, Kandy",
    type: "Teleshop",
    keywords: ["kcc", "kandy city centre", "teleshop", "sales", "nuwara", "mall"]
  },
  {
    id: "TS-003",
    name: "SLT Teleshop - Nugegoda",
    nameSinhala: "ටෙලිෂොප් - නුගේගොඩ",
    nameTamil: "டெலிஷாப் - நுகேகொட",
    department: "Sales & Payments",
    hotline: "011 2 822 822",
    operatingHours: "09:00 AM - 06:00 PM",
    location: "High Level Road, Nugegoda",
    type: "Teleshop",
    keywords: ["nugegoda", "teleshop", "sales", "payments", "highlevel"]
  },
  {
    id: "TS-004",
    name: "SLT Teleshop - Negombo",
    nameSinhala: "ටෙලිෂොප් - මීගමුව",
    nameTamil: "டெலிஷாப் - நீர்கொழும்பு",
    department: "Sales & Customer Support",
    hotline: "031 2 222 555",
    operatingHours: "09:00 AM - 06:00 PM",
    location: "Greens Road, Negombo",
    type: "Teleshop",
    keywords: ["negombo", "meegamuwa", "teleshop", "sales", "airport"]
  },

  // --- Corporate & Head Office ---
  {
    id: "HO-001",
    name: "SLT Headquarters - Main Reception",
    nameSinhala: "ශ්‍රී ලංකා ටෙලිකොම් ප්‍රධාන කාර්යාලය",
    nameTamil: "ஸ்ரீலங்கா டெலிகொம் தலைமையகம்",
    department: "General Inquiry",
    hotline: "011 2 021 000",
    operatingHours: "08:30 AM - 05:00 PM",
    location: "Lotus Road, Colombo 01",
    type: "Head Office",
    keywords: ["head office", "hq", "reception", "main", "colombo 1", "lotus road"]
  },
  {
    id: "HO-002",
    name: "Enterprise Solutions Hotline",
    nameSinhala: "ආයතනික පාරිභෝගික සේවා",
    nameTamil: "நிறுவன வாடிக்கையாளர் சேவை",
    department: "Corporate Sales",
    hotline: "011 2 388 388",
    operatingHours: "24/7",
    location: "Colombo 01",
    type: "Corporate Support",
    keywords: ["enterprise", "corporate", "business", "b2b", "sales", "company"]
  },
  {
    id: "HO-003",
    name: "PeoTV Technical Support",
    nameSinhala: "PeoTV තාක්ෂණික සහාය",
    nameTamil: "PeoTV தொழில்நுட்ப ஆதரவு",
    department: "Technical Helpdesk",
    hotline: "1212",
    extension: "Option 3",
    operatingHours: "24/7",
    location: "SLT VisionCom, Colombo",
    type: "Helpdesk",
    keywords: ["peotv", "tv", "visioncom", "fault", "technical", "support", "broken", "channel"]
  },

  // --- External / Emergency Directories ---
  {
    id: "EMR-001",
    name: "Police Emergency Service",
    nameSinhala: "පොලිස් හදිසි ඇමතුම්",
    nameTamil: "பொலிஸ் அவசர சேவை",
    department: "Emergency Dispatch",
    hotline: "119",
    operatingHours: "24/7",
    location: "Islandwide",
    type: "Emergency",
    keywords: ["police", "emergency", "119", "robbery", "accident", "policiya", "hadisi"]
  },
  {
    id: "EMR-002",
    name: "Fire & Rescue Department",
    nameSinhala: "ගිනි නිවන ඒකකය",
    nameTamil: "தீயணைப்பு மற்றும் மீட்பு துறை",
    department: "Fire Dispatch",
    hotline: "110",
    operatingHours: "24/7",
    location: "Islandwide",
    type: "Emergency",
    keywords: ["fire", "gini", "gini niwana", "rescue", "110", "ambulance", "gini gaththa"]
  },
  {
    id: "EMR-003",
    name: "National Hospital Colombo",
    nameSinhala: "ජාතික රෝහල කොළඹ",
    nameTamil: "தேசிய மருத்துவமனை கொழும்பு",
    department: "General Info",
    hotline: "011 2 691 111",
    operatingHours: "24/7",
    location: "Regent Street, Colombo 08",
    type: "Hospital",
    keywords: ["hospital", "rohal", "jathika", "national hospital", "colombo 8", "medical", "ward"]
  },
  {
    id: "EMR-004",
    name: "Suwa Seriya Ambulance",
    nameSinhala: "සුව සැරිය ගිලන් රථ",
    nameTamil: "சுவ செரிய அம்புலன்ஸ்",
    department: "Medical Emergency",
    hotline: "1990",
    operatingHours: "24/7",
    location: "Islandwide",
    type: "Emergency",
    keywords: ["ambulance", "1990", "suwa seriya", "medical", "gilan ratha", "ledek"]
  },
  {
    id: "EMR-005",
    name: "Ceylon Electricity Board (CEB) Hotline",
    nameSinhala: "විදුලිබල මණ්ඩලය",
    nameTamil: "இலங்கை மின்சார சபை",
    department: "Fault Reporting",
    hotline: "1987",
    operatingHours: "24/7",
    location: "Islandwide",
    type: "Utility",
    keywords: ["ceb", "electricity", "power", "current giya", "vidulibala", "fault", "1987"]
  },
  {
    id: "EMR-006",
    name: "National Water Supply & Drainage Board",
    nameSinhala: "ජාතික ජලසම්පාදන මණ්ඩලය",
    nameTamil: "தேசிய நீர் வழங்கல் சபை",
    department: "Fault Reporting",
    hotline: "1939",
    operatingHours: "24/7",
    location: "Islandwide",
    type: "Utility",
    keywords: ["water", "wathura", "jala sampadana", "nwsdb", "1939", "leak", "pipe"]
  },

  // --- Specific SLT Employees (Simulated) ---
  {
    id: "EMP-001",
    name: "Gehan Jayawardana",
    nameSinhala: "ගිහාන් ජයවර්ධන",
    nameTamil: "கெஹான் ஜயவர்தன",
    department: "IT Infrastructure Manager",
    hotline: "071 234 5678",
    extension: "8492",
    operatingHours: "08:30 AM - 05:00 PM",
    location: "Colombo Head Office - Floor 4",
    type: "Employee",
    keywords: ["gehan", "jayawardana", "manager", "it", "infrastructure", "gehan aiya"]
  },
  {
    id: "EMP-002",
    name: "Nuwan Kumara",
    nameSinhala: "නුවන් කුමාර",
    nameTamil: "நுவன் குமார",
    department: "Fiber Deployment Team Lead",
    hotline: "071 999 8888",
    extension: "3311",
    operatingHours: "08:30 AM - 05:00 PM",
    location: "Kurunegala RTO",
    type: "Employee",
    keywords: ["nuwan", "kumara", "fiber", "team lead", "kurunegala", "ftth"]
  },
  {
    id: "EMP-003",
    name: "Sarah Fernando",
    department: "Enterprise Account Manager",
    hotline: "071 555 4444",
    extension: "9921",
    operatingHours: "08:30 AM - 05:00 PM",
    location: "Colombo Head Office - Floor 2",
    type: "Employee",
    keywords: ["sarah", "fernando", "enterprise", "account", "manager", "corporate"]
  },
  {
    id: "EMP-004",
    name: "Kamal Perera",
    nameSinhala: "කමල් පෙරේරා",
    department: "PeoTV Broadcasting Engineer",
    hotline: "071 444 3333",
    extension: "2041",
    operatingHours: "Shift Basis",
    location: "SLT VisionCom, Welikada",
    type: "Employee",
    keywords: ["kamal", "perera", "peotv", "engineer", "broadcasting"]
  },
  
  // --- Government Ministries ---
  {
    id: "GOV-001",
    name: "Ministry of Health",
    nameSinhala: "සෞඛ්‍ය අමාත්‍යාංශය",
    nameTamil: "சுகாதார அமைச்சு",
    department: "General Inquiries",
    hotline: "011 2 695 112",
    operatingHours: "08:30 AM - 04:15 PM",
    location: "Suwasiripaya, Colombo 10",
    type: "Government",
    keywords: ["ministry", "health", "saukya", "suwasiripaya", "colombo 10"]
  },
  {
    id: "GOV-002",
    name: "Department of Immigration and Emigration",
    nameSinhala: "ආගමන හා විගමන දෙපාර්තමේන්තුව",
    nameTamil: "குடிவரவு குடியகல்வு திணைக்களம்",
    department: "Passport Inquiries",
    hotline: "011 5 329 000",
    operatingHours: "08:00 AM - 04:30 PM",
    location: "Suhurupaya, Battaramulla",
    type: "Government",
    keywords: ["passport", "immigration", "emigration", "suhurupaya", "battaramulla", "visa"]
  }
];
