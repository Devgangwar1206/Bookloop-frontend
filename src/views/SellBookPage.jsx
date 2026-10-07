import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, 
  Upload, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  Eye, 
  Sparkles, 
  ArrowLeftRight, 
  DollarSign, 
  Tag,
  AlertCircle
} from 'lucide-react';
import { CATEGORIES, CITIES } from '../data/mockData';
import { bookApi } from '../services/bookApi';
import { useMarketplace } from '../context/MarketplaceContext';
import { useToast } from '../context/ToastContext';
import { Modal } from '../components/common/Modal';


const SAMPLE_BOOK_PHOTOS = [
  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&auto=format&fit=crop&q=80'
];

export function SellBookPage() {
  const navigate = useNavigate();
  const { selectedLocation } = useMarketplace();
  const { addToast } = useToast();

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: 'Fiction',
    condition: 'Like New',
    price: '',
    negotiable: true,
    sellingOption: 'Sell', // Sell | Exchange | Both
    exchangePreferences: '',
    // Optional Details
    isbn: '',
    edition: '',
    publisher: '',
    language: 'English',
    description: '',
    location: selectedLocation || 'Noida, UP',
    delivery: 'Both'
  });

  const [images, setImages] = useState([
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80'
  ]);
  const [showOptional, setShowOptional] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddSamplePhoto = (url) => {
    if (images.length < 5) {
      setImages((prev) => [...prev, url]);
      addToast('Photo added to your book listing!', 'success', 2000);
    } else {
      addToast('Maximum 5 photos allowed', 'error');
    }
  };

  const handleRemovePhoto = (index) => {
    if (images.length <= 1) {
      addToast('At least one photo is required', 'error');
      return;
    }
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePublish = async (e) => {
    if (e) e.preventDefault();
    if (!formData.title.trim()) {
      addToast('Please enter a book title', 'error');
      return;
    }
    if (!formData.author.trim()) {
      addToast('Please specify the author', 'error');
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      addToast('Please set a valid asking price', 'error');
      return;
    }
    if (images.length === 0) {
      addToast('Please attach at least one photo', 'error');
      return;
    }

    setPublishing(true);
    try {
      const newBook = await bookApi.createBook({
        ...formData,

        price: Number(formData.price),

        originalPrice:
          Number(formData.price) > 0
            ? Number(formData.price) * 1.6
            : 0,

        images,

        listingType: 'Individual Seller',

        transactionType:
          formData.sellingOption === 'Both'
            ? 'Buy or Exchange'
            : formData.sellingOption,

        city: formData.location || 'Noida, UP'
      });

      console.log('BOOK CREATED:', newBook);

      addToast('Book listed successfully!', 'success');

      setPublishing(false);

      navigate(`/books/${newBook.id}`);

    } catch (err) {
      console.error('Publish book error:', err);
      addToast(err.message || 'Failed to publish listing', 'error');
      setPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Page Header */}
        <div className="text-center mb-8">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
            List in Under 2 Minutes
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 mt-1">
            Sell or Exchange Your Book
          </h1>
          <p className="text-slate-600 text-sm mt-1 max-w-md mx-auto">
            Give your book a second life. No listing charges, no middleman commissions.
          </p>
        </div>

        <form onSubmit={handlePublish} className="space-y-8">
          
          {/* ==================================================
              STEP 1: UPLOAD PHOTOS
              ================================================== */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-lg sm:text-xl font-bold text-slate-900">
                  Step 1: Upload Book Photos
                </h2>
                <p className="text-xs text-slate-500">
                  Add front cover, back cover, or open pages ({images.length}/5 photos)
                </p>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                Required
              </span>
            </div>

            {/* Uploaded Gallery Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 group">
                  <img src={img} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(idx)}
                    className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black text-white rounded-full transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  {idx === 0 && (
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 text-[10px] font-bold bg-white/90 rounded text-slate-900">
                      Cover
                    </span>
                  )}
                </div>
              ))}

              {/* Upload trigger button */}
              {images.length < 5 && (
                <label className="flex flex-col items-center justify-center aspect-square rounded-2xl border-2 border-dashed border-slate-300 hover:border-blue-600 bg-slate-50 hover:bg-blue-50/50 cursor-pointer transition-colors p-4 text-center">
                  <Camera className="w-6 h-6 text-slate-400 mb-2" />
                  <span className="text-xs font-semibold text-slate-700">Add Photo</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">JPG, PNG up to 10MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        const url = URL.createObjectURL(e.target.files[0]);
                        handleAddSamplePhoto(url);
                      }
                    }}
                  />
                </label>
              )}
            </div>

            {/* Quick sample cover picker */}
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[11px] text-slate-400 font-medium block mb-2">
                Or pick sample cover photos to test quickly:
              </span>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {SAMPLE_BOOK_PHOTOS.map((photo, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleAddSamplePhoto(photo)}
                    className="w-12 h-14 rounded-lg overflow-hidden border border-slate-200 shrink-0 hover:scale-105 transition-transform cursor-pointer"
                    title="Add photo"
                  >
                    <img src={photo} alt="Sample" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ==================================================
              STEP 2: BASIC INFORMATION
              ================================================== */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h2 className="font-serif text-lg sm:text-xl font-bold text-slate-900">
                  Step 2: Basic Information
                </h2>
                <p className="text-xs text-slate-500">
                  Tell potential buyers the essentials
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-1.5">
                  Book Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g. Atomic Habits, Introduction to Algorithms"
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-1.5">
                  Author Name *
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => handleInputChange('author', e.target.value)}
                  placeholder="e.g. James Clear, Cormen"
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-1.5">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Condition selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2">
                Book Condition *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'Brand New', desc: 'Unread / Sealed' },
                  { id: 'Like New', desc: 'Read once, crisp' },
                  { id: 'Used - Good', desc: 'Clean, light marks' },
                  { id: 'Acceptable', desc: 'Highlights, intact' }
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleInputChange('condition', c.id)}
                    className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                      formData.condition === c.id
                        ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-900">{c.id}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{c.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Price & Negotiable */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-1.5">
                  Your Asking Price (₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-500 font-bold">₹</span>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="e.g. 250"
                    min="1"
                    className="w-full pl-8 pr-4 py-2.5 text-lg font-bold text-slate-900 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col justify-end">
                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Negotiable Price?</span>
                    <span className="text-[11px] text-slate-500">Allow buyers to make counter offers</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.negotiable}
                    onChange={(e) => handleInputChange('negotiable', e.target.checked)}
                    className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* ==================================================
              STEP 3: SELLING / EXCHANGE OPTIONS
              ================================================== */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <h2 className="font-serif text-lg sm:text-xl font-bold text-slate-900">
              Step 3: Selling & Exchange Preferences
            </h2>

            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'Sell', title: 'Sell for Cash', icon: DollarSign },
                { id: 'Exchange', title: 'Exchange Only', icon: ArrowLeftRight },
                { id: 'Both', title: 'Sell or Exchange', icon: Tag }
              ].map((opt) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleInputChange('sellingOption', opt.id)}
                    className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                      formData.sellingOption === opt.id
                        ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600 text-blue-700'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-bold">{opt.title}</span>
                  </button>
                );
              })}
            </div>

            {/* If exchange is enabled */}
            {(formData.sellingOption === 'Exchange' || formData.sellingOption === 'Both') && (
              <div className="pt-2 animate-in fade-in duration-200">
                <label className="block text-xs font-semibold text-slate-800 uppercase tracking-wider mb-1.5">
                  What books would you exchange for?
                </label>
                <input
                  type="text"
                  value={formData.exchangePreferences}
                  onChange={(e) => handleInputChange('exchangePreferences', e.target.value)}
                  placeholder="e.g. Looking for Sci-Fi, UPSC Prelims PYQs, or Murakami novels"
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>
            )}
          </div>

          {/* ==================================================
              STEP 4: OPTIONAL DETAILS (EXPANDABLE)
              ================================================== */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <button
              type="button"
              onClick={() => setShowOptional(!showOptional)}
              className="w-full p-6 sm:p-8 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div>
                <h3 className="font-serif text-lg font-bold text-slate-900">
                  Optional Details
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  ISBN, Edition, Publisher, City, Description (You can add these later)
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                {showOptional ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            {showOptional && (
              <div className="px-6 pb-8 sm:px-8 space-y-4 pt-2 border-t border-slate-100 animate-in slide-in-from-top-2 duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      ISBN
                    </label>
                    <input
                      type="text"
                      value={formData.isbn}
                      onChange={(e) => handleInputChange('isbn', e.target.value)}
                      placeholder="978-0..."
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Edition
                    </label>
                    <input
                      type="text"
                      value={formData.edition}
                      onChange={(e) => handleInputChange('edition', e.target.value)}
                      placeholder="e.g. 3rd Edition"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Publisher
                    </label>
                    <input
                      type="text"
                      value={formData.publisher}
                      onChange={(e) => handleInputChange('publisher', e.target.value)}
                      placeholder="e.g. Penguin, Pearson"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      City / Neighborhood *
                    </label>
                    <select
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    >
                      {CITIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Delivery Option
                    </label>
                    <select
                      value={formData.delivery}
                      onChange={(e) => handleInputChange('delivery', e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    >
                      <option value="Both">Both (Pickup & Courier)</option>
                      <option value="Pickup">Handover Pickup Only</option>
                      <option value="Delivery">Courier Delivery Only</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Book Condition Notes / Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Mention if there are highlighted pages, personal notes, or dust jacket status..."
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>
              </div>
            )}
          </div>

          {/* ==================================================
              ACTION BAR
              ================================================== */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowPreviewModal(true)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-semibold bg-white border border-slate-300 text-slate-800 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Eye className="w-4 h-4 text-slate-500" />
              <span>Preview Listing</span>
            </button>

            <button
              type="submit"
              disabled={publishing}
              className="w-full sm:w-auto px-8 py-3 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-blue-200" />
              <span>{publishing ? 'Publishing...' : 'Publish Book Listing'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Preview Listing Modal */}
      <Modal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        title="Listing Preview"
        maxWidth="max-w-xl"
      >
        <div className="space-y-4">
          <div className="aspect-[16/10] bg-slate-100 rounded-xl overflow-hidden">
            <img src={images[0]} alt="Preview" className="w-full h-full object-cover" />
          </div>
          <div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              {formData.condition}
            </span>
            <h3 className="font-serif text-xl font-bold text-slate-900 mt-2">
              {formData.title || 'Untitled Book'}
            </h3>
            <p className="text-xs text-slate-600">by {formData.author || 'Author'}</p>
            <div className="text-2xl font-bold text-slate-900 mt-2">
              ₹{formData.price || '0'} {formData.negotiable && <span className="text-xs font-normal text-slate-500">(Negotiable)</span>}
            </div>
            <p className="text-xs text-slate-500 mt-1">Location: {formData.location}</p>
          </div>
          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowPreviewModal(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Back to Editing
            </button>
            <button
              type="button"
              onClick={() => {
                setShowPreviewModal(false);
                handlePublish();
              }}
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 cursor-pointer"
            >
              Publish Now
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default SellBookPage;
