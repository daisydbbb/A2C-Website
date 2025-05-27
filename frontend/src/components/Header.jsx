import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { FaShoppingCart, FaUser, FaChild } from "react-icons/fa";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);

  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="md" collapseOnSelect>
        <Container>
          <Navbar.Brand as={Link} to="/">
            <img
              src={logo}
              width="50"
              height="40"
              alt="Addicted2Cardboard"
              className="me-1"
            />
            Addicted2Cardboard LLC
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/about">
                <FaChild /> About Us
              </Nav.Link>
              <Nav.Link as={Link} to="/cart">
                <FaShoppingCart /> Cart
                {cartItems.length > 0 && (
                  <span className="ms-1">
                    ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                  </span>
                )}
              </Nav.Link>
              <Nav.Link as={Link} to="/login">
                <FaUser /> Sign In
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
