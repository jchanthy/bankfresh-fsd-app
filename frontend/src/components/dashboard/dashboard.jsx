// import React, { useState } from "react";
// import {
//   FaMoneyCheckAlt,
//   FaReceipt,
//   FaUserEdit,
//   FaHandHoldingUsd,
//   FaPhone,
//   FaCreditCard,
//   FaFileInvoiceDollar,
//   FaMoneyCheck,
// } from "react-icons/fa";
// import styles from "./Dashboard1.module.css";
// import { Link } from "react-router-dom";

// const Dashboard = () => {
//   const [balance, setBalance] = useState(null);

//   const handleCheckBalance = () => {
//     const user = JSON.parse(localStorage.getItem("user"));
//     const userId = user._id;

//     fetch(`api/users/${userId}`)
//       .then((response) => response.json())
//       .then((data) => {
//         // Update the balance state with the fetched balance
//         setBalance(data.balance);
//       })
//       .catch((error) => {
//         console.error("Error fetching balance:", error);
//       });
//   };

//   return (
//     <div className={styles.dashboard}>
//       <h2 className={styles.heading}>
//         Welcome to "Your Financial Hub with BankFresh" , avail our digital
//         services
//       </h2>

//       <div className={styles.checkBalanceCard}>
//         <h3 className={styles.checkBalanceHeading}>Check Balance</h3>
//         {balance !== null ? (
//           <h4 className={styles.checkBalanceButton}> {balance}</h4>
//         ) : (
//           <button
//             className={styles.checkBalanceButton}
//             onClick={handleCheckBalance}
//           >
//             Check
//           </button>
//         )}
//       </div>
//       <div className={styles.serviceCards}>
//         <Link to="/transferMoney" className={styles.serviceCard}>
//           <FaMoneyCheckAlt size={45} color="#bb6316" />
//           <h4 className={styles.serviceName}>Transfer</h4>
//         </Link>
//         <Link to="/transactionStatement" className={styles.serviceCard}>
//           <FaReceipt size={45} color="#bb6316" />
//           <h4 className={styles.serviceName}>Digital Statement</h4>
//         </Link>
//         <Link to="/update-profile" className={styles.serviceCard}>
//           <FaUserEdit size={45} color="#bb6316" />
//           <h4 className={styles.serviceName}>Update Profile</h4>
//         </Link>
//         <Link to="/loan" className={styles.serviceCard}>
//           <FaHandHoldingUsd size={45} color="#bb6316" />
//           <h4 className={styles.serviceName}>Apply for Loan</h4>
//         </Link>
//         <Link to="/loan-applied" className={styles.serviceCard}>
//           <FaMoneyCheck size={45} color="#bb6316" />
//           <h4 className={styles.serviceName}>Applied Loans</h4>
//         </Link>
//         <Link to="/contact-us" className={styles.serviceCard}>
//           <FaPhone size={45} color="#bb6316" />
//           <h4 className={styles.serviceName}>Contact</h4>
//         </Link>
//         <Link to="/card-services" className={styles.serviceCard}>
//           <FaCreditCard size={45} color="#bb6316" />
//           <h4 className={styles.serviceName}>Card Services</h4>
//         </Link>
//         <Link to="/payBills" className={styles.serviceCard}>
//           <FaFileInvoiceDollar size={45} color="#bb6316" />
//           <h4 className={styles.serviceName}>Bill Payment</h4>
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import React, { useEffect, useState, useContext } from 'react';
import styles from './dashboard.module.css';
import Card from './card';
import ChartComponent from './chart';
import Utilities from './utilities';
import Transaction from './loan';
import axios from 'axios'; // Import Axios for making API requests
import { UserContext } from '../../ctx/UserContextProvider';

export default function Dashboard() {
  const { user, token } = useContext(UserContext);
  const [accountBalance, setAccountBalance] = useState(''); // Initialize account balance as an empty string

  useEffect(() => {
    // Access the user ID from user data
    const userId = user._id;

    // Make an API call to fetch the account balance
    axios
      .get(`/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          // Set the account balance from the response data
          setAccountBalance(response.data.balance);
        } else {
          console.error('Unable to fetch account balance:', response.data.error);
        }
      })
      .catch((error) => {
        console.error('Error fetching account balance:', error);
      });
  }, [user._id, token]);

  return (
    <div className={styles.dashboard}>
      <div className={styles.dashboardContent}>
        <div className={styles.balanceContent}>
          {/* This div shows the account balance */}
          <div className={styles.accountBalance}>
            <strong> Account Balance:</strong> {accountBalance}
          </div>
          <Card />
        </div>
        <div className={styles.transactionsChart}>
          <div className={styles.chartUtilities}>
            <ChartComponent />
          </div>
          <div className={styles.chartUtilities}>
            <Transaction />

            <Utilities />
          </div>
        </div>
      </div>
    </div>
  );
}
