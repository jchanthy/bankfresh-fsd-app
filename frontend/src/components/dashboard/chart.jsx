import React, { useState, useEffect, useContext } from 'react';
import { Line } from 'react-chartjs-2';
import styles from './dashboard.module.css';
import Chart from 'chart.js/auto';
import axios from 'axios';
import { UserContext } from '../../ctx/UserContextProvider';

Chart.register();

export default function ChartComponent() {
  const { user } = useContext(UserContext);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Expenditure',
        data: [], // Initialize with empty data
        borderColor: '#8B4D6C',
        borderWidth: 2,
        fill: false,
      },
    ],
  });

  useEffect(() => {
    // Fetch data from the backend API

    const userId = user._id;

    axios
      .get(`/api/transactions/${userId}`)
      .then((response) => {
        if (response.status === 200) {
          const transactionData = response.data.transactions;

          // Extract labels (timestamps) and data (amounts) from the transaction data
          const labels = transactionData.map((transaction) => transaction.timestamp);
          const data = transactionData.map((transaction) => transaction.amount);

          // Update the chart data with the fetched data
          setChartData({
            ...chartData,
            labels,
            datasets: [
              {
                ...chartData.datasets[0],
                data,
              },
            ],
          });
        } else {
          console.log('Unable to fetch transaction data:', response.data.error);
        }
      })
      .catch((error) => {
        console.error('Error fetching transaction data:', error);
      });
  }, [user, chartData]);

  const chartOptions = {
    scales: {
      x: {
        display: false, // Hide X-axis labels
      },
      y: {
        title: {
          display: true,
          text: 'Amount',
        },
        grid: {
          display: false, // Hide Y-axis gridlines
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };

  return (
    <div className={styles.card}>
      <div className={styles.chart}>
        <h3>Financial Overview</h3>
        <Line data={chartData} options={chartOptions} width={1000} height={700} />
      </div>
    </div>
  );
}
