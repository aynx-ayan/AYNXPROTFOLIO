import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, LayoutDashboard, Briefcase, MessageSquare, Mail, Settings as SettingsIcon, 
  Trash2, Check, Star, ShieldAlert, Download, LogOut, Plus, Edit2, BarChart2, Eye, MapPin,
  Upload, Image
} from 'lucide-react';
import { Project, Review, Message, AdminSettings, AnalyticsData } from '../types';

interface AdminSectionProps {
  projects: Project[];
  reviews: Review[];
  messages: Message[];
  settings: AdminSettings;
  analytics: AnalyticsData;
  onUpdateProjects: (proj: Project[]) => void;
  onUpdateReviews: (rev: Review[]) => void;
  onUpdateMessages: (msg: Message[]) => void;
  onUpdateSettings: (set: AdminSettings) => void;
  onUpdateAnalytics: (anal: AnalyticsData) => void;
}

export default function AdminSection({
  projects,
  reviews,
  messages,
  settings,
  analytics,
  onUpdateProjects,
  onUpdateReviews,
  onUpdateMessages,
  onUpdateSettings,
  onUpdateAnalytics
}: AdminSectionProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Drag and drop / upload state
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await uploadFile(files[0]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await uploadFile(files[0]);
    }
  };

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file (PNG, JPG, WEBP, GIF etc.)');
      return;
    }

    setUploading(true);
    setUploadError('');

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        
        const token = sessionStorage.getItem('ayn_session');
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            name: file.name,
            type: file.type,
            base64: base64String
          })
        });

        const data = await response.json();
        if (data.success) {
          setPImage(data.url);
        } else {
          setUploadError(data.message || 'Upload failed.');
        }
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setUploadError('An error occurred during upload.');
      setUploading(false);
    }
  };

  // Tab control inside dashboard
  const [activeTab, setActiveTab] = useState<'analytics' | 'projects' | 'reviews' | 'messages' | 'settings'>('analytics');

  // Edit/Add Project modal state
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [pTitle, setPTitle] = useState('');
  const [pDesc, setPDesc] = useState('');
  const [pCategory, setPCategory] = useState('Website Development');
  const [pImage, setPImage] = useState('');
  const [pClient, setPClient] = useState('');
  const [pBudget, setPBudget] = useState('');
  const [pLink, setPLink] = useState('');
  const [pTags, setPTags] = useState('');

  // Settings edit state
  const [aboutMeText, setAboutMeText] = useState(settings.aboutText || '');
  const [whatsappVal, setWhatsappVal] = useState(settings.contactWhatsApp || '');
  const [telegramVal, setTelegramVal] = useState(settings.contactTelegram || '');
  const [phoneVal, setPhoneVal] = useState(settings.contactPhone || '');

  useEffect(() => {
    // Sync local states when settings load
    setAboutMeText(settings.aboutText);
    setWhatsappVal(settings.contactWhatsApp);
    setTelegramVal(settings.contactTelegram);
    setPhoneVal(settings.contactPhone);
  }, [settings]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        // Store session token
        sessionStorage.setItem('ayn_session', data.token);
      } else {
        setLoginError(data.message || 'Access denied.');
      }
    } catch (err) {
      setLoginError('Could not contact authentication gateway.');
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem('ayn_session');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('ayn_session');
    setIsAuthenticated(false);
  };

  // 1. Projects CRUDS
  const startAddProject = () => {
    setIsAddingProject(true);
    setEditingProject(null);
    setPTitle('');
    setPDesc('');
    setPCategory('Website Development');
    setPImage('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop');
    setPClient('');
    setPBudget('');
    setPLink('');
    setPTags('React, Tailwind');
  };

  const startEditProject = (p: Project) => {
    setIsAddingProject(false);
    setEditingProject(p);
    setPTitle(p.title);
    setPDesc(p.description);
    setPCategory(p.category);
    setPImage(p.image);
    setPClient(p.client || '');
    setPBudget(p.budget || '');
    setPLink(p.link || '');
    setPTags(p.tags.join(', '));
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: pTitle,
      description: pDesc,
      category: pCategory,
      image: pImage,
      client: pClient,
      budget: pBudget,
      link: pLink,
      tags: pTags.split(',').map(t => t.trim()).filter(Boolean)
    };

    try {
      if (isAddingProject) {
        const res = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem('ayn_session')}` },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          onUpdateProjects([...projects, data.project]);
          setIsAddingProject(false);
        }
      } else if (editingProject) {
        const res = await fetch(`/api/projects/${editingProject.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem('ayn_session')}` },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          onUpdateProjects(projects.map(p => p.id === editingProject.id ? data.project : p));
          setEditingProject(null);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${sessionStorage.getItem('ayn_session')}` } });
      const data = await res.json();
      if (data.success) {
        onUpdateProjects(projects.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 2. Reviews CRUD
  const handleApproveReview = async (rev: Review) => {
    try {
      const res = await fetch(`/api/reviews/${rev.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem('ayn_session')}` },
        body: JSON.stringify({ approved: true })
      });
      const data = await res.json();
      if (data.success) {
        onUpdateReviews(reviews.map(r => r.id === rev.id ? data.review : r));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleFeatureReview = async (rev: Review) => {
    try {
      const res = await fetch(`/api/reviews/${rev.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem('ayn_session')}` },
        body: JSON.stringify({ featured: !rev.featured })
      });
      const data = await res.json();
      if (data.success) {
        onUpdateReviews(reviews.map(r => r.id === rev.id ? data.review : r));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm('Delete this review completely?')) return;
    try {
      const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${sessionStorage.getItem('ayn_session')}` } });
      const data = await res.json();
      if (data.success) {
        onUpdateReviews(reviews.filter(r => r.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 3. Settings update
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      aboutText: aboutMeText,
      contactWhatsApp: whatsappVal,
      contactTelegram: telegramVal,
      contactPhone: phoneVal
    };

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem('ayn_session')}` },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        onUpdateSettings(data.settings);
        alert('Administrative parameters saved successfully.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleResetAnalytics = async () => {
    if (!window.confirm("Are you sure you want to reset all traffic analytics, regional metrics, and visit history back to zero? This action is irreversible.")) {
      return;
    }
    try {
      const res = await fetch('/api/analytics/reset', { method: 'POST', headers: { 'Authorization': `Bearer ${sessionStorage.getItem('ayn_session')}` } });
      const data = await res.json();
      if (data.success) {
        onUpdateAnalytics(data.analytics);
        alert('All visitor and traffic analytics have been reset to zero.');
      }
    } catch (e) {
      console.error("Failed to reset analytics", e);
    }
  };

  // 4. Export Messages to JSON/TXT
  const handleExportMessages = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(messages, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Ayn_Studio_Leads_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Render Login Panel if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 select-none relative">
        <div className="absolute inset-0 grid-overlay opacity-30 pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md bg-neutral-950 border border-white/10 rounded-3xl p-8 relative z-10 shadow-2xl gold-glow"
        >
          <div className="text-center space-y-2 mb-8">
            <div className="w-12 h-12 rounded-full border border-gold-500/30 flex items-center justify-center bg-gold-500/5 text-gold-400 mx-auto">
              <Lock className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-display font-extrabold text-white tracking-widest uppercase">
              ADMINISTRATIVE LOG
            </h2>
            <p className="text-[10px] font-mono text-neutral-500">
              ENTER PRIVATE SECURITY DECRYPT KEY
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 font-mono text-xs">
            {loginError && (
              <div className="p-3 bg-red-600/10 border border-red-500/20 text-red-400 rounded-lg text-center flex items-center justify-center gap-2">
                <ShieldAlert className="w-4 h-4" /> {loginError}
              </div>
            )}

            <div className="flex flex-col gap-1.5 text-neutral-400">
              <label className="text-neutral-500 uppercase">User Identification</label>
              <input 
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. admin"
                className="px-4 py-3 bg-neutral-900 border border-white/10 rounded-xl text-white outline-none focus:border-gold-500 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5 text-neutral-400">
              <label className="text-neutral-500 uppercase">Secure Password</label>
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password123"
                className="px-4 py-3 bg-neutral-900 border border-white/10 rounded-xl text-white outline-none focus:border-gold-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gold-500 hover:bg-gold-400 text-black text-xs font-display font-extrabold uppercase tracking-widest rounded-xl shadow-[0_0_20px_rgba(212,163,23,0.3)] transition-all cursor-pointer"
            >
              AUTHENTICATE SECURITY
            </button>
          </form>

          <div className="mt-8 border-t border-white/5 pt-6 text-center text-[10px] font-mono text-neutral-600">
            <span>DEFAULT ACCREDITATION: admin / password123</span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070707] text-white pb-20 pt-24 px-4 sm:px-8 relative select-none">
      <div className="absolute inset-0 grid-overlay opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col gap-8">
        
        {/* Header Panel */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-black/60 backdrop-blur-xl border border-white/5 p-6 rounded-3xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-gold-500/30 bg-gold-500/5 flex items-center justify-center text-gold-400">
              <LayoutDashboard className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold uppercase tracking-widest text-white">
                Core Operations Panel
              </h1>
              <p className="text-[9px] font-mono text-neutral-500">
                A.YNX_ CENTRAL INTELLIGENCE SYSTEMS v3.5
              </p>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="px-4 py-1.5 border border-red-500/20 text-red-400 hover:bg-red-600 hover:text-white rounded-full text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <LogOut className="w-3.5 h-3.5" /> Close Session
          </button>
        </div>

        {/* Workspace Body: Tabs & Contents */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Navigation drawer rail */}
          <div className="lg:col-span-3 flex flex-col gap-2 bg-neutral-950 p-4 rounded-3xl border border-white/5">
            <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest block mb-2 pl-3">
              INTELLIGENCE RAILS
            </span>
            {[
              { id: 'analytics', label: 'Dashboard Stats', icon: BarChart2 },
              { id: 'projects', label: 'Manage Projects', icon: Briefcase },
              { id: 'reviews', label: 'Audit Reviews', icon: MessageSquare },
              { id: 'messages', label: 'Export Leads', icon: Mail },
              { id: 'settings', label: 'About & Contacts', icon: SettingsIcon }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setIsAddingProject(false);
                    setEditingProject(null);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-mono tracking-wider uppercase text-left transition-all cursor-pointer ${
                    activeTab === tab.id 
                      ? 'bg-gold-500 text-black font-bold shadow-[0_0_15px_rgba(212,163,23,0.15)]' 
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" /> {tab.label}
                </button>
              );
            })}
          </div>

          {/* Core dynamic body panel */}
          <div className="lg:col-span-9 bg-neutral-950 p-8 rounded-3xl border border-white/5 min-h-[500px]">
            
            {/* 1. ANALYTICS BOARD */}
            {activeTab === 'analytics' && (
              <div className="space-y-8 text-left">
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <h3 className="text-lg font-display font-bold uppercase tracking-wider text-white">
                    Analytics Dashboard
                  </h3>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleResetAnalytics}
                      className="text-[9px] font-mono text-red-400 hover:text-red-300 border border-red-500/30 bg-red-500/5 hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                    >
                      Reset Analytics Data
                    </button>
                    <span className="text-[10px] font-mono text-green-500 animate-pulse">
                      ● LOGS SYNCHRONIZED
                    </span>
                  </div>
                </div>

                {/* Main statistics cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="glass-premium p-6 rounded-2xl text-left">
                    <span className="text-[9px] font-mono text-neutral-500 block">TOTAL TRAFFIC VIEWS</span>
                    <span className="text-3xl font-display font-black text-gold-400">{analytics.totalViews}</span>
                  </div>
                  <div className="glass-premium p-6 rounded-2xl text-left">
                    <span className="text-[9px] font-mono text-neutral-500 block">PENDING REVIEWS</span>
                    <span className="text-3xl font-display font-black text-white">
                      {reviews.filter(r => !r.approved).length}
                    </span>
                  </div>
                  <div className="glass-premium p-6 rounded-2xl text-left">
                    <span className="text-[9px] font-mono text-neutral-500 block">TOTAL DISPATCH LEADS</span>
                    <span className="text-3xl font-display font-black text-gold-400">{messages.length}</span>
                  </div>
                </div>

                {/* Country radar analytics listing */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                  <div className="glass-premium p-6 rounded-2xl">
                    <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block mb-4">Views By Client Region</span>
                    <div className="space-y-3 font-mono text-xs">
                      {Object.entries(analytics.viewsByCountry).map(([country, count]) => (
                        <div key={country} className="flex justify-between items-center py-1.5 border-b border-white/5">
                          <span className="flex items-center gap-1.5 text-white"><MapPin className="w-3.5 h-3.5 text-gold-400" /> {country}</span>
                          <span className="text-gold-400 font-bold">{count} Visits</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass-premium p-6 rounded-2xl">
                    <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block mb-4">Views By Ordered Service</span>
                    <div className="space-y-3 font-mono text-xs">
                      {Object.entries(analytics.viewsByService).map(([srv, count]) => (
                        <div key={srv} className="flex justify-between items-center py-1.5 border-b border-white/5">
                          <span className="text-white">{srv}</span>
                          <span className="text-white font-bold">{count} Clicks</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Real-time visits console logs */}
                <div className="glass-premium p-6 rounded-2xl">
                  <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block mb-4">Core Telemetry Log Stream</span>
                  <div className="bg-black/80 p-4 border border-white/5 rounded-xl max-h-48 overflow-y-auto space-y-2 font-mono text-[10px] text-neutral-400">
                    {analytics.recentVisits.map((v, i) => (
                      <div key={v.id || i} className="flex justify-between">
                        <span className="text-neutral-500">[{new Date(v.time).toLocaleTimeString()}]</span>
                        <span className="text-green-500">{v.country}</span>
                        <span className="text-white">Path: {v.path}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* 2. PROJECTS MANAGEMENT */}
            {activeTab === 'projects' && (
              <div className="space-y-8 text-left">
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <h3 className="text-lg font-display font-bold uppercase tracking-wider text-white">
                    Dossier Project Manager
                  </h3>
                  {!isAddingProject && !editingProject && (
                    <button 
                      onClick={startAddProject}
                      className="px-4 py-1.5 bg-gold-500 text-black rounded-full text-[10px] font-mono uppercase tracking-wider flex items-center gap-1 cursor-pointer font-bold"
                    >
                      <Plus className="w-3.5 h-3.5" /> Inject Project
                    </button>
                  )}
                </div>

                {/* Add or Edit form */}
                {(isAddingProject || editingProject) ? (
                  <form onSubmit={handleSaveProject} className="space-y-6 font-mono text-xs text-neutral-400">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-neutral-500 uppercase">Project Title</label>
                        <input 
                          type="text" required value={pTitle} onChange={(e) => setPTitle(e.target.value)}
                          className="px-4 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-white outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-neutral-500 uppercase">Creative Category</label>
                        <select 
                          value={pCategory} onChange={(e) => setPCategory(e.target.value)}
                          className="px-4 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-white outline-none cursor-pointer"
                        >
                          <option value="Website Development">Website Development</option>
                          <option value="App Development">App Development</option>
                          <option value="Game Development">Game Development</option>
                          <option value="Video Editing">Video Editing</option>
                          <option value="Motion Graphics">Motion Graphics</option>
                          <option value="Thumbnail Design">Thumbnail Design</option>
                          <option value="Business Solutions">Business Solutions</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-neutral-500 uppercase">Project Description</label>
                      <textarea 
                        required rows={3} value={pDesc} onChange={(e) => setPDesc(e.target.value)}
                        className="px-4 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-white outline-none resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5 sm:col-span-2">
                        <label className="text-neutral-500 uppercase">Visual Image (Drag & Drop File Upload)</label>
                        <div 
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          className={`border-2 border-dashed rounded-2xl p-6 transition-all flex flex-col items-center justify-center gap-4 text-center relative overflow-hidden ${
                            isDragging 
                              ? 'border-gold-500 bg-gold-500/5 scale-[1.01]' 
                              : pImage 
                                ? 'border-white/10 bg-neutral-900/50' 
                                : 'border-white/15 bg-neutral-900 hover:border-white/30'
                          }`}
                        >
                          {uploading ? (
                            <div className="flex flex-col items-center gap-2 py-4">
                              <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
                              <span className="text-[10px] uppercase tracking-wider text-gold-400 font-mono">Uploading media assets...</span>
                            </div>
                          ) : pImage ? (
                            <div className="w-full flex flex-col sm:flex-row items-center gap-6 text-left">
                              <div className="relative w-32 h-20 rounded-xl overflow-hidden border border-white/10 flex-shrink-0">
                                <img src={pImage} className="w-full h-full object-cover" alt="Preview" referrerPolicy="no-referrer" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                  <label className="cursor-pointer px-2 py-1 bg-black/80 border border-white/20 text-white rounded-lg text-[8px] hover:bg-gold-500 hover:text-black hover:border-transparent transition-all font-mono">
                                    Replace
                                    <input type="file" onChange={handleFileSelect} accept="image/*" className="hidden" />
                                  </label>
                                </div>
                              </div>
                              <div className="flex-1 flex flex-col gap-1 w-full min-w-0">
                                <div className="flex items-center gap-1.5 text-green-500">
                                  <Check className="w-4 h-4" />
                                  <span className="text-[9px] uppercase font-bold tracking-wider font-mono">Image Loaded Successfully</span>
                                </div>
                                <p className="text-[10px] text-neutral-500 truncate font-mono max-w-full">{pImage}</p>
                                <div className="flex gap-2 mt-1">
                                  <label className="cursor-pointer px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-lg text-[9px] transition-all flex items-center gap-1 border border-white/5 font-mono">
                                    <Upload className="w-3 h-3" /> Upload Different
                                    <input type="file" onChange={handleFileSelect} accept="image/*" className="hidden" />
                                  </label>
                                  <button 
                                    type="button"
                                    onClick={() => setPImage('')}
                                    className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white font-bold rounded-lg text-[9px] border border-red-500/20 hover:border-transparent transition-all font-mono"
                                  >
                                    Reset
                                  </button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <label className="cursor-pointer w-full py-4 flex flex-col items-center justify-center gap-2">
                              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-neutral-400 bg-white/5 hover:border-gold-500/50 hover:text-gold-400 transition-all">
                                <Upload className="w-4 h-4" />
                              </div>
                              <div>
                                <span className="text-xs text-white font-bold">Drag and drop file here</span>
                                <span className="text-neutral-500 text-[10px] block mt-0.5">or browse local disk to upload</span>
                              </div>
                              <span className="text-[8px] text-neutral-600 uppercase tracking-widest font-mono">Accepts PNG, JPG, WEBP, GIF (Max 10MB)</span>
                              <input type="file" onChange={handleFileSelect} accept="image/*" className="hidden" />
                            </label>
                          )}
                          
                          {uploadError && (
                            <div className="mt-1 text-[10px] text-red-500 flex items-center gap-1 font-mono">
                              <ShieldAlert className="w-3.5 h-3.5" /> {uploadError}
                            </div>
                          )}
                        </div>
                        
                        {/* Manual image URL override field */}
                        <div className="mt-1 flex items-center gap-2 w-full">
                          <span className="text-[9px] text-neutral-500 uppercase flex-shrink-0 font-mono">Or Paste Image URL directly:</span>
                          <input 
                            type="text" required value={pImage} onChange={(e) => setPImage(e.target.value)}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full px-3 py-1.5 bg-neutral-900 border border-white/5 rounded-lg text-[10px] text-neutral-300 outline-none font-mono"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5 sm:col-span-2">
                        <label className="text-neutral-500 uppercase">Client Name</label>
                        <input 
                          type="text" value={pClient} onChange={(e) => setPClient(e.target.value)}
                          className="px-4 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-white outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-neutral-500 uppercase">Budget Bracket</label>
                        <input 
                          type="text" value={pBudget} onChange={(e) => setPBudget(e.target.value)}
                          placeholder="e.g. $4,500"
                          className="px-4 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-white outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-neutral-500 uppercase">Interactive Link</label>
                        <input 
                          type="text" value={pLink} onChange={(e) => setPLink(e.target.value)}
                          placeholder="#"
                          className="px-4 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-white outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-neutral-500 uppercase">Tags (comma separated)</label>
                        <input 
                          type="text" value={pTags} onChange={(e) => setPTags(e.target.value)}
                          placeholder="React, Next, After Effects"
                          className="px-4 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-white outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-white/5">
                      <button 
                        type="submit"
                        className="px-6 py-2.5 bg-gold-500 text-black font-bold uppercase rounded-full cursor-pointer"
                      >
                        Commit Blueprint
                      </button>
                      <button 
                        type="button" 
                        onClick={() => { setIsAddingProject(false); setEditingProject(null); }}
                        className="px-6 py-2.5 bg-white/5 border border-white/10 text-white rounded-full cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    {projects.map(p => (
                      <div key={p.id} className="flex justify-between items-center p-4 bg-black/40 border border-white/5 rounded-2xl">
                        <div className="flex items-center gap-4">
                          <img src={p.image} className="w-12 h-12 object-cover rounded-lg border border-white/10" referrerPolicy="no-referrer" />
                          <div>
                            <h4 className="text-xs font-mono font-bold text-white uppercase">{p.title}</h4>
                            <span className="text-[9px] font-mono text-gold-400 uppercase tracking-widest">{p.category}</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button 
                            onClick={() => startEditProject(p)}
                            className="p-2 border border-white/10 hover:border-gold-500 text-neutral-400 hover:text-gold-400 rounded-lg cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteProject(p.id)}
                            className="p-2 border border-white/10 hover:border-red-500 text-neutral-400 hover:text-red-500 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. REVIEWS MANAGEMENT */}
            {activeTab === 'reviews' && (
              <div className="space-y-8 text-left">
                <div className="border-b border-white/5 pb-4">
                  <h3 className="text-lg font-display font-bold uppercase tracking-wider text-white">
                    Feedback Audit Console
                  </h3>
                </div>

                <div className="space-y-4">
                  {reviews.map(r => (
                    <div key={r.id} className="p-6 bg-black/40 border border-white/5 rounded-2xl space-y-4 relative">
                      <div className="absolute top-6 right-6 flex items-center gap-2">
                        {r.approved ? (
                          <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-[8px] font-mono uppercase tracking-wider border border-green-500/20">Approved</span>
                        ) : (
                          <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 text-[8px] font-mono uppercase tracking-wider border border-amber-500/20">Awaiting approval</span>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex gap-1 text-gold-400">
                          {Array.from({ length: r.rating }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                        <p className="text-xs font-sans text-neutral-300 italic">"{r.text}"</p>
                      </div>

                      <div className="flex justify-between items-center border-t border-white/5 pt-4 font-mono text-[11px] text-neutral-500">
                        <span>— {r.name} ({r.country})</span>
                        
                        <div className="flex gap-2">
                          {!r.approved && (
                            <button 
                              onClick={() => handleApproveReview(r)}
                              className="px-3 py-1 bg-green-500 text-black text-[9px] font-bold uppercase rounded flex items-center gap-1 cursor-pointer"
                            >
                              <Check className="w-3 h-3" /> Approve
                            </button>
                          )}
                          <button 
                            onClick={() => handleToggleFeatureReview(r)}
                            className={`px-3 py-1 text-[9px] font-bold uppercase rounded flex items-center gap-1 cursor-pointer ${
                              r.featured ? 'bg-gold-500 text-black' : 'bg-white/5 text-neutral-400 border border-white/10'
                            }`}
                          >
                            <Star className="w-3 h-3" /> Pin Testimonial
                          </button>
                          <button 
                            onClick={() => handleDeleteReview(r.id)}
                            className="p-1 border border-white/10 hover:border-red-500 text-neutral-400 hover:text-red-500 rounded cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. CONTACT LEADS EXPORT */}
            {activeTab === 'messages' && (
              <div className="space-y-8 text-left">
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <h3 className="text-lg font-display font-bold uppercase tracking-wider text-white">
                    Encrypted Message Vault
                  </h3>
                  <button 
                    onClick={handleExportMessages}
                    className="px-4 py-1.5 bg-white/5 hover:bg-gold-500/10 border border-white/10 hover:border-gold-500/20 text-gold-400 hover:text-white rounded-full text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Download className="w-3.5 h-3.5" /> Export leads (JSON)
                  </button>
                </div>

                <div className="space-y-4">
                  {messages.map(m => (
                    <div key={m.id} className="p-6 bg-black/40 border border-white/5 rounded-2xl space-y-4 relative">
                      <div className="flex justify-between items-start border-b border-white/5 pb-4 font-mono text-[11px]">
                        <div>
                          <h4 className="text-xs font-bold text-white uppercase">{m.name}</h4>
                          <span className="text-[10px] text-neutral-500 block mt-0.5">{m.email} • {m.country}</span>
                        </div>
                        <span className="text-gold-400">{new Date(m.date).toLocaleDateString()}</span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex gap-8 text-[10px] font-mono">
                          <span>REQUIRED: <strong className="text-white">{m.service}</strong></span>
                          <span>BUDGET: <strong className="text-gold-400">{m.budget}</strong></span>
                        </div>
                        <p className="text-xs font-sans text-neutral-300 leading-relaxed bg-[#050505] p-3 rounded border border-white/5">
                          {m.message}
                        </p>
                      </div>
                    </div>
                  ))}

                  {messages.length === 0 && (
                    <div className="text-center py-12 text-neutral-500 font-mono text-xs">
                      No customer leads have been dispatched to the vault yet.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 5. SETTINGS CONTROL */}
            {activeTab === 'settings' && (
              <form onSubmit={handleSaveSettings} className="space-y-8 text-left">
                <div className="border-b border-white/5 pb-4">
                  <h3 className="text-lg font-display font-bold uppercase tracking-wider text-white">
                    Administrative Parameters
                  </h3>
                </div>

                <div className="space-y-6 font-mono text-xs text-neutral-400">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-neutral-500 uppercase">Bio / About Me</label>
                    <textarea 
                      rows={6} required value={aboutMeText} onChange={(e) => setAboutMeText(e.target.value)}
                      className="px-4 py-3 bg-neutral-900 border border-white/10 rounded-xl text-white outline-none resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-neutral-500 uppercase">WhatsApp Link / Number</label>
                      <input 
                        type="text" required value={whatsappVal} onChange={(e) => setWhatsappVal(e.target.value)}
                        className="px-4 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-white outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-neutral-500 uppercase">Telegram Link</label>
                      <input 
                        type="text" required value={telegramVal} onChange={(e) => setTelegramVal(e.target.value)}
                        className="px-4 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-white outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-neutral-500 uppercase">Mobile Number</label>
                      <input 
                        type="text" required value={phoneVal} onChange={(e) => setPhoneVal(e.target.value)}
                        className="px-4 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-white outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-8 py-3 bg-gold-500 hover:bg-gold-400 text-black text-xs font-display font-extrabold uppercase tracking-widest rounded-full shadow-[0_0_20px_rgba(212,163,23,0.3)] cursor-pointer"
                  >
                    Commit Settings
                  </button>
                </div>
              </form>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
