import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
} from "react-bootstrap";
import { RxCross2 } from "react-icons/rx";
import Message from "../components/Message";
import { addToCart, removeFromCart } from "../slices/cartSlice";

const SummaryRow = ({ label, value, isBold = false }) => (
  <Row
    className={isBold ? "mt-3" : ""}
    style={isBold ? { fontWeight: "bold" } : {}}
  >
    <Col md={8}>{label}</Col>
    <Col md={4}>{value}</Col>
  </Row>
);

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);

  const addToCartHandler = async (item, qty) => {
    await dispatch(addToCart({ ...item, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/shipping");
  };

  return (
    <Row>
      <Col md={8}>
        <h2 style={{ marginTop: "10px", marginBottom: "20px" }}>
          Shopping Cart
        </h2>
        {cartItems.length === 0 ? (
          <>
            <Message>Your have nothing in your shopping cart.</Message>
            <Button
              className="btn-block w-25"
              variant="primary"
              type="button"
              onClick={() => navigate("/")}
            >
              Continue Shopping
            </Button>
          </>
        ) : (
          <ListGroup variant="flush">
            {cartItems.map((item) => (
              <ListGroup.Item key={item._id} className="border-0">
                <Row>
                  <Col md={2}>
                    <Image src={item.image} alt={item.name} fluid rounded />
                  </Col>
                  <Col md={5}>
                    <Link to={`/product/${item._id}`}>{item.name}</Link>
                  </Col>
                  <Col md={2}>
                    <Form.Control
                      as="select"
                      value={item.qty}
                      onChange={(e) =>
                        addToCartHandler(item, Number(e.target.value))
                      }
                    >
                      {[...Array(Math.min(item.countInStock, 12)).keys()].map(
                        (x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        )
                      )}
                    </Form.Control>
                  </Col>
                  <Col md={2}>${(item.qty * item.price).toFixed(2)}</Col>
                  <Col md={1}>
                    <RxCross2
                      style={{ cursor: "pointer", fontSize: "25px" }}
                      onClick={() => removeFromCartHandler(item._id)}
                    />
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <Card className="mt-2">
          <ListGroup variant="flush">
            <ListGroup.Item>
              <div
                className="text-center"
                style={{
                  fontSize: "20px",
                  marginBottom: "10px",
                  fontWeight: "bold",
                }}
              >
                Cart Summary
              </div>
              <SummaryRow
                label="Items"
                value={cartItems.reduce((acc, item) => acc + item.qty, 0)}
              />
              <SummaryRow
                label="Items Total"
                value={`$${cartItems
                  .reduce((acc, item) => acc + item.qty * item.price, 0)
                  .toFixed(2)}`}
              />
              <SummaryRow label="Estimated Tax" value="$0.00" />
              <SummaryRow label="Estimated Shipping" value="$0.00" />
              <SummaryRow
                label="Subtotal"
                value={`$${cartItems
                  .reduce((acc, item) => acc + item.qty * item.price, 0)
                  .toFixed(2)}`}
                isBold={true}
              />
            </ListGroup.Item>

            <ListGroup.Item>
              <Button
                className="btn-block"
                type="button"
                variant="primary"
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Check Out
              </Button>
              <Button
                className="btn-block"
                type="button"
                variant="primary"
                disabled={cartItems.length === 0}
                onClick={() => navigate("/login?redirect=/shipping")}
              >
                PayPal
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default CartScreen;
