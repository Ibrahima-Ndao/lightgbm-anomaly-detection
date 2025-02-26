from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd

app = FastAPI()

# Ajouter le support CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Charger le modèle LightGBM
model = joblib.load('modele_lightgbm.pkl')

# Définir le modèle de données
class DataModel(BaseModel):
    Flow_Duration: float
    Tot_Fwd_Pkts: float
    Tot_Bwd_Pkts: float
    TotLen_Fwd_Pkts: float
    TotLen_Bwd_Pkts: float
    Fwd_Pkt_Len_Max: float
    Fwd_Pkt_Len_Min: float
    Fwd_Pkt_Len_Mean: float
    Fwd_Pkt_Len_Std: float
    Bwd_Pkt_Len_Max: float
    Bwd_Pkt_Len_Min: float
    Bwd_Pkt_Len_Mean: float
    Bwd_Pkt_Len_Std: float
    Flow_Byts_per_s: float
    Flow_Pkts_per_s: float
    Flow_IAT_Mean: float
    Flow_IAT_Std: float
    Flow_IAT_Max: float
    Flow_IAT_Min: float
    Fwd_IAT_Tot: float
    Fwd_IAT_Mean: float
    Fwd_IAT_Std: float
    Fwd_IAT_Max: float
    Fwd_IAT_Min: float
    Bwd_IAT_Tot: float
    Bwd_IAT_Mean: float
    Bwd_IAT_Std: float
    Bwd_IAT_Max: float
    Bwd_IAT_Min: float
    Fwd_PSH_Flags: int
    Bwd_PSH_Flags: int
    Fwd_URG_Flags: int
    Bwd_URG_Flags: int
    Fwd_Header_Len: float
    Bwd_Header_Len: float
    Fwd_Pkts_per_s: float
    Bwd_Pkts_per_s: float
    Pkt_Len_Min: float
    Pkt_Len_Max: float
    Pkt_Len_Mean: float
    Pkt_Len_Std: float
    Pkt_Len_Var: float
    FIN_Flag_Cnt: int
    SYN_Flag_Cnt: int
    RST_Flag_Cnt: int
    PSH_Flag_Cnt: int
    ACK_Flag_Cnt: int
    URG_Flag_Cnt: int
    CWE_Flag_Count: int
    ECE_Flag_Cnt: int
    Down_Up_Ratio: float
    Pkt_Size_Avg: float
    Fwd_Seg_Size_Avg: float
    Bwd_Seg_Size_Avg: float
    Fwd_Byts_per_b_Avg: float
    Fwd_Pkts_per_b_Avg: float
    Fwd_Blk_Rate_Avg: float
    Bwd_Byts_per_b_Avg: float
    Bwd_Pkts_per_b_Avg: float
    Bwd_Blk_Rate_Avg: float
    Subflow_Fwd_Pkts: float
    Subflow_Fwd_Byts: float
    Subflow_Bwd_Pkts: float
    Subflow_Bwd_Byts: float
    Init_Fwd_Win_Byts: float
    Init_Bwd_Win_Byts: float
    Fwd_Act_Data_Pkts: float
    Fwd_Seg_Size_Min: float
    Active_Mean: float
    Active_Std: float
    Active_Max: float
    Active_Min: float
    Idle_Mean: float
    Idle_Std: float
    Idle_Max: float
    Idle_Min: float

@app.post('/predict')
def predict(data: DataModel):
    try:
        # Convertir les données en DataFrame
        input_data = pd.DataFrame([data.dict()])

        # Faire la prédiction
        prediction = model.predict(input_data)[0]

        # Interpréter la prédiction : 1 pour anomalie, 0 pour normal
        result = "Ce flux réseau est anormal et pourrait indiquer une anomalie." if prediction == 1 else "Ce flux réseau est normal et ne montre pas de signes d'anomalie."

        return {"prediction": int(prediction), "result": result}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Erreur de valeur: {str(e)}")
    except KeyError as e:
        raise HTTPException(status_code=400, detail=f"Clé manquante dans les données: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur interne du serveur: {str(e)}")