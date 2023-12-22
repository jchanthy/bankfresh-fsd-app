import React, { useEffect, useState, useContext } from 'react';
import styles from './dashboard.module.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../../ctx/UserContextProvider';

export default function Card() {
  const [transactions, setTransactions] = useState([]); // State for storing transactions
  const [creditCards, setCreditCards] = useState([]); // State for storing credit card details
  const { user, token } = useContext(UserContext);

  // Fetch recent transactions when the component mounts
  useEffect(() => {
    // Function to fetch recent transactions
    const fetchRecentTransactions = async () => {
      try {
        const userId = user._id;

        // Send a GET request to fetch recent transactions
        const response = await axios.get(`/api/transactions/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const data = response.data.transactions.slice(0, 4); // Get the top 4 transactions
          setTransactions(data);
        } else {
          console.log('Unable to fetch recent transactions:', response.data.error);
        }
      } catch (err) {
        console.error('Error occurred while fetching transactions:', err);
      }
    };

    fetchRecentTransactions();
  }, [user, token]);

  // Fetch recent transactions and credit card details when the component mounts
  useEffect(() => {
    const fetchCreditCards = async () => {
      try {
        const userId = user._id;

        // Send a GET request to fetch credit card details
        const response = await axios.get(`/api/credit-cards/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const data = response.data.creditCards[0];

          setCreditCards(data);
        } else {
          console.log('Unable to fetch credit card details:', response.data.error);
        }
      } catch (err) {
        console.error('Error occurred while fetching credit card details:', err);
      }
    };

    fetchCreditCards(); // Add this line to fetch credit card details
  }, [user, token]);

  return (
    <div className={styles.card}>
      <h4>Your Cards</h4>
      <div className={styles.creditCard}>
        <div className={styles.cardLogo}>VISA</div>
        <div className={styles.cardNumber}>{creditCards?.cardNumber}</div>
        <div className={styles.cardHolder}>{creditCards?.cardHolderName}</div>
        <div className={styles.cardExpiration}>{creditCards?.expirationDate}</div>
      </div>
      <div className={styles.cardTypeShowMore}>
        <div className={styles.cardType}>Card Type: Visa</div>
        <div className={styles.showMoreButton}>
          <button>
            <Link to="/card-services">Show More</Link>
          </button>
        </div>
      </div>
      <div className={styles.recentTransactions}>
        <h3>Recent Transactions</h3>
        {transactions.map((transaction, index) => (
          <div className={styles.transaction} key={index}>
            <span className={styles.transactionName}>{transaction.receiverName}</span>
            <span className={styles.transactionAmount}>{transaction.amount}</span>{' '}
          </div>
        ))}
      </div>
      <button>
        <Link to="/transactionStatement">Show More</Link>
      </button>
    </div>
  );
}
