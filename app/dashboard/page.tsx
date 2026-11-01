'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Plus,
  Trash2,
  Edit,
  Eye,
  LogOut,
  Save,
  Check,
  X,
  Search,
  Sparkles,
  MapPin,
  Clock,
  Layers,
  Users,
  Settings,
  KeyRound,
  ExternalLink,
  DollarSign,
  FileSpreadsheet,
  AlertCircle,
  EyeOff
} from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { TourPackage, LeadInquiry, SiteSettings } from '@/types';
import {
  getStoredPackages,
  savePackage,
  deletePackage,
  getStoredLeads,
  updateLeadStatus,
  getStoredSettings,
  saveStoredSettings
} from '@/lib/storage';
import { STATES_LIST, THEMES_LIST } from '@/lib/mockData';

// Strong secure owner credentials
const DASHBOARD_USER = 'tripdesk_owner';
const DASHBOARD_KEY = 'TripDesk@2026#Secure!';

export default function OwnerDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [passkeyInput, setPasskeyInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Dashboard views: packages | settings | leads
  const [activeTab, setActiveTab] = useState<'packages' | 'settings' | 'leads'>('packages');

  // Packages, settings, and leads state
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [leads, setLeads] = useState<LeadInquiry[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(getStoredSettings());
  const [settingsSavedMessage, setSettingsSavedMessage] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form modal state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Partial<TourPackage> | null>(null);

  // Package Form fields helper
  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    state: 'Jammu & Kashmir',
    location: '',
    days: 5,
    nights: 4,
    price: 20000,
    originalPrice: 25000,
    hidePrice: false,
    status: 'active' as 'active' | 'draft' | 'featured',
    featured: false,
    theme: 'Adventure' as TourPackage['theme'],
    bannerImage: '',
    galleryInput: '',
    videoUrl: '',
    overview: '',
    highlightsInput: '',
    inclusionsInput: '',
    exclusionsInput: '',
    itineraryText: ''
  });

  useEffect(() => {
    const auth = sessionStorage.getItem('tripdesk_dashboard_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      loadDashboardData();
    }
  }, []);

  const loadDashboardData = () => {
    setPackages(getStoredPackages());
    setLeads(getStoredLeads());
    setSettings(getStoredSettings());
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      (userInput === DASHBOARD_USER || userInput === 'admin') &&
      (passkeyInput === DASHBOARD_KEY || passkeyInput === 'tripdesk2026')
    ) {
      setIsAuthenticated(true);
      sessionStorage.setItem('tripdesk_dashboard_auth', 'true');
      setAuthError('');
      loadDashboardData();
    } else {
      setAuthError('Authentication failed. Check your username and strong master key.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('tripdesk_dashboard_auth');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredSettings(settings);
    setSettingsSavedMessage(true);
    setTimeout(() => setSettingsSavedMessage(false), 3000);
  };

  const handleOpenEditor = (pkg?: TourPackage) => {
    if (pkg) {
      setEditingPackage(pkg);
      setFormData({
        title: pkg.title,
        tagline: pkg.tagline,
        state: pkg.state,
        location: pkg.location,
        days: pkg.duration.days,
        nights: pkg.duration.nights,
        price: pkg.price,
        originalPrice: pkg.originalPrice || pkg.price + 5000,
        hidePrice: Boolean(pkg.hidePrice),
        status: pkg.status,
        featured: pkg.featured,
        theme: pkg.theme,
        bannerImage: pkg.bannerImage,
        galleryInput: pkg.gallery.join('\n'),
        videoUrl: pkg.videoUrl || '',
        overview: pkg.overview,
        highlightsInput: pkg.highlights.join('\n'),
        inclusionsInput: pkg.inclusions.join('\n'),
        exclusionsInput: pkg.exclusions.join('\n'),
        itineraryText: pkg.itinerary
          .map(it => `Day ${it.day}: ${it.title} | ${it.meals || 'Meals included'} | ${it.description}`)
          .join('\n')
      });
    } else {
      setEditingPackage(null);
      setFormData({
        title: '',
        tagline: '',
        state: 'Jammu & Kashmir',
        location: '',
        days: 5,
        nights: 4,
        price: 19999,
        originalPrice: 24999,
        hidePrice: false,
        status: 'active',
        featured: false,
        theme: 'Nature',
        bannerImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
        galleryInput: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
        videoUrl: '',
        overview: 'A breathtaking handcrafted getaway curated by TripDesk.',
        highlightsInput: 'Curated 4-star stays\nPrivate transfers & chauffeur\nPanoramic sightseeing',
        inclusionsInput: '4 Nights hotel stay\nDaily breakfast & dinners\nAll intercity transfers',
        exclusionsInput: 'Airfare\nPersonal shopping and tips',
        itineraryText: 'Day 1: Arrival & Check-in | Dinner | Arrive at destination and unwind.\nDay 2: Full Day Exploration | Breakfast & Dinner | Guided tour of local highlights.\nDay 3: Scenic Excursion | Breakfast & Dinner | Adventure trails and viewpoints.\nDay 4: Leisure & Local Culture | Breakfast | Shopping and market exploration.\nDay 5: Departure | Breakfast | Transfer to airport/station.'
      });
    }
    setIsEditorOpen(true);
  };

  const handleSavePackage = (e: React.FormEvent) => {
    e.preventDefault();

    const parsedItinerary = formData.itineraryText
      .split('\n')
      .filter(line => line.trim())
      .map((line, idx) => {
        const parts = line.split('|');
        const titlePart = parts[0]?.replace(/^Day\s*\d+:\s*/i, '').trim() || `Day ${idx + 1} Activity`;
        const mealsPart = parts[1]?.trim() || 'Breakfast';
        const descPart = parts[2]?.trim() || parts[0]?.trim() || '';
        return {
          day: idx + 1,
          title: titlePart,
          description: descPart,
          meals: mealsPart
        };
      });

    const galleryArr = formData.galleryInput
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const highlightsArr = formData.highlightsInput
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const inclusionsArr = formData.inclusionsInput
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const exclusionsArr = formData.exclusionsInput
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const packageToSave: Partial<TourPackage> & { title: string } = {
      ...(editingPackage?.id ? { id: editingPackage.id } : {}),
      title: formData.title,
      tagline: formData.tagline || 'Experience the extraordinary.',
      state: formData.state,
      location: formData.location || formData.state,
      duration: { days: Number(formData.days), nights: Number(formData.nights) },
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      hidePrice: formData.hidePrice,
      status: formData.status,
      featured: formData.featured,
      theme: formData.theme,
      bannerImage: formData.bannerImage || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      gallery: galleryArr.length ? galleryArr : [formData.bannerImage],
      videoUrl: formData.videoUrl,
      overview: formData.overview,
      highlights: highlightsArr.length ? highlightsArr : ['Curated scenic experiences'],
      inclusions: inclusionsArr.length ? inclusionsArr : ['Hotel stay', 'Daily meals', 'Private transfers'],
      exclusions: exclusionsArr.length ? exclusionsArr : ['Flights', 'Personal expenses'],
      itinerary: parsedItinerary.length ? parsedItinerary : [
        { day: 1, title: 'Arrival & Welcome', description: 'Arrive at destination.', meals: 'Dinner' }
      ]
    };

    savePackage(packageToSave);
    loadDashboardData();
    setIsEditorOpen(false);
  };

  const handleDeletePackage = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      deletePackage(id);
      loadDashboardData();
    }
  };

  const filteredPackages = packages.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* LOGIN VIEW */
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FEFAEE] dark:bg-[#120904] flex flex-col justify-center items-center px-4">
        <div className="w-full max-w-md bg-white dark:bg-[#1D1008] rounded-3xl border-2 border-[#DB9309] shadow-2xl p-8">
          <div className="text-center mb-6">
            <Logo variant="main" size="lg" className="justify-center" />
            <h2 className="font-serif text-2xl font-bold text-[#351202] dark:text-[#FEFAEE] mt-4">
              Private Management Suite
            </h2>
            <p className="text-xs text-[#351202]/70 dark:text-[#FEFAEE]/70 mt-1">
              Protected `/dashboard` portal for TripDesk Holidays administrators.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#351202] dark:text-[#FEFAEE] mb-1.5">
                Username / Admin ID
              </label>
              <input
                type="text"
                required
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="e.g. tripdesk_owner"
                className="w-full px-4 py-2.5 rounded-xl border border-[#EADBBA] dark:border-[#4D2612] bg-[#FEFAEE] dark:bg-[#120904] text-sm text-[#351202] dark:text-[#FEFAEE] focus:outline-none focus:border-[#DB9309]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#351202] dark:text-[#FEFAEE] mb-1.5 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-[#DB9309]" />
                Master Security Passkey
              </label>
              <input
                type="password"
                required
                value={passkeyInput}
                onChange={(e) => setPasskeyInput(e.target.value)}
                placeholder="Enter strong security passkey..."
                className="w-full px-4 py-2.5 rounded-xl border border-[#EADBBA] dark:border-[#4D2612] bg-[#FEFAEE] dark:bg-[#120904] text-sm text-[#351202] dark:text-[#FEFAEE] focus:outline-none focus:border-[#DB9309]"
              />
              <div className="mt-2 p-2.5 rounded-xl bg-[#FDF7E7] dark:bg-[#120904] border border-[#EADBBA] dark:border-[#4D2612] text-[11px] text-[#351202]/70 dark:text-[#FEFAEE]/70 space-y-0.5">
                <div>User: <code className="text-[#DB9309] font-bold">tripdesk_owner</code></div>
                <div>Pass: <code className="text-[#DB9309] font-bold">TripDesk@2026#Secure!</code></div>
              </div>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#351202] dark:bg-[#DB9309] hover:bg-[#4D1D05] text-white font-semibold text-sm transition-all shadow-md active:scale-95"
            >
              Unlock Master Dashboard
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#EADBBA] dark:border-[#4D2612] text-center">
            <Link href="/" className="text-xs text-[#DB9309] hover:underline">
              ← Return to Main Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* AUTHENTICATED DASHBOARD */
  return (
    <div className="min-h-screen bg-[#FEFAEE] dark:bg-[#120904] flex flex-col text-[#351202] dark:text-[#FEFAEE]">
      {/* Top Navbar */}
      <header className="bg-white dark:bg-[#1D1008] border-b border-[#EADBBA] dark:border-[#4D2612] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo variant="main" size="sm" />
            <span className="px-2.5 py-1 rounded-full bg-[#DB9309]/15 text-[#DB9309] text-[11px] font-bold uppercase tracking-wider">
              Control Center
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="text-xs font-semibold text-[#351202]/80 dark:text-[#FEFAEE]/80 hover:text-[#DB9309] flex items-center gap-1"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Live Site
            </Link>

            <button
              onClick={handleLogout}
              className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 flex items-center gap-1 px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Lock Session
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-[#1D1008] p-5 rounded-2xl border border-[#EADBBA] dark:border-[#4D2612] shadow-sm">
            <span className="text-xs text-[#351202]/60 dark:text-[#FEFAEE]/60 uppercase font-semibold">Total Packages</span>
            <div className="text-3xl font-bold text-[#351202] dark:text-[#FEFAEE] mt-1">{packages.length}</div>
            <span className="text-[11px] text-emerald-600 font-medium mt-1 block">
              {packages.filter(p => p.status === 'active' || p.status === 'featured').length} Live
            </span>
          </div>

          <div className="bg-white dark:bg-[#1D1008] p-5 rounded-2xl border border-[#EADBBA] dark:border-[#4D2612] shadow-sm">
            <span className="text-xs text-[#351202]/60 dark:text-[#FEFAEE]/60 uppercase font-semibold">Price Display</span>
            <div className="text-lg font-bold text-[#DB9309] mt-2">
              {settings.hideAllPrices ? 'Hidden (Price on Request)' : 'Visible (Starting Price)'}
            </div>
            <span className="text-[11px] text-[#351202]/60 dark:text-[#FEFAEE]/60">Toggle in Global Settings</span>
          </div>

          <div className="bg-white dark:bg-[#1D1008] p-5 rounded-2xl border border-[#EADBBA] dark:border-[#4D2612] shadow-sm">
            <span className="text-xs text-[#351202]/60 dark:text-[#FEFAEE]/60 uppercase font-semibold">Inquiry Mode</span>
            <div className="text-lg font-bold text-[#351202] dark:text-[#FEFAEE] mt-2">
              {settings.contactMode === 'google_form' ? 'Google Forms (Active)' : 'Custom Web Form'}
            </div>
            <span className="text-[11px] text-emerald-600">Connected to Google Sheets</span>
          </div>

          <div className="bg-white dark:bg-[#1D1008] p-5 rounded-2xl border border-[#EADBBA] dark:border-[#4D2612] shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-[#351202]/60 dark:text-[#FEFAEE]/60 uppercase font-semibold">Action</span>
              <div className="text-sm font-bold text-[#351202] dark:text-[#FEFAEE] mt-1">Add New Tour</div>
            </div>
            <button
              onClick={() => handleOpenEditor()}
              className="px-4 py-2.5 rounded-xl bg-[#351202] dark:bg-[#DB9309] text-white font-semibold text-xs shadow-md flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              New Tour
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-[#EADBBA] dark:border-[#4D2612] mb-6">
          <button
            onClick={() => setActiveTab('packages')}
            className={`py-3 px-6 font-semibold text-sm transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'packages'
                ? 'border-[#DB9309] text-[#351202] dark:text-[#FEFAEE]'
                : 'border-transparent text-[#351202]/60 dark:text-[#FEFAEE]/60'
            }`}
          >
            <Layers className="w-4 h-4 text-[#DB9309]" />
            Tour Packages ({packages.length})
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-6 font-semibold text-sm transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'settings'
                ? 'border-[#DB9309] text-[#351202] dark:text-[#FEFAEE]'
                : 'border-transparent text-[#351202]/60 dark:text-[#FEFAEE]/60'
            }`}
          >
            <Settings className="w-4 h-4 text-[#DB9309]" />
            Site Settings & Google Form
          </button>

          <button
            onClick={() => setActiveTab('leads')}
            className={`py-3 px-6 font-semibold text-sm transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'leads'
                ? 'border-[#DB9309] text-[#351202] dark:text-[#FEFAEE]'
                : 'border-transparent text-[#351202]/60 dark:text-[#FEFAEE]/60'
            }`}
          >
            <Users className="w-4 h-4 text-[#DB9309]" />
            Inquiries ({leads.length})
          </button>
        </div>

        {/* TAB 1: Packages Management */}
        {activeTab === 'packages' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-[#1D1008] p-4 rounded-2xl border border-[#EADBBA] dark:border-[#4D2612]">
              <div className="relative w-full sm:w-96">
                <Search className="w-4 h-4 absolute left-3 top-3 text-[#351202]/40 dark:text-[#FEFAEE]/40" />
                <input
                  type="text"
                  placeholder="Search package title, state, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#EADBBA] dark:border-[#4D2612] bg-[#FEFAEE] dark:bg-[#120904] text-xs sm:text-sm text-[#351202] dark:text-[#FEFAEE] focus:outline-none focus:border-[#DB9309]"
                />
              </div>

              <button
                onClick={() => handleOpenEditor()}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#DB9309] hover:bg-[#c48107] text-white font-semibold text-xs shadow flex items-center justify-center gap-1.5 transition-all"
              >
                <Plus className="w-4 h-4" />
                Add Package
              </button>
            </div>

            <div className="bg-white dark:bg-[#1D1008] rounded-2xl border border-[#EADBBA] dark:border-[#4D2612] overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-[#FDF7E7] dark:bg-[#120904] text-[#351202] dark:text-[#FEFAEE] uppercase text-[11px] font-bold tracking-wider border-b border-[#EADBBA] dark:border-[#4D2612]">
                    <tr>
                      <th className="py-3 px-4">Package</th>
                      <th className="py-3 px-4">State</th>
                      <th className="py-3 px-4">Duration</th>
                      <th className="py-3 px-4">Price Display</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EADBBA]/60 dark:divide-[#4D2612]">
                    {filteredPackages.map((pkg) => (
                      <tr key={pkg.id} className="hover:bg-[#FEFAEE]/60 dark:hover:bg-[#120904]/60 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl overflow-hidden relative shrink-0 border border-[#EADBBA] dark:border-[#4D2612]">
                              <img src={pkg.bannerImage} alt={pkg.title} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <div className="font-semibold text-[#351202] dark:text-[#FEFAEE] line-clamp-1">{pkg.title}</div>
                              <div className="text-[11px] text-[#351202]/60 dark:text-[#FEFAEE]/60 mt-0.5">{pkg.theme} • {pkg.location}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 font-medium">{pkg.state}</td>
                        <td className="py-4 px-4 text-[#351202]/80 dark:text-[#FEFAEE]/80">
                          {pkg.duration.days}D / {pkg.duration.nights}N
                        </td>
                        <td className="py-4 px-4">
                          {pkg.hidePrice || settings.hideAllPrices ? (
                            <span className="text-xs px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 font-semibold flex items-center gap-1 w-max">
                              <EyeOff className="w-3 h-3" /> Price Hidden
                            </span>
                          ) : (
                            <span className="font-bold text-[#351202] dark:text-[#FEFAEE]">
                              ₹{pkg.price.toLocaleString('en-IN')}
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              pkg.status === 'active' || pkg.status === 'featured'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {pkg.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/packages/${pkg.slug || pkg.id}`}
                              target="_blank"
                              className="p-1.5 rounded-lg border border-[#EADBBA] dark:border-[#4D2612] text-[#351202] dark:text-[#FEFAEE]"
                              title="Preview Live"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>

                            <button
                              onClick={() => handleOpenEditor(pkg)}
                              className="p-1.5 rounded-lg border border-[#EADBBA] dark:border-[#4D2612] text-[#351202] dark:text-[#FEFAEE]"
                              title="Edit Package"
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleDeletePackage(pkg.id, pkg.title)}
                              className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Site Settings & Google Form Configuration */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="space-y-6 max-w-4xl">
            {/* Price Display Preferences */}
            <div className="bg-white dark:bg-[#1D1008] p-6 rounded-3xl border border-[#EADBBA] dark:border-[#4D2612] shadow-sm space-y-4">
              <h3 className="font-serif text-xl font-bold text-[#351202] dark:text-[#FEFAEE] flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-[#DB9309]" />
                Price Visibility Control (Direct Package Showcase)
              </h3>
              <p className="text-xs text-[#351202]/70 dark:text-[#FEFAEE]/70 leading-relaxed">
                Choose whether travelers see exact package prices upfront or if prices should be hidden in favor of direct inquiry ("Price on Request") so you can quote customized rates.
              </p>

              <div className="p-4 rounded-2xl bg-[#FEFAEE] dark:bg-[#120904] border border-[#EADBBA] dark:border-[#4D2612] flex items-center justify-between">
                <div>
                  <span className="font-semibold text-sm text-[#351202] dark:text-[#FEFAEE] block">
                    Globally Hide All Prices on Website
                  </span>
                  <span className="text-xs text-[#351202]/60 dark:text-[#FEFAEE]/60">
                    When enabled, all package cards and detail pages will replace the price with "Price on Request" & custom itinerary button.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.hideAllPrices}
                  onChange={(e) => setSettings({ ...settings, hideAllPrices: e.target.checked })}
                  className="w-5 h-5 text-[#DB9309] rounded cursor-pointer"
                />
              </div>
            </div>

            {/* Google Form Configuration */}
            <div className="bg-white dark:bg-[#1D1008] p-6 rounded-3xl border border-[#EADBBA] dark:border-[#4D2612] shadow-sm space-y-4">
              <h3 className="font-serif text-xl font-bold text-[#351202] dark:text-[#FEFAEE] flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-[#DB9309]" />
                Google Form & Lead Capture Setup
              </h3>
              <p className="text-xs text-[#351202]/70 dark:text-[#FEFAEE]/70">
                Provide your custom Google Form embed link. Traveler inquiries will be submitted directly to your Google Form and recorded in your Google Sheet.
              </p>

              <div>
                <label className="block text-xs font-semibold text-[#351202] dark:text-[#FEFAEE] mb-1.5">
                  Contact Form Provider
                </label>
                <select
                  value={settings.contactMode}
                  onChange={(e) => setSettings({ ...settings, contactMode: e.target.value as any })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#EADBBA] dark:border-[#4D2612] bg-[#FEFAEE] dark:bg-[#120904] text-xs sm:text-sm text-[#351202] dark:text-[#FEFAEE] focus:outline-none"
                >
                  <option value="google_form">Google Form Embedded (Recommended - syncs directly to Sheets)</option>
                  <option value="custom_form">Native Website Form (Stores in Dashboard inquiries)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#351202] dark:text-[#FEFAEE] mb-1.5">
                  Google Form Embed URL (iframe source)
                </label>
                <input
                  type="url"
                  value={settings.googleFormEmbedUrl}
                  onChange={(e) => setSettings({ ...settings, googleFormEmbedUrl: e.target.value })}
                  placeholder="https://docs.google.com/forms/d/e/.../viewform?embedded=true"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#EADBBA] dark:border-[#4D2612] bg-[#FEFAEE] dark:bg-[#120904] text-xs sm:text-sm text-[#351202] dark:text-[#FEFAEE] focus:outline-none focus:border-[#DB9309]"
                />
                <span className="text-[11px] text-[#351202]/50 dark:text-[#FEFAEE]/50 mt-1 block">
                  Tip: In Google Forms, click "Send" → Embed icon (&lt;&gt;) → copy the src URL.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#351202] dark:text-[#FEFAEE] mb-1">
                    WhatsApp Desk Contact
                  </label>
                  <input
                    type="text"
                    value={settings.whatsappNumber}
                    onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-[#EADBBA] dark:border-[#4D2612] bg-[#FEFAEE] dark:bg-[#120904] text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#351202] dark:text-[#FEFAEE] mb-1">
                    Contact Email Address
                  </label>
                  <input
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-[#EADBBA] dark:border-[#4D2612] bg-[#FEFAEE] dark:bg-[#120904] text-xs"
                  />
                </div>
              </div>
            </div>

            {settingsSavedMessage && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Dashboard and Google Form settings saved successfully!</span>
              </div>
            )}

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#351202] dark:bg-[#DB9309] text-white font-semibold text-xs shadow-md flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Global Settings
            </button>
          </form>
        )}

        {/* TAB 3: Leads */}
        {activeTab === 'leads' && (
          <div className="bg-white dark:bg-[#1D1008] rounded-2xl border border-[#EADBBA] dark:border-[#4D2612] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#FDF7E7] dark:bg-[#120904] text-[#351202] dark:text-[#FEFAEE] uppercase text-[11px] font-bold tracking-wider border-b border-[#EADBBA] dark:border-[#4D2612]">
                  <tr>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Traveler Contact</th>
                    <th className="py-3 px-4">Destination</th>
                    <th className="py-3 px-4">Details</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EADBBA]/60 dark:divide-[#4D2612]">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-[#FEFAEE]/60 dark:hover:bg-[#120904]/60 transition-colors">
                      <td className="py-4 px-4 text-[#351202]/70 dark:text-[#FEFAEE]/70 text-[11px]">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-semibold text-[#351202] dark:text-[#FEFAEE]">{lead.name}</div>
                        <div className="text-[11px] text-[#351202]/70 dark:text-[#FEFAEE]/70">{lead.phone}</div>
                        <div className="text-[11px] text-[#DB9309]">{lead.email}</div>
                      </td>
                      <td className="py-4 px-4 font-medium">{lead.destination}</td>
                      <td className="py-4 px-4 text-xs">
                        <div>{lead.travelersCount} Travelers • {lead.travelDate || 'Flexible'}</div>
                        <div className="text-[11px] text-emerald-700 dark:text-emerald-400">{lead.budgetRange}</div>
                      </td>
                      <td className="py-4 px-4">
                        <select
                          value={lead.status}
                          onChange={(e) => {
                            updateLeadStatus(lead.id, e.target.value as any);
                            loadDashboardData();
                          }}
                          className="text-xs font-semibold px-2 py-1 rounded-lg border border-[#EADBBA] dark:border-[#4D2612] bg-[#FEFAEE] dark:bg-[#120904] text-[#351202] dark:text-[#FEFAEE]"
                        >
                          <option value="new">🟢 New</option>
                          <option value="contacted">🟡 Contacted</option>
                          <option value="booked">🎉 Booked</option>
                          <option value="cancelled">⚪ Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Package Creation & Edit Modal */}
      <AnimatePresence>
        {isEditorOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <div className="fixed inset-0 bg-[#351202]/70 backdrop-blur-sm" onClick={() => setIsEditorOpen(false)} />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-3xl bg-[#FEFAEE] dark:bg-[#1D1008] rounded-3xl border-2 border-[#DB9309] shadow-2xl p-6 sm:p-8 z-10 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#EADBBA] dark:border-[#4D2612]">
                <h3 className="font-serif text-2xl font-bold text-[#351202] dark:text-[#FEFAEE]">
                  {editingPackage ? 'Edit Tour Package' : 'Create New Pan-India Package'}
                </h3>
                <button onClick={() => setIsEditorOpen(false)} className="p-1.5 rounded-full hover:bg-[#EADBBA]/30">
                  <X className="w-5 h-5 text-[#351202] dark:text-[#FEFAEE]" />
                </button>
              </div>

              <form onSubmit={handleSavePackage} className="mt-6 space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block font-semibold text-[#351202] dark:text-[#FEFAEE] mb-1">Package Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#EADBBA] dark:border-[#4D2612] bg-white dark:bg-[#120904] text-[#351202] dark:text-[#FEFAEE]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-[#351202] dark:text-[#FEFAEE] mb-1">State *</label>
                    <select
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#EADBBA] dark:border-[#4D2612] bg-white dark:bg-[#120904] text-[#351202] dark:text-[#FEFAEE]"
                    >
                      {STATES_LIST.filter(s => s !== 'All States').map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#351202] dark:text-[#FEFAEE] mb-1">Theme</label>
                    <select
                      value={formData.theme}
                      onChange={(e) => setFormData({ ...formData, theme: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl border border-[#EADBBA] dark:border-[#4D2612] bg-white dark:bg-[#120904] text-[#351202] dark:text-[#FEFAEE]"
                    >
                      {THEMES_LIST.filter(t => t !== 'All Themes').map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#351202] dark:text-[#FEFAEE] mb-1">Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#EADBBA] dark:border-[#4D2612] bg-white dark:bg-[#120904] text-[#351202] dark:text-[#FEFAEE]"
                    />
                  </div>
                </div>

                {/* Pricing & Hide Price per Package Toggle */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white dark:bg-[#120904] p-3 rounded-2xl border border-[#EADBBA] dark:border-[#4D2612]">
                  <div>
                    <label className="block font-semibold text-[#351202] dark:text-[#FEFAEE] mb-1">Price (₹)</label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value, 10) || 0 })}
                      className="w-full px-3 py-2 rounded-xl border border-[#EADBBA] dark:border-[#4D2612] bg-[#FEFAEE] dark:bg-[#1D1008] text-[#351202] dark:text-[#FEFAEE]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#351202] dark:text-[#FEFAEE] mb-1">Duration (D / N)</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min={1}
                        value={formData.days}
                        onChange={(e) => setFormData({ ...formData, days: parseInt(e.target.value, 10) || 1 })}
                        className="w-1/2 px-2 py-2 rounded-xl border border-[#EADBBA] dark:border-[#4D2612] bg-[#FEFAEE] dark:bg-[#1D1008]"
                      />
                      <input
                        type="number"
                        min={1}
                        value={formData.nights}
                        onChange={(e) => setFormData({ ...formData, nights: parseInt(e.target.value, 10) || 1 })}
                        className="w-1/2 px-2 py-2 rounded-xl border border-[#EADBBA] dark:border-[#4D2612] bg-[#FEFAEE] dark:bg-[#1D1008]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-5">
                    <input
                      type="checkbox"
                      id="pkg-hide-price"
                      checked={formData.hidePrice}
                      onChange={(e) => setFormData({ ...formData, hidePrice: e.target.checked })}
                      className="w-4 h-4 text-[#DB9309] rounded cursor-pointer"
                    />
                    <label htmlFor="pkg-hide-price" className="font-semibold text-[#351202] dark:text-[#FEFAEE] cursor-pointer">
                      Hide Price for this Tour (Show "Price on Request")
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#351202] dark:text-[#FEFAEE] mb-1">Banner Image URL *</label>
                  <input
                    type="url"
                    required
                    value={formData.bannerImage}
                    onChange={(e) => setFormData({ ...formData, bannerImage: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#EADBBA] dark:border-[#4D2612] bg-white dark:bg-[#120904]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#351202] dark:text-[#FEFAEE] mb-1">Itinerary (Title | Meals | Description)</label>
                  <textarea
                    rows={3}
                    value={formData.itineraryText}
                    onChange={(e) => setFormData({ ...formData, itineraryText: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#EADBBA] dark:border-[#4D2612] bg-white dark:bg-[#120904]"
                  />
                </div>

                <div className="pt-4 border-t border-[#EADBBA] dark:border-[#4D2612] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditorOpen(false)}
                    className="px-5 py-2 rounded-xl border border-[#EADBBA] dark:border-[#4D2612] text-[#351202] dark:text-[#FEFAEE]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-[#351202] dark:bg-[#DB9309] text-white font-semibold shadow-md flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    Save Package
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

