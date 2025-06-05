import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Row, Col, Image, ListGroup, Button } from "react-bootstrap";
import Rating from "../components/Rating";
// import axios from "axios";
import { useState } from "react";
import { useGetProductDetailsQuery } from "../slices/productsApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Form from "react-bootstrap/Form";
import { useDispatch } from "react-redux";
import { addToCart } from "../slices/cartSlice";

const ProductScreen = () => {
  const { id: productId } = useParams();
  // const [product, setProduct] = useState({});

  // useEffect(() => {
  //   const fetchProduct = async () => {
  //     const { data } = await axios.get(`/api/products/${productId}`);
  //     setProduct(data);
  //   };
  //   fetchProduct();
  // }, [productId]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);

  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useGetProductDetailsQuery(productId);

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        Go Back
      </Link>
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        // render components after loaded, otherwise product might still be undefined while the api is still fetching
        <Row>
          <Col md={5} className="d-flex align-items-center">
            <Image
              className="product-img"
              src={product.image}
              alt={product.name}
              fluid
            />
          </Col>

          <Col md={7}>
            <ListGroup variant="flush">
              <ListGroup.Item className="border-0">
                <h1>{product.name}</h1>
              </ListGroup.Item>
              <ListGroup.Item className="border-0">
                <Row>
                  <Col>
                    <h3>${product.price}</h3>
                  </Col>
                </Row>
                <Row>
                  <Col>{product.countInStock > 0 ? "" : "Sold Out"}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item className="border-0">
                <h3>Product Details</h3>
                <p>{product.description}</p>
              </ListGroup.Item>

              {/* <ListGroup.Item>
              <Rating
                value={product.rating}
                text={`${product.numReviews} reviews`}
              />
            </ListGroup.Item> */}

              {product.countInStock > 0 && (
                <ListGroup.Item className="border-0">
                  <Row>
                    <Col md={2} className="mt-2">
                      Quantity:{" "}
                    </Col>
                    <Col md={3}>
                      <Form.Control
                        as="select"
                        value={qty}
                        onChange={(e) => setQty(Number(e.target.value))}
                      >
                        {[
                          ...Array(Math.min(product.countInStock, 12)).keys(),
                        ].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                  </Row>
                </ListGroup.Item>
              )}

              <ListGroup.Item>
                <Button
                  className="btn-block"
                  type="button"
                  disabled={product.countInStock === 0}
                  onClick={addToCartHandler}
                >
                  Add to Cart
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Col>
        </Row>
      )}
    </>
  );
};

export default ProductScreen;
