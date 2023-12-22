import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaExchangeAlt, FaUser, FaFileAlt, FaMoneyBillAlt } from 'react-icons/fa';
import styles from './sideNavbar.module.css';

const tabs = [
  { icon: <FaHome />, label: 'Home', to: '/dashboard' },
  { icon: <FaExchangeAlt />, label: 'Transfers', to: '/transferMoney' },
  {
    icon: <FaFileAlt />,
    label: 'Digital Statement',
    to: '/transactionStatement',
  },
  {
    icon: <FaMoneyBillAlt />,
    label: 'Card Service',
    to: '/card-services',
  },
  {
    icon: <FaMoneyBillAlt />,
    label: 'PayBills',
    to: '/payBills',
  },
  {
    icon: <FaUser />,
    label: 'Update Profile',
    to: '/update-profile',
  },
  {
    icon: <FaMoneyBillAlt />,
    label: 'Apply for Loan',
    to: '/loan',
  },
  {
    icon: <FaMoneyBillAlt />,
    label: 'Loans Applied',
    to: '/loan-applied',
  },
];

function SideNavbar() {
  return (
    <div className={styles.sideNavbar}>
      <ul className={styles.navList}>
        {tabs.map((tab, index) => (
          <li key={index} className={styles.navItem}>
            <Link to={tab.to} className={styles.link}>
              <span className={styles.icon}>{tab.icon}</span>
              <span className={styles.label}>{tab.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SideNavbar;
