
import React from 'react';
import { ICONS, PRICING } from '../constants';

interface TermsOfUsePageProps {
  onBack: () => void;
}

const TermsOfUsePage: React.FC<TermsOfUsePageProps> = ({ onBack }) => {
  const terms = [
    {
      title: "1. Eligibility",
      content: "You must be at least 18 years of age and a resident of Kenya with a valid Safaricom M-Pesa account to use this platform."
    },
    {
      title: "2. Account Activation",
      content: `A non-refundable one-time activation fee of KES ${PRICING.SIGN_UP_FEE} is required to access the referral system and dashboard features.`
    },
    {
      title: "3. Referral Conduct",
      content: "Users are prohibited from creating multiple accounts for the purpose of self-referral. Any detected fraudulent activity will result in immediate account suspension and forfeiture of balances."
    },
    {
      title: "4. Payouts & Withdrawals",
      content: `Earnings can be withdrawn once a minimum balance of KES ${PRICING.MIN_WITHDRAWAL} is reached. While most payouts are instant, some may take up to 24 hours for system verification.`
    },
    {
      title: "5. Limitation of Liability",
      content: "EarnLink Kenya is a referral facilitation platform. We are not responsible for losses incurred due to M-Pesa network delays or user-provided incorrect phone numbers."
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
        <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Terms of Use</h1>
        <p className="text-emerald-400/60 font-mono text-sm uppercase tracking-widest">Version: 1.0.2</p>
      </header>

      <div className="glass-card rounded-[2rem] p-8 md:p-12 border border-white/5 space-y-10">
        <p className="text-emerald-100/60 leading-relaxed italic border-b border-white/5 pb-8">
          By registering an account with EarnLink Kenya, you agree to comply with the following terms and conditions.
        </p>
        
        {terms.map((term, idx) => (
          <section key={idx}>
            <h3 className="text-xl font-bold mb-4 text-emerald-400">{term.title}</h3>
            <p className="text-emerald-100/60 leading-relaxed text-sm">
              {term.content}
            </p>
          </section>
        ))}
      </div>
    </div>
  );
};

export default TermsOfUsePage;
