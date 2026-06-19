import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send, CheckCircle } from 'lucide-react';
import './Contact.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Contact Inquiry Submitted:", formData);
    setIsSubmitted(true);
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    setTimeout(() => {
      setIsSubmitted(false);
    }, 6000);
  };

  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <h2 className="section-title">Get In Touch</h2>
        <p className="section-subtitle">
          Have a project in mind, a corporate opening, or want to collaborate? Send a message below.
        </p>

        <div className="contact-grid grid-2">
          {/* Left Column: Info & Details */}
          <div className="contact-info-container">
            <h3 className="contact-subtitle">Contact Information</h3>
            <p className="contact-info-text">
              I am available for UI/UX, Web Design, and Graphic Design roles. Let's connect through my channels or send me a message directly.
            </p>

            <div className="contact-channels">
              <div className="channel-item">
                <div className="channel-icon">
                  <Mail size={18} />
                </div>
                <div className="channel-details">
                  <span className="channel-label">Email Address</span>
                  <a href="mailto:rahuljadhav44@gmail.com" className="channel-link">rahuljadhav44@gmail.com</a>
                </div>
              </div>

              <div className="channel-item">
                <div className="channel-icon">
                  <Phone size={18} />
                </div>
                <div className="channel-details">
                  <span className="channel-label">Mobile</span>
                  <a href="tel:+919595997711" className="channel-link">+91 9595997711</a>
                </div>
              </div>

              <div className="channel-item">
                <div className="channel-icon">
                  <MapPin size={18} />
                </div>
                <div className="channel-details">
                  <span className="channel-label">Location / Address</span>
                  <span className="channel-value">Chh. Sambhajinagar (Aurangabad) 430001, MH</span>
                </div>
              </div>
            </div>

            <div className="social-links-section">
              <h4 className="social-links-title">Professional Networks</h4>
              <div className="social-links-list">
                <a href="https://linkedin.com/in/rahuljadhav44" target="_blank" rel="noopener noreferrer" className="social-link-item">LinkedIn</a>
                <a href="https://behance.net/sayrahul" target="_blank" rel="noopener noreferrer" className="social-link-item">Behance</a>
                <a href="https://github.com/sayrahul" target="_blank" rel="noopener noreferrer" className="social-link-item">GitHub</a>
                <a href="https://youtube.com/@Say_Rahul" target="_blank" rel="noopener noreferrer" className="social-link-item">YouTube</a>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="contact-form-container card">
            {isSubmitted ? (
              <div className="form-success-state fade-in">
                <CheckCircle size={48} className="success-icon" />
                <h3 className="success-title">Message Sent Successfully</h3>
                <p className="success-text">
                  Thank you for reaching out. I have received your message and will respond within 24 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter your name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter your email"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject" className="form-label">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="What is this regarding?"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message" className="form-label">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows="4"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="form-input form-textarea"
                    placeholder="Describe your inquiry, project scope, or opportunity..."
                  />
                </div>

                <button type="submit" className="btn btn-primary form-submit-btn">
                  Send Message <Send size={16} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
