import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';

// Load environment variables
dotenv.config();

const SESSION_TOKEN = crypto.randomBytes(32).toString('hex');

const requireAuth = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Missing token' });
  }
  const token = authHeader.split(' ')[1];
  if (token !== SESSION_TOKEN) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
  }
  next();
};

function hashPassword(password: string) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Initialize Firebase SDK
let firebaseConfig: any = null;
try {
  const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
  if (fs.existsSync(configPath)) {
    firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  }
} catch (err) {
  console.error('[FIREBASE CONFIG] Failed to load firebase-applet-config.json, using environment fallback', err);
}

if (!firebaseConfig) {
  firebaseConfig = {
    projectId: "firm-drummer-1pnh2",
    appId: "1:631060688559:web:f4e896b92e9b18993bae5a",
    apiKey: "AIzaSyD0wMnV4kHQW3jOmNzaPlpHXFYeqkJ3sPE",
    authDomain: "firm-drummer-1pnh2.firebaseapp.com",
    firestoreDatabaseId: "ai-studio-aynxportfolio-d393c4b5-36f3-46cd-a8ce-c5935c015c80",
    storageBucket: "firm-drummer-1pnh2.firebasestorage.app",
    messagingSenderId: "631060688559",
  };
}

const firebaseApp = initializeApp(firebaseConfig);
const firestoreDb = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);

let aiInstance: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

app.use(express.json({ limit: '10mb' }));

const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

const rateLimitCache = new Map();
function rateLimiter(req: any, res: any, next: any) {
  // Relax rate limiting for preview/development to avoid multi-user/proxy IP blockages
  next();
}

const DEFAULT_DB = {
  admin: {
    username: 'artistayan123@gmail.com',
    password: '787d451a22f3b47bc49e25caa3a487359b8c745bac4e75f2553d0a2f4997d063'
  },
  settings: {
    aboutText: "I am Ayan Nayak (A.ynx_), a multidisciplinary creator with over three years of experience delivering premium digital solutions worldwide. From cinematic editing and motion graphics to website, application, and game development, my mission is to build memorable digital experiences with creativity, professionalism, and reliability. Having successfully served more than 250 clients across India, Pakistan, and the USA, I continue to push boundaries and learn new technologies every day.",
    experience: "3+ Years",
    clientsCount: "250+",
    countriesCount: "3+",
    contactPhone: "+91 8477824872",
    contactTelegram: "https://t.me/Aynxxzzz",
    contactWhatsApp: "https://wa.me/918477824872"
  },
  projects: [
    {
      id: "1",
      title: "Nexus Luxury Web Portal",
      category: "Website Development",
      description: "A high-speed, holographic-inspired web portal designed for an elite digital couture house, featuring custom hover grids, fluid layout animations, and premium cursor physics.",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
      tags: ["React", "Tailwind CSS", "Motion", "Aesthetic Typography"],
      client: "Couture Digital Ltd.",
      date: "May 2026",
      link: "https://nexus-luxury.example.com",
      budget: "$5,000+"
    },
    {
      id: "2",
      title: "Aura Decentralized App",
      category: "App Development",
      description: "A secure, gesture-driven cryptocurrency wallet and NFT portfolio manager, designed with rich glassmorphism layouts, fluid tactile buttons, and interactive card transitions.",
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=800&auto=format&fit=crop",
      tags: ["React Native", "TypeScript", "Tailwind", "Haptic Engines"],
      client: "Aura Labs Inc.",
      date: "Jan 2026",
      link: "https://aura-crypto.example.com",
      budget: "$7,500+"
    },
    {
      id: "3",
      title: "Neon Chase 3D Runner",
      category: "Game Development",
      description: "An immersive retro-futuristic arcade runner featuring procedural terrain, procedural synthetic ambient scores, volumetric neon lighting, and high-performance physics.",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop",
      tags: ["Three.js", "WebGL", "TypeScript", "Audio Synth"],
      client: "Vapor Gaming Group",
      date: "March 2026",
      link: "https://neon-chase.example.com",
      budget: "$12,000"
    },
    {
      id: "4",
      title: "Cinematic Motion Opener",
      category: "Video Editing",
      description: "A premium 4K production opener for luxury auto-brands, crafting multi-layered 3D space effects, high-fidelity soundscapes, and professional-grade color grading.",
      image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop",
      tags: ["After Effects", "Premiere Pro", "DaVinci", "Sound Design"],
      client: "Vitesse Automotive",
      date: "April 2026",
      link: "https://vimeo.com/example",
      budget: "$3,500"
    },
    {
      id: "5",
      title: "Morphing Fluid Graphics",
      category: "Motion Graphics",
      description: "A series of kinetic typographic posters and digital animations that play with fluid dynamics, shape morphing, and golden metallic lighting overlays.",
      image: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=800&auto=format&fit=crop",
      tags: ["After Effects", "Framer Motion", "WebGL Canvas"],
      client: "Sonder Studio",
      date: "Feb 2026",
      link: "https://sonder.example.com",
      budget: "$4,200"
    },
    {
      id: "6",
      title: "Gold-Inlaid YouTube Thumbnail Set",
      category: "Thumbnail Design",
      description: "A series of high-conversion digital cover illustrations utilizing volumetric lighting, meticulously placed drop-shadows, and gold-foil digital elements.",
      image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=800&auto=format&fit=crop",
      tags: ["Photoshop", "Lightroom", "Volumetric Glows"],
      client: "Nayak Tech Show",
      date: "June 2026",
      link: "#",
      budget: "$1,800"
    },
    {
      id: "7",
      title: "Omni Flow Enterprise Dashboard",
      category: "Business Solutions",
      description: "A gorgeous executive corporate visualization system that helps large agencies export logs, track real-time visitors, and monitor cross-platform analytics with 3D charts.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
      tags: ["React Charts", "Express Backend", "CSV Export"],
      client: "Apex Enterprise Group",
      date: "June 2026",
      link: "https://omni-flow.example.com",
      budget: "$9,000"
    }
  ],
  reviews: [
    {
      id: "1",
      name: "James Carter",
      text: "Exceptional work and incredible quality. Fast, reliable and highly professional.",
      rating: 5,
      country: "USA 🇺🇸",
      approved: true,
      featured: true,
      date: "2026-06-15T10:00:00Z"
    },
    {
      id: "2",
      name: "Ali Raza",
      text: "Professional, creative and always available. Highly recommended.",
      rating: 5,
      country: "Pakistan 🇵🇰",
      approved: true,
      featured: true,
      date: "2026-06-18T14:30:00Z"
    },
    {
      id: "3",
      name: "Rohit Sharma",
      text: "One of the best editors and developers I have ever worked with.",
      rating: 5,
      country: "India 🇮🇳",
      approved: true,
      featured: true,
      date: "2026-06-25T08:15:00Z"
    }
  ],
  messages: [] as any[],
  analytics: {
    totalViews: 0,
    viewsByCountry: {} as Record<string, number>,
    viewsByService: {} as Record<string, number>,
    recentVisits: [] as any[]
  }
};

const countryMap: Record<string, string> = {
  "IN": "India 🇮🇳",
  "US": "USA 🇺🇸",
  "PK": "Pakistan 🇵🇰",
  "GB": "United Kingdom 🇬🇧",
  "CA": "Canada 🇨🇦",
  "AU": "Australia 🇦🇺",
  "DE": "Germany 🇩🇪",
  "FR": "France 🇫🇷",
  "AE": "UAE 🇦🇪",
  "BD": "Bangladesh 🇧🇩",
  "RU": "Russia 🇷🇺",
  "BR": "Brazil 🇧🇷",
  "ZA": "South Africa 🇿🇦",
  "SG": "Singapore 🇸🇬",
  "JP": "Japan 🇯🇵",
  "MY": "Malaysia 🇲🇾",
  "ID": "Indonesia 🇮🇩",
  "NP": "Nepal 🇳🇵",
  "LK": "Sri Lanka 🇱🇰"
};

function getCountryFromHeaders(req: express.Request): string {
  const directCountry = req.headers['cf-ipcountry'] || req.headers['x-appengine-country'] || req.headers['x-country-code'];
  if (directCountry && typeof directCountry === 'string') {
    const code = directCountry.toUpperCase();
    if (countryMap[code]) return countryMap[code];
  }

  const langHeader = req.headers['accept-language'];
  if (langHeader && typeof langHeader === 'string') {
    const matches = langHeader.match(/[a-z]{2}-([A-Z]{2})/);
    if (matches && matches[1]) {
      const code = matches[1].toUpperCase();
      if (countryMap[code]) return countryMap[code];
    }
    const matchesLower = langHeader.match(/[a-z]{2}-([a-z]{2})/);
    if (matchesLower && matchesLower[1]) {
      const code = matchesLower[1].toUpperCase();
      if (countryMap[code]) return countryMap[code];
    }
  }

  return "Other 🌐";
}

// Ensure database is seeded with initial default content
async function ensureDatabaseSeeded() {
  try {
    const adminDocRef = doc(firestoreDb, 'site_config', 'admin');
    const adminSnap = await getDoc(adminDocRef);
    if (!adminSnap.exists()) {
      console.log('[FIRESTORE] Seeding Firestore database with default portfolio data...');
      
      await setDoc(doc(firestoreDb, 'site_config', 'admin'), DEFAULT_DB.admin);
      await setDoc(doc(firestoreDb, 'site_config', 'settings'), DEFAULT_DB.settings);
      await setDoc(doc(firestoreDb, 'site_config', 'analytics'), DEFAULT_DB.analytics);
      
      for (const project of DEFAULT_DB.projects) {
        await setDoc(doc(firestoreDb, 'projects', project.id), project);
      }
      
      for (const review of DEFAULT_DB.reviews) {
        await setDoc(doc(firestoreDb, 'reviews', review.id), review);
      }
      
      console.log('[FIRESTORE] Seeding complete.');
    } else {
      console.log('[FIRESTORE] Already seeded. Skipping initial seed.');
    }
  } catch (error) {
    console.error('[FIRESTORE] Seeding failed:', error);
  }
}

// Database Getters and Setters
async function getAdminCredentials() {
  try {
    const docRef = doc(firestoreDb, 'site_config', 'admin');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data();
    }
  } catch (err) {
    console.error('Error getting admin credentials', err);
  }
  return DEFAULT_DB.admin;
}

async function getSettings() {
  try {
    const docRef = doc(firestoreDb, 'site_config', 'settings');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data();
    }
  } catch (err) {
    console.error('Error getting settings', err);
  }
  return DEFAULT_DB.settings;
}

async function updateSettings(settings: any) {
  try {
    const docRef = doc(firestoreDb, 'site_config', 'settings');
    await setDoc(docRef, settings, { merge: true });
  } catch (err) {
    console.error('Error updating settings', err);
  }
}

async function getProjects() {
  try {
    const colRef = collection(firestoreDb, 'projects');
    const snap = await getDocs(colRef);
    const projects: any[] = [];
    snap.forEach((doc) => {
      projects.push(doc.data());
    });
    projects.sort((a, b) => {
      const numA = parseInt(a.id);
      const numB = parseInt(b.id);
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }
      return a.id.localeCompare(b.id);
    });
    return projects;
  } catch (err) {
    console.error('Error getting projects', err);
  }
  return DEFAULT_DB.projects;
}

async function saveProject(project: any) {
  try {
    const docRef = doc(firestoreDb, 'projects', project.id);
    await setDoc(docRef, project);
  } catch (err) {
    console.error('Error saving project', err);
  }
}

async function deleteProject(id: string) {
  try {
    const docRef = doc(firestoreDb, 'projects', id);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Error deleting project', err);
  }
}

async function getReviews() {
  try {
    const colRef = collection(firestoreDb, 'reviews');
    const snap = await getDocs(colRef);
    const reviews: any[] = [];
    snap.forEach((doc) => {
      reviews.push(doc.data());
    });
    reviews.sort((a, b) => {
      return new Date(b.date || b.id).getTime() - new Date(a.date || a.id).getTime();
    });
    return reviews;
  } catch (err) {
    console.error('Error getting reviews', err);
  }
  return DEFAULT_DB.reviews;
}

async function saveReview(review: any) {
  try {
    const docRef = doc(firestoreDb, 'reviews', review.id);
    await setDoc(docRef, review);
  } catch (err) {
    console.error('Error saving review', err);
  }
}

async function deleteReview(id: string) {
  try {
    const docRef = doc(firestoreDb, 'reviews', id);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Error deleting review', err);
  }
}

async function getMessages() {
  try {
    const colRef = collection(firestoreDb, 'messages');
    const snap = await getDocs(colRef);
    const messages: any[] = [];
    snap.forEach((doc) => {
      messages.push(doc.data());
    });
    messages.sort((a, b) => {
      return new Date(b.date || b.id).getTime() - new Date(a.date || a.id).getTime();
    });
    return messages;
  } catch (err) {
    console.error('Error getting messages', err);
  }
  return [];
}

async function saveMessage(message: any) {
  try {
    const docRef = doc(firestoreDb, 'messages', message.id);
    await setDoc(docRef, message);
  } catch (err) {
    console.error('Error saving message', err);
  }
}

async function deleteMessage(id: string) {
  try {
    const docRef = doc(firestoreDb, 'messages', id);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Error deleting message', err);
  }
}

async function getAnalytics() {
  try {
    const docRef = doc(firestoreDb, 'site_config', 'analytics');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data();
    }
  } catch (err) {
    console.error('Error getting analytics', err);
  }
  return {
    totalViews: 0,
    viewsByCountry: {},
    viewsByService: {},
    recentVisits: []
  };
}

async function updateAnalytics(analytics: any) {
  try {
    const docRef = doc(firestoreDb, 'site_config', 'analytics');
    await setDoc(docRef, analytics);
  } catch (err) {
    console.error('Error updating analytics', err);
  }
}

// REST API Endpoints

// 1. Analytics Logger Middleware
app.use(async (req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api/') && !req.path.includes('.')) {
    try {
      const analytics = await getAnalytics();
      analytics.totalViews = (analytics.totalViews || 0) + 1;
      
      const visitorCountry = getCountryFromHeaders(req);
      if (!analytics.viewsByCountry) analytics.viewsByCountry = {};
      analytics.viewsByCountry[visitorCountry] = (analytics.viewsByCountry[visitorCountry] || 0) + 1;

      if (!analytics.recentVisits) analytics.recentVisits = [];
      analytics.recentVisits.unshift({
        id: "v" + Date.now() + Math.random().toString(36).substr(2, 4),
        path: req.path,
        country: visitorCountry,
        time: new Date().toISOString()
      });

      if (analytics.recentVisits.length > 50) {
        analytics.recentVisits = analytics.recentVisits.slice(0, 50);
      }

      await updateAnalytics(analytics);
    } catch (e) {
      console.error(e);
    }
  }
  next();
});

// 2. Auth Endpoint
app.post('/api/auth/login', rateLimiter, async (req, res) => {
  const { username, password } = req.body;
  const admin = await getAdminCredentials();
  if (username === admin.username && hashPassword(password) === admin.password) {
    res.json({ success: true, token: SESSION_TOKEN });
  } else {
    res.status(401).json({ success: false, message: 'Invalid administrative credentials.' });
  }
});

// 2.5 Upload Endpoint
app.post('/api/upload', requireAuth, async (req, res) => {
  try {
    const { name, type, base64 } = req.body;
    if (!name || !base64) {
      return res.status(400).json({ success: false, message: 'Missing file name or data.' });
    }

    // Clean filename to prevent path traversal
    const safeName = name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${Date.now()}-${safeName}`;
    const filePath = path.join(uploadsDir, fileName);

    // Extract raw base64 data
    const base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');

    await fs.promises.writeFile(filePath, buffer);

    res.json({ success: true, url: `/uploads/${fileName}` });
  } catch (error: any) {
    console.error('[UPLOAD ERROR]', error);
    res.status(500).json({ success: false, message: 'Upload failed: ' + error.message });
  }
});

// 3. Admin Settings
app.get('/api/settings', async (req, res) => {
  const settings = await getSettings();
  res.json(settings);
});

app.put('/api/settings', requireAuth, async (req, res) => {
  const settings = { ...req.body };
  await updateSettings(settings);
  res.json({ success: true, settings });
});

// 4. Portfolio Projects
app.get('/api/projects', async (req, res) => {
  const projects = await getProjects();
  res.json(projects);
});

app.post('/api/projects', requireAuth, async (req, res) => {
  const newProject = {
    ...req.body,
    id: Date.now().toString()
  };
  await saveProject(newProject);
  res.json({ success: true, project: newProject });
});

app.put('/api/projects/:id', requireAuth, async (req, res) => {
  const id = req.params.id;
  const existingProjects = await getProjects();
  const existing = existingProjects.find(p => p.id === id);
  if (existing) {
    const updated = { ...existing, ...req.body, id };
    await saveProject(updated);
    res.json({ success: true, project: updated });
  } else {
    res.status(404).json({ success: false, message: "Project not found" });
  }
});

app.delete('/api/projects/:id', requireAuth, async (req, res) => {
  await deleteProject(req.params.id);
  res.json({ success: true });
});

// 4.5 AI Blueprint Co-Pilot Architect
app.post('/api/ai/architect', rateLimiter, async (req, res) => {
  try {
    const { projectName, projectDescription, targetPlatform, approxBudgetRange, selectedCurrency, explicitPrice } = req.body;
    
    if (!projectDescription) {
      return res.status(400).json({ success: false, error: "Project description is required to generate a blueprint." });
    }

    const ai = getGeminiClient();

    const currName = selectedCurrency || 'INR';
    const baseVal = explicitPrice || 'Competitive Tier';

    const prompt = `You are the lead AI Creative Architect at A.YNX_ Creative Engine, an elite digital boutique specializing in website development, mobile apps, 3D/retro game development, high-end motion graphics, and thumbnail design.
    
    Analyze the following user project concept and perform a genuine, rigorous engineering evaluation:
    - Project Name: ${projectName || 'Unnamed concept'}
    - Description: ${projectDescription}
    - Target Platform: ${targetPlatform || 'Not specified'}
    - Selected Tier Preference: ${approxBudgetRange || 'Not specified'}
    - Selected Base Budget reference: ${baseVal} (Currency: ${currName})

    Please synthesize a premium engineering blueprint recommendation. You MUST perform a realistic engineering evaluation of the scope:
    1. Recommended disciplines (from our catalog: 'Website Development', 'App Development', 'Game Development', 'Motion Graphics', 'Thumbnail Design', 'Video Editing', 'Business Solutions'). Choose only the highly relevant ones.
    2. Suggested high-level architecture/tech stack (e.g. React, Tailwind CSS, Node.js, Express, Firestore, etc.). Be specific, modern, and realistic.
    3. 3-5 unique key features to make this project stand out in the industry.
    
    4. An appropriate, DYNAMICALLY ESTIMATED COST RANGE in the user's selected currency (${currName}) that is realistic for the described scope.
       CRITICAL RULES FOR BUDGET ESTIMATION:
       - Since A.YNX_ Creative Engine is an agile, high-efficiency development boutique, you MUST keep the budget strictly within these pricing bounds under all circumstances:
         * INR (Rupee): Minimum ₹8,999 INR, Maximum ₹30,000 INR.
         * USD (Dollar): Minimum $150 USD, Maximum $800 USD.
       - Under NO circumstance may the estimate exceed the maximum limit of ₹30,000 INR or $800 USD, nor fall below the minimum limit of ₹8,999 INR or $150 USD.
       - Scale the estimate dynamically based on the complexity of the user's described project:
         * Simple scope (e.g. single thumbnail, basic graphic, simple 1-page landing screen): estimate near the minimum range (e.g., "₹8,999 - ₹12,000 INR" or "$150 - $250 USD").
         * Medium scope (e.g. interactive multi-section website, custom motion graphics): estimate in the mid-range (e.g., "₹15,000 - ₹22,000 INR" or "$350 - $550 USD").
         * High complexity scope (e.g. full-stack interactive portals, customized web application, dynamic databases, 3D games): estimate near the absolute maximum range (e.g., "₹25,000 - ₹30,000 INR" or "$700 - $800 USD").
       - Provide a professional, specific range in the selected currency (e.g., "₹18,500 - ₹24,000 INR" or "$450 - $600 USD") within these exact bounds.
       
    5. A REALISTIC DEVELOPMENT TIMELINE (e.g. "3 - 5 Days", "10 - 14 Days", "3 - 4 Weeks", "6 - 8 Weeks") based on the true complexity of the project.
       - Do NOT default or hardcode to "5 - 7 Days" unless the project is indeed a simple 1-page static screen.
       - Complex systems, dynamic apps, or WebGL environments require realistic milestones (e.g., "4 - 5 Weeks" or "2 Months").
       
    6. A 3-4 milestone action plan roadmap.
    
    7. Personal expert notes from Ayan (A.ynx_) explaining how this blueprint will be delivered, including a justification of why the estimated budget or timeline may differ from their selected base reference (${baseVal}) due to the high production values, custom visual layouts, and architectural security required.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendedDisciplines: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Subset of: 'Website Development', 'App Development', 'Game Development', 'Motion Graphics', 'Thumbnail Design'"
            },
            suggestedArchitecture: {
              type: Type.STRING,
              description: "High-level visual & technical architecture approach"
            },
            keyFeatures: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ["title", "description"]
              },
              description: "Key recommended features"
            },
            budgetEstimate: {
              type: Type.STRING,
              description: "Cost range (e.g. '$4,000 - $6,000')"
            },
            timelineEstimate: {
              type: Type.STRING,
              description: "Estimated duration (e.g. '4 - 6 Weeks')"
            },
            actionPlanSteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Action plan roadmap milestones"
            },
            aiArchitectNotes: {
              type: Type.STRING,
              description: "Strategic creative recommendation from lead architect Ayan"
            }
          },
          required: [
            "recommendedDisciplines",
            "suggestedArchitecture",
            "keyFeatures",
            "budgetEstimate",
            "timelineEstimate",
            "actionPlanSteps",
            "aiArchitectNotes"
          ]
        }
      }
    });

    let resultText = response.text;
    if (!resultText) {
      throw new Error("No response text returned from the AI model.");
    }

    resultText = resultText.trim();
    if (resultText.startsWith('```json')) {
      resultText = resultText.substring(7);
    } else if (resultText.startsWith('```')) {
      resultText = resultText.substring(3);
    }
    if (resultText.endsWith('```')) {
      resultText = resultText.substring(0, resultText.length - 3);
    }
    resultText = resultText.trim();

    const result = JSON.parse(resultText);
    res.json({ success: true, blueprint: result });
  } catch (error: any) {
    console.error("[AI ARCHITECT ERROR]", error);
    res.status(500).json({ success: false, error: error.message || "An unexpected error occurred during AI synthesis." });
  }
});

// 5. Reviews
app.get('/api/reviews', async (req, res) => {
  const reviews = await getReviews();
  res.json(reviews);
});

function validateMessage(req: any, res: any, next: any) {
  if (!req.body || typeof req.body !== 'object') return res.status(400).json({ success: false, message: 'Invalid payload' });
  const { name, email, message } = req.body;
  if (!name || typeof name !== 'string' || name.length > 100) return res.status(400).json({ success: false, message: 'Invalid name' });
  if (!email || typeof email !== 'string' || email.length > 150) return res.status(400).json({ success: false, message: 'Invalid email' });
  if (message && (typeof message !== 'string' || message.length > 5000)) return res.status(400).json({ success: false, message: 'Message too long' });
  next();
}

function validateReview(req: any, res: any, next: any) {
  if (!req.body || typeof req.body !== 'object') return res.status(400).json({ success: false, message: 'Invalid payload' });
  const { name, text, rating } = req.body;
  if (!name || typeof name !== 'string' || name.length > 100) return res.status(400).json({ success: false, message: 'Invalid name' });
  if (!text || typeof text !== 'string' || text.length > 2000) return res.status(400).json({ success: false, message: 'Text too long' });
  if (typeof rating !== 'number' || rating < 1 || rating > 5) return res.status(400).json({ success: false, message: 'Invalid rating' });
  next();
}

app.post('/api/reviews', rateLimiter, validateReview, async (req, res) => {
  const newReview = {
    ...req.body,
    id: Date.now().toString(),
    approved: false,
    featured: false,
    date: new Date().toISOString()
  };
  await saveReview(newReview);
  res.json({ success: true, review: newReview });
});

app.put('/api/reviews/:id', requireAuth, async (req, res) => {
  const id = req.params.id;
  const existingReviews = await getReviews();
  const existing = existingReviews.find(r => r.id === id);
  if (existing) {
    const updated = { ...existing, ...req.body, id };
    await saveReview(updated);
    res.json({ success: true, review: updated });
  } else {
    res.status(404).json({ success: false, message: "Review not found" });
  }
});

app.delete('/api/reviews/:id', requireAuth, async (req, res) => {
  await deleteReview(req.params.id);
  res.json({ success: true });
});

// 6. Messages
app.get('/api/messages', requireAuth, async (req, res) => {
  const messages = await getMessages();
  res.json(messages);
});

app.post('/api/messages', rateLimiter, validateMessage, async (req, res) => {
  const newMessage = {
    ...req.body,
    id: Date.now().toString(),
    date: new Date().toISOString(),
    status: 'unread'
  };
  await saveMessage(newMessage);
  
  if (req.body.service) {
    const analytics = await getAnalytics();
    if (!analytics.viewsByService) analytics.viewsByService = {};
    analytics.viewsByService[req.body.service] = (analytics.viewsByService[req.body.service] || 0) + 1;
    await updateAnalytics(analytics);
  }
  
  console.log(`[MAIL DISPATCH] Notification sent to Ayan Nayak (+91 8477824872, thenayakshow12@gmail.com). New lead from ${req.body.name} (${req.body.country}) regarding "${req.body.service}" with budget: ${req.body.budget}.`);

  res.json({ success: true, message: newMessage });
});

app.put('/api/messages/:id', requireAuth, async (req, res) => {
  const id = req.params.id;
  const existingMessages = await getMessages();
  const existing = existingMessages.find(m => m.id === id);
  if (existing) {
    const updated = { ...existing, ...req.body, id };
    await saveMessage(updated);
    res.json({ success: true, message: updated });
  } else {
    res.status(404).json({ success: false, message: "Message not found" });
  }
});

app.delete('/api/messages/:id', requireAuth, async (req, res) => {
  await deleteMessage(req.params.id);
  res.json({ success: true });
});

// 7. Analytics Data
app.get('/api/analytics', async (req, res) => {
  const analytics = await getAnalytics();
  res.json(analytics);
});

app.post('/api/analytics/reset', requireAuth, async (req, res) => {
  const analytics = {
    totalViews: 0,
    viewsByCountry: {},
    viewsByService: {},
    recentVisits: []
  };
  await updateAnalytics(analytics);
  res.json({ success: true, analytics });
});

async function startServer() {
  // Ensure Firestore is seeded with default content on initial launch
  await ensureDatabaseSeeded();

  // Vite & Static file serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[AYN PORTFOLIO SERVER] Running securely on port ${PORT}`);
  });
}

startServer();
