import React, { useState, useEffect } from 'react';
import { 
  X, 
  Camera, 
  Loader2, 
  Save, 
  Tag, 
  BookOpen, 
  MapPin, 
  Truck, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { CATEGORIES } from '../../data/mockData';
import { bookApi } from '../../services/bookApi';
import { processImageFile } from '../../utils/imageUtils';
import { useToast } from '../../context/ToastContext';

const SAMPLE_BOOK_PHOTOS = [
  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&auto=format&fit=crop&q=80'
];

export function EditBookModal({ isOpen, onClose, book, onBookUpdated }) {
  const { addToast } = useToast();
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    price: '',
    originalPrice: '',
    condition: 'Like New',
    category: 'Fiction',
    transactionType: 'Sell',
    exchangePreferences: '',
    negotiable: true,
    city: 'Noida',
    delivery: 'Both',
    language: 'English',
    isbn: '',
    edition: '',
    publisher: '',
    description: ''
  });

  const [images, setImages] = useState([]);

  // Populate state whenever book changes
  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || '',
        author: book.author || '',
        price: book.price !== undefined ? String(book.price) : '',
        originalPrice: book.originalPrice !== undefined ? String(book.originalPrice) : '',
        condition: book.condition || 'Like New',
        category: book.category || 'Fiction',
        transactionType: book.transactionType || 'Sell',
        exchangePreferences: book.exchangePreferences || '',
        negotiable: book.negotiable !== false,
        city: book.city || book.location || 'Noida',
        delivery: book.delivery || 'Both',
        language: book.language || 'English',
        isbn: book.isbn || '',
        edition: book.edition || '',
        publisher: book.publisher || '',
        description: book.description || ''
      });

      const initialImages = Array.isArray(book.images) && book.images.length > 0
        ? [...book.images]
        : book.image
          ? [book.image]
          : ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80'];

      setImages(initialImages);
    }
  }, [book, isOpen]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDevicePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (images.length >= 5) {
      addToast('Maximum 5 photos allowed', 'error');
      return;
    }

    try {
      setUploadingPhoto(true);
      const base64Url = await processImageFile(file);
      setImages((prev) => [...prev, base64Url]);
      addToast('Device photo added!', 'success', 2000);
    } catch (err) {
      console.error('Image processing failed:', err);
      addToast(err?.message || 'Failed to process image file', 'error');
    } finally {
      setUploadingPhoto(false);
      e.target.value = '';
    }
  };

  const handleAddSamplePhoto = (url) => {
    if (images.length < 5) {
      setImages((prev) => [...prev, url]);
      addToast('Photo added!', 'success', 2000);
    } else {
      addToast('Maximum 5 photos allowed', 'error');
    }
  };

  const handleRemovePhoto = (index) => {
    if (images.length <= 1) {
      addToast('At least one photo is required for your listing', 'error');
      return;
    }
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      addToast('Please enter a book title', 'error');
      return;
    }

    if (!formData.author.trim()) {
      addToast('Please specify the author', 'error');
      return;
    }

    if (!formData.price || Number(formData.price) < 0) {
      addToast('Please enter a valid price', 'error');
      return;
    }

    if (images.length === 0) {
      addToast('At least one book photo is required', 'error');
      return;
    }

    try {
      setSaving(true);

      const payload = {
        title: formData.title.trim(),
        author: formData.author.trim(),
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : Math.round(Number(formData.price) * 1.4),
        condition: formData.condition,
        category: formData.category,
        transactionType: formData.transactionType,
        exchangePreferences: formData.exchangePreferences,
        negotiable: formData.negotiable,
        city: formData.city,
        location: formData.city,
        delivery: formData.delivery,
        language: formData.language,
        isbn: formData.isbn,
        edition: formData.edition,
        publisher: formData.publisher,
        description: formData.description,
        images: images
      };

      const updated = await bookApi.updateBook(book.id, payload);

      addToast('Book updated successfully!', 'success');
      if (typeof onBookUpdated === 'function') {
        onBookUpdated(updated);
      }
      onClose();
    } catch (err) {
      console.error('Failed to update book:', err);
      addToast(err?.message || 'Failed to update book listing', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !book) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Book Listing" maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Photos Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Book Photos ({images.length}/5)
            </label>
            <span className="text-[11px] text-slate-500">
              Cover is the first photo
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
            {images.map((img, idx) => (
              <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-50 group">
                <img src={img} alt={`Book ${idx + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemovePhoto(idx)}
                  className="absolute top-1 right-1 p-1 bg-black/70 hover:bg-black text-white rounded-full transition-colors cursor-pointer"
                  title="Remove photo"
                >
                  <X className="w-3 h-3" />
                </button>
                {idx === 0 && (
                  <span className="absolute bottom-1 left-1 px-1.5 py-0.5 text-[9px] font-bold bg-white/95 rounded text-slate-900 shadow-xs">
                    Cover
                  </span>
                )}
              </div>
            ))}

            {/* Add Photo Button */}
            {images.length < 5 && (
              <label className="flex flex-col items-center justify-center aspect-square rounded-xl border-2 border-dashed border-slate-300 hover:border-blue-600 bg-slate-50 hover:bg-blue-50/50 cursor-pointer transition-colors p-2 text-center">
                {uploadingPhoto ? (
                  <>
                    <Loader2 className="w-5 h-5 text-blue-600 mb-1 animate-spin" />
                    <span className="text-[10px] font-medium text-slate-600">Uploading...</span>
                  </>
                ) : (
                  <>
                    <Camera className="w-5 h-5 text-slate-400 mb-1" />
                    <span className="text-[11px] font-semibold text-slate-700">Add Photo</span>
                    <span className="text-[9px] text-slate-400">Device</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploadingPhoto}
                  className="hidden"
                  onChange={handleDevicePhotoUpload}
                />
              </label>
            )}
          </div>

          {/* Quick Sample Photos */}
          <div className="pt-2">
            <span className="text-[11px] text-slate-400 font-medium block mb-1.5">
              Or pick from sample cover photos:
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {SAMPLE_BOOK_PHOTOS.map((photo, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleAddSamplePhoto(photo)}
                  className="w-10 h-12 rounded-lg overflow-hidden border border-slate-200 shrink-0 hover:scale-105 transition-transform cursor-pointer"
                  title="Add sample cover"
                >
                  <img src={photo} alt="Sample" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="space-y-4 pt-2 border-t border-slate-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Book Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="e.g. Atomic Habits"
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Author Name *
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => handleChange('author', e.target.value)}
                placeholder="e.g. James Clear"
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Condition */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1.5">
              Condition *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['Brand New', 'Like New', 'Used - Good', 'Acceptable'].map((cond) => (
                <button
                  key={cond}
                  type="button"
                  onClick={() => handleChange('condition', cond)}
                  className={`p-2.5 rounded-xl text-center border text-xs font-semibold transition-all cursor-pointer ${
                    formData.condition === cond
                      ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {cond}
                </button>
              ))}
            </div>
          </div>

          {/* Price, MRP, Negotiable */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Asking Price (₹) *
              </label>
              <input
                type="number"
                min="0"
                value={formData.price}
                onChange={(e) => handleChange('price', e.target.value)}
                placeholder="e.g. 250"
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-semibold text-slate-900"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Original MRP (₹)
              </label>
              <input
                type="number"
                min="0"
                value={formData.originalPrice}
                onChange={(e) => handleChange('originalPrice', e.target.value)}
                placeholder="e.g. 500"
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            <div className="flex items-center sm:pt-6">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.negotiable}
                  onChange={(e) => handleChange('negotiable', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <span className="text-xs font-medium text-slate-700">Open to negotiation</span>
              </label>
            </div>
          </div>

          {/* Transaction Type & Delivery */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Selling Option *
              </label>
              <select
                value={formData.transactionType}
                onChange={(e) => handleChange('transactionType', e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              >
                <option value="Sell">Sell Only</option>
                <option value="Exchange">Exchange Only</option>
                <option value="Buy or Exchange">Both (Sell or Exchange)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Delivery Option *
              </label>
              <select
                value={formData.delivery}
                onChange={(e) => handleChange('delivery', e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              >
                <option value="Both">Both (Hand Delivery & Shipping)</option>
                <option value="Hand Delivery">Hand Delivery / Meetup only</option>
                <option value="Shipping">Shipping only</option>
                <option value="Free Delivery">Free Express Delivery</option>
              </select>
            </div>
          </div>

          {/* Exchange preferences if applicable */}
          {(formData.transactionType === 'Exchange' || formData.transactionType === 'Buy or Exchange') && (
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Books you want in exchange
              </label>
              <input
                type="text"
                value={formData.exchangePreferences}
                onChange={(e) => handleChange('exchangePreferences', e.target.value)}
                placeholder="e.g. Looking for psychology or sci-fi books"
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>
          )}

          {/* City / Location & Language */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Location / City *
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                placeholder="e.g. Noida, Delhi NCR"
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Language
              </label>
              <input
                type="text"
                value={formData.language}
                onChange={(e) => handleChange('language', e.target.value)}
                placeholder="e.g. English, Hindi"
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Description / Notes
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe condition, missing pages, highlights, edition details..."
              className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 resize-none"
            />
          </div>

          {/* Extra metadata: ISBN, Edition, Publisher */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                ISBN (optional)
              </label>
              <input
                type="text"
                value={formData.isbn}
                onChange={(e) => handleChange('isbn', e.target.value)}
                placeholder="978-..."
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Edition (optional)
              </label>
              <input
                type="text"
                value={formData.edition}
                onChange={(e) => handleChange('edition', e.target.value)}
                placeholder="e.g. 3rd Edition"
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Publisher (optional)
              </label>
              <input
                type="text"
                value={formData.publisher}
                onChange={(e) => handleChange('publisher', e.target.value)}
                placeholder="e.g. Penguin"
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving || uploadingPhoto}
            className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs flex items-center gap-2 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>

      </form>
    </Modal>
  );
}

export default EditBookModal;
