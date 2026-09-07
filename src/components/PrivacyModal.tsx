import React from 'react';
import { X, Shield } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      id="privacy-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="privacy-modal-container"
        className="relative w-full max-w-2xl bg-[#1a1c1f] border border-[#44474a] rounded-xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-5 right-5 p-1.5 text-[#8e9195] hover:text-white rounded-lg bg-[#111316] border border-[#44474a]/40 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 font-mono text-xs text-[#8e9195] mb-2">
          <Shield className="w-4 h-4 text-white" />
          <span>PRIVACY &amp; DATA SECURITY</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight uppercase mb-4">
          Privacy Policy
        </h3>

        <div className="space-y-4 text-xs sm:text-sm text-[#c5c6cb] leading-relaxed font-sans">
          <p>
            <strong className="text-white">1. Strict Confidentiality:</strong> We never share, sell, or disclose your project details, source code, research thesis, or personal contact info.
          </p>
          <p>
            <strong className="text-white">2. Full Data Protection:</strong> Your dataset, files, and intellectual property remain 100% yours. We never use your project assets for unauthorized purposes.
          </p>
          <p>
            <strong className="text-white">3. Secure File Delivery:</strong> All source code, CAD files, and databases are delivered directly and securely to you upon project handover.
          </p>
          <p>
            <strong className="text-white">4. Post-Project Cleanup:</strong> We delete temporary project copies from our workspace upon your confirmation and signoff.
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-[#44474a]/30 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold bg-white text-[#161c22] rounded hover:bg-[#dde3eb] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
