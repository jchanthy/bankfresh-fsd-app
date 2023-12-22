/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from 'react';
import axios from 'axios';
import styles from './openAccount.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import studentCharacterImage from '../../assets/student-character.webp';

function SignupPage() {
  const navigate = useNavigate();

  // State for form data and error message
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    gender: '',
    dob: '',
    balance: '',
    password: '',
    securityQuestion: '',
    securityAnswer: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Event handler for form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedDate = new Date(formData.dob);
    const currentDate = new Date();

    if (selectedDate > currentDate) {
      setError('Date of birth cannot be in the future.');
      toast.error('Date of birth cannot be in the future.');
      return;
    }

    try {
      setLoading(true);
      // Create an object containing all user data
      const userData = {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        gender: formData.gender,
        dob: formData.dob,
        password: formData.password,
        balance: formData.balance,
        securityQuestion: formData.securityQuestion,
        securityAnswer: formData.securityAnswer,
      };

      // Send the signup request to the server with all user data
      const response = await axios.post('/api/users/register', userData);
      setLoading(false);

      if (response.data.message === 'User registered successfully') {
        toast.success('User registered successfully!!');
        navigate('/login');
      } else if (response.data.message === 'User already exists') {
        setError('User with this email already exists.');
        toast.error('User with this email already exists');
      }
    } catch (error) {
      setLoading(false);
      console.error('Signup failed:', error.data);
      toast.error('Sign-up failed. Please try again.');
      setError('Sign-up failed. Please try again.');
    }
  };

  return (
    <div>
      <div className={styles.registerContainer}>
        <div className={styles.leftContainer}>
          <div className={styles.leftContainerImg}>
            <img src={studentCharacterImage} width="600" />
          </div>
          <div className={styles.leftContainerContent}>
            <h2>Where Trust Meets Prosperity</h2>
          </div>
        </div>
        <div className={styles.rightContainer}>
          <div className={styles.rightContainerContent}>
            <h2>Hello ! Welcome </h2>
            <p>Enter your data for registration</p>
          </div>
          <div className={styles.signupCard}>
            <form onSubmit={handleSubmit}>
              <div className={styles.inputContainer}>
                <label className={styles.label} htmlFor="fullName">
                  Full Name
                </label>
                <input
                  className={styles.input}
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.inputContainer}>
                <label className={styles.label} htmlFor="email">
                  Email
                </label>
                <input className={styles.input} type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>

              <div className={styles.inputContainer}>
                <label className={styles.label} htmlFor="phoneNumber">
                  Phone Number
                </label>
                <input className={styles.input} type="tel" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
              </div>

              <div className={styles.inputContainer}>
                <label className={styles.label} htmlFor="address">
                  Address
                </label>
                <input className={styles.input} type="text" id="address" name="address" value={formData.address} onChange={handleChange} />
              </div>

              <div className={styles.inputContainer}>
                <label className={styles.label} htmlFor="gender">
                  Gender
                </label>
                <select className={styles.input} id="gender" name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="">Select gender...</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className={styles.inputContainer}>
                <label className={styles.label} htmlFor="dob">
                  Date of Birth
                </label>
                <input className={styles.input} type="date" id="dob" name="dob" value={formData.dob} onChange={handleChange} required />
              </div>

              <div className={styles.inputContainer}>
                <label className={styles.label} htmlFor="balance">
                  Initial Balance
                </label>
                <input className={styles.input} type="number" id="balance" name="balance" value={formData.balance} onChange={handleChange} />
              </div>

              <div className={styles.inputContainer}>
                <label className={styles.label} htmlFor="password">
                  Password
                </label>
                <input
                  className={styles.input}
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.inputContainer}>
                <label className={styles.label} htmlFor="securityQuestion">
                  Select Security Question
                </label>
                <select
                  className={styles.input}
                  id="securityQuestion"
                  name="securityQuestion"
                  value={formData.securityQuestion}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a question...</option>
                  <option value="question1">What is your favorite vacation destination?</option>
                  <option value="question2">What is your mother's maiden name?</option>
                  <option value="question3">What is your favorite food?</option>
                </select>
              </div>

              <div className={styles.inputContainer}>
                <label className={styles.label} htmlFor="securityAnswer">
                  Enter Security Answer
                </label>
                <input
                  className={styles.input}
                  type="text"
                  id="securityAnswer"
                  name="securityAnswer"
                  value={formData.securityAnswer}
                  onChange={handleChange}
                  required
                />
              </div>

              {error && <p className={styles.error}>{error}</p>}
              <div className={styles.btn_wrp}>
                <button className={styles.button} type="submit">
                  {loading && <div class="loader"></div>}
                  Sign Up
                </button>
              </div>
            </form>
          </div>

          <p className={styles.loginLinkp}>
            Already have an account?
            <Link to="/login" className={styles.loginLink}>
              Login
            </Link>
          </p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default SignupPage;
