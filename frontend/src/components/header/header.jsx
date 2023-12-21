/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import Logo from "../../assets/logo.png";
import styles from "./header.module.css";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const goToLogin = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    window.location.reload();
  };

  const handleLogoClick = () => {
    if (token) {
      // Token is present, navigate to the dashboard
      navigate("/dashboard");
    } else {
      // Token is not present, navigate to the home page
      navigate("/");
    }
  };

  // Check if a token is present in local storage
  const token = localStorage.getItem("token");

  return (
    <div className={styles.header_wrp}>
      <div className={styles.header_innr_wrp}>
        <div className={styles.logo} onClick={handleLogoClick}>
          <img src={Logo} alt="" />
        </div>
        <div className={styles.login}>
          {/* Conditionally render buttons */}
          {token ? (
            <button onClick={goToLogin} className={styles.login_button}>
              Logout
            </button>
          ) : (
            <>
              <a className={styles.open_button} href="/openAccount">
                Open Digital A/C
              </a>
              <button onClick={goToLogin} className={styles.login_button}>
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
