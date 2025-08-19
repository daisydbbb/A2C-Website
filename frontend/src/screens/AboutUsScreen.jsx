import React from "react";
import { Row, Col } from "react-bootstrap";
import logo from "../assets/logo.png";

const AboutUsScreen = () => {
  return (
    <>
      <h1>About Us</h1>

      <Row style={{ marginTop: 120, marginLeft: 20 }}>
        <Col>
          <h2>It all begins with a passion</h2>
          <p style={{ fontSize: 20 }}>
            Addicted2CardboardLLC was created because of our love for all things
            cardboard, game related. As of 2024 we are just a small online
            company with the dreams and doing big things in the cardboard
            industry. We thank you for your support and we hope you continue
            supporting in us in the future.
          </p>
        </Col>
        <Col>
          <img
            src={logo}
            width="300"
            height="300"
            alt="Addicted2Cardboard"
            style={{ marginLeft: 50 }}
          />
        </Col>
      </Row>
    </>
  );
};

export default AboutUsScreen;
