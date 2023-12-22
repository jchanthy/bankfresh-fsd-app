import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import styles from './loan.module.css';
import { Link } from 'react-router-dom';
import { UserContext } from '../../ctx/UserContextProvider';

export default function Loan() {
  const [loanData, setLoanData] = useState([]);
  const { user, token } = useContext(UserContext);

  useEffect(() => {
    // Fetch the user ID from local storage
    if (user && user._id) {
      // Fetch loan data from the backend API
      axios
        .get(`/api/loans/${user._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            const loanRequests = response.data.loanRequests;
            if (Array.isArray(loanRequests) && loanRequests.length > 0) {
              setLoanData(loanRequests);
            }
          } else {
            console.log('Unable to fetch loan data:', response.data.error);
          }
        })
        .catch((error) => {
          console.error('Error fetching loan data:', error);
        });
    }
  }, [user, token]);

  function getRandomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  }

  function LoanRow({ loan }) {
    const firstLetter = loan.loanPurpose.charAt(0);
    const randomColor = getRandomColor();

    return (
      <tr className={styles.loanRow}>
        <td className={styles.purposeIcon}>
          <Link to="/loan-applied" className={styles.purposeIcon}>
            <div className={styles.icon} style={{ backgroundColor: randomColor, color: '#ffffff' }}>
              {firstLetter}
            </div>
            {loan.loanPurpose}
          </Link>
        </td>
        <td>{loan.interestRate}</td>
        <td>{loan.loanAmount}</td>
      </tr>
    );
  }

  return (
    <div className={styles.loans}>
      <h3>Loan Details</h3>
      <table className={styles.loanTable}>
        <thead>
          <tr>
            <th>Purpose</th>
            <th>Interest Rate</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(loanData) ? (
            loanData.map((loan, index) => <LoanRow key={index} loan={loan} />)
          ) : (
            <tr>
              <td colSpan="3">No loan data available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
