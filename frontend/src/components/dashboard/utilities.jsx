import React from "react";
import {
  FaMoneyBill,
  FaHandHoldingUsd,
  FaExchangeAlt,
  FaCreditCard,
  FaMoneyCheck,
  FaLifeRing,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import styles from "./dashboard.module.css";

export default function Utilities() {
  return (
    <div className={styles.utilitiesContainer}>
      <h3>Utilities</h3>
      <div className={styles.utilities}>
        <div className={styles.row}>
          <Utility
            icon={<FaMoneyBill />}
            text="Pay Bills"
            color="#007BFF"
            to="/payBills"
          />
          <Utility
            icon={<FaHandHoldingUsd />}
            text="Loans"
            color="#8E44AD"
            to="/loan"
          />
          <Utility
            icon={<FaExchangeAlt />}
            text="Transfer Money"
            color="#AC6753"
            to="/transferMoney"
          />
        </div>
        <div className={styles.row}>
          <Utility
            icon={<FaMoneyCheck />}
            text="Loans Applied"
            color="#3B5998"
            to="/loan-applied"
          />
          <Utility
            icon={<FaCreditCard />}
            text="Card Services"
            color="#E74C3C"
            to="/card-services"
          />
          <Utility
            icon={<FaLifeRing />}
            text="Contact Us"
            color="#27AE60"
            to="/contact-us"
          />
        </div>
      </div>
    </div>
  );
}

function Utility({ icon, text, color, to }) {
  return (
    <Link to={to} className={styles.utility} style={{ color }}>
      {icon}
      <span>{text}</span>
    </Link>
  );
}
