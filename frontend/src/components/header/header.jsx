/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext } from 'react';
import Logo from '../../assets/logo.png';
import styles from './header.module.css';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../ctx/UserContextProvider';

function Header() {
  const { token, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const goToLogin = () => {
    logout();
    navigate('/login');
  };

  const handleLogoClick = () => {
    if (token) {
      // Token is present, navigate to the dashboard
      navigate('/dashboard');
    } else {
      // Token is not present, navigate to the home page
      navigate('/');
    }
  };

  return (
    <div className={styles.header_wrp}>
      <div className={styles.header_innr_wrp}>
        <div className={styles.logo} onClick={handleLogoClick}>
          <img src={Logo} alt="Bankfresh" />
        </div>
        <div className={styles.login}>
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
