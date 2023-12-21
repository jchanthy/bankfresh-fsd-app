import React from "react";
import styles from "./homepage.module.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; // Import slick-carousel styles
import "slick-carousel/slick/slick-theme.css"; // Import slick-carousel theme styles
import Bill from "../../assets/Bill-Paid-Payment.png";
import Card from "../../assets/credit-card-black.png";
import Statement from "../../assets/statement.png";
import Fund from "../../assets/fund.png";

import ContactUs from "../contactUs/contactUs";
import Footer from "../footer/footer";

function Homepage() {
  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className={styles.homepage}>
      <div className={styles.banner}>
        <Slider {...settings}>
          <div>
            <h4>Banking Solutions</h4>
            <p>
              Experience a new era of banking where convenience meets security.
              Our cutting-edge
              <br />
              technology and personalized services empower you to take control
              of your finances
              <br />
              like never before. Discover a world of possibilities with us.
            </p>
          </div>
          <div>
            <h4>Easy Loans</h4>
            <p>
              Secure hassle-free loans for your financial needs with our easy
              loan solutions.
              <br /> Enjoy quick approvals, competitive rates, and flexible
              repayment options.
            </p>
          </div>
          <div>
            <h4>Pay Bills</h4>
            <p>
              Effortlessly manage and pay your bills with our secure banking
              application. <br />
              Enjoy the convenience of setting up recurring payments, tracking
              expenses, <br />
              and ensuring timely payments, all from one user-friendly platform.
            </p>
          </div>
          {/* Add more slides as needed */}
        </Slider>
      </div>
      <div className={styles.slider}>
        <h2>Financial transactions using Internet Banking</h2>
        <p>
          From savings to investment and from fund transfers to bill payment you
          can do all this and more using Internet Banking via your Bank Fresh
          account.
        </p>
        <div className={styles.what}>
          <div className={styles.left}>
            <h2>What We Do </h2>
          </div>
          <div className={styles.right}>
            <ul className={styles.horizontal_list}>
              <li>
                <img src={Bill} alt="" />
                <p>
                  Bill <br /> Payments{" "}
                </p>
              </li>
              <li>
                <img src={Fund} alt="" />
                <p>
                  Fund <br />
                  Transfers{" "}
                </p>
              </li>
              <li>
                <img src={Statement} alt="" />
                <p>
                  Digital
                  <br /> Statements{" "}
                </p>
              </li>
              <li>
                <img src={Card} alt="" />
                <p>
                  Credit <br />
                  Card Services
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <ContactUs />
      <Footer />
    </div>
  );
}

export default Homepage;
