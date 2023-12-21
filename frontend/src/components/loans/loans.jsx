import React, { useState } from "react";
import styles from "./loans.module.css";
import loan from "../../assets/bank-loan.jpg";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Loans() {
  const [loanType, setLoanType] = useState("home");
  const [loanAmount, setLoanAmount] = useState("");
  const [loanTerm, setLoanTerm] = useState(12);

  const [emi, setEMI] = useState(0);
  const [loanTypes] = useState([
    { value: "home", label: "Home Loan", interestRate: 8 },
    { value: "car", label: "Car Loan", interestRate: 9 },
    { value: "personal", label: "Personal Loan", interestRate: 10 },
  ]);

  // State for the new form
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  const handleLoanTypeChange = (event) => {
    setLoanType(event.target.value);
  };

  const handleLoanAmountChange = (event) => {
    const principal = parseFloat(event.target.value);
    const annualInterestRate = loanTypes.find(
      (type) => type.value === loanType
    ).interestRate;
    const monthlyInterestRate = annualInterestRate / 12 / 100;

    // Calculate loan term (in months) based on other factors
    const loanTermMonths = 12; // Set the loan term in months

    // Calculate EMI
    const emi =
      (principal *
        monthlyInterestRate *
        Math.pow(1 + monthlyInterestRate, loanTermMonths)) /
      (Math.pow(1 + monthlyInterestRate, loanTermMonths) - 1);

    // Update both loanAmount and emi state variables
    setLoanAmount(event.target.value);
    setEMI(emi.toFixed(2)); // Display the EMI with two decimal places
  };

  // Handlers for the new form
  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };

  const handleApply = () => {
    // Add validation for required fields
    if (!loanAmount || !name || !address) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Fetch the user ID from local storage
    const userData = JSON.parse(localStorage.getItem("user")); // Parse the JSON string
    const userId = userData._id;

    // Calculate the loan term (in months) based on EMI and other factors
    const annualInterestRate = loanTypes.find(
      (type) => type.value === loanType
    ).interestRate;
    const monthlyInterestRate = annualInterestRate / 12 / 100;

    const principal =
      (emi * Math.pow(1 + monthlyInterestRate, loanTerm) - emi) /
      (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTerm));

    // Create a loan object with the required fields
    const loanData = {
      userId,
      loanAmount: principal.toFixed(2), // Set the loan amount based on the calculated principal
      loanTerm,
      loanPurpose: loanType, // Assuming loanType is the loan purpose
      interestRate: loanTypes.find((type) => type.value === loanType)
        .interestRate,
    };

    // Send a POST request to your backend API using Axios
    axios
      .post("/api/loans/apply", loanData)
      .then((response) => {
        console.log("Loan request created successfully:", response.data);
        toast.success("Loan request created successfully");

        setLoanAmount(""); // Reset loanAmount
        setName(""); // Reset name
        setAddress(""); // Reset address
        setEMI(0); // Reset emi
      })
      .catch((error) => {
        console.error("Error creating loan request:", error);
        toast.error("Error creating loan request");
      });
  };

  return (
    <div className={styles.bank_loans}>
      <ToastContainer />

      <div className={styles.loans}>
        <div className={styles.loans_left}>
          <h1>
            {" "}
            Payment upto 50K <br />
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
        <h5>Loan Application Form</h5>
        <div className={styles.loan_options}>
          <div>
            <select
              id="loanType"
              value={loanType}
              onChange={handleLoanTypeChange}
            >
              {loanTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <input
              type="number"
              id="loanAmount"
              value={loanAmount}
              onChange={handleLoanAmountChange}
              placeholder="Enter loan amount"
            />
          </div>
          <div>
            <input
              type="text"
              id="emiAmount"
              value={emi}
              readOnly
              placeholder="EMI amount"
            />
          </div>
        </div>
        <div className={styles.details}>
          <div>
            <input
              type="text"
              id="name"
              value={name}
              onChange={handleNameChange}
              placeholder="Name"
              required
            />
          </div>
          <div>
            <input
              type="text"
              id="address"
              value={address}
              onChange={handleAddressChange}
              placeholder="Enter your address"
              required
            />
          </div>
          <button type="button" onClick={handleApply}>
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

export default Loans;
