
import React from 'react';
import { ICONS } from '../constants';

interface PrivacyPolicyPageProps {
  onBack: () => void;
}

const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onBack }) => {
  const sections = [
    {
      title: "1. Information We Collect",
      content: "We collect information you provide directly to us, including your username, phone number (for M-Pesa integration), and referral connections. We also collect transactional data related to your earnings and withdrawals."
    },
    {
      title: "2. How We Use Your Information",
      content: "Your phone number is used exclusively for facilitating activation payments and withdrawal payouts via M-Pesa. Your username and referral data are used to build and manage your referral network and calculate rewards."
    },
    {
      title: "3. M-Pesa Data Security",
      content: "We utilize Raja SDK for M-Pesa interactions. We do not store your M-Pesa PIN. All transactional data is handled using industry-standard encryption to ensure your financial security."
    },
    {
      title: "4. Data Sharing",
      content: "EarnLink Kenya does not sell your personal data. We share information only with financial service providers (Safaricom M-Pesa) as necessary to process your transactions."
    },
    {
      title: "5. Your Rights",
      content: "You have the right to request access to your personal data, correct inaccuracies, or request account deletion. Please contact our support team for any data-related requests."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 pt-12 md:pt-20 pb-24">
      <button 
        onClick={onBack} 
        className="flex items-center gap-2 text-emerald-400 mb-8 font-bold hover:translate-x-[-4px] transition-all"
      >
        <span className="rotate-180">{ICONS.ArrowRight}</span>
        Back to Home
      </button>

      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Privacy Policy</h1>
        <p className="text-emerald-400/60 font-mono text-sm uppercase tracking-widest">Effective Date: January 1, 2025</p>
      </header>

      <div className="glass-card rounded-[2rem] p-8 md:p-12 border border-white/5 space-y-10">
        <p className="text-emerald-100/60 leading-relaxed italic border-b border-white/5 pb-8">
          At EarnLink Kenya, your privacy is our priority. This document outlines how we handle your data to provide a secure earning environment.
        </p>
        
        {sections.map((section, idx) => (
          <section key={idx}>
            <h3 className="text-xl font-bold mb-4 text-emerald-400">{section.title}</h3>
            <p className="text-emerald-100/60 leading-relaxed text-sm">
              {section.content}
            </p>
          </section>
        ))}
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
