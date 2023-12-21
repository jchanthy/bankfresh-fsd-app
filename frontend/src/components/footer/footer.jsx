/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import styles from "./footer.module.css";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div className={styles.footer_wrp}>
      <div className={styles.footer_innr_wrp}>
        <div className={styles.address}>
          <h5>Address </h5>
          <p>
            123, ABC Street
            <br />
            Mumbai
            <br />
            Maharashtra
            <br />
            PIN Code: 123456
            <br />
            India
          </p>
        </div>
        <div className={styles.contact_us}>
          <h5>Call us on </h5>
          <p>
            Call: 1800-000-0000
            <br />
            SMS to 12121200 or +911230456789
          </p>
        </div>

        <div className={styles.info}>
          <h5> Get the latest information from us</h5>
          <form>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email id"
              required
            />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>
      <div className={styles.copyright}>
        <h5>&copy; Copyright Bank Fresh </h5>
        <h5>
          <Link to="/privacypolicy" className={styles.link}>
            Privacy Policy
          </Link>
        </h5>
        <div className={styles.connect}>
          <h5>Connect us on</h5>
          <div className={styles.social_icons}>
            <a href="#">
              <FaFacebook className={styles.social_icon} />
            </a>
            <a href="#">
              <FaTwitter className={styles.social_icon} />
            </a>
            <a href="#">
              <FaInstagram className={styles.social_icon} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
