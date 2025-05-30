import React from "react";
import { useParams } from "react-router-dom";
import { useGetOrderDetailsQuery } from "../slices/ordersApiSlice";
import { useNavigate } from "react-router-dom";
import { Row, Col, ListGroup, Card, Button } from "react-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loader";

const OrderScreen = () => {
  const navigate = useNavigate();

  const { id: orderId } = useParams();
  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  if (!order) {
    return <div>Order not found</div>;
  }

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <Message variant="danger">{error}</Message>;
  }

  const {
    shippingAddress,
    billingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = order;
  console.log(order);

  return (
    <div className="container mt-3">
      <h1>Thank you for your order!</h1>
      <h4>Order No. {order._id}</h4>
      <p>Purchase Date: {order.createdAt.substring(0, 10)}</p>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping Address</h2>
              <p>
                {shippingAddress.firstName} {shippingAddress.lastName}
                <br />
                {shippingAddress.phone}
                <br />
                {shippingAddress.address}
                <br />
                {shippingAddress.city}, {shippingAddress.postalCode}
                <br />
                {shippingAddress.country}
                <br />
              </p>

              {order.isDelivered ? (
                <Message variant="success">Delivered</Message>
              ) : (
                <Message>Not Delivered</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Billing Address</h2>
              <p>
                {billingAddress.firstName} {billingAddress.lastName}
                <br />
                {billingAddress.phone}
                <br />
                {billingAddress.address}
                <br />
                {billingAddress.city}, {billingAddress.postalCode}
                <br />
              </p>
              {order.isPaid ? (
                <Message variant="success">Paid</Message>
              ) : (
                <Message>Not Paid</Message>
              )}
            </ListGroup.Item>
          </ListGroup>
          <Button
            className="mt-2"
            variant="primary"
            onClick={() => navigate("/")}
          >
            Continue Shopping
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
                  <Col>$ {itemsPrice}</Col>
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
                    <strong>$ {totalPrice}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>
              {/* Pay order placeholder*/}
              {/* Mark as delivered placeholder*/}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OrderScreen;
