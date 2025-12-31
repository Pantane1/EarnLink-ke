
import React, { useState } from 'react';
import { ICONS, PRICING } from '../constants';
import { ChevronDown } from 'lucide-react';

interface HowItWorksPageProps {
  onBack: () => void;
  onStart: () => void;
}

const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onBack, onStart }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const steps = [
    {
      title: "Quick Registration",
      description: `Create your account with a one-time activation fee of KES ${PRICING.SIGN_UP_FEE}. Get a KES ${PRICING.NEW_USER_BONUS} welcome bonus instantly.`,
      icon: ICONS.Wallet,
    },
    {
      title: "Get Your Link",
      description: "Access your unique referral link from your dashboard. This link tracks all your successful invites.",
      icon: ICONS.Share,
    },
    {
      title: "Share & Invite",
      description: "Send your link to friends, family, or share on social media. When they join, you start earning.",
      icon: ICONS.Users,
    },
    {
      title: "Earn Multi-Level Rewards",
      description: `Earn KES ${PRICING.DIRECT_REFERRAL} for everyone you invite directly, and KES ${PRICING.INDIRECT_REFERRAL} when your friends invite others.`,
      icon: ICONS.Stats,
    },
    {
      title: "Instant Withdrawals",
      description: `Once you reach KES ${PRICING.MIN_WITHDRAWAL}, you can withdraw your earnings directly to your M-Pesa account 24/7.`,
      icon: ICONS.Withdraw,
    },
  ];

  const faqs = [
    {
      question: "How do I activate my account?",
      answer: `To start earning, you need to pay a one-time activation fee of KES ${PRICING.SIGN_UP_FEE} via M-Pesa. This grants you access to your unique referral link and dashboard.`
    },
    {
      question: "How much exactly do I earn per invite?",
      answer: `You earn KES ${PRICING.DIRECT_REFERRAL} for every person who signs up directly using your link. If they invite someone else, you earn an additional KES ${PRICING.INDIRECT_REFERRAL} as an indirect reward.`
    },
    {
      question: "When can I withdraw my money?",
      answer: `You can request a withdrawal at any time once your balance reaches KES ${PRICING.MIN_WITHDRAWAL}. Withdrawals are processed instantly through our M-Pesa integration.`
    },
    {
      question: "Is there a limit to how many people I can invite?",
      answer: "Absolutely not! You can invite as many people as you want. There are no caps on your potential earnings."
    },
    {
      question: "What if my referral forgets to use my link?",
      answer: "Referrals are tracked through the link and unique referral codes. Ensure your friends click your link or enter your code during registration to ensure you get credited."
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 pt-12 md:pt-20 pb-24">
      <button 
        onClick={onBack} 
        className="flex items-center gap-2 text-emerald-400 mb-8 font-bold hover:translate-x-[-4px] transition-all"
      >
        <span className="rotate-180">{ICONS.ArrowRight}</span>
        Back to Home
      </button>

      <header className="mb-16 text-center md:text-left">
        <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">The EarnLink Process</h1>
        <p className="text-emerald-400/60 text-lg max-w-2xl">
          Everything you need to know about starting your earning journey with Kenya's most trusted referral network.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {steps.map((step, idx) => (
          <div key={idx} className="glass-card p-8 rounded-3xl relative group hover:bg-white/10 transition-all border-emerald-500/10 hover:border-emerald-500/30">
            <div className="absolute top-4 right-4 text-4xl font-black text-white/5 group-hover:text-emerald-500/10 transition-colors">
              0{idx + 1}
            </div>
            <div className="w-12 h-12 bg-emerald-500/20 text-emerald-500 rounded-2xl flex items-center justify-center mb-6">
              {step.icon}
            </div>
            <h3 className="text-xl font-bold mb-3">{step.title}</h3>
            <p className="text-emerald-100/60 leading-relaxed text-sm">
              {step.description}
            </p>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-[2rem] p-8 md:p-12 border-emerald-500/20 overflow-hidden relative mb-16">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none transform rotate-12 scale-150">
          {ICONS.Stats}
        </div>
        
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl font-black mb-6">Transparent Earning Structure</h2>
          <div className="space-y-6">
            <div className="flex justify-between items-center p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
              <div>
                <p className="font-bold">Direct Referral</p>
                <p className="text-xs text-emerald-400/60">When someone uses your link</p>
              </div>
              <p className="text-2xl font-black text-emerald-400">KES {PRICING.DIRECT_REFERRAL}</p>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
              <div>
                <p className="font-bold">Indirect Referral</p>
                <p className="text-xs text-emerald-400/60">When your referral invites someone</p>
              </div>
              <p className="text-2xl font-black text-emerald-400">KES {PRICING.INDIRECT_REFERRAL}</p>
            </div>

            <div className="flex justify-between items-center p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
              <div>
                <p className="font-bold">Welcome Bonus</p>
                <p className="text-xs text-emerald-400/60">Upon successful registration</p>
              </div>
              <p className="text-2xl font-black text-emerald-400">KES {PRICING.NEW_USER_BONUS}</p>
            </div>
          </div>
        </div>
      </div>

      <section className="mb-16">
        <h2 className="text-3xl font-black mb-8 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="glass-card rounded-2xl overflow-hidden border border-emerald-500/5">
              <button 
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors focus:outline-none"
              >
                <span className="font-bold text-emerald-50">{faq.question}</span>
                <ChevronDown className={`w-5 h-5 text-emerald-500 transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`} />
              </button>
              <div 
                className={`transition-all duration-300 ease-in-out overflow-hidden ${openFaq === index ? 'max-h-96' : 'max-h-0'}`}
              >
                <div className="p-6 pt-0 text-emerald-100/60 text-sm leading-relaxed border-t border-white/5">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-12 text-center">
        <button 
          onClick={onStart}
          className="px-12 py-5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black rounded-2xl transition-all shadow-xl shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-3 mx-auto"
        >
          Join Now & Start Earning {ICONS.ArrowRight}
        </button>
        <p className="mt-4 text-xs font-bold text-emerald-400/40 uppercase tracking-widest">
          No experience required • Payments via M-Pesa
        </p>
      </div>
    </div>
  );
};

export default HowItWorksPage;
