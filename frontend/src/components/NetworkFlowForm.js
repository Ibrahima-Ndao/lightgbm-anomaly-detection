import React, { useState } from "react";
import { Form, Button, Card, Alert, Accordion, Spinner } from "react-bootstrap";
import axios from "axios";

const NetworkFlowForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [showSimplifiedForm, setShowSimplifiedForm] = useState(true);

  // État initial du formulaire avec toutes les valeurs à 0
  const initialFormState = {
    Flow_Duration: 0,
    Tot_Fwd_Pkts: 0,
    Tot_Bwd_Pkts: 0,
    TotLen_Fwd_Pkts: 0,
    TotLen_Bwd_Pkts: 0,
    Fwd_Pkt_Len_Max: 0,
    Fwd_Pkt_Len_Min: 0,
    Fwd_Pkt_Len_Mean: 0,
    Fwd_Pkt_Len_Std: 0,
    Bwd_Pkt_Len_Max: 0,
    Bwd_Pkt_Len_Min: 0,
    Bwd_Pkt_Len_Mean: 0,
    Bwd_Pkt_Len_Std: 0,
    Flow_Byts_per_s: 0,
    Flow_Pkts_per_s: 0,
    Flow_IAT_Mean: 0,
    Flow_IAT_Std: 0,
    Flow_IAT_Max: 0,
    Flow_IAT_Min: 0,
    Fwd_IAT_Tot: 0,
    Fwd_IAT_Mean: 0,
    Fwd_IAT_Std: 0,
    Fwd_IAT_Max: 0,
    Fwd_IAT_Min: 0,
    Bwd_IAT_Tot: 0,
    Bwd_IAT_Mean: 0,
    Bwd_IAT_Std: 0,
    Bwd_IAT_Max: 0,
    Bwd_IAT_Min: 0,
    Fwd_PSH_Flags: 0,
    Bwd_PSH_Flags: 0,
    Fwd_URG_Flags: 0,
    Bwd_URG_Flags: 0,
    Fwd_Header_Len: 0,
    Bwd_Header_Len: 0,
    Fwd_Pkts_per_s: 0,
    Bwd_Pkts_per_s: 0,
    Pkt_Len_Min: 0,
    Pkt_Len_Max: 0,
    Pkt_Len_Mean: 0,
    Pkt_Len_Std: 0,
    Pkt_Len_Var: 0,
    FIN_Flag_Cnt: 0,
    SYN_Flag_Cnt: 0,
    RST_Flag_Cnt: 0,
    PSH_Flag_Cnt: 0,
    ACK_Flag_Cnt: 0,
    URG_Flag_Cnt: 0,
    CWE_Flag_Count: 0,
    ECE_Flag_Cnt: 0,
    Down_Up_Ratio: 0,
    Pkt_Size_Avg: 0,
    Fwd_Seg_Size_Avg: 0,
    Bwd_Seg_Size_Avg: 0,
    Fwd_Byts_per_b_Avg: 0,
    Fwd_Pkts_per_b_Avg: 0,
    Fwd_Blk_Rate_Avg: 0,
    Bwd_Byts_per_b_Avg: 0,
    Bwd_Pkts_per_b_Avg: 0,
    Bwd_Blk_Rate_Avg: 0,
    Subflow_Fwd_Pkts: 0,
    Subflow_Fwd_Byts: 0,
    Subflow_Bwd_Pkts: 0,
    Subflow_Bwd_Byts: 0,
    Init_Fwd_Win_Byts: 0,
    Init_Bwd_Win_Byts: 0,
    Fwd_Act_Data_Pkts: 0,
    Fwd_Seg_Size_Min: 0,
    Active_Mean: 0,
    Active_Std: 0,
    Active_Max: 0,
    Active_Min: 0,
    Idle_Mean: 0,
    Idle_Std: 0,
    Idle_Max: 0,
    Idle_Min: 0,
  };

  // Groupes de champs pour un affichage organisé
  const fieldGroups = [
    {
      title: "Informations générales du flux",
      fields: [
        "Flow_Duration",
        "Tot_Fwd_Pkts",
        "Tot_Bwd_Pkts",
        "TotLen_Fwd_Pkts",
        "TotLen_Bwd_Pkts",
      ],
    },
    {
      title: "Longueur des paquets",
      fields: [
        "Fwd_Pkt_Len_Max",
        "Fwd_Pkt_Len_Min",
        "Fwd_Pkt_Len_Mean",
        "Fwd_Pkt_Len_Std",
        "Bwd_Pkt_Len_Max",
        "Bwd_Pkt_Len_Min",
        "Bwd_Pkt_Len_Mean",
        "Bwd_Pkt_Len_Std",
        "Pkt_Len_Min",
        "Pkt_Len_Max",
        "Pkt_Len_Mean",
        "Pkt_Len_Std",
        "Pkt_Len_Var",
        "Pkt_Size_Avg",
      ],
    },
    {
      title: "Débits et paquets par seconde",
      fields: [
        "Flow_Byts_per_s",
        "Flow_Pkts_per_s",
        "Fwd_Pkts_per_s",
        "Bwd_Pkts_per_s",
        "Fwd_Byts_per_b_Avg",
        "Fwd_Pkts_per_b_Avg",
        "Bwd_Byts_per_b_Avg",
        "Bwd_Pkts_per_b_Avg",
      ],
    },
    {
      title: "Temps inter-arrivée (IAT)",
      fields: [
        "Flow_IAT_Mean",
        "Flow_IAT_Std",
        "Flow_IAT_Max",
        "Flow_IAT_Min",
        "Fwd_IAT_Tot",
        "Fwd_IAT_Mean",
        "Fwd_IAT_Std",
        "Fwd_IAT_Max",
        "Fwd_IAT_Min",
        "Bwd_IAT_Tot",
        "Bwd_IAT_Mean",
        "Bwd_IAT_Std",
        "Bwd_IAT_Max",
        "Bwd_IAT_Min",
      ],
    },
    {
      title: "Drapeaux TCP",
      fields: [
        "Fwd_PSH_Flags",
        "Bwd_PSH_Flags",
        "Fwd_URG_Flags",
        "Bwd_URG_Flags",
        "FIN_Flag_Cnt",
        "SYN_Flag_Cnt",
        "RST_Flag_Cnt",
        "PSH_Flag_Cnt",
        "ACK_Flag_Cnt",
        "URG_Flag_Cnt",
        "CWE_Flag_Count",
        "ECE_Flag_Cnt",
      ],
    },
    {
      title: "En-têtes et taille de segments",
      fields: [
        "Fwd_Header_Len",
        "Bwd_Header_Len",
        "Fwd_Seg_Size_Avg",
        "Bwd_Seg_Size_Avg",
        "Fwd_Seg_Size_Min",
      ],
    },
    {
      title: "Sous-flux et taux de blocs",
      fields: [
        "Fwd_Blk_Rate_Avg",
        "Bwd_Blk_Rate_Avg",
        "Subflow_Fwd_Pkts",
        "Subflow_Fwd_Byts",
        "Subflow_Bwd_Pkts",
        "Subflow_Bwd_Byts",
        "Down_Up_Ratio",
      ],
    },
    {
      title: "Fenêtres et activité",
      fields: [
        "Init_Fwd_Win_Byts",
        "Init_Bwd_Win_Byts",
        "Fwd_Act_Data_Pkts",
        "Active_Mean",
        "Active_Std",
        "Active_Max",
        "Active_Min",
        "Idle_Mean",
        "Idle_Std",
        "Idle_Max",
        "Idle_Min",
      ],
    },
  ];

  // Paramètres simplifiés pour le formulaire simplifié
  const simplifiedFields = [
    "Flow_Duration",
    "Tot_Fwd_Pkts",
    "Tot_Bwd_Pkts",
    "TotLen_Fwd_Pkts",
    "TotLen_Bwd_Pkts",
    "Fwd_Pkt_Len_Max",
    "Bwd_Pkt_Len_Max",
    "Flow_Pkts_per_s",
    "SYN_Flag_Cnt",
    "ACK_Flag_Cnt",
  ];

  const [formData, setFormData] = useState(initialFormState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Convertir en nombre et limiter à 2 décimales pour les nombres décimaux
    const numericValue = parseFloat(value) || 0;

    setFormData({
      ...formData,
      [name]: numericValue,
    });
  };

  const loadTestData = () => {
    // Exemple de données à tester (vous pouvez les ajuster selon vos besoins)
    const testData = {
      ...initialFormState,
      Flow_Duration: 30250.0,
      Tot_Fwd_Pkts: 20.0,
      Tot_Bwd_Pkts: 30.0,
      TotLen_Fwd_Pkts: 9825.0,
      TotLen_Bwd_Pkts: 15540.0,
      Fwd_Pkt_Len_Max: 1460.0,
      Bwd_Pkt_Len_Max: 1460.0,
      Flow_Pkts_per_s: 1.65,
      SYN_Flag_Cnt: 1,
      ACK_Flag_Cnt: 46,
    };

    setFormData(testData);
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setPrediction(null);
    setError(null);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setPrediction(null);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:8000/predict",
        formData
      );
      setPrediction(response.data);
    } catch (err) {
      console.error("Erreur lors de la prédiction:", err);
      setError(err.response?.data?.detail || "Erreur de connexion au serveur");
    } finally {
      setIsLoading(false);
    }
  };

  // Rendu du formulaire
  return (
    <Card className="mb-4 shadow-sm">
      <Card.Header className="d-flex justify-content-between align-items-center bg-primary text-white">
        <h4 className="mb-0">Analyse de flux réseau</h4>
        <div>
          <Button
            variant={showSimplifiedForm ? "outline-light" : "light"}
            size="sm"
            className="me-2"
            onClick={() => setShowSimplifiedForm(!showSimplifiedForm)}
          >
            {showSimplifiedForm ? "Mode Expert" : "Mode Simplifié"}
          </Button>
          <Button variant="light" size="sm" onClick={loadTestData}>
            Charger exemple
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        {error && (
          <Alert variant="danger">
            <Alert.Heading>Erreur</Alert.Heading>
            <p>{error}</p>
          </Alert>
        )}

        {prediction && (
          <Alert
            variant={prediction.prediction === 1 ? "danger" : "success"}
            className="mb-4"
          >
            <Alert.Heading>
              {prediction.prediction === 1
                ? "⚠️ Anomalie détectée"
                : "✅ Trafic normal"}
            </Alert.Heading>
            <p>{prediction.result}</p>
          </Alert>
        )}

        <Form onSubmit={submitForm}>
          {showSimplifiedForm ? (
            // Formulaire simplifié
            <div className="row">
              {simplifiedFields.map((field) => (
                <div className="col-md-6 mb-3" key={field}>
                  <Form.Group>
                    <Form.Label>{formatFieldName(field)}</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      className="form-control-sm"
                    />
                  </Form.Group>
                </div>
              ))}
              <div className="col-12">
                <small className="text-muted mb-3 d-block">
                  Note: Ce formulaire simplifié inclut uniquement les paramètres
                  les plus importants. Utilisez le mode Expert pour accéder à
                  tous les paramètres.
                </small>
              </div>
            </div>
          ) : (
            // Formulaire complet avec accordéon
            <Accordion defaultActiveKey="0" className="mb-4">
              {fieldGroups.map((group, groupIndex) => (
                <Accordion.Item
                  eventKey={groupIndex.toString()}
                  key={groupIndex}
                >
                  <Accordion.Header>{group.title}</Accordion.Header>
                  <Accordion.Body>
                    <div className="row">
                      {group.fields.map((field) => (
                        <div className="col-md-4 mb-2" key={field}>
                          <Form.Group>
                            <Form.Label className="small">
                              {formatFieldName(field)}
                            </Form.Label>
                            <Form.Control
                              type="number"
                              step="0.01"
                              name={field}
                              value={formData[field]}
                              onChange={handleChange}
                              className="form-control-sm"
                            />
                          </Form.Group>
                        </div>
                      ))}
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          )}

          <div className="d-flex justify-content-between mt-4">
            <Button variant="secondary" onClick={resetForm}>
              Réinitialiser
            </Button>
            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Analyse en cours...
                </>
              ) : (
                "Analyser le flux"
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

// Fonction utilitaire pour formater les noms de champs
function formatFieldName(field) {
  // Remplacer les underscores par des espaces et ajouter des espaces avant les majuscules
  return field
    .replace(/_/g, " ")
    .replace(/([A-Z])/g, " $1")
    .trim();
}

export default NetworkFlowForm;
