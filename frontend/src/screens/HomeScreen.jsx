import React from "react";
import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";
// import axios from "axios"; // preferaxios over native fetch api
import { useGetProductsQuery } from "../slices/productsApiSlice"; // prefer RTK Query over axios (redux toolkit)
import Loader from "../components/Loader";
import Message from "../components/Message";

const HomeScreen = () => {
  // --- Use axios to fetch products ---
  // const [products, setProducts] = useState([]);
  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     const { data } = await axios.get("/api/products"); // we are using proxy, so no need for http://localhost:5001
  //     setProducts(data);
  //   };
  //   fetchProducts();
  // }, []);

  // --- Use redux toolkit to fetch products ---
  const { data: products, isLoading, isError, error } = useGetProductsQuery();

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <h1>Latest Products</h1>
          <Row>
            {products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
        </>
      )}
    </>
  );
};

export default HomeScreen;
