import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Sparkles,
  Clock,
  IndianRupee,
  CheckCircle2,
  AlertCircle,
  X,
  Save,
  Tag,
} from 'lucide-react';
import { fetchServices, adminCreateService, adminUpdateService, adminDeleteService, getErrorMessage } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';

const ServicesManagement = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null); // null for Add, object for Edit

  // Form Fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState('General Dentistry');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [priceStartingAt, setPriceStartingAt] = useState(500);
  const [shortDescription, setShortDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadServicesList = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const data = await fetchServices();
      setServices(data || []);
    } catch (err) {
      setErrorMsg(getErrorMessage(err, 'Failed to fetch services list.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServicesList();
  }, []);

  const handleOpenAddModal = () => {
    setEditingService(null);
    setName('');
    setCategory('General Dentistry');
    setDurationMinutes(30);
    setPriceStartingAt(500);
    setShortDescription('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (service) => {
    setEditingService(service);
    setName(service.name || '');
    setCategory(service.category || 'General Dentistry');
    setDurationMinutes(service.durationMinutes || 30);
    setPriceStartingAt(service.priceStartingAt || 500);
    setShortDescription(service.shortDescription || '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!name.trim() || !shortDescription.trim()) {
      setErrorMsg('Service Name and Short Description are required.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        name: name.trim(),
        category: category.trim(),
        durationMinutes: Number(durationMinutes),
        priceStartingAt: Number(priceStartingAt),
        shortDescription: shortDescription.trim(),
      };

      if (editingService) {
        await adminUpdateService(editingService._id, payload);
        setSuccessMsg(`Service "${name}" updated successfully!`);
      } else {
        await adminCreateService(payload);
        setSuccessMsg(`New service "${name}" added successfully!`);
      }

      setIsModalOpen(false);
      loadServicesList();
    } catch (err) {
      setErrorMsg(getErrorMessage(err, 'Failed to save service.'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (service) => {
    if (!window.confirm(`Are you sure you want to remove the service "${service.name}"?`)) {
      return;
    }

    try {
      setErrorMsg(null);
      setSuccessMsg(null);
      await adminDeleteService(service._id);
      setSuccessMsg(`Service "${service.name}" removed successfully.`);
      loadServicesList();
    } catch (err) {
      setErrorMsg(getErrorMessage(err, 'Failed to delete service.'));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-card">
        <div>
          <h2 className="text-xl font-extrabold text-navy-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-sky-600" />
            <span>Clinic Services & Pricing Management</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Add new treatments, modify prices, update service durations, or remove obsolete services.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs shadow-md transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4 text-sky-400" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Alerts */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Services List Grid */}
      {loading ? (
        <div className="py-16">
          <LoadingSpinner text="Loading service catalog..." />
        </div>
      ) : services.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 text-slate-500 text-xs space-y-3">
          <p>No services found in the catalog.</p>
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2 bg-navy-900 text-white font-bold rounded-xl text-xs"
          >
            Create First Service
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <div
              key={service._id}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-card hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-200/60">
                    {service.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditModal(service)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-navy-900 hover:bg-slate-100 transition-colors"
                      title="Edit Service & Pricing"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(service)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Remove Service"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-navy-900">{service.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {service.shortDescription}
                  </p>
                </div>
              </div>

              {/* Price & Duration Badge */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-1 text-slate-600">
                  <Clock className="w-3.5 h-3.5 text-sky-600" />
                  <span>~{service.durationMinutes} mins</span>
                </div>

                <div className="text-emerald-700 font-extrabold text-sm">
                  ₹{service.priceStartingAt?.toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Service Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-fadeIn">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <h3 className="text-xl font-extrabold text-navy-900">
                {editingService ? 'Edit Dental Service & Price' : 'Add New Dental Service'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Update treatment pricing, duration, and details visible to patients.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Service Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Service Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Laser Teeth Whitening"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-navy-900 focus:outline-none focus:border-navy-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Category */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-navy-900 focus:outline-none focus:border-navy-900 bg-white"
                  >
                    <option value="General Dentistry">General Dentistry</option>
                    <option value="Cosmetic Dentistry">Cosmetic Dentistry</option>
                    <option value="Endodontics">Endodontics (Root Canal)</option>
                    <option value="Implantology">Implantology</option>
                    <option value="Prosthodontics">Prosthodontics (Crowns & Bridges)</option>
                    <option value="Orthodontics">Orthodontics (Braces / Aligners)</option>
                    <option value="Pediatric Dentistry">Pediatric Dentistry</option>
                  </select>
                </div>

                {/* Duration */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Duration (Minutes)</label>
                  <input
                    type="number"
                    required
                    min={10}
                    step={5}
                    placeholder="30"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-navy-900 focus:outline-none focus:border-navy-900"
                  />
                </div>
              </div>

              {/* Price Starting At */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Price Starting At (₹ INR)</label>
                <input
                  type="number"
                  required
                  min={0}
                  step={50}
                  placeholder="1500"
                  value={priceStartingAt}
                  onChange={(e) => setPriceStartingAt(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-navy-900 focus:outline-none focus:border-navy-900"
                />
              </div>

              {/* Short Description */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Short Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Brief summary of the dental treatment..."
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-navy-900 focus:outline-none focus:border-navy-900 resize-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs shadow-md transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingService ? 'Save Changes' : 'Create Service'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesManagement;
