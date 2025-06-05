import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Row, Col, ListGroup, Card, Button, Image } from "react-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import {
  usePayOrderMutation,
  useGetPaypalClientIdQuery,
  useGetOrderDetailsQuery,
  useDeliverOrderMutation,
} from "../slices/ordersApiSlice";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const OrderScreen = () => {
  const navigate = useNavigate();

  // order details
  const { id: orderId } = useParams();
  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  // deliver order
  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();

  // paypal
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const { userInfo } = useSelector((state) => state.auth);
  const {
    data: paypal,
    isLoading: loadingPaypal,
    error: errorPaypal,
  } = useGetPaypalClientIdQuery();

  useEffect(() => {
    if (!errorPaypal && !loadingPaypal && paypal.clientId) {
      const loadPaypalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": paypal.clientId,
            currency: "USD",
          },
        });
        paypalDispatch({
          type: "setLoadingStatus",
          value: "pending",
        });
      };
      if (order && !order.isPaid && !window.paypal) {
        loadPaypalScript();
      }
    }
  }, [order, paypal, paypalDispatch, errorPaypal, loadingPaypal]);

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
    orderItems,
    shippingAddress,
    billingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = order;

  // ---- paypal functions ----
  const onApprove = async (data, actions) => {
    return actions.order.capture().then(async (details) => {
      try {
        await payOrder({ orderId, details }).unwrap();
        toast.success("Payment successful");
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    });
  };

  const onError = (error) => {
    toast.error(error.message);
  };

  // const onApproveTest = async () => {
  //   await payOrder({ orderId, details: { payer: {} } }).unwrap();
  //   toast.success("Payment successful");
  //   refetch();
  // };

  const createOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: totalPrice },
          },
        ],
      })
      .then((orderId) => {
        return orderId;
      });
  };
  // ---------------

  const deliverHandler = async (orderId) => {
    try {
      await deliverOrder(orderId).unwrap();
      toast.success("Order delivered");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

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
                <Message variant="success">
                  Delivered on {order.deliveredAt.substring(0, 10)}
                </Message>
              ) : (
                <Message>Not Delivered</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Billing Information</h2>
              <Row>
                <Col md={6}>
                  <p>
                    {billingAddress.firstName} {billingAddress.lastName}
                    <br />
                    {billingAddress.phone}
                    <br />
                    {billingAddress.email}
                    <br />
                    {billingAddress.address}
                    <br />
                    {billingAddress.city}, {billingAddress.postalCode}
                    <br />
                    {billingAddress.country}
                    <br />
                  </p>
                </Col>
                <Col md={6}>{paymentMethod}</Col>
              </Row>
              {order.isPaid ? (
                <Message variant="success">
                  Paid on {order.paidAt.substring(0, 10)}
                </Message>
              ) : (
                <Message>Not Paid</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Ordered Items</h2>
              {orderItems.map((item) => (
                <ListGroup.Item key={item._id}>
                  <Row>
                    <Col md={1}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Col>
                    <Col md={6}>{item.name}</Col>
                    <Col md={1}>{item.qty}</Col>
                    <Col md={2}>${item.price}</Col>
                    <Col md={1}>${item.price * item.qty}</Col>
                  </Row>
                </ListGroup.Item>
              ))}
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
                  <Col>
                    {orderItems.reduce((acc, item) => acc + item.qty, 0)}
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
                    <strong>$ {totalPrice}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>
              {!order.isPaid && !isPending && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}
                  {isPending ? (
                    <Loader />
                  ) : (
                    <div>
                      {/* <Button
                        onClick={onApproveTest}
                        style={{ marginBottom: "10px" }}
                      >
                        Test Pay Order
                      </Button> */}
                      <PayPalButtons
                        createOrder={createOrder}
                        onApprove={onApprove}
                        onError={onError}
                      />
                    </div>
                  )}
                </ListGroup.Item>
              )}

              {loadingDeliver && <Loader />}
              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      variant="primary"
                      onClick={() => deliverHandler(order._id)}
                    >
                      Mark as Delivered
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OrderScreen;
