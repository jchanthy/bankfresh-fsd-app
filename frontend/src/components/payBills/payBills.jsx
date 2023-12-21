import React, { useState, useEffect } from "react";
import styles from "./payBills.module.css";
import recharge_phone from "../../assets/phone-icon.png";
import gas from "../../assets/gas.jpg";
import water from "../../assets/water.png";
import electricity from "../../assets/electricity.png";
import dth from "../../assets/dth.png";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function PayBills() {
  const [selectedForm, setSelectedForm] = useState("MobileRecharge");
  const [paymentMethod, setPaymentMethod] = useState("NetBanking");
  const [userCreditCards, setUserCreditCards] = useState([]);
  const [selectedCreditCardId, setSelectedCreditCardId] = useState(null); // New state for selected credit card

  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem("user"))._id;
    console.log(userId);

    // Make an API request to fetch user credit card data
    axios
      .get(`/api/credit-cards/${userId}`)
      .then((response) => {
        console.log("Response data:", response.data); // Log the entire response data
        const creditCards = response.data.creditCards; // Access the creditCards array
        console.log("Credit cards:", creditCards);

        if (Array.isArray(creditCards)) {
          // Set the userCreditCards state with the received data
          const cardsWithSelection = creditCards.map((card, index) => ({
            ...card,
            selected: index === 0, // Select the first card by default
          }));
          setUserCreditCards(cardsWithSelection);
          console.log("User credit cards:", cardsWithSelection);
        } else {
          console.error("Invalid data received for user credit cards.");
        }
      })
      .catch((error) => {
        console.error("Error fetching user credit cards:", error);
      });
  }, []);

  const selectCard = (cardNumber) => {
    // Update the selected state of the cards
    setUserCreditCards((prevCards) =>
      prevCards.map((card) => ({
        ...card,
        selected: card.cardNumber === cardNumber,
      }))
    );
  };

  const openForm = (formName) => {
    setSelectedForm(formName);
  };

  // Form data and logic for "Mobile Recharge"
  const [localMobileNumber, setLocalMobileNumber] = useState("");
  const [amount, setAmount] = useState("");

  const handleMobileNumberChange = (event) => {
    // Remove the "+91" prefix and any non-numeric characters from the input
    const newMobileNumber = event.target.value.replace(/\D/g, "");
    setLocalMobileNumber(newMobileNumber);
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const handleRecharge = async () => {
    // Add validation checks
    if (!localMobileNumber || !amount) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const generateRandomUserId = () => {
      return uuidv4(); // Generates a random UUID
    };

    try {
      let data;
      if (paymentMethod === "Card") {
        if (!selectedCreditCardId) {
          toast.error("Please select a credit card.");
          return;
        }

        data = {
          userId: JSON.parse(localStorage.getItem("user"))._id,
          receiverUserId: generateRandomUserId(),
          amount,
          description: "Optional description of the transaction",
          receiverName: "Bill Pay",
          cardId: selectedCreditCardId,
        };
      } else {
        data = {
          userId: JSON.parse(localStorage.getItem("user"))._id,
          receiverUserId: generateRandomUserId(),
          amount,
          description: "Optional description of the transaction",
          receiverName: "Bill Pay",
        };
      }

      // Determine the API endpoint based on the payment method
      const apiEndpoint =
        paymentMethod === "Card"
          ? "/api/card-transactions/create"
          : "/api/transactions/create";

      // Make an HTTP POST request to the appropriate API endpoint
      const response = await axios.post(apiEndpoint, data);

      // Handle the response from the backend (e.g., show a success message)
      console.log("Payment successful:", response.data);
      toast.success("Payment Successful", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Clear the form fields for mobile recharge
      setLocalMobileNumber(""); // Clear the mobile number
      setAmount(""); // Clear the amount
    } catch (error) {
      // Handle any errors (e.g., show an error message)
      console.log(error.response.data);
      toast.error("Payment Failed, Limit Exceed", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);

    // When the payment method is changed to "Card", select the first available card
    if (method === "Card" && userCreditCards.length > 0) {
      setSelectedCreditCardId(userCreditCards[0]._id);
    }
  };

  return (
    <div className={styles.paybills}>
      <ToastContainer position="top-right" autoClose={3000} />

      <h2>Recharge And PayBills</h2>
      <div className={styles.icons}>
        <div className={styles.recharge}>
          <button onClick={() => openForm("MobileRecharge")}>
            <img src={recharge_phone} alt="Mobile Recharge" />
            <p>Mobile Recharge</p>
          </button>
        </div>
        <div className={styles.electricity}>
          <button onClick={() => openForm("Electricity")}>
            <img src={electricity} alt="Electricity" />
            <p>Electricity</p>
          </button>
        </div>
        <div className={styles.gas}>
          <button onClick={() => openForm("Gas")}>
            <img src={gas} alt="Gas" />
            <p>Gas</p>
          </button>
        </div>
        <div className={styles.water}>
          <button onClick={() => openForm("Water")}>
            <img src={water} alt="Water" />
            <p>Water</p>
          </button>
        </div>
        <div className={styles.dth}>
          <button onClick={() => openForm("DTH")}>
            <img src={dth} alt="DTH" />
            <p>DTH</p>
          </button>
        </div>
      </div>

      <div className={styles.paymentMethod}>
        <p>Payment Method:</p>
        <label>
          <input
            type="radio"
            value="NetBanking"
            checked={paymentMethod === "NetBanking"}
            onChange={() => handlePaymentMethodChange("NetBanking")}
          />
          Net Banking
        </label>
        <label>
          <input
            type="radio"
            value="Card"
            checked={paymentMethod === "Card"}
            onChange={() => handlePaymentMethodChange("Card")}
          />
          Card
        </label>

        {paymentMethod === "Card" && userCreditCards.length > 0 ? (
          <div className={styles.netBankingDropdown}>
            <label>Select Card:</label>
            <select>
              {userCreditCards.map((card, index) => (
                <option
                  key={index}
                  value={card.cardNumber}
                  selected={card.selected} // Select the card if it's selected
                  onClick={() => selectCard(card.cardNumber)}
                >
                  {card.cardNumber}
                </option>
              ))}
            </select>
          </div>
        ) : paymentMethod === "Card" ? (
          <div className={styles.netBankingDropdown}>
            <p>No cards available.</p>
          </div>
        ) : null}
      </div>

      {/* Conditionally render the selected form */}
      {selectedForm === "MobileRecharge" ? (
        <MobileRechargeForm
          mobileNumber={localMobileNumber}
          amount={amount}
          onMobileNumberChange={handleMobileNumberChange}
          onAmountChange={handleAmountChange}
          onRecharge={handleRecharge}
        />
      ) : (
        <GenericForm
          heading={`Payment for ${selectedForm}`}
          paymentMethod={paymentMethod}
          selectedCreditCardId={selectedCreditCardId}
          handlePayment={handleRecharge}
        />
      )}
    </div>
  );
}

function MobileRechargeForm({
  mobileNumber,
  amount,
  onMobileNumberChange,
  onAmountChange,
  onRecharge,
}) {
  return (
    <div className={styles.pay_form}>
      <h3>Mobile Recharge</h3>
      <form>
        <div>
          <label htmlFor="mobileNumber">Mobile Number:</label>
          <input
            type="text"
            id="mobileNumber"
            value={mobileNumber}
            onChange={onMobileNumberChange}
            placeholder="Enter mobile number"
            className={styles.form_input}
          />
        </div>
        <div className={styles.form_fields}>
          <label htmlFor="amount">Amount:</label>
          <input
            type="text"
            id="amount"
            value={amount}
            onChange={onAmountChange}
            placeholder="Enter amount"
            className={styles.form_input}
          />
        </div>
        <button type="button" onClick={onRecharge}>
          Recharge
        </button>
      </form>
    </div>
  );
}

function GenericForm({
  heading,
  paymentMethod,
  selectedCreditCardId,
  handlePayment,
}) {
  const [billNumber, setBillNumber] = useState("");
  const [amount, setAmount] = useState("");

  const handleBillNumberChange = (event) => {
    setBillNumber(event.target.value);
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const handleSubmit = async () => {
    // Add validation checks
    if (!billNumber || !amount) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const generateRandomUserId = () => {
      return uuidv4(); // Generates a random UUID
    };

    try {
      let data;
      if (paymentMethod === "Card") {
        if (!selectedCreditCardId) {
          toast.error("Please select a credit card.");
          return;
        }

        data = {
          userId: JSON.parse(localStorage.getItem("user"))._id,
          receiverUserId: generateRandomUserId(),
          amount,
          description: "Optional description of the transaction",
          receiverName: "Bill Pay",
          cardId: selectedCreditCardId,
        };
      } else {
        data = {
          userId: JSON.parse(localStorage.getItem("user"))._id,
          receiverUserId: generateRandomUserId(),
          amount,
          description: "Optional description of the transaction",
          receiverName: "Bill Pay",
        };
      }
      console.log(data);
      // Determine the API endpoint based on the payment method
      const apiEndpoint =
        paymentMethod === "Card"
          ? "/api/card-transactions/create"
          : "/api/transactions/create";

      // Make an HTTP POST request to the appropriate API endpoint
      const response = await axios.post(apiEndpoint, data);
      console.log(response.data);

      console.log("Payment made successfully:", response.data);
      toast.success("Payment Made Successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Clear the form fields
      setBillNumber("");
      setAmount("");
    } catch (error) {
      console.error("Payment Failed, Limit Exceed:", error);
      toast.error("Payment Failed, Limit Exceed", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <div className={styles.pay_form}>
      <h3>{heading}</h3>
      <form>
        <div>
          <label htmlFor="billNumber">Bill Number:</label>
          <input
            type="text"
            id="billNumber"
            value={billNumber}
            onChange={handleBillNumberChange}
            placeholder="Enter bill number"
            className={styles.form_input}
          />
        </div>
        <div className={styles.form_fields}>
          <label htmlFor="amount">Amount:</label>
          <input
            type="text"
            id="amount"
            value={amount}
            onChange={handleAmountChange}
            placeholder="Enter amount"
            className={styles.form_input}
          />
        </div>
        <button type="button" onClick={handleSubmit}>
          Pay
        </button>
      </form>
    </div>
  );
}

export default PayBills;
