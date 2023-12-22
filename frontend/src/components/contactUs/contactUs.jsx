import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './contactUs.module.css';
import location from '../../assets/location.png';
import email from '../../assets/email.png';
import phone from '../../assets/phone.png';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: '',
  });

  const [formSubmitted, setFormSubmitted] = useState(false); // State to track form submission

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic form validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill in all required fields.');
      return;
    }

    // Email format validation using a regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    // Simulated form submission with a delay
    // TODO: Replace with actual form submission
    setTimeout(() => {
      toast.success('Form submitted successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setFormSubmitted(true);
    }, 1000);
  };

  return (
    <div className={styles.contact_us}>
      <h2>Contact Us</h2>
      <div className={styles.contact}>
        <div className={styles.address}>
          <img src={location} alt="Location" />
          <p>19524 Nordhoff St, Northridge, California, 91324</p>
        </div>
        <div className={styles.phone}>
          <img src={phone} alt="Phone" />
          <p>(305) 408-5554</p>
        </div>
        <div className={styles.email}>
          <img src={email} alt="Email" />
          <p>customercare@bankfresh.com</p>
        </div>
      </div>
      <div className={styles.contact_form}>
        <h5>Contact Form</h5>
        {/* Display "Form Submitted" message when formSubmitted is true */}
        {formSubmitted ? (
          <div className="form-submitted-message">Form Submitted! Thank you for your message.</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form_group">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className="form_control"
              />
              <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} className="form_control" />
            </div>
            <div className="form_group">
              <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="form_control" />
              <input type="text" name="subject" placeholder="Subject" value={formData.subject} onChange={handleChange} className="form_control" />
            </div>
            <div className="form_group">
              <textarea name="message" placeholder="Message" value={formData.message} onChange={handleChange} className="form_control"></textarea>
            </div>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>
        )}
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default ContactUs;
