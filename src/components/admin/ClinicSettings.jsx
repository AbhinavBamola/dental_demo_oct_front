import React, { useState, useEffect } from 'react';
import {
  Building2,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  Save,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';
import { updateClinicConfig, getErrorMessage } from '../../services/api';

const ClinicSettings = () => {
  const { clinic, setClinic, reloadClinicData } = useClinic();

  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    description: '',
    phone: '',
    whatsapp: '',
    email: '',
    street: '',
    area: '',
    city: '',
    state: '',
    pincode: '',
    weekdays: '',
    sunday: '',
    googleMapsUrl: '',
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (clinic) {
      setFormData({
        name: clinic.name || '',
        tagline: clinic.tagline || '',
        description: clinic.description || '',
        phone: clinic.phone || '',
        whatsapp: clinic.whatsapp || '',
        email: clinic.email || '',
        street: clinic.address?.street || '',
        area: clinic.address?.area || '',
        city: clinic.address?.city || '',
        state: clinic.address?.state || '',
        pincode: clinic.address?.pincode || '',
        weekdays: clinic.openingHours?.weekdays || '',
        sunday: clinic.openingHours?.sunday || '',
        googleMapsUrl: clinic.googleMapsUrl || '',
      });
    }
  }, [clinic]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setErrorMsg(null);
      setSuccessMsg(null);

      const payload = {
        clinicId: clinic?.clinicId || 'smilecare-dehradun',
        name: formData.name,
        tagline: formData.tagline,
        description: formData.description,
        phone: formData.phone,
        whatsapp: formData.whatsapp,
        email: formData.email,
        address: {
          street: formData.street,
          area: formData.area,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          country: 'India',
        },
        openingHours: {
          ...clinic.openingHours,
          weekdays: formData.weekdays,
          sunday: formData.sunday,
        },
        googleMapsUrl: formData.googleMapsUrl,
      };

      const updated = await updateClinicConfig(payload);
      setClinic(updated);
      setSuccessMsg('Clinic settings have been updated and saved to MongoDB successfully!');
      reloadClinicData();
    } catch (err) {
      console.error('Failed to update clinic configuration:', err);
      setErrorMsg(getErrorMessage(err, 'Failed to update clinic configuration.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Intro info card */}
      <div className="bg-sky-50 border border-sky-200 rounded-2xl p-5 flex items-start gap-4">
        <Sparkles className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
        <div className="text-xs text-sky-900 leading-relaxed">
          <strong className="font-bold block text-sm mb-0.5">
            White-Label Clinic Configuration
          </strong>
          Updates made here are persisted in MongoDB and dynamically change the clinic name,
          addresses, phone numbers, WhatsApp, and timings on both the public website and the booking
          system without code rebuilds!
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: General Branding */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft space-y-5">
          <div className="border-b border-slate-100 pb-3 flex items-center gap-2 text-navy-950 font-bold text-sm">
            <Building2 className="w-4 h-4 text-sky-600" />
            <span>Clinic Identity & Brand</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Clinic Name *</label>
              <input
                type="text"
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-navy-900"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Tagline</label>
              <input
                type="text"
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-navy-900"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-slate-700">Clinic Description</label>
              <textarea
                rows={2}
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-navy-900 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Contact Information */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft space-y-5">
          <div className="border-b border-slate-100 pb-3 flex items-center gap-2 text-navy-950 font-bold text-sm">
            <Phone className="w-4 h-4 text-sky-600" />
            <span>Contact Numbers & WhatsApp</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-400" />
                <span>Calling Phone Number</span>
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-navy-900"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                <MessageCircle className="w-3 h-3 text-emerald-600" />
                <span>WhatsApp Number</span>
              </label>
              <input
                type="text"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-navy-900"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                <Mail className="w-3 h-3 text-indigo-500" />
                <span>Contact Email</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-navy-900"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Physical Address */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft space-y-5">
          <div className="border-b border-slate-100 pb-3 flex items-center gap-2 text-navy-950 font-bold text-sm">
            <MapPin className="w-4 h-4 text-sky-600" />
            <span>Clinic Address & Directions</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Street / Shop No.</label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-navy-900"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Area / Landmark</label>
              <input
                type="text"
                name="area"
                value={formData.area}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-navy-900"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-navy-900"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">State & Pincode</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-navy-900"
                />
                <input
                  type="text"
                  name="pincode"
                  placeholder="Pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-navy-900"
                />
              </div>
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-slate-700">Google Maps Link</label>
              <input
                type="url"
                name="googleMapsUrl"
                value={formData.googleMapsUrl}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-navy-900"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Operating Hours */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft space-y-5">
          <div className="border-b border-slate-100 pb-3 flex items-center gap-2 text-navy-950 font-bold text-sm">
            <Clock className="w-4 h-4 text-sky-600" />
            <span>Consultation Hours Display</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Weekday Timings</label>
              <input
                type="text"
                name="weekdays"
                value={formData.weekdays}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-navy-900"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Sunday Timings</label>
              <input
                type="text"
                name="sunday"
                value={formData.sunday}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-navy-900"
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-navy-900 hover:bg-navy-800 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all active:scale-95"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving to MongoDB...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-sky-400" />
                <span>Save Clinic Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClinicSettings;
