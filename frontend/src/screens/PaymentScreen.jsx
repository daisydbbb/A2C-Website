import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Form, Button, Row, Col, Card } from "react-bootstrap";
import { useState, useEffect } from "react";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { savePaymentMethod, saveBillingAddress } from "../slices/cartSlice";
import { FaCreditCard } from "react-icons/fa";
import { FaPaypal } from "react-icons/fa";
import { ListGroup } from "react-bootstrap";

const PaymentScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [paymentMethod, setPaymentMethod] = useState("CreditCard");
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });
  const [discountCode, setDiscountCode] = useState("");

  // Billing Address
  const [
    billingAddressSameAsShippingAddress,
    setBillingAddressSameAsShippingAddress,
  ] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");

  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  useEffect(() => {
    if (!shippingAddress) {
      navigate("/shipping");
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    // check if billing address is same as shipping address
    if (billingAddressSameAsShippingAddress) {
      dispatch(saveBillingAddress(shippingAddress));
    } else {
      dispatch(
        saveBillingAddress({
          firstName,
          lastName,
          phone,
          email,
          address,
          city,
          postalCode,
          country,
        })
      );
    }
    navigate("/review");
  };

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <CheckoutSteps step1 step2 step3 />
      <FormContainer>
        <h2>Payment & Discounts</h2>
        <Form.Group className="mb-4">
          <Form.Label
            style={{
              fontWeight: "bold",
              fontSize: "1.2rem",
              fontFamily: "Arial, sans-serif",
            }}
          >
            Select Method
          </Form.Label>
          <Col>
            <Form.Check
              type="radio"
              label={
                <span>
                  <FaCreditCard className="me-2" />
                  Credit Card
                </span>
              }
              id="CreditCard"
              name="paymentMethod"
              value="CreditCard"
              checked={paymentMethod === "CreditCard"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            {paymentMethod === "CreditCard" && (
              <Card className="mt-2 mb-2">
                <Card.Body>
                  <Form.Group className="mb-2">
                    <Form.Label>Card Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardDetails.cardNumber}
                      onChange={handleCardInputChange}
                      maxLength="19"
                    />
                  </Form.Group>

                  <Form.Group className="mb-2">
                    <Form.Label>Name on Card</Form.Label>
                    <Form.Control
                      type="text"
                      name="cardName"
                      placeholder="John Doe"
                      value={cardDetails.cardName}
                      onChange={handleCardInputChange}
                    />
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-2">
                        <Form.Label>Expiration Date</Form.Label>
                        <Form.Control
                          type="text"
                          name="expiryDate"
                          placeholder="MM/YY"
                          value={cardDetails.expiryDate}
                          onChange={handleCardInputChange}
                          maxLength="5"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-2">
                        <Form.Label>CVV</Form.Label>
                        <Form.Control
                          type="text"
                          name="cvv"
                          placeholder="123"
                          value={cardDetails.cvv}
                          onChange={handleCardInputChange}
                          maxLength="3"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            )}

            <Form.Check
              type="radio"
              label={
                <span>
                  <FaPaypal className="me-2" />
                  PayPal
                </span>
              }
              id="PayPal"
              name="paymentMethod"
              value="PayPal"
              checked={paymentMethod === "PayPal"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            {paymentMethod === "PayPal" && (
              <ListGroup className="mt-2 mb-2">
                <ListGroup.Item>PayPal selected.</ListGroup.Item>
                <ListGroup.Item>
                  After submission, you will be redirected to PayPal to complete
                  next steps.
                </ListGroup.Item>
              </ListGroup>
            )}
          </Col>

          <Form.Label className="mt-3">Gift or Discount Code</Form.Label>
          <Row>
            <Col md={10}>
              <Form.Control
                type="text"
                placeholder="Enter code"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
              />
            </Col>
            <Col md={2}>
              <Button variant="primary">Apply</Button>
            </Col>
          </Row>
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label
            style={{
              fontWeight: "bold",
              fontSize: "1.2rem",
              fontFamily: "Arial, sans-serif",
              marginTop: "1rem",
            }}
          >
            Billing Address
          </Form.Label>

          <Row>
            <Col md={10}>
              <Form.Check
                type="checkbox"
                label="Billing address same as shipping address"
                checked={billingAddressSameAsShippingAddress}
                onChange={(e) =>
                  setBillingAddressSameAsShippingAddress(
                    !billingAddressSameAsShippingAddress
                  )
                }
              />
            </Col>
          </Row>

          {!billingAddressSameAsShippingAddress && (
            <Form onSubmit={submitHandler}>
              <Row className="mt-2">
                <Col md={6}>
                  <Form.Group controlId="firstName" className="my-2">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="lastName" className="my-2">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group controlId="phone" className="my-2">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId="email" className="my-2">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId="address" className="my-2">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId="city" className="my-2">
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId="postalCode" className="my-2">
                <Form.Label>Postal Code</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter postal code"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId="country" className="my-2">
                <Form.Label>Country</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                ></Form.Control>
              </Form.Group>
            </Form>
          )}
        </Form.Group>
        <Button
          variant="light"
          className="mt-2"
          onClick={() => navigate("/shipping")}
        >
          Back
        </Button>
        {paymentMethod === "CreditCard" && (
          <Button
            type="submit"
            variant="primary"
            className="mt-2 float-end"
            onClick={submitHandler}
          >
            Continue
          </Button>
        )}
        {paymentMethod === "PayPal" && (
          <Button type="submit" variant="primary" className="mt-2 float-end">
            Pay with PayPal
          </Button>
        )}
      </FormContainer>
    </>
  );
};

export default PaymentScreen;
