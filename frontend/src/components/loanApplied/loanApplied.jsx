import React, { useState, useEffect, useContext } from 'react';
import styles from './loans.module.css';
import loan from '../../assets/bank-loan.jpg';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserContext } from '../../ctx/UserContextProvider';

function LoanApplied() {
  const { user, token } = useContext(UserContext);
  const [loanApplications, setLoanApplications] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userIDFunction = () => {
      if (user && user._id) {
        setUserId(user._id);
      } else {
        toast.error('Unable to fetch loan application data.');
      }
    };
    userIDFunction();

    userId &&
      axios
        .get(`/api/loans/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            setLoanApplications(response.data.loanRequests);
            setIsLoading(false);
          } else {
            console.error('Error fetching loan application data:', response.status);
          }
        })
        .catch((error) => {
          console.error('Error fetching loan application data:', error);
        });
  }, [userId, token, user]);

  // Function to calculate EMI
  const calculateEMI = (loanAmount, interestRate, loanTerm) => {
    const principal = parseFloat(loanAmount);
    const annualInterestRate = interestRate;
    const monthlyInterestRate = annualInterestRate / 12 / 100;
    const loanTermMonths = loanTerm;
    const emi =
      (principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTermMonths)) / (Math.pow(1 + monthlyInterestRate, loanTermMonths) - 1);
    return emi.toFixed(2);
  };

  return (
    <div className={styles.bank_loans}>
      <ToastContainer />

      <div className={styles.loans}>
        <div className={styles.loans_left}>
          <h1>
            {' '}
            Payment up to 50K <br />
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
        {isLoading && <p>Loading...</p>}
        {!isLoading && loanApplications.length === 0 && <p>No loan applications available.</p>}
        {loanApplications.map((loanRequest, index) => (
          <table className={styles.loans_table}>
            <tr>
              <th>Loan Purpose</th>
              <th>Loan Amount</th>
              <th>EMI Amount</th>
              <th>Interest Rate</th>
              <th>Status</th>
            </tr>
            <tr>
              <td>{loanRequest.loanPurpose.toUpperCase()}</td>
              <td>{loanRequest.loanAmount}</td>
              <td>{calculateEMI(loanRequest.loanAmount, loanRequest.interestRate, loanRequest.loanTerm)}</td>
              <td>{loanRequest.interestRate}%</td>
              <td>{loanRequest.status.toUpperCase()}</td>
            </tr>
          </table>
        ))}
      </div>
    </div>
  );
}

export default LoanApplied;
