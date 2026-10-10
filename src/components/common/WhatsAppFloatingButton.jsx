import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';
import { getWhatsAppLink } from '../../config/clinicConfig';

const WhatsAppFloatingButton = () => {
  const { clinic } = useClinic();
  const waUrl = getWhatsAppLink(
    clinic?.whatsapp,
    `Hello ${clinic?.name || 'SmileCare Dental Clinic'}, I would like to enquire about a dental consultation.`
  );

  return (
    <aside aria-label="Quick contact" className="fixed bottom-6 right-6 z-40 group">
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-emerald-300"
        title="Chat with us on WhatsApp"
        aria-label="Chat with us on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-current" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 font-medium text-sm">
          WhatsApp Us
        </span>
      </a>
    </aside>
  );
};

export default WhatsAppFloatingButton;
