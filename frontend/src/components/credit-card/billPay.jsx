import React, { useState, useContext } from 'react';
import styles from './billPay.module.css';
import recharge_phone from '../../assets/phone-icon.png';
import gas from '../../assets/gas.jpg';
import water from '../../assets/water.png';
import electricity from '../../assets/electricity.png';
import dth from '../../assets/dth.png';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserContext } from '../../context/userContext';

const PayBills = ({ creditCardId }) => {
  const { user } = useContext(UserContext);
  const [selectedForm, setSelectedForm] = useState('MobileRecharge');

  const openForm = (formName) => {
    setSelectedForm(formName);
  };

  // Form data and logic for "Mobile Recharge"
  const [localMobileNumber, setLocalMobileNumber] = useState('');
  const [amount, setAmount] = useState('');

  const handleMobileNumberChange = (event) => {
    // Remove the "+91" prefix and any non-numeric characters from the input
    const newMobileNumber = event.target.value.replace(/\D/g, '');
    setLocalMobileNumber(newMobileNumber);
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const handleRecharge = async () => {
    // Add validation checks
    if (!localMobileNumber || !amount) {
      toast.error('Please fill in all required fields.');
      return;
    }

    const generateRandomUserId = () => {
      return uuidv4(); // Generates a random UUID
    };

    try {
      // Prepare the data to send to the backend
      const data = {
        userId: user._id, // Get the user's ID from localStorage
        receiverUserId: generateRandomUserId(), // Implement the function to generate a random user ID
        amount,
        description: 'Optional description of the transaction',
        receiverName: 'Bill Pay',
        cardId: creditCardId,
      };

      // Make an HTTP POST request to your backend API endpoint
      await axios.post('/api/card-transactions/create', data);

      // Handle the response from the backend (e.g., show a success message)
      toast.success('Payment Successful', {
        position: 'top-right',
        autoClose: 3000, // Close the toast after 3 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      // Show an error toast message
      toast.error('Payment Failed', {
        position: 'top-right',
        autoClose: 3000, // Close the toast after 3 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <div className={styles.paybills}>
      <ToastContainer position="top-right" autoClose={3000} />

      <h2>Recharge And PayBills</h2>
      <div className={styles.icons}>
        <div className={styles.recharge}>
          <button onClick={() => openForm('MobileRecharge')}>
            <img src={recharge_phone} alt="Mobile Recharge" />
            <p>Mobile Recharge</p>
          </button>
        </div>
        <div className={styles.electricity}>
          <button onClick={() => openForm('Electricity')}>
            <img src={electricity} alt="Electricity" />
            <p>Electricity</p>
          </button>
        </div>
        <div className={styles.gas}>
          <button onClick={() => openForm('Gas')}>
            <img src={gas} alt="Gas" />
            <p>Gas</p>
          </button>
        </div>
        <div className={styles.water}>
          <button onClick={() => openForm('Water')}>
            <img src={water} alt="Water" />
            <p>Water</p>
          </button>
        </div>
        <div className={styles.dth}>
          <button onClick={() => openForm('DTH')}>
            <img src={dth} alt="DTH" />
            <p>DTH</p>
          </button>
        </div>
      </div>

      {/* Conditionally render the selected form */}
      {selectedForm === 'MobileRecharge' ? (
        <MobileRechargeForm
          mobileNumber={localMobileNumber}
          amount={amount}
          onMobileNumberChange={handleMobileNumberChange}
          onAmountChange={handleAmountChange}
          onRecharge={handleRecharge}
        />
      ) : (
        <GenericForm heading={`Payment for ${selectedForm}`} />
      )}
    </div>
  );
};

function MobileRechargeForm({ mobileNumber, amount, onMobileNumberChange, onAmountChange, onRecharge }) {
  return (
    <div className={styles.pay_form}>
      <h3>Mobile Recharge</h3>
      <form>
        <div>
          <label htmlFor="mobileNumber">Mobile Number:</label>
          <input
            type="text"
            id="mobileNumber"
            value={mobileNumber}
            onChange={onMobileNumberChange}
            placeholder="Enter mobile number"
            className={styles.form_input}
          />
        </div>
        <div className={styles.form_fields}>
          <label htmlFor="amount">Amount:</label>
          <input type="text" id="amount" value={amount} onChange={onAmountChange} placeholder="Enter amount" className={styles.form_input} />
        </div>
        <button type="button" onClick={onRecharge}>
          Recharge
        </button>
      </form>
    </div>
  );
}

function GenericForm({ heading, creditCardId, onHandleSubmit }) {
  const [billNumber, setBillNumber] = useState('');
  const [amount, setAmount] = useState('');

  const handleBillNumberChange = (event) => {
    setBillNumber(event.target.value);
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const handleSubmit = async () => {
    // Add validation checks
    if (!billNumber || !amount) {
      toast.error('Please fill in all required fields.');
      return;
    }
    const generateRandomUserId = () => {
      return uuidv4(); // Generates a random UUID
    };

    try {
      // Prepare the data to send to the backend
      const data = {
        userId: JSON.parse(localStorage.getItem('user'))._id, // Get the user's ID from localStorage
        receiverUserId: generateRandomUserId(), // Implement the function to generate a random user ID
        amount,
        description: 'Optional description of the transaction',
        receiverName: 'Bill Pay',
        cardId: creditCardId,
      };

      // Make an HTTP POST request to your backend API endpoint
      const response = await axios.post('/api/card-transactions/create', data);

      // Handle the response from the backend (e.g., show a success message)
      console.log('Payment successful:', response.data);

      toast.success('Payment made Successfully', {
        position: 'top-right',
        autoClose: 3000, // Close the toast after 3 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setBillNumber('');
      setAmount('');
    } catch (error) {
      // Handle any errors (e.g., show an error message)
      console.error('Form submission failed:', error);
      // Show an error toast message for the form submission
      toast.error('Form Submission Failed', {
        position: 'top-right',
        autoClose: 3000, // Close the toast after 3 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <div className={styles.pay_form}>
      <h3>{heading}</h3>
      <form>
        <div>
          <label htmlFor="billNumber">Bill Number:</label>
          <input
            type="text"
            id="billNumber"
            value={billNumber}
            onChange={handleBillNumberChange}
            placeholder="Enter bill number"
            className={styles.form_input}
          />
        </div>
        <div className={styles.form_fields}>
          <label htmlFor="amount">Amount:</label>
          <input type="text" id="amount" value={amount} onChange={handleAmountChange} placeholder="Enter amount" className={styles.form_input} />
        </div>
        <button type="button" onClick={handleSubmit}>
          Pay
        </button>
      </form>
    </div>
  );
}

export default PayBills;
