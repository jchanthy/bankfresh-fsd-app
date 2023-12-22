/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useContext } from 'react';
import axios from 'axios';
import styles from './login.module.css';
import { Link } from 'react-router-dom'; // Import useHistory
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import studentCharacterTogether from '../../assets/student-character-together.webp';
import { UserContext } from '../../ctx/UserContextProvider';

function LoginPage() {
  const { login } = useContext(UserContext);
  const validateSchema = yup.object().shape({
    email: yup.string().email('Invalid email format').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });
  const {
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validateSchema),
  });

  const {
    loginContainer,
    leftContainer,
    leftContainerImg,
    leftContainerContent,
    rightContainer,
    rightContainerContent,
    loginCard,
    errorMessage,
    signupLink,
    forgotPasswordLink,
    button,
    inputContainer,
    label,
    input,
    rememberMe,
    rememberMeLabel,
    rememberMeCheckbox,
    loginOptions,
  } = styles;

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
    securityQuestion: '',
    securityAnswer: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Create a userData object with email and password only
      const userData = {
        email: formData.email,
        password: formData.password,
        securityQuestion: formData.securityQuestion,
        securityAnswer: formData.securityAnswer,
      };

      // Make an HTTP POST request to your backend login endpoint
      const response = await axios.post('/api/users/login', userData);

      if (response.status === 200) {
        login(response.data.user, response.data.token);
      }
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.status === 401) {
        setError('Incorrect email or password.');
      } else {
        setError('Login failed. Please try again later.');
      }
    }
  };

  const handleBackToLogin = () => {
    setError(''); // Clear any previous errors
  };

  return (
    <div>
      <div className={loginContainer}>
        <div className={leftContainer}>
          <div className={leftContainerImg}>
            <img src={studentCharacterTogether} width="600" />
          </div>
          <div className={leftContainerContent}>
            <h2>Where Trust Meets Prosperity</h2>
          </div>
        </div>
        <div className={rightContainer}>
          <div className={rightContainerContent}>
            <h2>Hello ! Welcome back.</h2>
            <p>Log in with your data that you entered during Your registration.</p>
          </div>
          <div className={loginCard}>
            {error && <p className={errorMessage}>{error}</p>}
            <form onSubmit={handleSubmit}>
              <div className={inputContainer}>
                <label className={label} htmlFor="email">
                  E-mail
                </label>
                <input className={input} type="text" id="email" name="email" value={formData.email} onChange={handleChange} required />
                {errors && errors.email && <p className={styles.error}>{errors.email.message}</p>}
              </div>

              <div className={inputContainer}>
                <label className={label} htmlFor="password">
                  Password
                </label>
                <input className={input} type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
                {errors && errors.password && <p className={styles.error}>{errors.password.message}</p>}
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

              <div className={rememberMe}>
                <label className={rememberMeLabel}>
                  <input className={rememberMeCheckbox} type="checkbox" name="rememberMe" checked={formData.rememberMe} onChange={handleChange} />
                  Remember me
                </label>
              </div>

              <div className={styles.btn_wrp}>
                <button className={button} type="submit">
                  Login
                  {/* {forgotPasswordMode ? "Send Reset Email" : "Login"} */}
                  {loading && <div class="loader"></div>}
                </button>
              </div>
            </form>
            <div className={loginOptions}>
              <p>
                <Link to="/openAccount" className={signupLink}>
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default LoginPage;
