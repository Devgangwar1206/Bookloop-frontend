import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Edit3,
  Check,
  BookOpen,
  Heart,
  ShoppingBag,
  ArrowLeftRight,
  Tag,
  Calendar,
  Sparkles,
  ExternalLink,
  Lock,
  CheckCircle2,
  Camera,
  Upload,
  Image as ImageIcon,
  AlertCircle,
  RotateCcw,
  Loader2,
  X
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { userApi } from '../services/userApi';
import { bookApi } from '../services/bookApi';
import { offerApi } from '../services/offerApi';
import { exchangeApi } from '../services/exchangeApi';
import { SellerBadge } from '../components/common/SellerBadge';
import { Modal } from '../components/common/Modal';
import { useToast } from '../context/ToastContext';
import { CITIES } from '../data/mockData';

export const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=160&auto=format&fit=crop&q=80';

export function UserProfilePage() {
  const { user, isAuthenticated, updateProfile } = useAuth();
  const { addToast } = useToast();

  const [profile, setProfile] = useState(null);

  const [stats, setStats] = useState({
    listingsCount: 0,
    savedCount: 0,
    ordersCount: 0,
    exchangesCount: 0,
    offersCount: 0
  });

  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Photo change state
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [photoError, setPhotoError] = useState('');
  const [isSavingPhoto, setIsSavingPhoto] = useState(false);

  const fileInputRef = useRef(null);

  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
    city: '',
    pincode: ''
  });

  // ============================================================
  // LOAD REAL USER PROFILE + STATS
  // ============================================================

  useEffect(() => {
    let isMounted = true;

    const loadProfileData = async () => {
      try {
        const data = await userApi.getProfile();

        if (!isMounted) return;

        if (!data) {
          throw new Error('Profile data not received');
        }

        setProfile(data);

        setEditForm({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          bio: data.bio || '',
          location: data.location || '',
          city: data.city || '',
          pincode: data.pincode || ''
        });
      } catch (err) {
        console.error('Failed to load profile:', err);

        if (isMounted) {
          addToast(
            err?.message || 'Failed to load profile information',
            'error'
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProfileData();

    // ============================================================
    // LOAD USER'S BOOK LISTINGS
    // ============================================================

    bookApi.getMyBooks()
      .then((myBooks) => {
        if (isMounted && Array.isArray(myBooks)) {
          setStats(prev => ({
            ...prev,
            listingsCount: myBooks.length
          }));
        }
      })
      .catch((err) => {
        console.error('Failed to load my books:', err);
      });

    // ============================================================
    // LOAD FAVORITES
    // ============================================================

    bookApi.getFavorites()
      .then((favs) => {
        if (isMounted && Array.isArray(favs)) {
          setStats(prev => ({
            ...prev,
            savedCount: favs.length
          }));
        }
      })
      .catch((err) => {
        console.error('Failed to load favorites:', err);
      });

    // ============================================================
    // LOAD RECEIVED OFFERS
    // ============================================================

    offerApi.getOffersReceived()
      .then((offers) => {
        if (isMounted && Array.isArray(offers)) {
          const pendingOffers = offers.filter(
            offer =>
              String(offer.status || '').toUpperCase() === 'PENDING'
          );

          setStats(prev => ({
            ...prev,
            offersCount: pendingOffers.length
          }));
        }
      })
      .catch((err) => {
        console.error('Failed to load received offers:', err);
      });

    // ============================================================
    // LOAD EXCHANGE REQUESTS
    // ============================================================

    exchangeApi.getExchangeRequests()
      .then((exchanges) => {
        if (isMounted && Array.isArray(exchanges)) {
          const pendingExchanges = exchanges.filter(
            ex =>
              String(ex.status || '').toUpperCase() === 'PENDING'
          );

          setStats(prev => ({
            ...prev,
            exchangesCount: pendingExchanges.length
          }));
        }
      })
      .catch((err) => {
        console.error('Failed to load exchanges:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [user, addToast]);

  // ============================================================
  // SAVE PROFILE
  // ============================================================

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    try {
      const updated = await userApi.updateProfile({
        name: editForm.name,
        phone: editForm.phone,
        city: editForm.city,
        location: editForm.location,
        pincode: editForm.pincode,
        bio: editForm.bio
      });

      setProfile(updated);

      if (updateProfile) {
        await updateProfile(updated);
      }

      setIsEditModalOpen(false);

      addToast(
        'Profile updated successfully!',
        'success'
      );
    } catch (err) {
      console.error('Failed to save profile:', err);

      addToast(
        err?.message || 'Failed to save profile changes',
        'error'
      );
    }
  };

  // ============================================================
  // PROFILE PHOTO MODAL
  // ============================================================

  const handleOpenPhotoModal = () => {
    if (!isAuthenticated && !user) {
      addToast(
        'Please login to change your profile photo',
        'error'
      );
      return;
    }

    setPreviewImage(null);
    setSelectedFile(null);
    setPhotoError('');
    setIsPhotoModalOpen(true);
  };

  // ============================================================
  // SELECT PHOTO
  // ============================================================

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];

    setPhotoError('');

    if (!file) return;

    // Validate file type
    const validTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/jpg'
    ];

    const extension = file.name
      .split('.')
      .pop()
      ?.toLowerCase();

    const validExtensions = [
      'jpg',
      'jpeg',
      'png',
      'webp'
    ];

    if (
      !validTypes.includes(file.type) &&
      !validExtensions.includes(extension)
    ) {
      setPhotoError(
        'Invalid image format. Only JPG, PNG, JPEG, and WEBP files are allowed.'
      );

      setSelectedFile(null);
      setPreviewImage(null);

      return;
    }

    // Max 5 MB
    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      setPhotoError(
        `File is too large (${(
          file.size /
          (1024 * 1024)
        ).toFixed(1)} MB). Maximum allowed size is 5 MB.`
      );

      setSelectedFile(null);
      setPreviewImage(null);

      return;
    }

    setSelectedFile(file);

    // Compress & Preview
    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const MAX_DIM = 400;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_DIM) {
              height = Math.round((height * MAX_DIM) / width);
              width = MAX_DIM;
            }
          } else {
            if (height > MAX_DIM) {
              width = Math.round((width * MAX_DIM) / height);
              height = MAX_DIM;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          const compressed = canvas.toDataURL('image/jpeg', 0.85);
          setPreviewImage(compressed);
        } catch (e) {
          // Fallback to uncompressed if canvas throws
          setPreviewImage(reader.result);
        }
      };

      img.onerror = () => {
        setPhotoError('Failed to read image file. Please try another image.');
      };

      img.src = reader.result;
    };

    reader.onerror = () => {
      setPhotoError(
        'Failed to read image file. Please try another image.'
      );
    };

    reader.readAsDataURL(file);
  };

  // ============================================================
  // SAVE PROFILE PHOTO
  // ============================================================

  const handleSavePhoto = async () => {
    if (!previewImage) {
      setPhotoError(
        'Please select a photo to upload'
      );
      return;
    }

    try {
      setIsSavingPhoto(true);
      setPhotoError('');

      const updated = await userApi.updateAvatar(
        previewImage
      );

      if (updateProfile) {
        await updateProfile({
          avatar: previewImage
        });
      }

      setProfile(prev => ({
        ...(prev || {}),
        ...(updated || {}),
        avatar: previewImage
      }));

      setIsSavingPhoto(false);
      setIsPhotoModalOpen(false);
      setSelectedFile(null);
      setPreviewImage(null);

      addToast(
        'Profile photo updated successfully!',
        'success'
      );
    } catch (err) {
      console.error(
        'Failed to save profile photo:',
        err
      );

      setIsSavingPhoto(false);

      setPhotoError(
        err?.message ||
        'Failed to upload photo. Please try again.'
      );

      addToast(
        'Error saving profile photo',
        'error'
      );
    }
  };

  // ============================================================
  // RESET PROFILE PHOTO
  // ============================================================

  const handleResetToDefault = async () => {
    const defaultAvatar = DEFAULT_AVATAR;

    try {
      setIsSavingPhoto(true);

      await userApi.updateAvatar(
        defaultAvatar
      );

      if (updateProfile) {
        await updateProfile({
          avatar: defaultAvatar
        });
      }

      setProfile(prev => ({
        ...(prev || {}),
        avatar: defaultAvatar
      }));

      setIsSavingPhoto(false);
      setIsPhotoModalOpen(false);

      addToast(
        'Profile photo reset to default',
        'info'
      );
    } catch (err) {
      console.error(
        'Failed to reset photo:',
        err
      );

      setIsSavingPhoto(false);

      addToast(
        'Failed to reset photo',
        'error'
      );
    }
  };

  // ============================================================
  // MEMBER SINCE
  // ============================================================

  const formatMemberSince = (createdAt) => {
    if (!createdAt) {
      return 'Not available';
    }

    const date = new Date(createdAt);

    if (Number.isNaN(date.getTime())) {
      return 'Not available';
    }

    return date.toLocaleDateString(
      'en-IN',
      {
        month: 'short',
        year: 'numeric'
      }
    );
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="h-44 bg-white rounded-3xl border border-slate-200 animate-pulse" />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div
                key={i}
                className="h-24 bg-white rounded-2xl border border-slate-200 animate-pulse"
              />
            ))}
          </div>

          <div className="h-64 bg-white rounded-3xl border border-slate-200 animate-pulse" />
        </div>
      </div>
    );
  }

  // No fake CURRENT_USER fallback anymore
  const currentProfile = profile || user || {};

  return (
    <div className="min-h-screen bg-slate-50/70 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* ======================================================== */}
        {/* PROFILE HERO HEADER CARD */}
        {/* ======================================================== */}

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">

          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-50/60 via-amber-50/30 to-transparent rounded-full blur-3xl -z-0 pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">

            <div className="flex items-center gap-5">

              {/* Profile Avatar */}
              <div className="relative group shrink-0">
                <img
                  src={
                    currentProfile.avatar ||
                    DEFAULT_AVATAR
                  }
                  alt={currentProfile.name || 'Profile'}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white shadow-md ring-2 ring-indigo-500/20"
                />

                <button
                  type="button"
                  onClick={handleOpenPhotoModal}
                  className="absolute bottom-0 right-0 p-2 rounded-full bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md transition-transform active:scale-95 cursor-pointer border-2 border-white"
                  title="Change Profile Photo"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              <div>

                <div className="flex items-center gap-2.5 flex-wrap">

                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                    {currentProfile.name || 'User'}
                  </h1>

                  {/* Verified Member Badge */}
                  {currentProfile.verified && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Verified Member
                    </span>
                  )}

                  {/* Top Reader */}
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    Top Reader
                  </span>

                </div>

                <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-md line-clamp-2">
                  {currentProfile.bio || 'No bio added yet.'}
                </p>

                <div className="flex items-center gap-3 text-xs text-slate-500 mt-2.5 flex-wrap">

                  <span className="flex items-center gap-1 font-medium text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-indigo-600" />

                    <span>
                      {currentProfile.city ||
                        currentProfile.location ||
                        'Not provided'}
                    </span>
                  </span>

                  <span className="text-slate-300">·</span>

                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />

                    <span>
                      Joined{' '}
                      {formatMemberSince(
                        currentProfile.createdAt
                      )}
                    </span>
                  </span>

                </div>

                <div className="mt-2.5">
                  <button
                    type="button"
                    onClick={handleOpenPhotoModal}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Change Photo</span>
                  </button>
                </div>

              </div>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto flex-wrap">

              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs shadow-indigo-600/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>

              <Link
                to="/dashboard/listings"
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center gap-1.5 transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5 text-slate-600" />
                <span>My Bookshelf</span>
              </Link>

            </div>

          </div>
        </div>

        {/* ======================================================== */}
        {/* QUICK STATS */}
        {/* ======================================================== */}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

          <Link
            to="/dashboard/listings"
            className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 hover:border-emerald-300 transition-all hover:shadow-xs group"
          >
            <div className="flex items-center justify-between text-emerald-800">
              <span className="text-xs font-bold uppercase tracking-wider">
                Books Listed
              </span>

              <BookOpen className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
            </div>

            <div className="text-2xl sm:text-3xl font-bold font-sans text-emerald-950 mt-2">
              {stats.listingsCount}
            </div>

            <div className="text-[11px] text-emerald-700 mt-0.5">
              Manage listings & prices →
            </div>
          </Link>

          <Link
            to="/dashboard/offers"
            className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 hover:border-amber-300 transition-all hover:shadow-xs group"
          >
            <div className="flex items-center justify-between text-amber-800">
              <span className="text-xs font-bold uppercase tracking-wider">
                Price Offers
              </span>

              <Tag className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
            </div>

            <div className="text-2xl sm:text-3xl font-bold font-sans text-amber-950 mt-2">
              {stats.offersCount}
            </div>

            <div className="text-[11px] text-amber-700 mt-0.5">
              Pending buyer bargains →
            </div>
          </Link>

          <Link
            to="/dashboard/exchanges"
            className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200/80 hover:border-teal-300 transition-all hover:shadow-xs group"
          >
            <div className="flex items-center justify-between text-teal-800">
              <span className="text-xs font-bold uppercase tracking-wider">
                Book Swaps
              </span>

              <ArrowLeftRight className="w-4 h-4 text-teal-600 group-hover:scale-110 transition-transform" />
            </div>

            <div className="text-2xl sm:text-3xl font-bold font-sans text-teal-950 mt-2">
              {stats.exchangesCount}
            </div>

            <div className="text-[11px] text-teal-700 mt-0.5">
              Active exchange proposals →
            </div>
          </Link>

          <Link
            to="/favorites"
            className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200/80 hover:border-rose-300 transition-all hover:shadow-xs group"
          >
            <div className="flex items-center justify-between text-rose-800">
              <span className="text-xs font-bold uppercase tracking-wider">
                Saved Wishlist
              </span>

              <Heart className="w-4 h-4 text-rose-600 group-hover:scale-110 transition-transform" />
            </div>

            <div className="text-2xl sm:text-3xl font-bold font-sans text-rose-950 mt-2">
              {stats.savedCount}
            </div>

            <div className="text-[11px] text-rose-700 mt-0.5">
              View saved books →
            </div>
          </Link>

        </div>

        {/* ======================================================== */}
        {/* PROFILE DETAILS */}
        {/* ======================================================== */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Left: Contact & Location */}
          <div className="md:col-span-1 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">

            <h2 className="font-serif text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Account Details
            </h2>

            <div className="space-y-4 text-xs">

              <div>
                <span className="text-slate-400 font-semibold uppercase tracking-wider">
                  Email Address
                </span>

                <div className="font-medium text-slate-800 mt-1 flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />

                  <span className="truncate">
                    {currentProfile.email || 'Not provided'}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-semibold uppercase tracking-wider">
                  Phone / WhatsApp
                </span>

                <div className="font-medium text-slate-800 mt-1 flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />

                  <span>
                    {currentProfile.phone || 'Not provided'}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-semibold uppercase tracking-wider">
                  Preferred City
                </span>

                <div className="font-medium text-slate-800 mt-1 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />

                  <span>
                    {currentProfile.city || 'Not provided'}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-semibold uppercase tracking-wider">
                  Pickup Landmark
                </span>

                <div className="font-medium text-slate-800 mt-1">
                  {currentProfile.location || 'Not provided'}
                </div>
              </div>

            </div>

            <div className="pt-4 border-t border-slate-100">

              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                className="w-full py-2 px-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition-colors cursor-pointer"
              >
                Update Contact Info
              </button>

            </div>

          </div>

          {/* Right */}
          <div className="md:col-span-2 space-y-6">

            {/* Quick Actions */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">

              <h2 className="font-serif text-base font-bold text-slate-900 mb-4">
                Marketplace Management
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                <Link
                  to="/sell"
                  className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all flex items-center gap-3 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                    +
                  </div>

                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      List Another Book
                    </div>

                    <div className="text-[11px] text-slate-500">
                      Sell or propose swap
                    </div>
                  </div>
                </Link>

                <Link
                  to="/chat"
                  className="p-4 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/30 transition-all flex items-center gap-3 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                    💬
                  </div>

                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      Buyer Inquiries
                    </div>

                    <div className="text-[11px] text-slate-500">
                      Respond to chats & offers
                    </div>
                  </div>
                </Link>

                <Link
                  to="/dashboard/orders"
                  className="p-4 rounded-2xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/30 transition-all flex items-center gap-3 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                    📦
                  </div>

                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      Orders & Fulfillment
                    </div>

                    <div className="text-[11px] text-slate-500">
                      Tracking and delivery steps
                    </div>
                  </div>
                </Link>

                <Link
                  to="/settings"
                  className="p-4 rounded-2xl border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-all flex items-center gap-3 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                    ⚙️
                  </div>

                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      Account Settings
                    </div>

                    <div className="text-[11px] text-slate-500">
                      Security & notification rules
                    </div>
                  </div>
                </Link>

              </div>
            </div>

            {/* Safety */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-3xl p-5 border border-red-200/80 shadow-xs flex items-start gap-4">

              <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-red-600/20">
                <Lock className="w-5 h-5" />
              </div>

              <div className="text-xs">

                <div className="font-bold text-red-950 text-sm">
                  BookLoop Buyer & Seller Protection
                </div>

                <p className="text-red-900/80 mt-1 leading-relaxed">
                  Never wire money off-platform. Inspect physical condition, pages, and ISBN in person before handing over payment or books.
                </p>

              </div>

            </div>

          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* CHANGE PROFILE PHOTO MODAL */}
      {/* ======================================================== */}

      <Modal
        isOpen={isPhotoModalOpen}
        onClose={() => {
          if (!isSavingPhoto) {
            setIsPhotoModalOpen(false);
            setPreviewImage(null);
            setSelectedFile(null);
            setPhotoError('');
          }
        }}
        title="Change Profile Photo"
      >

        <div className="space-y-5">

          <p className="text-xs text-slate-500">
            Upload a clear photo of yourself. Supported formats: JPG, PNG, JPEG, or WEBP (Max 5 MB).
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-3 bg-slate-50 rounded-2xl border border-slate-100 p-4">

            {/* Current Photo */}
            <div className="flex flex-col items-center gap-2">

              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Current Photo
              </span>

              <img
                src={
                  currentProfile.avatar ||
                  DEFAULT_AVATAR
                }
                alt="Current profile"
                className="w-20 h-20 rounded-full object-cover border-2 border-slate-300 shadow-xs"
              />

            </div>

            {previewImage && (
              <div className="text-indigo-600 font-bold text-sm">
                →
              </div>
            )}

            {/* New Preview */}
            {previewImage ? (
              <div className="flex flex-col items-center gap-2">

                <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  New Preview
                </span>

                <div className="relative">

                  <img
                    src={previewImage}
                    alt="New profile preview"
                    className="w-24 h-24 rounded-full object-cover border-4 border-indigo-600 shadow-md ring-4 ring-indigo-100 animate-in fade-in zoom-in-95 duration-200"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      setPreviewImage(null);
                      setSelectedFile(null);

                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                    className="absolute -top-1 -right-1 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-xs cursor-pointer"
                    title="Remove selected photo"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>

                </div>

                {selectedFile && (
                  <span className="text-[11px] text-slate-500 max-w-[150px] truncate text-center">
                    {selectedFile.name} (
                    {(selectedFile.size / 1024).toFixed(0)}
                    KB)
                  </span>
                )}

              </div>
            ) : (
              <div className="flex flex-col items-center justify-center w-24 h-24 rounded-full border-2 border-dashed border-slate-300 bg-white text-slate-400 text-xs">

                <ImageIcon className="w-6 h-6 mb-1 text-slate-300" />

                <span>
                  No selection
                </span>

              </div>
            )}

          </div>

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/jpeg,image/png,image/jpg,image/webp,.jpg,.jpeg,.png,.webp"
            className="hidden"
          />

          {/* Upload Area */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-indigo-300 hover:border-indigo-500 bg-indigo-50/40 hover:bg-indigo-50/70 transition-all rounded-2xl p-6 text-center cursor-pointer group"
          >

            <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6" />
            </div>

            <div className="text-sm font-bold text-slate-800">
              {previewImage
                ? 'Choose a different photo'
                : 'Click to browse & select image'}
            </div>

            <p className="text-xs text-slate-500 mt-1">
              PNG, JPG, JPEG, or WEBP up to 5 MB
            </p>

          </div>

          {/* Error */}
          {photoError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium flex items-center gap-2">

              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />

              <span>
                {photoError}
              </span>

            </div>
          )}

          {/* Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">

            <button
              type="button"
              onClick={handleResetToDefault}
              disabled={isSavingPhoto}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />

              <span>
                Reset to default photo
              </span>
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto">

              <button
                type="button"
                onClick={() => {
                  setIsPhotoModalOpen(false);
                  setPreviewImage(null);
                  setSelectedFile(null);
                  setPhotoError('');
                }}
                disabled={isSavingPhoto}
                className="flex-1 sm:flex-initial px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSavePhoto}
                disabled={!previewImage || isSavingPhoto}
                className={`flex-1 sm:flex-initial px-5 py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer ${
                  !previewImage || isSavingPhoto
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-amber-500 hover:bg-amber-600 active:scale-98 text-slate-950 shadow-amber-500/20'
                }`}
              >

                {isSavingPhoto ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>
                      Saving Photo...
                    </span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>
                      Upload & Save Photo
                    </span>
                  </>
                )}

              </button>

            </div>
          </div>

        </div>
      </Modal>

      {/* ======================================================== */}
      {/* EDIT PROFILE MODAL */}
      {/* ======================================================== */}

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Profile Information"
      >

        <form
          onSubmit={handleSaveProfile}
          className="space-y-4"
        >

          <div>

            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Full Name *
            </label>

            <input
              type="text"
              value={editForm.name}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  name: e.target.value
                })
              }
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-medium"
              required
            />

          </div>

          <div>

            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Bio & Reading Interests
            </label>

            <textarea
              rows={3}
              value={editForm.bio}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  bio: e.target.value
                })
              }
              placeholder="e.g. CS Student. Love reading sci-fi, philosophy, and software engineering..."
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

            <div>

              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                City *
              </label>

              <select
                value={editForm.city}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    city: e.target.value
                  })
                }
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-medium"
              >

                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}

              </select>

            </div>

            <div>

              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Area / Metro Landmark *
              </label>

              <input
                type="text"
                value={editForm.location}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    location: e.target.value
                  })
                }
                placeholder="e.g. Sector 62, Near Metro Station"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-medium"
                required
              />

            </div>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

            <div>

              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Phone Number
              </label>

              <input
                type="text"
                value={editForm.phone}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    phone: e.target.value
                  })
                }
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-medium"
              />

            </div>

            <div>

              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Pincode
              </label>

              <input
                type="text"
                value={editForm.pincode}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    pincode: e.target.value
                  })
                }
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-medium"
              />

            </div>

          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-100">

            <button
              type="button"
              onClick={() => {
                setIsEditModalOpen(false);
                setIsPhotoModalOpen(true);
              }}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>
                Change Photo instead
              </span>
            </button>

            <div className="flex items-center gap-2">

              <button
                type="button"
                onClick={() =>
                  setIsEditModalOpen(false)
                }
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs shadow-indigo-600/20 transition-colors cursor-pointer"
              >
                Save Profile Changes
              </button>

            </div>
          </div>

        </form>
      </Modal>

    </div>
  );
}

export default UserProfilePage;