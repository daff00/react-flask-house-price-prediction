from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import pickle
import os

app = Flask(__name__)
CORS(app)

# 1. Load all the model when server is running
try:
    with open("models/encoder_data_listrik.pkl", "rb") as f:
        watt_enc = pickle.load(f)
    with open("models/scaler.pkl", "rb") as f:
        scaler = pickle.load(f)
    with open("models/xgboost_optuna.pkl", "rb") as f:
        model_xgb = pickle.load(f)
    print("All models have been loaded.")
except Exception as e:
    print(f"Error loading models: {e}")

# 2. Setup const from previous Streamlit app
available_district = [
    'Balaraja', 'Cikupa', 'Cisauk', 'Curug', 'Jatiuwung', 'Jayanti', 'Kadu',
    'Kelapa Dua', 'Kosambi', 'Kresek', 'Legok', 'Mauk', 'Pagedangan',
    'Panongan', 'Pasar Kemis', 'Rajeg', 'Sepatan', 'Sindang Jaya', 'Solear',
    'Teluk Naga', 'Tigaraksa'
]

unavailable_district = [
    'Gunung Kaler', 'Jambe', 'Kemiri', 'Mekar Baru', 
    'Pakuhaji', 'Sepatan Timur', 'Sukadiri', 'Sukamulya'
]