import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useGetUserDetailsQuery } from "../../slices/usersApiSlice";
import {
  useDeleteUserMutation,
  useUpdateUserMutation,
} from "../../slices/usersApiSlice";
import { toast } from "react-toastify";
import { Button, Form } from "react-bootstrap";
import FormContainer from "../../components/FormContainer";
import Loader from "../../components/Loader";
import Message from "../../components/Message";

const UserEditScreen = () => {
  const navigate = useNavigate();
  const { id: userId } = useParams();
  const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: loadingDelete }] = useDeleteUserMutation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useGetUserDetailsQuery(userId);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
    }
  }, [user]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (window.confirm("Confirm to update this user?")) {
      try {
        await updateUser({
          _id: userId,
          name,
          email,
          isAdmin,
        }).unwrap();
        toast.success("User updated successfully");
        navigate("/admin/userlist");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id);
        refetch();
        toast.success("User deleted successfully.");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <>
      <Link to="/admin/userlist">
        <Button variant="light" className="mt-2">
          Go Back
        </Button>
      </Link>
      <FormContainer>
        <h1>User Information</h1>
        {loadingUpdate && <Loader />}
        {loadingDelete && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name">
              <Form.Label>User Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="email" className="mt-3">
              <Form.Label>User Email</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="isAdmin" className="mt-3">
              <Form.Check
                type="checkbox"
                label="isAdmin"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              ></Form.Check>
            </Form.Group>

            <Button type="submit" variant="primary" className="mt-3">
              Update
            </Button>
            <Button
              variant="danger"
              className="mt-3"
              onClick={() => deleteHandler(userId)}
            >
              Delete User
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default UserEditScreen;
