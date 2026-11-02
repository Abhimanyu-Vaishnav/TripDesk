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
  EyeOff,
  Download,
  Bell,
  PhoneCall,
  Image as ImageIcon,
  Video,
  ListPlus,
  Compass
} from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { TourPackage, LeadInquiry, SiteSettings, ItineraryDay } from '@/types';
import {
  getStoredPackages,
  savePackage,
  deletePackage,
  getStoredLeads,
  updateLeadStatus,
  deleteLead,
  getStoredSettings,
  saveStoredSettings,
  DEFAULT_SETTINGS,
  fetchCloudPackages,
  fetchCloudSettings,
  fetchCloudLeads
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
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [settingsSavedMessage, setSettingsSavedMessage] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [leadsFilter, setLeadsFilter] = useState<'all' | 'talk_to_specialist' | 'package_booking'>('all');

  // Form modal state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Partial<TourPackage> | null>(null);

  // Tab inside package editor: basic | media | inclusions | itinerary
  const [editorSection, setEditorSection] = useState<'basic' | 'media' | 'inclusions' | 'itinerary'>('basic');

  // Package Form full state
  const [formTitle, setFormTitle] = useState('');
  const [formTagline, setFormTagline] = useState('');
  const [formState, setFormState] = useState('Jammu & Kashmir');
  const [formLocation, setFormLocation] = useState('');
  const [formDays, setFormDays] = useState(5);
  const [formNights, setFormNights] = useState(4);
  const [formPrice, setFormPrice] = useState(20000);
  const [formOriginalPrice, setFormOriginalPrice] = useState<number | ''>(25000);
  const [formHidePrice, setFormHidePrice] = useState(false);
  const [formFeatured, setFormFeatured] = useState(false);
  const [formStatus, setFormStatus] = useState<'active' | 'draft' | 'featured'>('active');
  const [formTheme, setFormTheme] = useState<TourPackage['theme']>('Adventure');
  const [formGroupSize, setFormGroupSize] = useState('2 to 12 Persons');
  const [formBestTimeToVisit, setFormBestTimeToVisit] = useState('March to October');
  const [formOverview, setFormOverview] = useState('');

  // Media
  const [formBannerImage, setFormBannerImage] = useState('');
  const [formGalleryImages, setFormGalleryImages] = useState<string[]>(['']);
  const [formVideoUrl, setFormVideoUrl] = useState('');

  // Lists
  const [formHighlights, setFormHighlights] = useState<string[]>(['']);
  const [formInclusions, setFormInclusions] = useState<string[]>(['']);
  const [formExclusions, setFormExclusions] = useState<string[]>(['']);

  // Day-wise Itinerary Items
  const [formItinerary, setFormItinerary] = useState<ItineraryDay[]>([
    { day: 1, title: 'Arrival & Welcome', description: 'Arrive at destination and transfer to hotel.', meals: 'Dinner' }
  ]);

  useEffect(() => {
    const auth = sessionStorage.getItem('tripdesk_dashboard_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      loadDashboardData();
    }
  }, []);

  // Poll for new leads every 8 seconds when on dashboard
  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(() => {
      fetchCloudLeads().then(cloudLeads => {
        if (cloudLeads) setLeads(cloudLeads);
      });
    }, 8000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const loadDashboardData = () => {
    setPackages(getStoredPackages());
    setLeads(getStoredLeads());
    setSettings(getStoredSettings());

    // Sync latest from database
    fetchCloudPackages().then(cloudPkgs => {
      if (cloudPkgs && cloudPkgs.length > 0) setPackages(cloudPkgs);
    });
    fetchCloudLeads().then(cloudLeads => {
      if (cloudLeads) setLeads(cloudLeads);
    });
    fetchCloudSettings().then(cloudSettings => {
      if (cloudSettings) setSettings(cloudSettings);
    });
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

  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsErrorMessage, setSettingsErrorMessage] = useState('');

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    setSettingsErrorMessage('');
    try {
      // 1. Direct save to storage & supabase
      await saveStoredSettings(settings);

      // 2. Also call test-save directly to guarantee Supabase update
      const res = await fetch('/api/test-save-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      const resJson = await res.json();
      if (!resJson.success) {
        setSettingsErrorMessage(resJson.updateError || 'Failed to update database');
      } else {
        setSettingsSavedMessage(true);
        setTimeout(() => setSettingsSavedMessage(false), 4000);
      }
    } catch (err: unknown) {
      setSettingsErrorMessage(String(err));
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleOpenEditor = (pkg?: TourPackage) => {
    setEditorSection('basic');
    if (pkg) {
      setEditingPackage(pkg);
      setFormTitle(pkg.title);
      setFormTagline(pkg.tagline || '');
      setFormState(pkg.state);
      setFormLocation(pkg.location);
      setFormDays(pkg.duration.days);
      setFormNights(pkg.duration.nights);
      setFormPrice(pkg.price);
      setFormOriginalPrice(pkg.originalPrice || '');
      setFormHidePrice(Boolean(pkg.hidePrice));
      setFormFeatured(Boolean(pkg.featured));
      setFormStatus(pkg.status);
      setFormTheme(pkg.theme);
      setFormGroupSize(pkg.groupSize || 'Customizable');
      setFormBestTimeToVisit(pkg.bestTimeToVisit || 'Year-round');
      setFormOverview(pkg.overview || '');
      setFormBannerImage(pkg.bannerImage);
      setFormGalleryImages(pkg.gallery && pkg.gallery.length ? [...pkg.gallery] : ['']);
      setFormVideoUrl(pkg.videoUrl || '');
      setFormHighlights(pkg.highlights && pkg.highlights.length ? [...pkg.highlights] : ['']);
      setFormInclusions(pkg.inclusions && pkg.inclusions.length ? [...pkg.inclusions] : ['']);
      setFormExclusions(pkg.exclusions && pkg.exclusions.length ? [...pkg.exclusions] : ['']);
      setFormItinerary(pkg.itinerary && pkg.itinerary.length ? JSON.parse(JSON.stringify(pkg.itinerary)) : [
        { day: 1, title: 'Arrival', description: 'Arrive at destination', meals: 'Dinner' }
      ]);
    } else {
      setEditingPackage(null);
      setFormTitle('');
      setFormTagline('');
      setFormState('Jammu & Kashmir');
      setFormLocation('');
      setFormDays(5);
      setFormNights(4);
      setFormPrice(19999);
      setFormOriginalPrice(24999);
      setFormHidePrice(false);
      setFormFeatured(false);
      setFormStatus('active');
      setFormTheme('Adventure');
      setFormGroupSize('2 to 12 Persons');
      setFormBestTimeToVisit('Year-round');
      setFormOverview('');
      setFormBannerImage('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80');
      setFormGalleryImages([
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1200&q=80'
      ]);
      setFormVideoUrl('');
      setFormHighlights(['Curated 4-star boutique stay', 'Private vehicle with dedicated chauffeur']);
      setFormInclusions(['Daily buffet breakfast and dinners', 'All inter-city transfers and permits']);
      setFormExclusions(['Airfare / Train tickets', 'Personal expenses & tips']);
      setFormItinerary([
        { day: 1, title: 'Arrival & Welcome', description: 'Warm reception and check-in to resort.', meals: 'Dinner included' },
        { day: 2, title: 'Scenic Exploration', description: 'Full day sightseeing of key natural wonders.', meals: 'Breakfast & Dinner' }
      ]);
    }
    setIsEditorOpen(true);
  };

  const handleSavePackage = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanGallery = formGalleryImages.map(s => s.trim()).filter(Boolean);
    const cleanHighlights = formHighlights.map(s => s.trim()).filter(Boolean);
    const cleanInclusions = formInclusions.map(s => s.trim()).filter(Boolean);
    const cleanExclusions = formExclusions.map(s => s.trim()).filter(Boolean);
    const cleanItinerary = formItinerary.filter(it => it.title.trim() || it.description.trim());

    const packageToSave: Partial<TourPackage> & { title: string } = {
      ...(editingPackage?.id ? { id: editingPackage.id } : {}),
      title: formTitle.trim(),
      tagline: formTagline.trim(),
      state: formState,
      location: formLocation.trim() || formState,
      duration: { days: Number(formDays), nights: Number(formNights) },
      price: Number(formPrice) || 0,
      originalPrice: formOriginalPrice ? Number(formOriginalPrice) : undefined,
      hidePrice: formHidePrice,
      featured: formFeatured,
      status: formStatus,
      theme: formTheme,
      groupSize: formGroupSize,
      bestTimeToVisit: formBestTimeToVisit,
      overview: formOverview.trim(),
      bannerImage: formBannerImage.trim() || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      gallery: cleanGallery.length ? cleanGallery : [formBannerImage.trim()],
      videoUrl: formVideoUrl.trim(),
      highlights: cleanHighlights,
      inclusions: cleanInclusions,
      exclusions: cleanExclusions,
      itinerary: cleanItinerary
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

  // CSV Export for Leads / Inquiries
  const handleExportCSV = () => {
    if (!leads.length) {
      alert('No inquiries or call requests to export yet.');
      return;
    }

    const headers = ['ID', 'Date', 'Type', 'Traveler Name', 'Phone', 'Email', 'Destination', 'Travelers', 'Travel Date', 'Budget', 'Status', 'Notes'];
    const rows = leads.map(l => [
      `"${l.id}"`,
      `"${new Date(l.createdAt).toLocaleString()}"`,
      `"${l.type || 'General'}"`,
      `"${(l.name || '').replace(/"/g, '""')}"`,
      `"${l.phone || ''}"`,
      `"${l.email || ''}"`,
      `"${(l.destination || '').replace(/"/g, '""')}"`,
      `"${l.travelersCount || 1}"`,
      `"${l.travelDate || ''}"`,
      `"${l.budgetRange || ''}"`,
      `"${l.status}"`,
      `"${(l.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `tripdesk-leads-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredPackages = packages.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLeads = leads.filter(l => {
    if (leadsFilter === 'talk_to_specialist') return l.type === 'talk_to_specialist';
    if (leadsFilter === 'package_booking') return l.type !== 'talk_to_specialist';
    return true;
  });

  const newSpecialistRequestsCount = leads.filter(l => l.type === 'talk_to_specialist' && l.status === 'new').length;

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
                placeholder="Enter username"
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
                placeholder="Enter password"
                className="w-full px-4 py-2.5 rounded-xl border border-[#EADBBA] dark:border-[#4D2612] bg-[#FEFAEE] dark:bg-[#120904] text-sm text-[#351202] dark:text-[#FEFAEE] focus:outline-none focus:border-[#DB9309]"
              />
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
            {newSpecialistRequestsCount > 0 && (
              <span className="animate-bounce flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold shadow-sm">
                <Bell className="w-3 h-3" />
                {newSpecialistRequestsCount} New Callback Alert
              </span>
            )}
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
              {packages.filter(p => p.status === 'active' || p.status === 'featured').length} Live Packages
            </span>
          </div>

          <div className="bg-white dark:bg-[#1D1008] p-5 rounded-2xl border border-[#EADBBA] dark:border-[#4D2612] shadow-sm">
            <span className="text-xs text-[#351202]/60 dark:text-[#FEFAEE]/60 uppercase font-semibold">Price Display</span>
            <div className="text-lg font-bold text-[#DB9309] mt-2">
              {settings.hideAllPrices ? 'Hidden (Price on Request)' : 'Visible (Starting Price)'}
            </div>
            <span className="text-[11px] text-[#351202]/60 dark:text-[#FEFAEE]/60">Toggle in Settings</span>
          </div>

          <div className="bg-white dark:bg-[#1D1008] p-5 rounded-2xl border border-[#EADBBA] dark:border-[#4D2612] shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#351202]/60 dark:text-[#FEFAEE]/60 uppercase font-semibold">Inquiries & Callbacks</span>
              {newSpecialistRequestsCount > 0 && (
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              )}
            </div>
            <div className="text-3xl font-bold text-[#351202] dark:text-[#FEFAEE] mt-1">{leads.length}</div>
            <span className="text-[11px] text-rose-600 dark:text-rose-400 font-medium mt-1 block">
              {newSpecialistRequestsCount} Urgent Call Requests Pending
            </span>
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
            Footer Data, Google Form & Settings
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
            Inquiries & Callback Leads ({leads.length})
            {newSpecialistRequestsCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500" />
            )}
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
                              title="Edit Full Package Data"
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

        {/* TAB 2: Dynamic Footer Data, Settings & Google Form Configuration */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="space-y-6 max-w-4xl">
            {/* 1. Global Price Visibility */}
            <div className="bg-white dark:bg-[#1D1008] p-6 rounded-3xl border border-[#EADBBA] dark:border-[#4D2612] shadow-sm space-y-3">
              <h3 className="font-serif text-xl font-bold text-[#351202] dark:text-[#FEFAEE] flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-[#DB9309]" />
                Price Visibility Control (Direct Package Showcase)
              </h3>
              <p className="text-xs text-[#351202]/70 dark:text-[#FEFAEE]/70">
                Hide package prices across the site and display "Price on Request" instead.
              </p>

              <div className="p-4 rounded-2xl bg-[#FEFAEE] dark:bg-[#120904] border border-[#EADBBA] dark:border-[#4D2612] flex items-center justify-between">
                <div>
                  <span className="font-semibold text-sm text-[#351202] dark:text-[#FEFAEE] block">
                    Globally Hide All Prices on Website
                  </span>
                  <span className="text-xs text-[#351202]/60 dark:text-[#FEFAEE]/60">
                    Travelers will see "Price on Request" and direct quotation buttons on all packages.
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

            {/* 2. Dynamic Footer Data (Address, Phone, About, Socials) */}
            <div className="bg-white dark:bg-[#1D1008] p-6 rounded-3xl border border-[#EADBBA] dark:border-[#4D2612] shadow-sm space-y-4">
              <h3 className="font-serif text-xl font-bold text-[#351202] dark:text-[#FEFAEE] flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#DB9309]" />
                Footer & Company Contact Information (Editable)
              </h3>
              <p className="text-xs text-[#351202]/70 dark:text-[#FEFAEE]/70">
                Any changes made here will update the footer across all pages immediately.
              </p>

              <div>
                <label className="block text-xs font-semibold text-[#351202] dark:text-[#FEFAEE] mb-1">
                  Footer Office Address *
                </label>
                <input
                  type="text"
                  required
                  value={settings.contactAddress}
                  onChange={(e) => setSettings({ ...settings, contactAddress: e.target.value })}
                  placeholder="e.g. TripDesk Travel Hub, Connaught Place, New Delhi..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#EADBBA] dark:border-[#4D2612] bg-[#FEFAEE] dark:bg-[#120904] text-xs sm:text-sm text-[#351202] dark:text-[#FEFAEE]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#351202] dark:text-[#FEFAEE] mb-1">
                    Primary Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.contactPhone}
                    onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-2 rounded-xl border border-[#EADBBA] dark:border-[#4D2612] bg-[#FEFAEE] dark:bg-[#120904] text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#351202] dark:text-[#FEFAEE] mb-1">
                    Secondary / Landline Number
                  </label>
                  <input
                    type="text"
                    value={settings.contactLandline || ''}
                    onChange={(e) => setSettings({ ...settings, contactLandline: e.target.value })}
                    placeholder="+91 11 4567 8900"
                    className="w-full px-4 py-2 rounded-xl border border-[#EADBBA] dark:border-[#4D2612] bg-[#FEFAEE] dark:bg-[#120904] text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#351202] dark:text-[#FEFAEE] mb-1">
                    Official Contact Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={settings.contactEmail}
                    onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                    placeholder="desk@tripdeskholidays.com"
                    className="w-full px-4 py-2 rounded-xl border border-[#EADBBA] dark:border-[#4D2612] bg-[#FEFAEE] dark:bg-[#120904] text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#351202] dark:text-[#FEFAEE] mb-1">
                    WhatsApp Number (for direct chat) *
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.whatsappNumber}
                    onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                    placeholder="+919876543210"
                    className="w-full px-4 py-2 rounded-xl border border-[#EADBBA] dark:border-[#4D2612] bg-[#FEFAEE] dark:bg-[#120904] text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#351202] dark:text-[#FEFAEE] mb-1">
                  Footer About Description
                </label>
                <textarea
                  rows={2}
                  value={settings.aboutText}
                  onChange={(e) => setSettings({ ...settings, aboutText: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-[#EADBBA] dark:border-[#4D2612] bg-[#FEFAEE] dark:bg-[#120904] text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#351202] dark:text-[#FEFAEE] mb-1">
                    Instagram URL
                  </label>
                  <input
                    type="url"
                    value={settings.instagramUrl || ''}
                    onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                    placeholder="https://instagram.com/yourhandle"
                    className="w-full px-4 py-2 rounded-xl border border-[#EADBBA] dark:border-[#4D2612] bg-[#FEFAEE] dark:bg-[#120904] text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#351202] dark:text-[#FEFAEE] mb-1">
                    Facebook Page URL
                  </label>
                  <input
                    type="url"
                    value={settings.facebookUrl || ''}
                    onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                    placeholder="https://facebook.com/yourpage"
                    className="w-full px-4 py-2 rounded-xl border border-[#EADBBA] dark:border-[#4D2612] bg-[#FEFAEE] dark:bg-[#120904] text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#351202] dark:text-[#FEFAEE] mb-1">
                    X (Twitter) URL
                  </label>
                  <input
                    type="url"
                    value={settings.twitterUrl || ''}
                    onChange={(e) => setSettings({ ...settings, twitterUrl: e.target.value })}
                    placeholder="https://x.com/yourhandle"
                    className="w-full px-4 py-2 rounded-xl border border-[#EADBBA] dark:border-[#4D2612] bg-[#FEFAEE] dark:bg-[#120904] text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#351202] dark:text-[#FEFAEE] mb-1">
                    LinkedIn Company URL
                  </label>
                  <input
                    type="url"
                    value={settings.linkedinUrl || ''}
                    onChange={(e) => setSettings({ ...settings, linkedinUrl: e.target.value })}
                    placeholder="https://linkedin.com/company/yourcompany"
                    className="w-full px-4 py-2 rounded-xl border border-[#EADBBA] dark:border-[#4D2612] bg-[#FEFAEE] dark:bg-[#120904] text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#351202] dark:text-[#FEFAEE] mb-1">
                    YouTube Channel URL
                  </label>
                  <input
                    type="url"
                    value={settings.youtubeUrl || ''}
                    onChange={(e) => setSettings({ ...settings, youtubeUrl: e.target.value })}
                    placeholder="https://youtube.com/@channel"
                    className="w-full px-4 py-2 rounded-xl border border-[#EADBBA] dark:border-[#4D2612] bg-[#FEFAEE] dark:bg-[#120904] text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#351202] dark:text-[#FEFAEE] mb-1">
                    Response Timing Badge Text
                  </label>
                  <input
                    type="text"
                    value={settings.responseTimingText || ''}
                    onChange={(e) => setSettings({ ...settings, responseTimingText: e.target.value })}
                    placeholder="⚡ Response time: Under 2 hours"
                    className="w-full px-4 py-2 rounded-xl border border-[#EADBBA] dark:border-[#4D2612] bg-[#FEFAEE] dark:bg-[#120904] text-xs"
                  />
                </div>
              </div>
            </div>

            {/* 3. Google Form Configuration */}
            <div className="bg-white dark:bg-[#1D1008] p-6 rounded-3xl border border-[#EADBBA] dark:border-[#4D2612] shadow-sm space-y-4">
              <h3 className="font-serif text-xl font-bold text-[#351202] dark:text-[#FEFAEE] flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-[#DB9309]" />
                Google Form & Spreadsheet Setup
              </h3>
              <p className="text-xs text-[#351202]/70 dark:text-[#FEFAEE]/70">
                Inquiries will be submitted directly to your custom Google Form.
              </p>

              <div>
                <label className="block text-xs font-semibold text-[#351202] dark:text-[#FEFAEE] mb-1.5">
                  Contact Form Provider
                </label>
                <select
                  value={settings.contactMode}
                  onChange={(e) => setSettings({ ...settings, contactMode: e.target.value as any })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#EADBBA] dark:border-[#4D2612] bg-[#FEFAEE] dark:bg-[#120904] text-xs sm:text-sm text-[#351202] dark:text-[#FEFAEE]"
                >
                  <option value="google_form">Google Form Embedded (Recommended - real-time sync with Google Sheets)</option>
                  <option value="custom_form">Native Website Form</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#351202] dark:text-[#FEFAEE] mb-1.5">
                  Google Form Embed URL
                </label>
                <input
                  type="url"
                  value={settings.googleFormEmbedUrl}
                  onChange={(e) => setSettings({ ...settings, googleFormEmbedUrl: e.target.value })}
                  placeholder="https://docs.google.com/forms/d/e/.../viewform?embedded=true"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#EADBBA] dark:border-[#4D2612] bg-[#FEFAEE] dark:bg-[#120904] text-xs sm:text-sm text-[#351202] dark:text-[#FEFAEE]"
                />
              </div>
            </div>

            {/* 4. Homepage Hero & Sliding Background Management */}
            <div className="bg-white dark:bg-[#1D1008] p-6 rounded-3xl border border-[#EADBBA] dark:border-[#4D2612] shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#351202] dark:text-[#FEFAEE] flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-[#DB9309]" />
                    Homepage Slideshow & Hero Controls
                  </h3>
                  <p className="text-xs text-[#351202]/70 dark:text-[#FEFAEE]/70 mt-0.5">
                    Customize background slides, add/remove images, and manage titles live.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const currentSlides = settings.heroSlides || [];
                    setSettings({
                      ...settings,
                      heroSlides: [
                        ...currentSlides,
                        { url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80', title: 'New Destination' }
                      ]
                    });
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-[#DB9309] hover:bg-[#c48107] text-white text-xs font-semibold flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Slide
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#351202] dark:text-[#FEFAEE] mb-1">
                  Custom Hero Main Title (Optional override)
                </label>
                <input
                  type="text"
                  value={settings.heroTitle || ''}
                  onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                  placeholder="From Desk to Dream Destination"
                  className="w-full px-4 py-2 rounded-xl border border-[#EADBBA] dark:border-[#4D2612] bg-[#FEFAEE] dark:bg-[#120904] text-xs"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-semibold text-[#351202] dark:text-[#FEFAEE]">
                  Slideshow Images ({settings.heroSlides?.length || 0} active slides)
                </label>
                {(settings.heroSlides || []).map((slide, idx) => (
                  <div key={idx} className="p-3 bg-[#FDF7E7] dark:bg-[#120904] rounded-2xl border border-[#EADBBA] dark:border-[#4D2612] flex flex-col sm:flex-row items-center gap-3">
                    <div className="relative w-20 h-14 rounded-lg overflow-hidden bg-black/10 shrink-0">
                      <img src={slide.url} alt={slide.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                      <input
                        type="url"
                        value={slide.url}
                        onChange={(e) => {
                          const updated = [...(settings.heroSlides || [])];
                          updated[idx] = { ...updated[idx], url: e.target.value };
                          setSettings({ ...settings, heroSlides: updated });
                        }}
                        placeholder="Image URL (Unsplash or direct image link)"
                        className="w-full px-3 py-1.5 rounded-lg border border-[#EADBBA] dark:border-[#4D2612] bg-white dark:bg-[#1D1008] text-xs"
                      />
                      <input
                        type="text"
                        value={slide.title}
                        onChange={(e) => {
                          const updated = [...(settings.heroSlides || [])];
                          updated[idx] = { ...updated[idx], title: e.target.value };
                          setSettings({ ...settings, heroSlides: updated });
                        }}
                        placeholder="Slide Title / Caption (e.g. Kashmir Peaks)"
                        className="w-full px-3 py-1.5 rounded-lg border border-[#EADBBA] dark:border-[#4D2612] bg-white dark:bg-[#1D1008] text-xs"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = (settings.heroSlides || []).filter((_, i) => i !== idx);
                        setSettings({ ...settings, heroSlides: updated });
                      }}
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                      title="Delete Slide"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {settingsSavedMessage && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Footer details and global settings updated successfully in Cloud Database!</span>
              </div>
            )}

            {settingsErrorMessage && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>Database Error: {settingsErrorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSavingSettings}
              className="px-6 py-3 rounded-xl bg-[#351202] dark:bg-[#DB9309] text-white font-semibold text-xs shadow-md flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSavingSettings ? 'Saving to Cloud Database...' : 'Save Footer & Global Settings'}
            </button>
          </form>
        )}

        {/* TAB 3: Leads & Talk-to-Specialist Notifications */}
        {activeTab === 'leads' && (
          <div className="space-y-4">
            {/* Filter & Export Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-[#1D1008] p-4 rounded-2xl border border-[#EADBBA] dark:border-[#4D2612]">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setLeadsFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    leadsFilter === 'all'
                      ? 'bg-[#351202] dark:bg-[#DB9309] text-white'
                      : 'bg-[#FEFAEE] dark:bg-[#120904] text-[#351202] dark:text-[#FEFAEE]'
                  }`}
                >
                  All Inquiries ({leads.length})
                </button>
                <button
                  onClick={() => setLeadsFilter('talk_to_specialist')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                    leadsFilter === 'talk_to_specialist'
                      ? 'bg-rose-600 text-white'
                      : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300'
                  }`}
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  Specialist Callbacks ({leads.filter(l => l.type === 'talk_to_specialist').length})
                </button>
              </div>

              {/* Download CSV */}
              <button
                onClick={handleExportCSV}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow"
              >
                <Download className="w-3.5 h-3.5" />
                Download Inquiries (CSV / Excel)
              </button>
            </div>

            <div className="bg-white dark:bg-[#1D1008] rounded-2xl border border-[#EADBBA] dark:border-[#4D2612] overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-[#FDF7E7] dark:bg-[#120904] text-[#351202] dark:text-[#FEFAEE] uppercase text-[11px] font-bold tracking-wider border-b border-[#EADBBA] dark:border-[#4D2612]">
                    <tr>
                      <th className="py-3 px-4">Date & Type</th>
                      <th className="py-3 px-4">Traveler Contact</th>
                      <th className="py-3 px-4">Destination / Query</th>
                      <th className="py-3 px-4">Details</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EADBBA]/60 dark:divide-[#4D2612]">
                    {filteredLeads.map((lead) => (
                      <tr
                        key={lead.id}
                        className={`transition-colors ${
                          lead.type === 'talk_to_specialist' && lead.status === 'new'
                            ? 'bg-rose-50/60 dark:bg-rose-950/20'
                            : 'hover:bg-[#FEFAEE]/60 dark:hover:bg-[#120904]/60'
                        }`}
                      >
                        <td className="py-4 px-4 text-[#351202]/70 dark:text-[#FEFAEE]/70 text-[11px]">
                          <div>{new Date(lead.createdAt).toLocaleDateString()}</div>
                          {lead.type === 'talk_to_specialist' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 mt-1 rounded bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200 font-bold text-[10px]">
                              <PhoneCall className="w-3 h-3" /> Specialist Call
                            </span>
                          ) : (
                            <span className="text-[10px] text-[#351202]/50 dark:text-[#FEFAEE]/50">General Lead</span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-semibold text-[#351202] dark:text-[#FEFAEE]">{lead.name || 'Anonymous'}</div>
                          <a href={`tel:${lead.phone}`} className="text-[12px] font-bold text-[#DB9309] hover:underline block mt-0.5">
                            {lead.phone}
                          </a>
                          {lead.email && <div className="text-[11px] text-[#351202]/60 dark:text-[#FEFAEE]/60">{lead.email}</div>}
                        </td>
                        <td className="py-4 px-4 font-medium">
                          {lead.destination}
                          {lead.notes && (
                            <div className="text-[11px] text-[#351202]/70 dark:text-[#FEFAEE]/70 mt-1 max-w-xs italic">
                              "{lead.notes}"
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-4 text-xs">
                          {lead.travelersCount && <div>{lead.travelersCount} Travelers</div>}
                          <div className="text-[11px] text-[#351202]/60 dark:text-[#FEFAEE]/60">{lead.travelDate || 'Flexible dates'}</div>
                          {lead.budgetRange && <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">{lead.budgetRange}</div>}
                        </td>
                        <td className="py-4 px-4">
                          <select
                            value={lead.status}
                            onChange={async (e) => {
                              const newStatus = e.target.value as any;
                              // Optimistically update UI
                              setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, status: newStatus } : l));
                              await updateLeadStatus(lead.id, newStatus);
                            }}
                            className="text-xs font-semibold px-2 py-1 rounded-lg border border-[#EADBBA] dark:border-[#4D2612] bg-[#FEFAEE] dark:bg-[#120904] text-[#351202] dark:text-[#FEFAEE]"
                          >
                            <option value="new">🟢 New</option>
                            <option value="contacted">🟡 Contacted</option>
                            <option value="booked">🎉 Booked</option>
                            <option value="cancelled">⚪ Cancelled</option>
                          </select>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={async () => {
                              if (confirm(`Are you sure you want to delete lead from ${lead.name || lead.phone}?`)) {
                                setLeads(prev => prev.filter(l => l.id !== lead.id));
                                await deleteLead(lead.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors inline-flex items-center"
                            title="Delete Lead"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FULL PACKAGE CREATION & EDIT MODAL WITH TABS */}
      <AnimatePresence>
        {isEditorOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <div className="fixed inset-0 bg-[#351202]/70 dark:bg-black/80 backdrop-blur-sm" onClick={() => setIsEditorOpen(false)} />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-4xl bg-[#FEFAEE] dark:bg-[#1D1008] rounded-3xl border-2 border-[#DB9309] shadow-2xl p-6 sm:p-8 z-10 max-h-[92vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#EADBBA] dark:border-[#4D2612]">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-[#351202] dark:text-[#FEFAEE]">
                    {editingPackage ? 'Edit Full Tour Package' : 'Create New Pan-India Package'}
                  </h3>
                  <p className="text-xs text-[#351202]/70 dark:text-[#FEFAEE]/70 mt-0.5">
                    Add images, video, day plans, inclusions & pricing. Empty sections will auto-hide.
                  </p>
                </div>
                <button onClick={() => setIsEditorOpen(false)} className="p-1.5 rounded-full hover:bg-[#EADBBA]/30">
                  <X className="w-5 h-5 text-[#351202] dark:text-[#FEFAEE]" />
                </button>
              </div>

              {/* Sub-tabs inside Form */}
              <div className="flex border-b border-[#EADBBA] dark:border-[#4D2612] mt-4 mb-6 bg-[#FDF7E7] dark:bg-[#120904] rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => setEditorSection('basic')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                    editorSection === 'basic'
                      ? 'bg-[#351202] dark:bg-[#DB9309] text-white shadow'
                      : 'text-[#351202]/70 dark:text-[#FEFAEE]/70'
                  }`}
                >
                  1. Basic & Pricing
                </button>
                <button
                  type="button"
                  onClick={() => setEditorSection('media')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1 ${
                    editorSection === 'media'
                      ? 'bg-[#351202] dark:bg-[#DB9309] text-white shadow'
                      : 'text-[#351202]/70 dark:text-[#FEFAEE]/70'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  2. Photos & Video
                </button>
                <button
                  type="button"
                  onClick={() => setEditorSection('inclusions')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                    editorSection === 'inclusions'
                      ? 'bg-[#351202] dark:bg-[#DB9309] text-white shadow'
                      : 'text-[#351202]/70 dark:text-[#FEFAEE]/70'
                  }`}
                >
                  3. Inclusions & Highlights
                </button>
                <button
                  type="button"
                  onClick={() => setEditorSection('itinerary')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1 ${
                    editorSection === 'itinerary'
                      ? 'bg-[#351202] dark:bg-[#DB9309] text-white shadow'
                      : 'text-[#351202]/70 dark:text-[#FEFAEE]/70'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  4. Day-by-Day Itinerary ({formItinerary.length} Days)
                </button>
              </div>

              <form onSubmit={handleSavePackage} className="space-y-5 text-xs sm:text-sm">
                
                {/* SECTION 1: Basic & Pricing */}
                {editorSection === 'basic' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block font-semibold text-[#351202] dark:text-[#FEFAEE] mb-1">
                        Package Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        placeholder="e.g. Kashmir: Paradise On Earth & Dal Lake Escapade"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#EADBBA] dark:border-[#4D2612] bg-white dark:bg-[#120904] text-[#351202] dark:text-[#FEFAEE]"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-[#351202] dark:text-[#FEFAEE] mb-1">
                        Catchy Tagline (Optional)
                      </label>
                      <input
                        type="text"
                        value={formTagline}
                        onChange={(e) => setFormTagline(e.target.value)}
                        placeholder="e.g. Glide on Shikaras, wander Mughal gardens, and soak in snowy peaks"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#EADBBA] dark:border-[#4D2612] bg-white dark:bg-[#120904] text-[#351202] dark:text-[#FEFAEE]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-semibold text-[#351202] dark:text-[#FEFAEE] mb-1">State / Region *</label>
                        <select
                          value={formState}
                          onChange={(e) => setFormState(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-[#EADBBA] dark:border-[#4D2612] bg-white dark:bg-[#120904] text-[#351202] dark:text-[#FEFAEE]"
                        >
                          {STATES_LIST.filter(s => s !== 'All States').map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-[#351202] dark:text-[#FEFAEE] mb-1">Theme</label>
                        <select
                          value={formTheme}
                          onChange={(e) => setFormTheme(e.target.value as any)}
                          className="w-full px-3 py-2.5 rounded-xl border border-[#EADBBA] dark:border-[#4D2612] bg-white dark:bg-[#120904] text-[#351202] dark:text-[#FEFAEE]"
                        >
                          {THEMES_LIST.filter(t => t !== 'All Themes').map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-[#351202] dark:text-[#FEFAEE] mb-1">Key Cities / Locations</label>
                        <input
                          type="text"
                          value={formLocation}
                          onChange={(e) => setFormLocation(e.target.value)}
                          placeholder="e.g. Srinagar, Gulmarg, Pahalgam"
                          className="w-full px-3 py-2.5 rounded-xl border border-[#EADBBA] dark:border-[#4D2612] bg-white dark:bg-[#120904] text-[#351202] dark:text-[#FEFAEE]"
                        />
                      </div>
                    </div>

                    {/* Pricing Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white dark:bg-[#120904] p-4 rounded-2xl border border-[#EADBBA] dark:border-[#4D2612]">
                      <div>
                        <label className="block font-semibold text-[#351202] dark:text-[#FEFAEE] mb-1">Starting Price (₹) *</label>
                        <input
                          type="number"
                          required
                          value={formPrice}
                          onChange={(e) => setFormPrice(parseInt(e.target.value, 10) || 0)}
                          className="w-full px-3 py-2 rounded-xl border border-[#EADBBA] dark:border-[#4D2612] bg-[#FEFAEE] dark:bg-[#1D1008] text-[#351202] dark:text-[#FEFAEE]"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-[#351202] dark:text-[#FEFAEE] mb-1">Original Price (Strikethrough)</label>
                        <input
                          type="number"
                          value={formOriginalPrice}
                          onChange={(e) => setFormOriginalPrice(e.target.value ? parseInt(e.target.value, 10) : '')}
                          placeholder="Optional"
                          className="w-full px-3 py-2 rounded-xl border border-[#EADBBA] dark:border-[#4D2612] bg-[#FEFAEE] dark:bg-[#1D1008] text-[#351202] dark:text-[#FEFAEE]"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-[#351202] dark:text-[#FEFAEE] mb-1">Duration (Days / Nights)</label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            min={1}
                            value={formDays}
                            onChange={(e) => setFormDays(parseInt(e.target.value, 10) || 1)}
                            className="w-1/2 px-2 py-2 rounded-xl border border-[#EADBBA] dark:border-[#4D2612] bg-[#FEFAEE] dark:bg-[#1D1008]"
                            title="Days"
                          />
                          <input
                            type="number"
                            min={0}
                            value={formNights}
                            onChange={(e) => setFormNights(parseInt(e.target.value, 10) || 0)}
                            className="w-1/2 px-2 py-2 rounded-xl border border-[#EADBBA] dark:border-[#4D2612] bg-[#FEFAEE] dark:bg-[#1D1008]"
                            title="Nights"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 p-4 rounded-2xl bg-white dark:bg-[#120904] border border-[#EADBBA] dark:border-[#4D2612]">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="formHidePrice"
                          checked={formHidePrice}
                          onChange={(e) => setFormHidePrice(e.target.checked)}
                          className="w-4 h-4 text-[#DB9309] rounded cursor-pointer"
                        />
                        <label htmlFor="formHidePrice" className="font-semibold text-xs cursor-pointer">
                          Hide Price (Show "Price on Request" on this package)
                        </label>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="formFeatured"
                          checked={formFeatured}
                          onChange={(e) => setFormFeatured(e.target.checked)}
                          className="w-4 h-4 text-[#DB9309] rounded cursor-pointer"
                        />
                        <label htmlFor="formFeatured" className="font-semibold text-xs cursor-pointer">
                          Mark as Featured
                        </label>
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="font-semibold text-xs">Status:</label>
                        <select
                          value={formStatus}
                          onChange={(e) => setFormStatus(e.target.value as any)}
                          className="px-2.5 py-1 rounded-lg border border-[#EADBBA] dark:border-[#4D2612] bg-[#FEFAEE] dark:bg-[#1D1008] text-xs font-semibold"
                        >
                          <option value="active">Active (Visible)</option>
                          <option value="featured">Featured</option>
                          <option value="draft">Draft (Hidden)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-[#351202] dark:text-[#FEFAEE] mb-1">
                        Tour Overview / Narrative (Optional)
                      </label>
                      <textarea
                        rows={3}
                        value={formOverview}
                        onChange={(e) => setFormOverview(e.target.value)}
                        placeholder="Detailed travel story and experience overview..."
                        className="w-full px-3.5 py-2 rounded-xl border border-[#EADBBA] dark:border-[#4D2612] bg-white dark:bg-[#120904]"
                      />
                    </div>
                  </div>
                )}

                {/* SECTION 2: Media (Banner, Multi-Image Gallery, YouTube Embed) */}
                {editorSection === 'media' && (
                  <div className="space-y-5">
                    <div>
                      <label className="block font-semibold text-[#351202] dark:text-[#FEFAEE] mb-1">
                        Primary Banner Image URL *
                      </label>
                      <input
                        type="url"
                        required
                        value={formBannerImage}
                        onChange={(e) => setFormBannerImage(e.target.value)}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="w-full px-3.5 py-2 rounded-xl border border-[#EADBBA] dark:border-[#4D2612] bg-white dark:bg-[#120904]"
                      />
                    </div>

                    {/* YouTube Embed Video URL */}
                    <div className="p-4 bg-white dark:bg-[#120904] rounded-2xl border border-[#EADBBA] dark:border-[#4D2612] space-y-2">
                      <label className="font-semibold text-[#351202] dark:text-[#FEFAEE] flex items-center gap-2">
                        <Video className="w-4 h-4 text-[#DB9309]" />
                        YouTube Embed Video Link (Optional)
                      </label>
                      <p className="text-xs text-[#351202]/60 dark:text-[#FEFAEE]/60">
                        If left blank, the video showcase section will be automatically hidden from the package page.
                      </p>
                      <input
                        type="url"
                        value={formVideoUrl}
                        onChange={(e) => setFormVideoUrl(e.target.value)}
                        placeholder="https://www.youtube.com/embed/n3kUvD4gVqU"
                        className="w-full px-3.5 py-2 rounded-xl border border-[#EADBBA] dark:border-[#4D2612] bg-[#FEFAEE] dark:bg-[#1D1008]"
                      />
                    </div>

                    {/* Multi-Photo Gallery Dynamic List */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="font-semibold text-[#351202] dark:text-[#FEFAEE] flex items-center gap-1.5">
                          <ImageIcon className="w-4 h-4 text-[#DB9309]" />
                          Multi-Photo Gallery Images ({formGalleryImages.filter(Boolean).length} added)
                        </label>
                        <button
                          type="button"
                          onClick={() => setFormGalleryImages([...formGalleryImages, ''])}
                          className="text-xs font-semibold px-3 py-1 rounded-lg bg-[#DB9309] text-white flex items-center gap-1 shadow-sm"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Another Photo URL
                        </button>
                      </div>

                      {formGalleryImages.map((img, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#DB9309] w-6 shrink-0">#{idx + 1}</span>
                          <input
                            type="url"
                            value={img}
                            onChange={(e) => {
                              const updated = [...formGalleryImages];
                              updated[idx] = e.target.value;
                              setFormGalleryImages(updated);
                            }}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full px-3 py-2 rounded-xl border border-[#EADBBA] dark:border-[#4D2612] bg-white dark:bg-[#120904]"
                          />
                          {formGalleryImages.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                setFormGalleryImages(formGalleryImages.filter((_, i) => i !== idx));
                              }}
                              className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg shrink-0"
                              title="Remove photo"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SECTION 3: Highlights, Inclusions & Exclusions */}
                {editorSection === 'inclusions' && (
                  <div className="space-y-5">
                    {/* Highlights */}
                    <div className="p-4 rounded-2xl bg-white dark:bg-[#120904] border border-[#EADBBA] dark:border-[#4D2612] space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="font-semibold text-xs uppercase tracking-wider text-[#DB9309]">
                          Key Highlights ({formHighlights.filter(Boolean).length})
                        </label>
                        <button
                          type="button"
                          onClick={() => setFormHighlights([...formHighlights, ''])}
                          className="text-xs px-2.5 py-1 rounded-md bg-[#DB9309] text-white flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" /> Add Highlight
                        </button>
                      </div>
                      {formHighlights.map((hl, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={hl}
                            onChange={(e) => {
                              const updated = [...formHighlights];
                              updated[i] = e.target.value;
                              setFormHighlights(updated);
                            }}
                            placeholder="e.g. Luxury houseboat stay on Dal Lake"
                            className="w-full px-3 py-1.5 rounded-xl border border-[#EADBBA] dark:border-[#4D2612] bg-[#FEFAEE] dark:bg-[#1D1008] text-xs"
                          />
                          {formHighlights.length > 1 && (
                            <button
                              type="button"
                              onClick={() => setFormHighlights(formHighlights.filter((_, idx) => idx !== i))}
                              className="text-rose-500 hover:text-rose-700 p-1"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Inclusions */}
                    <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="font-semibold text-xs uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                          Included in Tour ({formInclusions.filter(Boolean).length})
                        </label>
                        <button
                          type="button"
                          onClick={() => setFormInclusions([...formInclusions, ''])}
                          className="text-xs px-2.5 py-1 rounded-md bg-emerald-700 text-white flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" /> Add Inclusion
                        </button>
                      </div>
                      {formInclusions.map((inc, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={inc}
                            onChange={(e) => {
                              const updated = [...formInclusions];
                              updated[i] = e.target.value;
                              setFormInclusions(updated);
                            }}
                            placeholder="e.g. 5 Nights Accommodations in 4-Star hotels"
                            className="w-full px-3 py-1.5 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-white dark:bg-[#120904] text-xs"
                          />
                          {formInclusions.length > 1 && (
                            <button
                              type="button"
                              onClick={() => setFormInclusions(formInclusions.filter((_, idx) => idx !== i))}
                              className="text-rose-500 hover:text-rose-700 p-1"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Exclusions */}
                    <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="font-semibold text-xs uppercase tracking-wider text-rose-800 dark:text-rose-300">
                          Excluded from Tour ({formExclusions.filter(Boolean).length})
                        </label>
                        <button
                          type="button"
                          onClick={() => setFormExclusions([...formExclusions, ''])}
                          className="text-xs px-2.5 py-1 rounded-md bg-rose-700 text-white flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" /> Add Exclusion
                        </button>
                      </div>
                      {formExclusions.map((exc, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={exc}
                            onChange={(e) => {
                              const updated = [...formExclusions];
                              updated[i] = e.target.value;
                              setFormExclusions(updated);
                            }}
                            placeholder="e.g. Flights / Train tickets"
                            className="w-full px-3 py-1.5 rounded-xl border border-rose-300 dark:border-rose-800 bg-white dark:bg-[#120904] text-xs"
                          />
                          {formExclusions.length > 1 && (
                            <button
                              type="button"
                              onClick={() => setFormExclusions(formExclusions.filter((_, idx) => idx !== i))}
                              className="text-rose-500 hover:text-rose-700 p-1"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SECTION 4: Day-by-Day Detailed Itinerary */}
                {editorSection === 'itinerary' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-xs text-[#351202] dark:text-[#FEFAEE]">
                          Day-by-Day Detailed Plan
                        </span>
                        <p className="text-xs text-[#351202]/60 dark:text-[#FEFAEE]/60">
                          Add individual days with titles, meals, hotel names, and activity descriptions.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const nextDay = formItinerary.length + 1;
                          setFormItinerary([
                            ...formItinerary,
                            { day: nextDay, title: `Day ${nextDay} Itinerary`, description: '', meals: 'Breakfast & Dinner' }
                          ]);
                        }}
                        className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#DB9309] text-white flex items-center gap-1 shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Day {formItinerary.length + 1}
                      </button>
                    </div>

                    <div className="space-y-3">
                      {formItinerary.map((dayItem, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-white dark:bg-[#120904] border border-[#EADBBA] dark:border-[#4D2612] space-y-2">
                          <div className="flex items-center justify-between pb-2 border-b border-[#EADBBA]/50 dark:border-[#4D2612]">
                            <span className="font-bold text-xs uppercase text-[#DB9309]">
                              Day {idx + 1}
                            </span>
                            {formItinerary.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = formItinerary.filter((_, i) => i !== idx).map((item, newI) => ({
                                    ...item,
                                    day: newI + 1
                                  }));
                                  setFormItinerary(updated);
                                }}
                                className="text-rose-500 hover:text-rose-700 text-xs flex items-center gap-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Remove Day
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[11px] font-semibold text-[#351202]/70 dark:text-[#FEFAEE]/70 mb-0.5">
                                Title / Heading *
                              </label>
                              <input
                                type="text"
                                value={dayItem.title}
                                onChange={(e) => {
                                  const updated = [...formItinerary];
                                  updated[idx].title = e.target.value;
                                  setFormItinerary(updated);
                                }}
                                placeholder="e.g. Srinagar to Gulmarg Gondola"
                                className="w-full px-3 py-1.5 rounded-lg border border-[#EADBBA] dark:border-[#4D2612] bg-[#FEFAEE] dark:bg-[#1D1008] text-xs font-semibold"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-semibold text-[#351202]/70 dark:text-[#FEFAEE]/70 mb-0.5">
                                Meals & Hotel Info
                              </label>
                              <input
                                type="text"
                                value={dayItem.meals || ''}
                                onChange={(e) => {
                                  const updated = [...formItinerary];
                                  updated[idx].meals = e.target.value;
                                  setFormItinerary(updated);
                                }}
                                placeholder="e.g. Breakfast & Dinner | Pine Palace Resort"
                                className="w-full px-3 py-1.5 rounded-lg border border-[#EADBBA] dark:border-[#4D2612] bg-[#FEFAEE] dark:bg-[#1D1008] text-xs"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-[#351202]/70 dark:text-[#FEFAEE]/70 mb-0.5">
                              Day Description & Sightseeing details
                            </label>
                            <textarea
                              rows={2}
                              value={dayItem.description}
                              onChange={(e) => {
                                const updated = [...formItinerary];
                                updated[idx].description = e.target.value;
                                setFormItinerary(updated);
                              }}
                              placeholder="Describe day's activities..."
                              className="w-full px-3 py-1.5 rounded-lg border border-[#EADBBA] dark:border-[#4D2612] bg-[#FEFAEE] dark:bg-[#1D1008] text-xs"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Form Footer Buttons */}
                <div className="pt-4 border-t border-[#EADBBA] dark:border-[#4D2612] flex items-center justify-between">
                  <div className="text-xs text-[#351202]/60 dark:text-[#FEFAEE]/60">
                    Switch tabs 1 to 4 above to fill or edit all package parameters.
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsEditorOpen(false)}
                      className="px-5 py-2.5 rounded-xl border border-[#EADBBA] dark:border-[#4D2612] text-[#351202] dark:text-[#FEFAEE] hover:bg-[#FDF7E7]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-[#351202] dark:bg-[#DB9309] text-white font-semibold shadow-md flex items-center gap-1.5"
                    >
                      <Save className="w-4 h-4" />
                      Save Complete Package
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
