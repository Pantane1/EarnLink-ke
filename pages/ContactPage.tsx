
import React, { useState } from 'react';
import { ICONS } from '../constants.tsx';
import { Mail, MessageCircle, Send, Github, Linkedin, Twitter } from 'lucide-react';

interface ContactPageProps {
  onBack: () => void;
  addToast: (msg: string) => void;
}

const ContactPage: React.FC<ContactPageProps> = ({ onBack, addToast }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      addToast("Your message has been sent! We'll get back to you soon.");
      setFormData({ name: '', email: '', message: '' });
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 pt-12 md:pt-20 pb-24 space-y-24">
      <div>
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 text-emerald-400 mb-8 font-bold hover:translate-x-[-4px] transition-all"
        >
          <span className="rotate-180">{ICONS.ArrowRight}</span>
          Back to Home
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            <header>
              <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight text-white">Get in Touch</h1>
              <p className="text-emerald-400/60 text-lg leading-relaxed">
                Have questions about your earnings? Our Kenyan support team is ready to help you succeed.
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-card p-6 rounded-2xl border border-white/5">
                <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center mb-4">
                  <Mail className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-white mb-1">Email Support</h4>
                <p className="text-xs text-emerald-100/40 mb-3">Response within 24hrs</p>
                <a href="mailto:pantane254@gmail.com" className="text-sm font-bold text-emerald-400 hover:underline">support@earnlink.co.ke</a>
              </div>

              <div className="glass-card p-6 rounded-2xl border border-white/5">
                <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center mb-4">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-white mb-1">WhatsApp Chat</h4>
                <p className="text-xs text-emerald-100/40 mb-3">Live during business hrs</p>
                <a href="https://wa.me/254740312402" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-emerald-400 hover:underline">+254 740 312 402</a>
              </div>
            </div>

            <div className="p-8 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/10">
              <h4 className="font-bold text-emerald-400 mb-2 uppercase tracking-widest text-xs">Office Location</h4>
              <p className="text-sm text-emerald-100/60 leading-relaxed">
                Kimbo-Ruiru, <br />
                Thika, Kenya
              </p>
            </div>
          </div>

          <div className="glass-card p-8 md:p-12 rounded-[2.5rem] border border-white/10 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-emerald-400/60 ml-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-white"
                  placeholder="Your Name"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-emerald-400/60 ml-1">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-white"
                  placeholder="your@email.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-emerald-400/60 ml-1">Message</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-white resize-none"
                  placeholder="How can we help you?"
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black rounded-xl transition-all shadow-xl shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-3"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-emerald-950 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>Send Message <Send className="w-4 h-4" /></>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      <section className="relative">
        <div className="absolute inset-0 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="glass-card rounded-[3rem] p-8 md:p-16 border border-emerald-500/20 relative overflow-hidden group">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-emerald-500 rounded-[2.5rem] rotate-6 group-hover:rotate-0 transition-transform duration-700 opacity-20"></div>
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-[2.5rem] overflow-hidden border-2 border-emerald-500/30 relative z-10 shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]">
                <img 
                  src="https://ibb.co/8DZQj76v" 
                  alt="PANTANE"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left space-y-6">
              <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">The Creator</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">
                PANTANE
              </h2>
              <h3 className="text-xl md:text-2xl font-bold text-emerald-400/80">
                Full-Stack Engineer & UI/UX Specialist
              </h3>
              <p className="text-lg text-emerald-100/60 leading-relaxed max-w-2xl">
                Wamuhu Martin a visionary developer based in Kenya, dedicated to building high-performance digital ecosystems that empower local entrepreneurs. Specializing in fintech integrations and modern web architectures, I craft seamless experiences that bridge the gap between technology and community growth.
              </p>
              
              <div className="pt-6 flex flex-wrap justify-center md:justify-start gap-4">
                <a href="https://github.com/pantane1" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold hover:bg-emerald-500 hover:text-emerald-950 transition-all active:scale-95">
                  <Github className="w-4 h-4" /> GitHub
                </a>
                <a href="https://www.linkedin.com/in/pantane/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold hover:bg-emerald-500 hover:text-emerald-950 transition-all active:scale-95">
                  <Linkedin className="w-4 h-4" /> LinkedIn
                </a>
                <a href="https://x.com/pantane4" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold hover:bg-emerald-500 hover:text-emerald-950 transition-all active:scale-95">
                  <Twitter className="w-4 h-4" /> Twitter
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;