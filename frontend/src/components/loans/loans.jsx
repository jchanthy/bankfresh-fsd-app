import React, { useState, useEffect, useContext } from 'react';
import styles from './loans.module.css';
import loan from '../../assets/bank-loan.jpg';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserContext } from '../../ctx/UserContextProvider';

const loanTypes = [
  { value: 'home', label: 'Home Loan', interestRate: 8 },
  { value: 'car', label: 'Car Loan', interestRate: 9 },
  { value: 'personal', label: 'Personal Loan', interestRate: 10 },
];

function Loans() {
  const { user, token } = useContext(UserContext);
  const [loanType, setLoanType] = useState('home');
  const [loanAmount, setLoanAmount] = useState(0);
  const [loanTermMonths, setLoanTermMonths] = useState(12);

  const [emi, setEMI] = useState(0);

  const handleLoanTypeChange = (event) => {
    setLoanType(event.target.value);
  };

  const handleLoanAmountChange = (event) => {
    setLoanAmount(parseFloat(event.target.value));
  };

  useEffect(() => {
    function computeEmi() {
      const annualInterestRate = loanTypes.find((type) => type.value === loanType).interestRate;
      const monthlyInterestRate = annualInterestRate / loanTermMonths / 100;
      const emi =
        (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTermMonths)) /
        (Math.pow(1 + monthlyInterestRate, loanTermMonths) - 1);
      return emi;
    }

    const emi = computeEmi();
    setEMI(emi.toFixed(2));
  }, [loanAmount, loanTermMonths, loanType]);

  const handleApply = () => {
    // Add validation for required fields
    if (!loanAmount) {
      toast.error('Please fill in all required fields.');
      return;
    }

    // Fetch the user ID from local storage
    const userId = user._id;

    // Calculate the loan term (in months) based on EMI and other factors
    const annualInterestRate = loanTypes.find((type) => type.value === loanType).interestRate;
    const monthlyInterestRate = annualInterestRate / 12 / 100;

    const principal =
      (emi * Math.pow(1 + monthlyInterestRate, loanTermMonths) - emi) / (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTermMonths));

    // Create a loan object with the required fields
    const loanData = {
      userId,
      loanAmount: principal.toFixed(2), // Set the loan amount based on the calculated principal
      loanTermMonths,
      loanPurpose: loanType, // Assuming loanType is the loan purpose
      interestRate: loanTypes.find((type) => type.value === loanType).interestRate,
    };

    // Send a POST request to your backend API using Axios
    axios
      .post('/api/loans/apply', loanData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        toast.success('Loan request created successfully');
        setLoanAmount(''); // Reset loanAmount
        setEMI(0); // Reset emi
      })
      .catch((error) => {
        console.error('Error creating loan request:', error);
        toast.error('Error creating loan request');
      });
  };

  return (
    <div className={styles.bank_loans}>
      <ToastContainer />

      <div className={styles.loans}>
        <div className={styles.loans_left}>
          <h1>
            Payment upto 50K <br />
            Easy money, easy <br />
            payment{' '}
          </h1>
          <p>
            You can get the money you need with easy terms and <br />
            conditions and pay them back based on your payment ability
          </p>
        </div>
        <div className={styles.loans_right}>
          <img src={loan} alt="Loan" />
        </div>
      </div>
      <div className={styles.loan_form}>
        <h5>Loan Application Form</h5>
        <div className={styles.loan_options}>
          <div>
            <select id="loanType" value={loanType} onChange={handleLoanTypeChange}>
              {loanTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <input type="number" id="loanAmount" value={loanAmount} onChange={handleLoanAmountChange} placeholder="Enter loan amount" />
          </div>
          <div>
            <select
              id="loanTerm"
              onChange={(e) => {
                setLoanTermMonths(e.target.value);
              }}
            >
              <option value="12">12 months</option>
              <option value="24">24 months</option>
              <option value="36">36 months</option>
              <option value="48">48 months</option>
              <option value="60">60 months</option>
            </select>
          </div>
          <div>
            <input type="text" id="emiAmount" value={emi} readOnly placeholder="EMI amount" />
          </div>
        </div>
        <div className={styles.details}>
          <button type="button" onClick={handleApply}>
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

export default Loans;
