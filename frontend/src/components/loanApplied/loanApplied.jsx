import React, { useState, useEffect } from "react";
import styles from "./loans.module.css";
import loan from "../../assets/bank-loan.jpg";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function LoanApplied() {
  const [loanApplications, setLoanApplications] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const userIDFunction = () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData && userData._id) {
      setUserId(userData._id);
    } else {
      toast.error("Unable to fetch loan application data.");
    }
  };

  useEffect(() => {
    userIDFunction();

    axios
      .get(`/api/loans/${userId}`)
      .then((response) => {
        if (response.status === 200) {
          setLoanApplications(response.data.loanRequests);
          setIsLoading(false);
        } else {
          console.error(
            "Error fetching loan application data:",
            response.status
          );
        }
      })
      .catch((error) => {
        console.error("Error fetching loan application data:", error);
      });
  }, [userId]);

  // Function to calculate EMI
  const calculateEMI = (loanAmount, interestRate, loanTerm) => {
    const principal = parseFloat(loanAmount);
    const annualInterestRate = interestRate;
    const monthlyInterestRate = annualInterestRate / 12 / 100;
    const loanTermMonths = loanTerm;
    const emi =
      (principal *
        monthlyInterestRate *
        Math.pow(1 + monthlyInterestRate, loanTermMonths)) /
      (Math.pow(1 + monthlyInterestRate, loanTermMonths) - 1);
    return emi.toFixed(2);
  };

  return (
    <div className={styles.bank_loans}>
      <ToastContainer />

      <div className={styles.loans}>
        <div className={styles.loans_left}>
          <h1>
            {" "}
            Payment up to 50K <br />
            Easy money, easy <br />
            payment{" "}
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
        {!isLoading && loanApplications.length === 0 && (
          <p>No loan applications available.</p>
        )}
        {loanApplications.map((loanRequest, index) => (
          <div key={index} className={styles.card}>
            <h5>Loan Application {index + 1}</h5>
            <div className={styles.loan_options}>
              <div>
                <label htmlFor={`loanPurpose_${index}`}>Loan Purpose:</label>
                <input
                  type="text"
                  id={`loanPurpose_${index}`}
                  value={loanRequest.loanPurpose}
                  readOnly
                />
              </div>
              <div>
                <label htmlFor={`loanAmount_${index}`}>Loan Amount:</label>
                <input
                  type="number"
                  id={`loanAmount_${index}`}
                  value={loanRequest.loanAmount}
                  readOnly
                />
              </div>
              <div>
                <label htmlFor={`emiAmount_${index}`}>EMI Amount:</label>
                <input
                  type="text"
                  id={`emiAmount_${index}`}
                  value={calculateEMI(
                    loanRequest.loanAmount,
                    loanRequest.interestRate,
                    loanRequest.loanTerm
                  )}
                  readOnly
                />
              </div>
            </div>
            <div className={styles.loan_options}>
              <div>
                <label htmlFor={`interestRate_${index}`}>
                  Interest Rate (%):
                </label>
                <input
                  type="text"
                  id={`interestRate_${index}`}
                  value={loanRequest.interestRate}
                  readOnly
                />
              </div>
              <div>
                <label htmlFor={`status_${index}`}>Status:</label>
                <input
                  type="text"
                  id={`status_${index}`}
                  value={loanRequest.status}
                  readOnly
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LoanApplied;
