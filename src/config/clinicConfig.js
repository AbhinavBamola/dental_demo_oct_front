/**
 * Centralized Clinic Configuration
 * This configuration acts as the default fallback for "SmileCare Dental Clinic"
 * in Dehradun, Uttarakhand, India.
 *
 * For new clinics, these values can be customized here or updated dynamically
 * via the Clinic Admin Settings panel stored in MongoDB.
 */

export const defaultClinicConfig = {
  clinicId: 'smilecare-dehradun',
  name: 'SmileCare Dental Clinic',
  tagline: 'Gentle Care, Confident Smiles',
  description:
    'Comprehensive, gentle, and modern dental care delivered by experienced specialists using state-of-the-art sterile technology in Dehradun.',
  phone: '+91 98765 43210',
  whatsapp: '+91 98765 43210',
  email: 'contact@smilecaredental.in',
  address: {
    street: 'Shop 14-15, Rajpur Heights, Rajpur Road',
    area: 'Near Jakhan Flyover',
    city: 'Dehradun',
    state: 'Uttarakhand',
    pincode: '248001',
    country: 'India',
  },
  openingHours: {
    weekdays: 'Mon – Sat: 9:00 AM – 7:30 PM',
    sunday: 'Sunday: 10:00 AM – 2:00 PM (By Appointment)',
    openTime: '09:00',
    closeTime: '19:30',
    lunchStart: '13:30',
    lunchEnd: '14:30',
    slotIntervalMinutes: 30,
  },
  googleMapsUrl: 'https://maps.google.com/?q=Rajpur+Road+Dehradun+Uttarakhand',
  googleMapsEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110204.74637233633!2d77.94709395279611!3d30.325564567406195!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390929c356c888af%3A0x4c3562c032518799!2sDehradun%2C%20Uttarakhand!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
  socialLinks: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    whatsapp: 'https://wa.me/919876543210',
  },
  theme: {
    primaryColor: '#0284C7',
    secondaryColor: '#0B2545',
    accentColor: '#0D9488',
  },
  heroBadge: 'Trusted Dental Care in Dehradun',
  heroHeadline: 'Confident Smiles Start Here.',
  heroSubtext:
    'Comprehensive dental care delivered with modern technology, experienced professionals, and a gentle, patient-first approach.',
  trustStats: [
    { label: 'Experienced Care', value: '12+ Years Clinical Excellence' },
    { label: 'Sterile Environment', value: '100% Autoclaved Equipment' },
    { label: 'Comfortable Care', value: 'Painless Procedures' },
  ],
};

/**
 * Generate a pre-filled WhatsApp link with clinic number and text
 */
export const getWhatsAppLink = (phone, text = '') => {
  const cleanPhone = (phone || defaultClinicConfig.whatsapp).replace(/\D/g, '');
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${cleanPhone}${encodedText ? `?text=${encodedText}` : ''}`;
};
