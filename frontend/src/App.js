import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col } from "react-bootstrap";
import NetworkFlowForm from "./components/NetworkFlowForm";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Container fluid>
        <Row className="justify-content-center">
          <Col md={10} lg={8} xl={7}>
            <div className="header-container text-center my-4">
              <h1 className="primary-title">Détecteur d'Anomalies Réseau</h1>
              <p className="lead">
                Analysez vos flux réseau pour détecter les potentielles
                anomalies à l'aide de notre modèle d'IA
              </p>
            </div>
            <NetworkFlowForm />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
