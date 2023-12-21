import React, { useState, useEffect } from "react";
import styles from "./recentPayee.module.css";
import { Link } from "react-router-dom";

import axios from "axios";

export default function RecentPayee() {
  const [payees, setPayees] = useState([]);

  useEffect(() => {
    // Fetch payee data from the backend
    async function fetchPayees() {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        const userId = user._id;
        console.log(userId);
        const response = await axios.get(`/api/payee/${userId}`);
        console.log(response.data);
        setPayees(response.data);
      } catch (error) {
        console.error("Error fetching payees:", error);
      }
    }

    fetchPayees();
  }, []);

  return (
    <div className={styles.payeeContainer}>
      <h3>Recent Payees</h3>
      <div className={styles.payeeList}>
        <table>
          <thead>
            <tr>
              <th>Payee Name</th>
            </tr>
          </thead>
          <tbody>
            {payees.map((payee, index) => (
              <tr key={index}>
                <td>{payee.payeeName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.showMoreButton}>
        <Link to="/transfermoney">Show More</Link>
      </div>
    </div>
  );
}
