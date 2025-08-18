import React from "react";
import { useGetProductsQuery } from "../../slices/productsApiSlice";
import { Table, Button, Image, Row, Col } from "react-bootstrap";
import { FaTrash, FaPlus } from "react-icons/fa";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { useNavigate, useParams } from "react-router-dom";
import { useCreateProductMutation } from "../../slices/productsApiSlice";
import { toast } from "react-toastify";
import Paginate from "../../components/Paginate";

const ProductListScreen = () => {
  const navigate = useNavigate();
  const params = useParams();
  const pageNumber = params.pageNumber || 1;
  const { data, isLoading, error, refetch } = useGetProductsQuery({
    pageNumber,
  });
  const [createProduct, { isLoading: loadingCreate }] =
    useCreateProductMutation();

  const createProductHandler = async () => {
    if (window.confirm("Are you sure to create a new product?")) {
      try {
        const result = await createProduct().unwrap();
        toast.success("Product created successfully");
        navigate(`/admin/product/${result._id}/edit`);
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>All Products</h1>
        </Col>
        <Col className="text-end">
          <Button className="btn-sm m-3" onClick={createProductHandler}>
            <FaPlus /> Add New Product
          </Button>
        </Col>
      </Row>

      {loadingCreate && <Loader />}

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Table hover responsive className="table-sm">
            <thead>
              <tr>
                <th>Product</th>
                <th></th>
                <th>Shipping Method</th>
                <th>Visibility</th>
                <th>Product ID</th>
                <th>Stock</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {data.products.map((product) => (
                <tr
                  key={product._id}
                  onClick={() => navigate(`/admin/product/${product._id}/edit`)}
                  style={{ cursor: "pointer" }}
                  className="align-middle"
                >
                  <td>
                    <Image
                      src={product.image}
                      alt={product.name}
                      fluid
                      rounded
                      style={{ width: "100px", height: "100px" }}
                    />
                  </td>
                  <td className="text-start">{product.name}</td>
                  <td>
                    <select
                      className="form-select"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="Free Tracked Shipping">
                        Free Tracked Shipping
                      </option>
                      <option value="Small Package">Small Package</option>
                    </select>
                  </td>
                  <td>
                    <select
                      className="form-select"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="public">Public</option>
                      <option value="Hidden">Hidden</option>
                    </select>
                  </td>
                  <td>{product._id}</td>
                  <td>
                    {product.countInStock}
                    {product.countInStock === 0 && (
                      <p className="text-danger">Out of Stock</p>
                    )}
                  </td>
                  <td>${product.price}</td>
                  {/* <td>
                    <Button
                      className="btn-sm mx-1"
                      variant="light"
                      onClick={(e) => deleteHandler(e, product._id)}
                    >
                      Delete
                    </Button>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate
            pages={data.pages}
            page={data.page}
            isAdmin={true}
            keyword={""}
          />
        </>
      )}
    </>
  );
};

export default ProductListScreen;
