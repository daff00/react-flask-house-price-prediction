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

def categorize_price(price):
    if price < 500_000_000: return "< 500 Juta"
    elif price < 1_000_000_000: return "500 Juta - 1 Miliar"
    elif price < 1_500_000_000: return "1 - 1.5 Miliar"
    elif price < 2_000_000_000: return "1.5 - 2 Miliar"
    elif price < 2_500_000_000: return "2 - 2.5 Miliar"
    elif price < 3_000_000_000: return "2.5 - 3 Miliar"
    elif price < 4_000_000_000: return "3 - 4 Miliar"
    elif price < 5_000_000_000: return "4 - 5 Miliar"
    else: return "> 5 Miliar"

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        selected_district = data.get("kecamatan")

        if selected_district in unavailable_district:
            return jsonify({
                "success": False,
                "error": f"House price for {selected_district} district is not available."
            }), 400
        
        if selected_district not in available_district:
            return jsonify({
                "success": False,
                "error": "Distric is not valid"
            }), 400
        
        # One-hot encoding the district
        district_encoded = {f'kec_{district}': 0 for district in available_district}
        district_encoded[f"kec_{selected_district}"] = 1

        # User inputted data frame
        df_input = pd.DataFrame({
            'Kamar Tidur': [data.get('kamar_tidur', 3)],
            'Kamar Mandi': [data.get('kamar_mandi', 2)],
            'Luas Tanah': [np.log1p(data.get('luas_tanah', 100))],
            'Luas Bangunan': [np.log1p(data.get('luas_bangunan', 80))],
            'Daya Listrik': [data.get('daya_listrik', 1300)],
            'Jumlah Lantai': [data.get('jumlah_lantai', 1)],
            'Carport': [data.get('carport', 1)],
            'Kamar Tidur Pembantu': [data.get('kamar_tidur_pembantu', 0)],
            'Kamar Mandi Pembantu': [data.get('kamar_mandi_pembantu', 0)]
        })

        # Electrical power encoding
        df_input[['Daya Listrik']] = watt_enc.transform(df_input[['Daya Listrik']])

        # Join and sort column
        df_final = pd.concat([df_input, pd.DataFrame([district_encoded])], axis=1)
        expected_columns = [
            'Kamar Tidur', 'Kamar Mandi', 'Luas Tanah', 'Luas Bangunan', 'Daya Listrik',
            'Jumlah Lantai', 'Carport', 'Kamar Tidur Pembantu', 'Kamar Mandi Pembantu'
        ] + [f'kec_{kec}' for kec in available_district]
        df_final = df_final[expected_columns]

        # Scaling and prediction
        df_scaled = scaler.transform(df_final)
        predicted_price_log = model_xgb.predict(df_scaled)
        predicted_price = np.expm1(predicted_price_log)

        return jsonify({
            "success": True,
            "predicted_price": float(predicted_price[0])
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
    
@app.route('/specs', methods=['GET'])
def get_specs():
    try:
        lokasi_filter = request.args.get('kecamatan')
        harga_filter = request.args.get('range_harga')

        if not os.path.exists("data/Data Harga Rumah Kabupaten Tangerang.csv"):
            return jsonify({"success": False, "error": "Dataset tidak ditemukan."}), 404

        df_rumah = pd.read_csv("data/Data Harga Rumah Kabupaten Tangerang.csv")
        df_rumah["Range Harga"] = df_rumah["Harga"].apply(categorize_price)

        # Jika hanya request list kecamatan dan range harga (untuk dropdown frontend)
        if not lokasi_filter and not harga_filter:
            return jsonify({
                "success": True,
                "kecamatan_list": sorted(df_rumah["Kecamatan"].dropna().unique().tolist()),
                "range_harga_list": df_rumah["Range Harga"].unique().tolist()
            })

        if lokasi_filter not in df_rumah["Kecamatan"].values:
            return jsonify({"success": False, "error": "Kecamatan tidak tersedia dalam database."}), 400

        # Filter dataset
        df_filtered = df_rumah[
            (df_rumah["Kecamatan"] == lokasi_filter) & 
            (df_rumah["Range Harga"] == harga_filter)
        ]

        if df_filtered.empty:
            return jsonify({"success": True, "data": []})

        # Konversi data ke format list of dictionaries untuk dikirim ke frontend
        tampilkan_kolom = [
            "Harga", "Kecamatan", "Kamar Tidur", "Kamar Mandi", "Luas Tanah",
            "Luas Bangunan", "Daya Listrik", "Jumlah Lantai", "Carport",
            "Kamar Tidur Pembantu", "Kamar Mandi Pembantu"
        ]
        
        result_data = df_filtered[tampilkan_kolom].fillna(0).to_dict(orient='records')

        recommended_specs = {
            "kamar_tidur": int(df_filtered["Kamar Tidur"].median()),
            "kamar_mandi": int(df_filtered["Kamar Mandi"].median()),
            "luas_tanah": int(df_filtered["Luas Tanah"].median()),
            "luas_bangunan": int(df_filtered["Luas Bangunan"].median()),
            "daya_listrik": int(df_filtered["Daya Listrik"].median()),
            "jumlah_lantai": int(df_filtered["Jumlah Lantai"].median()),
            "carport": int(df_filtered["Carport"].median())
        }

        return jsonify({
            "success": True,
            "total_data": len(result_data),
            "data": result_data,
            "recommended_specs": recommended_specs
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)