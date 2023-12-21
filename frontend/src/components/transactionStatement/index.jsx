import React, { useState, useEffect, useContext, useCallback } from 'react';
import styles from './TransactionStatement.module.css';
import axios from 'axios';
import { FaDownload } from 'react-icons/fa';
import { PDFDownloadLink, Page, Text, View, Document } from '@react-pdf/renderer';
import { UserContext } from '../../ctx/UserContextProvider';

// Define a styles object for your PDF table
const pdfTableStyles = {
  table: {
    width: '100%',
    border: '1px solid #000',
    borderCollapse: 'collapse',
  },
  th: {
    border: '1px solid #000',
    backgroundColor: '#f2f2f2',
    padding: '8px',
    textAlign: 'left',
  },
  td: {
    border: '1px solid #000',
    padding: '8px',
    textAlign: 'left',
  },
};

export default function TransactionStatement() {
  const { user } = useContext(UserContext);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [transactions, setTransactions] = useState([]);
  const handleFromDateChange = (e) => {
    setFromDate(e.target.value);
  };

  const handleToDateChange = (e) => {
    setToDate(e.target.value);
  };

  const fetchTransactions = useCallback(async () => {
    try {
      if (user && user._id) {
        const response = await axios.get(`/api/transactions/${user._id}`);
        if (response.status === 200) {
          const data = response.data.transactions?.map((t) => {
            const date = new Date(t.timestamp);
            const formattedDate = date.toLocaleString();

            // Check if a date range is specified
            if (fromDate && toDate && !isWithinDateRange(date, fromDate, toDate)) {
              return null; // Transaction is outside the date range
            }

            return {
              name: t.receiverName,
              accountNo: t.receiverUserId,
              amount: t.amount,
              transaction_id: t._id,
              date: formattedDate,
            };
          });

          // Remove null entries (transactions outside date range)
          const filteredData = data.filter((item) => item !== null);
          setTransactions(filteredData);
        } else {
          console.log('Unable to fetch transactions:', response.data.error);
        }
      } else {
        console.log('User data not found.');
      }
    } catch (err) {
      console.error('Error occurred:', err);
    }
  }, [user, fromDate, toDate]);

  const isWithinDateRange = (date, fromDate, toDate) => {
    const transactionDate = date;
    const fromDateObj = new Date(fromDate);
    const toDateObj = new Date(toDate);

    // Check if the transaction date is within the specified date range
    return transactionDate >= fromDateObj && transactionDate <= toDateObj;
  };

  const filterTransactionsByDate = () => {
    // Filter transactions based on the date range
    const filteredTransactions = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      const fromDateObj = new Date(fromDate);
      const toDateObj = new Date(toDate);

      // Check if the transaction date is within the specified date range
      return transactionDate >= fromDateObj && transactionDate <= toDateObj;
    });

    setTransactions(filteredTransactions);
  };

  const handleShowTransactionsClick = async () => {
    // First, fetch all transactions
    fetchTransactions();
    // Then, filter transactions based on the date range
    filterTransactionsByDate();
  };

  const generatePDFDocument = () => {
    const headers = ['Name', 'Account No', 'Transaction id', 'Amount', 'Date'];

    return (
      <Document>
        <Page size="A4">
          <View>
            <Text>Transaction Statement</Text>
          </View>
          <View>
            <View style={pdfTableStyles.table}>
              <View style={pdfTableStyles.th}>
                {headers.map((header, index) => (
                  <Text key={index}>{header}</Text>
                ))}
              </View>
              {transactions.map((transaction, index) => (
                <View key={index} style={pdfTableStyles.tr}>
                  <View style={pdfTableStyles.td}>
                    <Text>{transaction.name}</Text>
                  </View>
                  <View style={pdfTableStyles.td}>
                    <Text>{transaction.accountNo}</Text>
                  </View>
                  <View style={pdfTableStyles.td}>
                    <Text>{transaction.transaction_id}</Text>
                  </View>
                  <View style={pdfTableStyles.td}>
                    <Text>{transaction.amount}</Text>
                  </View>
                  <View style={pdfTableStyles.td}>
                    <Text>{transaction.date}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </Page>
      </Document>
    );
  };

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return (
    <div className={styles.transactionStatement}>
      <div className={styles.search}>
        <div>
          <h4>Transaction Statement</h4>
        </div>
        <div className={styles.dateFilter}>
          <label>From Date:</label>
          <input type="date" value={fromDate} onChange={handleFromDateChange} />
          <label>To Date:</label>
          <input type="date" value={toDate} onChange={handleToDateChange} />
          <button onClick={handleShowTransactionsClick}>Show Transactions</button>
          <PDFDownloadLink document={generatePDFDocument()} fileName="transaction_statement.pdf" className="button">
            {({ blob, url, loading, error }) =>
              loading ? (
                'Generating PDF...'
              ) : (
                <a href={url}>
                  <FaDownload /> Download
                </a>
              )
            }
          </PDFDownloadLink>
        </div>
      </div>
      <table className={styles.transactionTable}>
        <thead className={styles.tableHead}>
          <tr>
            <th>Name</th>
            <th>Account No</th>
            <th>Transaction id</th>
            <th>Amount</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan="5">No transactions available.</td>
            </tr>
          ) : (
            transactions.map((transaction, index) => <TransactionRow key={index} transaction={transaction} />)
          )}
        </tbody>
      </table>
    </div>
  );
}

function TransactionRow({ transaction }) {
  const getRandomColor = () => {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  };

  function getInitials(name) {
    if (name && typeof name === 'string') {
      const nameParts = name.split(' ');
      if (nameParts.length >= 2) {
        return nameParts[0][0] + nameParts[1][0];
      }
      return nameParts[0][0];
    }
    return '';
  }

  const iconBackgroundColor = getRandomColor();
  const initials = getInitials(transaction.name);

  return (
    <tr className={styles.transactionRow}>
      <td>
        <div className={styles.icon} style={{ backgroundColor: iconBackgroundColor }}>
          {initials}
        </div>
        {transaction.name}
      </td>
      <td>{transaction.accountNo}</td>
      <td>{transaction.transaction_id}</td>
      <td style={{ color: transaction.type === 'incoming' ? 'green' : 'red' }}>{transaction.amount}</td>
      <td>{transaction.date}</td>
    </tr>
  );
}
