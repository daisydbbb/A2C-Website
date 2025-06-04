import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useCreateOrderMutation } from "../slices/ordersApiSlice";
import { clearCartItems } from "../slices/cartSlice";
import { toast } from "react-toastify";
import { useEffect } from "react";
import CheckoutSteps from "../components/CheckoutSteps";
import Message from "../components/Message";
import Loader from "../components/Loader";

const ReviewScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    cartItems,
    shippingAddress,
    billingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = useSelector((state) => state.cart);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    } else if (!paymentMethod) {
      navigate("/payment");
    }
  }, [shippingAddress, paymentMethod, navigate]);

  const createOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cartItems,
        shippingAddress,
        billingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <h2>Review Your Order</h2>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Row>
                <h4>Shipping</h4>
                <p>DELIVER TO:</p>
                <Col md={8}>
                  <strong>
                    {shippingAddress.firstName} {shippingAddress.lastName}
                  </strong>
                  <br />
                  {shippingAddress.phone}
                  <br />
                  {shippingAddress.address}
                  <br />
                  {shippingAddress.city}, {shippingAddress.postalCode} <br />
                  {shippingAddress.country}
                </Col>
                <Col md={4}>
                  <p>Free 2-3 Day Priority Shipping</p>
                  <p>FREE</p>
                </Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <h4>Payment & Discounts</h4>
                <p>BILLING TO:</p>
                <Col md={8}>
                  <strong>
                    {billingAddress.firstName} {billingAddress.lastName}
                  </strong>
                  <br />
                  {billingAddress.phone}
                  <br />
                  {billingAddress.address}
                  <br />
                  {billingAddress.city}, {billingAddress.postalCode}
                  <br />
                  {billingAddress.country}
                </Col>
                <Col md={4}>
                  <p>{paymentMethod}</p>
                </Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <h4>Ordered Items</h4>
              {cartItems.length === 0 ? (
                <p>No items in cart</p>
              ) : (
                <ListGroup variant="flush">
                  {cartItems.map((item) => (
                    <ListGroup.Item key={item._id} className="border-0">
                      <Row>
                        <Col md={2}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col md={4}>
                          <Link to={`/product/${item._id}`}>{item.name}</Link>
                        </Col>
                        <Col md={2}>
                          <p>${item.price}</p>
                        </Col>
                        <Col md={2}>
                          <p>{item.qty}</p>
                        </Col>
                        <Col md={2}>${item.price * item.qty}</Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
          <Button
            variant="light"
            className="mt-2"
            onClick={() => navigate("/payment")}
          >
            Back
          </Button>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h4>Order Summary</h4>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items:</Col>
                  <Col>
                    {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                  </Col>
                </Row>
                <Row>
                  <Col>Subtotal:</Col>
                  <Col>$ {itemsPrice}</Col>
                </Row>
                <Row>
                  <Col>Sales Tax (15%):</Col>
                  <Col>$ {taxPrice}</Col>
                </Row>
                <Row>
                  <Col>Shipping:</Col>
                  <Col>$ {shippingPrice}</Col>
                </Row>
                <Row>
                  <Col className="fw-bold mt-2">Total:</Col>
                  <Col className="fw-bold mt-2">
                    <strong>${totalPrice}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>
            </ListGroup>
          </Card>
          <ListGroup.Item className="mt-3">
            {error && (
              <Message variant="danger">
                {error?.data?.message || error?.error || "An error occurred"}
              </Message>
            )}
          </ListGroup.Item>
          <Button
            type="button"
            className="btn-block w-50 mt-3"
            onClick={createOrderHandler}
            disabled={isLoading}
          >
            Place Order
          </Button>
          {isLoading && <Loader />}
        </Col>
      </Row>
    </>
  );
};

export default ReviewScreen;
