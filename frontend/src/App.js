import React from "react";
import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

const App = () => {
  return (
    <>
      <Header />
      <main>
        <Container className="py-3">
          <Outlet /> {/* renders the matched child route here */}
        </Container>
      </main>
      <Footer />
    </>
  );
};

export default App;
