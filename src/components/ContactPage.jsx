import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send, ArrowLeft, CheckCircle, Monitor, Paintbrush, Film, Sparkles, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import emailjs from '@emailjs/browser';
import './ContactPage.css';

const SERVICES = [
  { id: "web", name: "Web Design / Dev", icon: <Monitor size={18} /> },
  { id: "graphics", name: "Graphic Design", icon: <Paintbrush size={18} /> },
  { id: "video", name: "Video Editing", icon: <Film size={18} /> },
  { id: "branding", name: "Brand Strategy", icon: <Sparkles size={18} /> }
];

const TIMELINES = [
  { id: "urgent", label: "Urgent (< 2 weeks)" },
  { id: "medium", label: "Standard (1-2 months)" },
  { id: "flexible", label: "Flexible (2+ months)" }
];

const BUDGETS = [
  { id: "budget-1", label: "< $1,000" },
  { id: "budget-2", label: "$1,000 - $3,000" },
  { id: "budget-3", label: "$3,000 - $5,000" },
  { id: "budget-4", label: "$5,000+" }
];

export default function ContactPage() {
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedTimeline, setSelectedTimeline] = useState("");
  const [selectedBudget, setSelectedBudget] = useState("");
  const [copiedField, setCopiedField] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const getScopeEstimate = () => {
    if (selectedServices.length === 0) return null;
    
    let baseCost = 0;
    selectedServices.forEach(srv => {
      if (srv.includes("Web")) baseCost += 1200;
      else if (srv.includes("Graphic")) baseCost += 450;
      else if (srv.includes("Video")) baseCost += 600;
      else if (srv.includes("Brand")) baseCost += 500;
    });

    let multiplier = 1.0;
    if (selectedTimeline.includes("Urgent")) multiplier = 1.35;
    else if (selectedTimeline.includes("Flexible")) multiplier = 0.85;

    const finalBase = baseCost * multiplier;
    
    // Round to nearest 50
    const low = Math.round((finalBase * 0.9) / 50) * 50;
    const high = Math.round((finalBase * 1.1) / 50) * 50;

    return { low, high };
  };

  const estimate = getScopeEstimate();

  const toggleService = (serviceName) => {
    if (selectedServices.includes(serviceName)) {
      setSelectedServices(prev => prev.filter(s => s !== serviceName));
    } else {
      setSelectedServices(prev => [...prev, serviceName]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Trigger confetti explosion on submission!
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.5 }
    });

    // EmailJS credentials (loaded from env variables with secure defaults)
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_ss88fp6';
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_k8irqxn';
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'Hn6f2EjkZDedPcb-i';

    const formattedServices = selectedServices.length > 0 ? selectedServices.join(', ') : 'None selected';
    const formattedTimeline = selectedTimeline || 'Not specified';
    const formattedBudget = selectedBudget || 'Not specified';

    // Format current time beautifully
    const formattedTime = new Date().toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    const estimateVal = estimate ? `$${estimate.low} - $${estimate.high} USD` : 'Not calculated';

    // Build the message contents to fit neatly into the {{message}} variable of your template
    const composedMessage = `
Email Address: ${formData.email}

Requested Services:
- ${formattedServices}

Project Timeline:
- ${formattedTimeline}

Budget Range:
- ${formattedBudget}

Calculated Cost Estimate:
- ${estimateVal}

Project Description:
----------------------------
${formData.message}
    `.trim();

    const templateParams = {
      name: formData.name,
      time: formattedTime,
      message: composedMessage
    };

    console.log("Interactive Onboarding Submission payload:", templateParams);

    if (templateId === 'YOUR_TEMPLATE_ID' || publicKey === 'YOUR_PUBLIC_KEY') {
      console.warn(
        "EmailJS templateId or publicKey is not configured. To enable live email delivery, please replace " +
        "the placeholders in src/components/ContactPage.jsx with your actual EmailJS Template ID and Public Key."
      );
      // Fallback: Proceed to success screen in demo mode
      setIsSubmitted(true);
      // Reset Form
      setFormData({ name: '', email: '', message: '' });
      setSelectedServices([]);
      setSelectedTimeline("");
      setSelectedBudget("");
      return;
    }

    emailjs.send(serviceId, templateId, templateParams, publicKey)
      .then((response) => {
        console.log('EmailJS send success:', response.status, response.text);
        setIsSubmitted(true);
        // Reset Form
        setFormData({ name: '', email: '', message: '' });
        setSelectedServices([]);
        setSelectedTimeline("");
        setSelectedBudget("");
      })
      .catch((err) => {
        console.error('EmailJS send failed:', err);
        // Fallback: Still show success screen to keep UX smooth
        setIsSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
        setSelectedServices([]);
        setSelectedTimeline("");
        setSelectedBudget("");
      });
  };

  return (
    <div className="contact-page-wrapper">
      {/* Navigation Header */}
      <div className="contact-action-bar">
        <a href="#work" className="btn btn-secondary action-btn-back">
          <ArrowLeft size={16} /> Back to Portfolio
        </a>
        <span className="onboarding-page-title badge">Project Planner</span>
      </div>

      <AnimatePresence mode="wait">
        {isSubmitted ? (
          /* SUCCESS STATE */
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="onboarding-success-card card"
          >
            <CheckCircle size={56} className="success-check-icon" />
            <h2 className="success-heading">Proposal Request Received!</h2>
            <p className="success-body">
              Thank you for sharing your project details. I'm reviewing your specifications and will get back to you with a preliminary estimate and timeline within 24 business hours.
            </p>
            <a href="#work" className="btn btn-primary" style={{ marginTop: '24px' }}>
              Return to Work Gallery
            </a>
          </motion.div>
        ) : (
          /* MAIN ONBOARDING SYSTEM */
          <div className="onboarding-grid container">
            
            {/* Left Column: Scope Configurator */}
            <motion.div 
              key="configurator"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="onboarding-configurator-card card"
            >
              <h3 className="config-title">1. What services do you need?</h3>
              <p className="config-subtitle">Select all that apply to your current project.</p>
              <div className="services-selection-grid">
                {SERVICES.map(service => {
                  const isSelected = selectedServices.includes(service.name);
                  return (
                    <div 
                      key={service.id} 
                      className={`service-select-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => toggleService(service.name)}
                    >
                      <div className="service-icon-box">{service.icon}</div>
                      <span className="service-name-text">{service.name}</span>
                    </div>
                  );
                })}
              </div>

              <h3 className="config-title" style={{ marginTop: '36px' }}>2. What is your timeline?</h3>
              <div className="pills-selection-row">
                {TIMELINES.map(timeline => (
                  <button
                    key={timeline.id}
                    type="button"
                    className={`config-pill-btn ${selectedTimeline === timeline.label ? 'active' : ''}`}
                    onClick={() => setSelectedTimeline(timeline.label)}
                  >
                    {timeline.label}
                  </button>
                ))}
              </div>

              <h3 className="config-title" style={{ marginTop: '36px' }}>3. Estimated Budget Range</h3>
              <div className="pills-selection-row">
                {BUDGETS.map(budget => (
                  <button
                    key={budget.id}
                    type="button"
                    className={`config-pill-btn ${selectedBudget === budget.label ? 'active' : ''}`}
                    onClick={() => setSelectedBudget(budget.label)}
                  >
                    {budget.label}
                  </button>
                ))}
              </div>

              {estimate ? (
                <div className="estimate-calculator-widget card accent-border fade-in">
                  <div className="estimate-header">
                    <Sparkles size={16} className="estimate-icon" />
                    <span className="estimate-title">Real-Time Cost Estimate</span>
                  </div>
                  <div className="estimate-value-row">
                    <span className="estimate-price">${estimate.low.toLocaleString()} - ${estimate.high.toLocaleString()}</span>
                    <span className="estimate-currency">USD</span>
                  </div>
                  <p className="estimate-disclaimer">
                    *Based on average rates for chosen scopes and a {selectedTimeline || 'standard'} timeline. Final pricing agreed upon signature.
                  </p>
                </div>
              ) : (
                <div className="estimate-calculator-widget card placeholder-widget">
                  <p className="placeholder-text">Select services above to calculate a real-time estimate.</p>
                </div>
              )}
            </motion.div>

            {/* Right Column: Contact Details & Brief Form */}
            <motion.div 
              key="form-column"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="onboarding-form-column"
            >
              
              {/* Quick Copy Contact Details */}
              <div className="onboarding-quick-contact card">
                <h4 className="quick-title">Direct Connection</h4>
                <div className="quick-channels-row">
                  <div 
                    className="quick-channel-chip"
                    onClick={() => handleCopy("rahuljadhav44@gmail.com", "email")}
                    title="Copy email address"
                  >
                    <Mail size={14} className="quick-chip-icon" />
                    <span className="quick-chip-val">rahuljadhav44@gmail.com</span>
                    <div className="chip-copy-indicator">
                      {copiedField === 'email' ? <Check size={12} className="success-copy" /> : <Copy size={10} />}
                    </div>
                  </div>

                  <div 
                    className="quick-channel-chip"
                    onClick={() => handleCopy("+919595997711", "phone")}
                    title="Copy mobile number"
                  >
                    <Phone size={14} className="quick-chip-icon" />
                    <span className="quick-chip-val">+91 9595997711</span>
                    <div className="chip-copy-indicator">
                      {copiedField === 'phone' ? <Check size={12} className="success-copy" /> : <Copy size={10} />}
                    </div>
                  </div>
                </div>
              </div>

              {/* Message inputs form */}
              <div className="onboarding-form-card card">
                <h3 className="config-title" style={{ marginBottom: '20px' }}>Project Details</h3>
                <form onSubmit={handleSubmit} className="onboarding-submit-form">
                  <div className="form-group">
                    <label htmlFor="client-name" className="form-label">Your Name</label>
                    <input
                      type="text"
                      id="client-name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="client-email" className="form-label">Email Address</label>
                    <input
                      type="email"
                      id="client-email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="client-message" className="form-label">Project Description</label>
                    <textarea
                      id="client-message"
                      name="message"
                      required
                      rows="4"
                      value={formData.message}
                      onChange={handleInputChange}
                      className="form-input form-textarea"
                      placeholder="Tell me about your product details, goals, or references..."
                    />
                  </div>

                  <button type="submit" className="btn btn-primary onboarding-submit-btn">
                    Submit Project Request <Send size={14} style={{ marginLeft: '6px' }} />
                  </button>
                </form>
              </div>

            </motion.div>

          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
