import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formSubject, setFormSubject] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim() || !formMessage.trim()) return;
    setIsSent(true);
    setTimeout(() => {
      setFormName('');
      setFormEmail('');
      setFormSubject('');
      setFormMessage('');
    }, 1000);
  };

  return (
    <div className="bg-white py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="max-w-2xl text-left space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-blue-700">
            Get in Touch
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Contact KIPS College
          </h1>
          <p className="text-base text-slate-600">
            Have questions regarding admissions, academic curricula, or student records? Reach out to our campus administrative office.
          </p>
        </div>

        {/* Contact Info & Inquiry Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Contact Placeholders */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
              <h2 className="text-lg font-bold text-slate-900">
                Institutional Contact Directory
              </h2>
              
              <div className="space-y-5 text-sm">
                {/* College Name */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <span className="font-bold text-xs">KC</span>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Institution Name
                    </span>
                    <span className="font-bold text-slate-900">
                      KIPS College
                    </span>
                  </div>
                </div>

                {/* Address Placeholder */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Campus Address
                    </span>
                    <span className="text-slate-700">
                      [Campus Address Placeholder - To be configured]
                    </span>
                    <p className="text-xs text-slate-400 mt-0.5">
                      (Configurable placeholder for official campus location)
                    </p>
                  </div>
                </div>

                {/* Phone Placeholder */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Phone Number
                    </span>
                    <span className="text-slate-700 font-mono">
                      [Phone Number Placeholder - e.g. +92 (XX) XXXXXXX]
                    </span>
                  </div>
                </div>

                {/* Email Placeholder */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Email Address
                    </span>
                    <span className="text-slate-700 font-mono">
                      [admissions@kips-college-placeholder.edu]
                    </span>
                  </div>
                </div>

                {/* Visiting Hours */}
                <div className="flex items-start gap-3.5 pt-2 border-t border-slate-200">
                  <div className="w-9 h-9 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Administrative Hours
                    </span>
                    <span className="text-slate-700">
                      Monday – Saturday: 08:30 AM – 04:00 PM
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Message Form */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Send an Inquiry
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Leave a message for the KIPS College administrative admissions office.
                </p>
              </div>

              {isSent ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-3 animate-in fade-in">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h3 className="text-base font-bold text-emerald-900">Message Received</h3>
                  <p className="text-xs text-emerald-800 max-w-sm mx-auto">
                    Thank you for contacting KIPS College. An administrative advisor will review your inquiry.
                  </p>
                  <button
                    onClick={() => setIsSent(false)}
                    className="mt-2 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="Your full name"
                        className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Subject / Department
                    </label>
                    <input
                      type="text"
                      value={formSubject}
                      onChange={(e) => setFormSubject(e.target.value)}
                      placeholder="e.g. Admission Inquiry for FSc Pre-Engineering"
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Message <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formMessage}
                      onChange={(e) => setFormMessage(e.target.value)}
                      placeholder="Write your questions or inquiries here..."
                      className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Inquiry</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
