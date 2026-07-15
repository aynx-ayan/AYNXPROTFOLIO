import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, MessageSquare, Plus, CheckCircle, Globe, ShieldCheck, X } from 'lucide-react';
import { Review } from '../types';

interface ReviewsSectionProps {
  reviews: Review[];
  onSubmitReview: (review: Omit<Review, 'id' | 'approved' | 'featured' | 'date'>) => Promise<boolean>;
}

export default function ReviewsSection({ reviews, onSubmitReview }: ReviewsSectionProps) {
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [country, setCountry] = useState('USA 🇺🇸');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Filter approved reviews for public view
  const approvedReviews = reviews.filter(r => r.approved);

  const countries = [
    { code: 'India 🇮🇳', name: 'India' },
    { code: 'USA 🇺🇸', name: 'United States' },
    { code: 'Pakistan 🇵🇰', name: 'Pakistan' },
    { code: 'United Kingdom 🇬🇧', name: 'United Kingdom' },
    { code: 'Canada 🇨🇦', name: 'Canada' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !text) return;

    setSubmitting(true);
    try {
      const res = await onSubmitReview({
        name,
        text,
        rating,
        country
      });

      if (res) {
        setSuccess(true);
        setName('');
        setText('');
        setRating(5);
        setTimeout(() => {
          setSuccess(false);
          setShowSubmitModal(false);
        }, 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black pb-24 pt-24 px-6 md:px-12 relative overflow-hidden select-none">
      {/* Background glow flares */}
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-gold-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
          <div className="flex flex-col items-start text-left">
            <span className="text-xs font-mono tracking-[0.3em] text-gold-400 uppercase mb-2 block">
              Audience Intel
            </span>
            <h1 className="text-4xl sm:text-6xl font-display font-extrabold tracking-tight text-white uppercase">
              CLIENT <span className="metallic-gold-text">FEEDBACK</span>
            </h1>
            <p className="text-xs font-mono text-neutral-500 mt-2">
              Verified dispatches compiled from over 250+ clients globally.
            </p>
          </div>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-6 py-3 bg-white/5 hover:bg-gold-500/10 border border-white/10 hover:border-gold-500/30 text-white hover:text-gold-400 text-xs font-display font-bold uppercase tracking-[0.2em] rounded-full flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Disperse Feedback
          </button>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {approvedReviews.map((rev, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              key={rev.id}
              className={`glass-premium p-8 rounded-3xl border ${
                rev.featured ? 'border-gold-500/30 shadow-[0_0_20px_rgba(212,163,23,0.1)]' : 'border-white/5'
              } relative flex flex-col justify-between`}
            >
              {rev.featured && (
                <div className="absolute top-6 right-6 flex items-center gap-1 bg-gold-500/10 text-gold-400 text-[8px] font-mono font-extrabold py-0.5 px-1.5 rounded uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5" /> Featured Testimonial
                </div>
              )}

              <div className="space-y-4">
                {/* Stars Indicator */}
                <div className="flex items-center gap-1 text-gold-400">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <p className="text-sm font-sans text-neutral-300 italic leading-relaxed">
                  "{rev.text}"
                </p>
              </div>

              <div className="flex justify-between items-center border-t border-white/5 pt-6 mt-8 font-mono text-xs">
                <div className="flex flex-col">
                  <span className="text-white font-display font-extrabold uppercase tracking-wide">
                    — {rev.name}
                  </span>
                  <span className="text-[10px] text-neutral-500 mt-0.5 uppercase tracking-widest">
                    {rev.country}
                  </span>
                </div>

                <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-[10px] text-neutral-500">
                  🌐
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FEEDBACK SUBMISSION MODAL OVERLAY */}
        <AnimatePresence>
          {showSubmitModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex justify-center items-center p-4 overflow-y-auto"
            >
              <div className="absolute inset-0 grid-overlay opacity-30 pointer-events-none" />

              <motion.div
                initial={{ scale: 0.9, y: 35 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 35 }}
                className="my-auto w-full max-w-lg bg-neutral-950 border border-white/10 rounded-3xl p-6 sm:p-8 relative z-10"
              >
                {/* Close Button */}
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="absolute top-6 right-6 w-8 h-8 rounded-full border border-white/10 hover:border-gold-500/30 flex items-center justify-center bg-black text-white hover:text-gold-400 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>

                {success ? (
                  <div className="text-center py-12 space-y-4">
                    <CheckCircle className="w-16 h-16 text-gold-500 mx-auto animate-bounce" />
                    <h3 className="text-2xl font-display font-extrabold text-white uppercase tracking-wider">
                      DISPATCH SUCCESSFUL
                    </h3>
                    <p className="text-xs font-mono text-neutral-400 max-w-xs mx-auto leading-relaxed">
                      Your feedback has been logged. Admin approval is pending prior to public radar publication.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6 text-left">
                    <div>
                      <span className="text-[10px] font-mono tracking-widest text-gold-500 uppercase block mb-1">
                        SECURE LOGGING UNIT
                      </span>
                      <h3 className="text-2xl font-display font-extrabold text-white uppercase tracking-wider">
                        DISPERSE CLIENT REVIEW
                      </h3>
                    </div>

                    <div className="space-y-4 font-mono text-xs text-neutral-400">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-neutral-500 uppercase">Your Name</label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. James Carter"
                          className="px-4 py-3 bg-neutral-900 border border-white/10 text-white rounded-lg focus:border-gold-500 outline-none transition-colors"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-neutral-500 uppercase">Country Flag</label>
                          <select
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            className="px-4 py-3 bg-neutral-900 border border-white/10 text-white rounded-lg focus:border-gold-500 outline-none transition-colors cursor-pointer"
                          >
                            {countries.map(c => (
                              <option key={c.code} value={c.code}>{c.code} ({c.name})</option>
                            ))}
                          </select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-neutral-500 uppercase">Rating Stars</label>
                          <div className="flex items-center gap-1.5 h-11 px-4 bg-neutral-900 border border-white/10 rounded-lg">
                            {[1, 2, 3, 4, 5].map(star => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className="text-gold-400 hover:scale-110 transition-transform"
                              >
                                <Star className={`w-4 h-4 ${rating >= star ? 'fill-current' : 'text-neutral-600'}`} />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-neutral-500 uppercase">Review Description</label>
                        <textarea
                          required
                          rows={4}
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                          placeholder="Your honest experience with Ayan Nayak (A.ynx_)..."
                          className="px-4 py-3 bg-neutral-900 border border-white/10 text-white rounded-lg focus:border-gold-500 outline-none transition-colors resize-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-4 bg-gold-500 hover:bg-gold-400 text-black text-xs font-display font-bold uppercase tracking-widest rounded-full shadow-[0_0_20px_rgba(212,163,23,0.3)] hover:shadow-[0_0_30px_rgba(212,163,23,0.5)] transition-all cursor-pointer"
                    >
                      {submitting ? 'LOGGING INTEGRITY...' : 'DISPATCH TO ADMIN'}
                    </button>
                  </form>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
