import React, { useEffect, useState, useContext } from 'react';
import styles from './creditcard.module.css';
import axios from 'axios';
import TransactionStatement from './cardTransaction';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserContext } from '../../ctx/UserContextProvider';

const CreditCard = () => {
  const [creditCards, setCreditCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null); // New state to store the selected card
  const [userId, setUserId] = useState(null);
  const [transactionLimit, setTransactionLimit] = useState(0);
  const [cardTransactions, setCardTransactions] = useState([]);
  const { user, token } = useContext(UserContext);

  const fetchCreditCards = async () => {
    try {
      if (user && user._id) {
        const userId = user._id;
        setUserId(userId);

        const response = await axios.get(`/api/credit-cards/${userId}`);

        if (response.status === 200) {
          const data = response.data.creditCards;

          setCreditCards(data);
        } else {
          console.log('Unable to fetch credit card details:', response.data.error);
        }
      } else {
        console.log('Unable to fetch user data from localStorage.');
      }
    } catch (err) {
      console.error('Error occurred while fetching credit card details:', err);
    }
  };

  const applyForNewCard = async () => {
    try {
      const response = await axios.post('/api/credit-cards/apply', { userId });
      console.log('Apply for New Card API response:', response.data);

      if (response.status === 200) {
        // Assuming the response contains the new card details
        const newCard = response.data.newCard;
        console.log('New card created:', newCard);
        toast.success('Applied for new card successfully!');

        // Update the state to include the new card
        setCreditCards([...creditCards, newCard]);
      } else {
        console.log(response.data);
        console.log('Unable to apply for a new card:');
        toast.error('Unable to apply for a new card: ');
      }
    } catch (err) {
      if (err.message === 'Request failed with status code 400') {
        toast.error('Maximum 3 cards can be applied');
      } else {
        console.error('Error occurred while applying for a new card:', err);
        toast.error(err.message);
      }
    }
  };

  const blockCard = async () => {
    try {
      if (!selectedCard) {
        console.log('No card selected.');
        return;
      }

      const response = await axios.put(`/api/credit-cards/block/${selectedCard._id}`);
      console.log('Block Card API response:', response.data);

      if (response.status === 200) {
        if (selectedCard.block) {
          // Card was deactivated
          console.log('Card activated successfully.');
          toast.success('Card activated successfully.');
        } else {
          // Card was activated
          console.log('Card deactivated successfully.');
          toast.success('Card deactivated successfully.');
        }

        // Update the local selectedCard to reflect the change in card status
        setSelectedCard({ ...selectedCard, block: !selectedCard.block });
      } else {
        console.log('Unable to block the card:', response.data.error);
        toast.error('Unable to block the card ' + response.data.error);
      }
    } catch (err) {
      console.error('Error occurred while blocking the card:', err);
      toast.error('Unable to block the card ');
    }
  };

  // Function to handle card selection
  const handleCardSelection = async (card) => {
    setSelectedCard(card);

    // Fetch transactions for the selected card
    try {
      const cardId = card._id;
      console.log('card in transaction', card, 'card is is ', cardId);
      const response = await axios.get(`/api/card-transactions/${cardId}`);
      if (response.status === 200) {
        const data = response.data;
        console.log(data);
        setCardTransactions(data);
      } else {
        console.log('Unable to fetch transactions:', response.data.error);
      }
    } catch (err) {
      console.error('Error occurred while fetching transactions:', err);
    }
  };

  const updateTransactionLimit = async () => {
    try {
      if (!selectedCard) {
        console.log('No card selected.');
        return;
      }

      const response = await axios.put(`/api/credit-cards/update-transaction-limit/${selectedCard._id}`, { transactionLimit });

      if (response.status === 200) {
        // Assuming the response contains a message indicating success
        console.log('Transaction limit updated successfully.');
        toast.success('Transaction limit updated successfully.');
      } else {
        console.log('Unable to update transaction limit:', response.data.error);
        toast.error('Unable to update transaction limit: ' + response.data.error);
      }
    } catch (err) {
      console.error('Error occurred while updating transaction limit:', err);
      toast.error('Error updating transaction limit.');
    }
  };

  useEffect(() => {
    fetchCreditCards();
  }, []);

  return (
    <div className={styles.cardComponent}>
      <div className={styles.cardLeft}>
        {creditCards.length > 0 ? (
          creditCards.map((card, index) => (
            <div
              key={index}
              className={`${styles.creditCard} ${card === selectedCard ? styles.selected : ''}`}
              onClick={() => handleCardSelection(card)} // Add click event to select the card
            >
              <div className={styles.cardLogo}>VISA</div>
              <div className={styles.cardNumber}>{card.cardNumber}</div>
              <div className={styles.cardHolder}>{card.cardHolderName}</div>
              <div className={styles.cardExpiration}>{card.expirationDate}</div>
            </div>
          ))
        ) : (
          <p>No credit card data available.</p>
        )}
      </div>
      <div className={styles.cardActions}>
        <div className={styles.cardActionsHeader}>Card Actions for ({selectedCard ? selectedCard.cardNumber : ''})</div>
        <div className={styles.cardActionButtonComponent}>
          <input
            type="text"
            placeholder="Per Transaction Limit"
            className={styles.cardActionInput}
            value={transactionLimit}
            onChange={(e) => setTransactionLimit(e.target.value)}
          />

          <button className={styles.cardActionButtonSetLimit} onClick={updateTransactionLimit}>
            Set Limit
          </button>
          <button className={styles.cardActionButtonApplyCard} onClick={applyForNewCard}>
            Apply for New Card
          </button>
          <button className={styles.cardActionButtonBlockCard} onClick={blockCard}>
            {selectedCard && selectedCard.block ? 'Activate' : 'De-Activate'}
          </button>
        </div>
      </div>
      <TransactionStatement creditCardId={selectedCard ? selectedCard.id : null} transactionsData={cardTransactions} />

      <ToastContainer />
    </div>
  );
};

export default CreditCard;
