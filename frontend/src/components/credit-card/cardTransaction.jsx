import React, { useState, useEffect } from 'react';
import styles from './cardTransaction.module.css';
import { FaDownload } from 'react-icons/fa';
import { PDFDownloadLink, Page, Text, View, Document } from '@react-pdf/renderer';

export default function TransactionStatement({ transactionsData }) {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState(transactionsData); // Initialize with all transactions

  useEffect(() => {
    setFilteredTransactions(transactionsData);
  }, [transactionsData]);

  const handleFromDateChange = (e) => {
    setFromDate(e.target.value);
  };

  const handleToDateChange = (e) => {
    setToDate(e.target.value);
  };

  const filterTransactionsByDate = () => {
    const fromDateObj = new Date(fromDate);
    const toDateObj = new Date(toDate);

    if (fromDate === '' && toDate === '') {
      // If both filters are empty, show all transactions
      setFilteredTransactions(transactionsData);
    } else {
      const filteredTransactions = transactionsData.filter((transaction) => {
        const transactionDate = new Date(transaction.timestamp);
        return transactionDate >= fromDateObj && transactionDate <= toDateObj;
      });

      setFilteredTransactions(filteredTransactions);
    }
  };

  const handleShowTransactionsClick = () => {
    // Filter transactions based on the date range
    filterTransactionsByDate();
  };

  const generatePDFDocument = () => {
    // Define the headers
    const headers = ['Name', 'Account No', 'Transaction id', 'Amount'];

    // Define styles for the PDF
    const pdfStyles = {
      page: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: '#ffffff',
      },
      section: {
        margin: 10,
        padding: 10,
        flexGrow: 1,
      },
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

    // Create the PDF
    return (
      <Document>
        <Page size="A4" style={pdfStyles.page}>
          <View style={pdfStyles.section}>
            <Text>Transaction Statement</Text>
          </View>
          <View style={pdfStyles.section}>
            <View style={pdfStyles.table}>
              <View style={pdfStyles.th}>
                {headers.map((header, index) => (
                  <Text key={index}>{header}</Text>
                ))}
              </View>
              {filteredTransactions.map((transaction, index) => (
                <View key={index} style={pdfStyles.tr}>
                  <View style={pdfStyles.td}>
                    <Text>{transaction.receiverName}</Text>
                  </View>
                  <View style={pdfStyles.td}>
                    <Text>{transaction.receiverUserId}</Text>
                  </View>
                  <View style={pdfStyles.td}>
                    <Text>{transaction.amount}</Text>
                  </View>
                  <View style={pdfStyles.td}>
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
                  <FaDownload />
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
            <th>Amount</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.length === 0 ? (
            <tr>
              <td colSpan="4">No transactions available in the selected date range.</td>
            </tr>
          ) : (
            filteredTransactions.map((transaction, index) => <TransactionRow key={index} transaction={transaction} />)
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

  return (
    <tr className={styles.transactionRow}>
      <td>
        <div className={styles.icon} style={{ backgroundColor: getRandomColor() }}>
          {getInitials(transaction.name)}
        </div>
        {transaction.receiverName}
      </td>
      <td>{transaction.receiverUserId}</td>
      <td>{transaction.amount}</td>
      <td>{new Date(transaction.timestamp).toLocaleDateString()}</td>
    </tr>
  );
}
