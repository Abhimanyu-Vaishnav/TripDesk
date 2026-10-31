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
  Calendar,
  AlertCircle,
  TrendingUp,
  KeyRound,
  ExternalLink
} from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { TourPackage, LeadInquiry } from '@/types';
import { getStoredPackages, savePackage, deletePackage, getStoredLeads, updateLeadStatus } from '@/lib/storage';
import { STATES_LIST, THEMES_LIST } from '@/lib/mockData';

// Demo admin passkey for direct access
const ADMIN_PASSKEY = 'tripdesk2026';

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passkeyInput, setPasskeyInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Dashboard views: packages | leads
  const [activeTab, setActiveTab] = useState<'packages' | 'leads'>('packages');

  // Packages state
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [leads, setLeads] = useState<LeadInquiry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Form modal state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Partial<TourPackage> | null>(null);

  // Form fields helper
  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    state: 'Jammu & Kashmir',
    location: '',
    days: 5,
    nights: 4,
    price: 20000,
    originalPrice: 25000,
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
    // Check if previously logged in this session
    const auth = sessionStorage.getItem('tripdesk_admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      loadDashboardData();
    }
  }, []);

  const loadDashboardData = () => {
    setPackages(getStoredPackages());
    setLeads(getStoredLeads());
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passkeyInput === ADMIN_PASSKEY || passkeyInput === 'admin') {
      setIsAuthenticated(true);
      sessionStorage.setItem('tripdesk_admin_auth', 'true');
      setAuthError('');
      loadDashboardData();
    } else {
      setAuthError('Invalid Admin Passkey. (Hint: Use tripdesk2026 or admin)');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('tripdesk_admin_auth');
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
        status: 'active',
        featured: false,
        theme: 'Nature',
        bannerImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
        galleryInput: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80\nhttps://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1200&q=80',
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

    // Parse itinerary lines
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

  // Filter packages
  const filteredPackages = packages.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* LOGIN SCREEN IF NOT AUTHENTICATED */
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FEFAEE] flex flex-col justify-center items-center px-4">
        <div className="w-full max-w-md bg-white rounded-3xl border-2 border-[#DB9309] shadow-2xl p-8">
          <div className="text-center mb-6">
            <Logo variant="main" size="lg" className="justify-center" />
            <h2 className="font-serif text-2xl font-bold text-[#351202] mt-4">
              Staff & Admin Portal
            </h2>
            <p className="text-xs text-[#351202]/70 mt-1">
              Authorized tour managers only. Manage packages, media, and traveler inquiries.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#351202] mb-1.5 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-[#DB9309]" />
                Security Passkey
              </label>
              <input
                type="password"
                required
                value={passkeyInput}
                onChange={(e) => setPasskeyInput(e.target.value)}
                placeholder="Enter passkey..."
                className="w-full px-4 py-2.5 rounded-xl border border-[#EADBBA] focus:outline-none focus:border-[#DB9309] text-sm text-[#351202]"
              />
              <span className="text-[11px] text-[#351202]/50 mt-1 block">
                Default Passkey: <code className="bg-[#FEFAEE] px-1.5 py-0.5 rounded text-[#DB9309] font-semibold">tripdesk2026</code>
              </span>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#351202] hover:bg-[#4D1D05] text-white font-semibold text-sm transition-all shadow-md"
            >
              Sign In to Dashboard
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#EADBBA] text-center">
            <Link href="/" className="text-xs text-[#DB9309] hover:underline">
              ← Return to Main Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* AUTHENTICATED ADMIN DASHBOARD */
  return (
    <div className="min-h-screen bg-[#FEFAEE] flex flex-col text-[#351202]">
      {/* Top Navbar */}
      <header className="bg-white border-b border-[#EADBBA] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo variant="main" size="sm" />
            <span className="px-2.5 py-1 rounded-full bg-[#DB9309]/15 text-[#DB9309] text-[11px] font-bold uppercase tracking-wider">
              Admin Suite
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="text-xs font-semibold text-[#351202]/80 hover:text-[#DB9309] flex items-center gap-1"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Live Site
            </Link>

            <button
              onClick={handleLogout}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 px-3 py-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main View */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Top Summary Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-[#EADBBA] shadow-sm">
            <span className="text-xs text-[#351202]/60 uppercase font-semibold">Total Packages</span>
            <div className="text-3xl font-bold text-[#351202] mt-1">{packages.length}</div>
            <span className="text-[11px] text-emerald-600 font-medium mt-1 block">
              {packages.filter(p => p.status === 'active' || p.status === 'featured').length} Live on Website
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#EADBBA] shadow-sm">
            <span className="text-xs text-[#351202]/60 uppercase font-semibold">Leads & Inquiries</span>
            <div className="text-3xl font-bold text-[#DB9309] mt-1">{leads.length}</div>
            <span className="text-[11px] text-[#351202]/70 font-medium mt-1 block">
              {leads.filter(l => l.status === 'new').length} New / Unhandled
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#EADBBA] shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-[#351202]/60 uppercase font-semibold">Action Center</span>
              <div className="text-sm font-bold text-[#351202] mt-1">Create New Tour</div>
              <span className="text-[11px] text-[#351202]/70">Add photos, day plans & prices</span>
            </div>
            <button
              onClick={() => handleOpenEditor()}
              className="px-4 py-2.5 rounded-xl bg-[#351202] hover:bg-[#4D1D05] text-white font-semibold text-xs shadow-md flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4 text-[#DB9309]" />
              New Tour
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-[#EADBBA] mb-6">
          <button
            onClick={() => setActiveTab('packages')}
            className={`py-3 px-6 font-semibold text-sm transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'packages'
                ? 'border-[#DB9309] text-[#351202]'
                : 'border-transparent text-[#351202]/60 hover:text-[#351202]'
            }`}
          >
            <Layers className="w-4 h-4 text-[#DB9309]" />
            Manage Tour Packages ({packages.length})
          </button>

          <button
            onClick={() => setActiveTab('leads')}
            className={`py-3 px-6 font-semibold text-sm transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'leads'
                ? 'border-[#DB9309] text-[#351202]'
                : 'border-transparent text-[#351202]/60 hover:text-[#351202]'
            }`}
          >
            <Users className="w-4 h-4 text-[#DB9309]" />
            Client Inquiries & Leads ({leads.length})
          </button>
        </div>

        {/* TAB 1: Packages Management */}
        {activeTab === 'packages' && (
          <div className="space-y-6">
            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#EADBBA]">
              <div className="relative w-full sm:w-96">
                <Search className="w-4 h-4 absolute left-3 top-3 text-[#351202]/40" />
                <input
                  type="text"
                  placeholder="Search package title, state, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#EADBBA] text-xs sm:text-sm focus:outline-none focus:border-[#DB9309]"
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

            {/* Packages Table */}
            <div className="bg-white rounded-2xl border border-[#EADBBA] overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-[#FDF7E7] text-[#351202] uppercase text-[11px] font-bold tracking-wider border-b border-[#EADBBA]">
                    <tr>
                      <th className="py-3 px-4">Package Details</th>
                      <th className="py-3 px-4">Region / State</th>
                      <th className="py-3 px-4">Duration</th>
                      <th className="py-3 px-4">Price / Person</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EADBBA]/60">
                    {filteredPackages.map((pkg) => (
                      <tr key={pkg.id} className="hover:bg-[#FEFAEE]/60 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl overflow-hidden relative shrink-0 border border-[#EADBBA]">
                              <img
                                src={pkg.bannerImage}
                                alt={pkg.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-semibold text-[#351202] line-clamp-1">{pkg.title}</div>
                              <div className="text-[11px] text-[#351202]/60 mt-0.5">{pkg.theme} • {pkg.location}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 font-medium text-[#351202]">{pkg.state}</td>
                        <td className="py-4 px-4 text-[#351202]/80">
                          {pkg.duration.days}D / {pkg.duration.nights}N
                        </td>
                        <td className="py-4 px-4 font-bold text-[#351202]">
                          ₹{pkg.price.toLocaleString('en-IN')}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              pkg.status === 'active' || pkg.status === 'featured'
                                ? 'bg-emerald-100 text-emerald-800'
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
                              className="p-1.5 rounded-lg border border-[#EADBBA] hover:bg-[#FEFAEE] text-[#351202]"
                              title="Preview Live"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>

                            <button
                              onClick={() => handleOpenEditor(pkg)}
                              className="p-1.5 rounded-lg border border-[#EADBBA] hover:bg-[#FEFAEE] text-[#351202]"
                              title="Edit Package"
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleDeletePackage(pkg.id, pkg.title)}
                              className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600"
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

        {/* TAB 2: Leads & Inquiries */}
        {activeTab === 'leads' && (
          <div className="bg-white rounded-2xl border border-[#EADBBA] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#FDF7E7] text-[#351202] uppercase text-[11px] font-bold tracking-wider border-b border-[#EADBBA]">
                  <tr>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Traveler Contact</th>
                    <th className="py-3 px-4">Destination / Package</th>
                    <th className="py-3 px-4">Travelers & Date</th>
                    <th className="py-3 px-4">Notes</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EADBBA]/60">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-[#FEFAEE]/60 transition-colors">
                      <td className="py-4 px-4 text-[#351202]/70 text-[11px] whitespace-nowrap">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-semibold text-[#351202]">{lead.name}</div>
                        <div className="text-[11px] text-[#351202]/70">{lead.phone}</div>
                        <div className="text-[11px] text-[#DB9309]">{lead.email}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-medium text-[#351202]">{lead.destination}</div>
                        {lead.packageTitle && (
                          <div className="text-[11px] text-[#351202]/60 line-clamp-1">
                            Ref: {lead.packageTitle}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-[#351202]">{lead.travelersCount} Travelers</div>
                        <div className="text-[11px] text-[#351202]/60">{lead.travelDate || 'Flexible dates'}</div>
                        <div className="text-[11px] text-emerald-700 font-medium">{lead.budgetRange}</div>
                      </td>
                      <td className="py-4 px-4 text-xs text-[#351202]/80 max-w-xs">
                        {lead.notes || 'No special notes'}
                      </td>
                      <td className="py-4 px-4">
                        <select
                          value={lead.status}
                          onChange={(e) => {
                            updateLeadStatus(lead.id, e.target.value as any);
                            loadDashboardData();
                          }}
                          className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-[#EADBBA] bg-[#FEFAEE] text-[#351202] focus:outline-none"
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
            <div
              className="fixed inset-0 bg-[#351202]/70 backdrop-blur-sm"
              onClick={() => setIsEditorOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-3xl bg-[#FEFAEE] rounded-3xl border-2 border-[#DB9309] shadow-2xl p-6 sm:p-8 z-10 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#EADBBA]">
                <h3 className="font-serif text-2xl font-bold text-[#351202]">
                  {editingPackage ? 'Edit Tour Package' : 'Create New Pan-India Package'}
                </h3>
                <button
                  onClick={() => setIsEditorOpen(false)}
                  className="p-1.5 rounded-full hover:bg-[#EADBBA]"
                >
                  <X className="w-5 h-5 text-[#351202]" />
                </button>
              </div>

              <form onSubmit={handleSavePackage} className="mt-6 space-y-4 text-xs sm:text-sm">
                {/* Title */}
                <div>
                  <label className="block font-semibold text-[#351202] mb-1">Package Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Kashmir: Paradise On Earth & Dal Lake Escapade"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#EADBBA] bg-white text-[#351202]"
                  />
                </div>

                {/* Tagline */}
                <div>
                  <label className="block font-semibold text-[#351202] mb-1">Tagline</label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    placeholder="Short catchy one-liner"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#EADBBA] bg-white text-[#351202]"
                  />
                </div>

                {/* State, Theme & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-[#351202] mb-1">State / Region *</label>
                    <select
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#EADBBA] bg-white text-[#351202]"
                    >
                      {STATES_LIST.filter(s => s !== 'All States').map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#351202] mb-1">Theme</label>
                    <select
                      value={formData.theme}
                      onChange={(e) => setFormData({ ...formData, theme: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl border border-[#EADBBA] bg-white text-[#351202]"
                    >
                      {THEMES_LIST.filter(t => t !== 'All Themes').map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#351202] mb-1">Key Cities / Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g. Srinagar, Gulmarg, Pahalgam"
                      className="w-full px-3 py-2 rounded-xl border border-[#EADBBA] bg-white text-[#351202]"
                    />
                  </div>
                </div>

                {/* Duration & Pricing */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block font-semibold text-[#351202] mb-1">Days</label>
                    <input
                      type="number"
                      min={1}
                      value={formData.days}
                      onChange={(e) => setFormData({ ...formData, days: parseInt(e.target.value, 10) || 1 })}
                      className="w-full px-3 py-2 rounded-xl border border-[#EADBBA] bg-white text-[#351202]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#351202] mb-1">Nights</label>
                    <input
                      type="number"
                      min={1}
                      value={formData.nights}
                      onChange={(e) => setFormData({ ...formData, nights: parseInt(e.target.value, 10) || 1 })}
                      className="w-full px-3 py-2 rounded-xl border border-[#EADBBA] bg-white text-[#351202]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#351202] mb-1">Price (₹) *</label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value, 10) || 0 })}
                      className="w-full px-3 py-2 rounded-xl border border-[#EADBBA] bg-white text-[#351202]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#351202] mb-1">Original Price (₹)</label>
                    <input
                      type="number"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: parseInt(e.target.value, 10) || 0 })}
                      className="w-full px-3 py-2 rounded-xl border border-[#EADBBA] bg-white text-[#351202]"
                    />
                  </div>
                </div>

                {/* Status & Featured Toggle */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center bg-white p-3 rounded-2xl border border-[#EADBBA]">
                  <div>
                    <label className="block font-semibold text-[#351202] mb-1">Publish Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl border border-[#EADBBA] bg-[#FEFAEE] text-[#351202]"
                    >
                      <option value="active">Active (Visible)</option>
                      <option value="featured">Featured (Top Badge)</option>
                      <option value="draft">Draft (Hidden)</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 pt-4 sm:pt-0">
                    <input
                      type="checkbox"
                      id="featured-toggle"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-4 h-4 text-[#DB9309] rounded"
                    />
                    <label htmlFor="featured-toggle" className="font-semibold text-[#351202] cursor-pointer">
                      Mark as Featured Package
                    </label>
                  </div>
                </div>

                {/* Banner Image & Video URL */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#351202] mb-1">Banner Image URL *</label>
                    <input
                      type="url"
                      required
                      value={formData.bannerImage}
                      onChange={(e) => setFormData({ ...formData, bannerImage: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 rounded-xl border border-[#EADBBA] bg-white text-[#351202]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#351202] mb-1">YouTube Embed Video URL</label>
                    <input
                      type="url"
                      value={formData.videoUrl}
                      onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                      placeholder="https://www.youtube.com/embed/..."
                      className="w-full px-3 py-2 rounded-xl border border-[#EADBBA] bg-white text-[#351202]"
                    />
                  </div>
                </div>

                {/* Gallery Images */}
                <div>
                  <label className="block font-semibold text-[#351202] mb-1">
                    Multi-Photo Gallery URLs (One per line)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.galleryInput}
                    onChange={(e) => setFormData({ ...formData, galleryInput: e.target.value })}
                    placeholder="https://...\nhttps://..."
                    className="w-full px-3 py-2 rounded-xl border border-[#EADBBA] bg-white text-[#351202]"
                  />
                </div>

                {/* Overview */}
                <div>
                  <label className="block font-semibold text-[#351202] mb-1">Tour Overview</label>
                  <textarea
                    rows={2}
                    value={formData.overview}
                    onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                    placeholder="Experience summary..."
                    className="w-full px-3 py-2 rounded-xl border border-[#EADBBA] bg-white text-[#351202]"
                  />
                </div>

                {/* Highlights */}
                <div>
                  <label className="block font-semibold text-[#351202] mb-1">Highlights (One per line)</label>
                  <textarea
                    rows={2}
                    value={formData.highlightsInput}
                    onChange={(e) => setFormData({ ...formData, highlightsInput: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#EADBBA] bg-white text-[#351202]"
                  />
                </div>

                {/* Inclusions & Exclusions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-emerald-800 mb-1">Inclusions (One per line)</label>
                    <textarea
                      rows={3}
                      value={formData.inclusionsInput}
                      onChange={(e) => setFormData({ ...formData, inclusionsInput: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-emerald-200 bg-white text-[#351202]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-rose-800 mb-1">Exclusions (One per line)</label>
                    <textarea
                      rows={3}
                      value={formData.exclusionsInput}
                      onChange={(e) => setFormData({ ...formData, exclusionsInput: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-rose-200 bg-white text-[#351202]"
                    />
                  </div>
                </div>

                {/* Day-by-Day Itinerary */}
                <div>
                  <label className="block font-semibold text-[#351202] mb-1">
                    Day-by-Day Itinerary (Format: Title | Meals | Description)
                  </label>
                  <textarea
                    rows={4}
                    value={formData.itineraryText}
                    onChange={(e) => setFormData({ ...formData, itineraryText: e.target.value })}
                    placeholder="Day 1: Arrival | Dinner | Welcome to destination..."
                    className="w-full px-3 py-2 rounded-xl border border-[#EADBBA] bg-white text-[#351202]"
                  />
                </div>

                {/* Submit Buttons */}
                <div className="pt-4 border-t border-[#EADBBA] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditorOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-[#EADBBA] text-[#351202] hover:bg-[#FDF7E7]"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#351202] hover:bg-[#4D1D05] text-white font-semibold shadow-md flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4 text-[#DB9309]" />
                    Save Tour Package
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

