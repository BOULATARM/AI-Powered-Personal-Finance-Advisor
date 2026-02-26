import os
import joblib
import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.layers import Layer

# =========================
# Paths
# =========================
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # .../backend
ML_DIR = os.path.join(BASE_DIR, "ml")

MODEL_PATH = os.path.join(ML_DIR, "model_savings_attention.keras")
ENCODER_PATH = os.path.join(ML_DIR, "encoder.joblib")
SCALER_PATH = os.path.join(ML_DIR, "scaler.joblib")

# =========================
# Features
# =========================
VARIABLE_EXPENSES = [
    "Groceries", "Transport", "Eating_Out", "Entertainment",
    "Utilities", "Healthcare", "Education", "Miscellaneous"
]

NUMERICAL_FEATURES = [
    "Income", "Age", "Dependents", "Disposable_Income", "Desired_Savings"
] + VARIABLE_EXPENSES

CATEGORICAL_FEATURES = ["Occupation", "City_Tier"]

# =========================
# Custom Attention Layer (IMPORTANT)
# =========================
class AttentionLayer(Layer):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    def build(self, input_shape):
        self.W = self.add_weight(
            name="att_weight",
            shape=(input_shape[-1], 1),
            initializer="normal",
            trainable=True,
        )
        self.b = self.add_weight(
            name="att_bias",
            shape=(input_shape[1], 1),
            initializer="zeros",
            trainable=True,
        )
        super().build(input_shape)

    def call(self, x):
        e = tf.matmul(x, self.W) + self.b
        e = tf.squeeze(e, -1)
        a = tf.nn.softmax(e)
        a = tf.expand_dims(a, -1)
        output = x * a
        return tf.reduce_sum(output, axis=1)

# =========================
# Lazy-load (load once)
# =========================
_model = None
_encoder = None
_scaler = None

def _load_once():
    global _model, _encoder, _scaler

    if _model is not None and _encoder is not None and _scaler is not None:
        return

    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"Model not found: {MODEL_PATH}")
    if not os.path.exists(ENCODER_PATH):
        raise FileNotFoundError(f"Encoder not found: {ENCODER_PATH}")
    if not os.path.exists(SCALER_PATH):
        raise FileNotFoundError(f"Scaler not found: {SCALER_PATH}")

    _model = load_model(MODEL_PATH, custom_objects={"AttentionLayer": AttentionLayer})
    _encoder = joblib.load(ENCODER_PATH)
    _scaler = joblib.load(SCALER_PATH)

# =========================
# Preprocess + Predict
# =========================
def predict(payload: dict) -> dict:
    """
    payload: dict contenant toutes les features attendues
    return: dict avec 8 outputs + total
    """
    _load_once()

    df = pd.DataFrame([payload])

    # 1) Encode catégories
    cat_df = df[CATEGORICAL_FEATURES]
    encoded = _encoder.transform(cat_df)
    occ = payload.get("Occupation")
    tier = payload.get("City_Tier")

    allowed_occ = set(_encoder.categories_[0])
    allowed_tier = set(_encoder.categories_[1])

    if occ not in allowed_occ:
        raise ValueError(f"Occupation invalide: {occ}. Valeurs: {sorted(list(allowed_occ))}")

    if tier not in allowed_tier:
        raise ValueError(f"City_Tier invalide: {tier}. Valeurs: {sorted(list(allowed_tier))}")
    encoded_cols = _encoder.get_feature_names_out(CATEGORICAL_FEATURES)
    df_encoded = pd.DataFrame(encoded, columns=encoded_cols, index=df.index)

    # 2) Scale numériques
    num_df = df[NUMERICAL_FEATURES]
    scaled = _scaler.transform(num_df)
    df_scaled = pd.DataFrame(scaled, columns=NUMERICAL_FEATURES, index=df.index)

    # 3) Final input
    X = pd.concat([df_scaled, df_encoded], axis=1).values

    # 4) Predict
    preds = _model.predict(X, verbose=0)[0]  # shape (8,)

    result = {f"Potential_Savings_{k}": float(v) for k, v in zip(VARIABLE_EXPENSES, preds)}
    result["Total_Potential_Savings"] = float(np.sum(preds))
    return result
