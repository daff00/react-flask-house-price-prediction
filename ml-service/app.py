from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pickle
import os
import csv
import math

app = Flask(__name__)
CORS(app)

# --- PASTE HASIL DARI LANGKAH 1 DI SINI ---
SCALER_MEAN = np.array([3.2593880389429764, 2.597357440890125, 4.7860313362888, 4.831711857064102, 4.64673157162726, 1.868567454798331, 1.3004172461752435, 0.5730180806675939, 0.5013908205841446, 0.0034770514603616135, 0.14881780250347706, 0.03894297635605007, 0.015994436717663423, 0.0006954102920723226, 0.0006954102920723226, 0.0006954102920723226, 0.6126564673157163, 0.0013908205841446453, 0.0, 0.01808066759388039, 0.0006954102920723226, 0.12308762169680111, 0.0013908205841446453, 0.011126564673157162, 0.002086230876216968, 0.008344923504867872, 0.004867872044506259, 0.0, 0.004172461752433936, 0.0027816411682892906])  # Isi dengan list dari terminal
SCALER_SCALE = np.array([0.9846697876614018, 1.0233266670556476, 0.5170848298029017, 0.6196982645207496, 2.6678088760546963, 0.5141659793793265, 0.5301873010239905, 0.5776511726646784, 0.5217769590202475, 0.05886392421087478, 0.3559087862943442, 0.19345909373452105, 0.12545363570557883, 0.026361462338003988, 0.026361462338003985, 0.026361462338003985, 0.48714322367445795, 0.037267763579900595, 1.0, 0.13324322516826134, 0.026361462338003988, 0.3285377589894749, 0.037267763579900595, 0.10489406194695299, 0.04562760696056815, 0.09096859763987666, 0.06960011398169241, 1.0, 0.0644596952782001, 0.05266786155427395]) # Isi dengan list dari terminal
LISTRIK_CATEGORIES = [450.0, 900.0, 1300.0, 2200.0, 3300.0, 3500.0, 4400.0, 5500.0, 6600.0, 7600.0, 7700.0, 8000.0, 10000.0, 10600.0, 11000.0, 13200.0, 16500.0, 22000.0, 23000.0, 30500.0, 33000.0]     # Isi dengan list dari terminal
# ------------------------------------------

model_xgb = None

def load_models():
    global model_xgb
    if model_xgb is None:
        try:
            with open("models/xgboost_optuna.pkl", "rb") as f:
                model_xgb = pickle.load(f)
            print("Model loaded.")
        except Exception as e:
            print(f"Error loading model: {e}")

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
        load_models()
        data = request.json
        selected_district = data.get("kecamatan")

        if selected_district in unavailable_district:
            return jsonify({"success": False, "error": f"House price for {selected_district} district is not available."}), 400
        
        if selected_district not in available_district:
            return jsonify({"success": False, "error": "Distric is not valid"}), 400

        # Manual Encoding Daya Listrik
        daya_input = data.get('daya_listrik', 1300)
        daya_encoded = LISTRIK_CATEGORIES.index(daya_input) if daya_input in LISTRIK_CATEGORIES else 0

        # Base features (9 kolom pertama)
        features = [
            data.get('kamar_tidur', 3),
            data.get('kamar_mandi', 2),
            math.log1p(data.get('luas_tanah', 100)),
            math.log1p(data.get('luas_bangunan', 80)),
            daya_encoded,
            data.get('jumlah_lantai', 1),
            data.get('carport', 1),
            data.get('kamar_tidur_pembantu', 0),
            data.get('kamar_mandi_pembantu', 0)
        ]

        # One-Hot Encoding Kecamatan (21 kolom berikutnya)
        for dist in available_district:
            features.append(1 if dist == selected_district else 0)

        # Convert ke numpy array 2D
        input_array = np.array([features])

        # Manual Scaling
        df_scaled = (input_array - SCALER_MEAN) / SCALER_SCALE

        # Prediksi
        predicted_price_log = model_xgb.predict(df_scaled)
        predicted_price = np.expm1(predicted_price_log)

        return jsonify({"success": True, "predicted_price": float(predicted_price[0])})
    
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/specs', methods=['GET'])
def get_specs():
    try:
        lokasi_filter = request.args.get('kecamatan')
        harga_filter = request.args.get('range_harga')
        csv_path = "data/Data Harga Rumah Kabupaten Tangerang.csv"

        if not os.path.exists(csv_path):
            return jsonify({"success": False, "error": "Dataset tidak ditemukan."}), 404

        result_data = []
        kecamatan_set = set()
        range_harga_set = set()

        # Baca CSV manual tanpa Pandas
        with open(csv_path, mode='r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            for row in reader:
                try:
                    harga = float(row['Harga'])
                except ValueError:
                    continue
                
                kec = row.get('Kecamatan', '').strip()
                if not kec: continue
                
                range_h = categorize_price(harga)
                kecamatan_set.add(kec)
                range_harga_set.add(range_h)

                if (not lokasi_filter or kec == lokasi_filter) and (not harga_filter or range_h == harga_filter):
                    # Parsing dan pembersihan data
                    row_data = {
                        "Harga": harga,
                        "Kecamatan": kec,
                        "Kamar Tidur": float(row.get('Kamar Tidur', 0) or 0),
                        "Kamar Mandi": float(row.get('Kamar Mandi', 0) or 0),
                        "Luas Tanah": float(row.get('Luas Tanah', 0) or 0),
                        "Luas Bangunan": float(row.get('Luas Bangunan', 0) or 0),
                        "Daya Listrik": float(row.get('Daya Listrik', 0) or 0),
                        "Jumlah Lantai": float(row.get('Jumlah Lantai', 0) or 0),
                        "Carport": float(row.get('Carport', 0) or 0),
                        "Kamar Tidur Pembantu": float(row.get('Kamar Tidur Pembantu', 0) or 0),
                        "Kamar Mandi Pembantu": float(row.get('Kamar Mandi Pembantu', 0) or 0)
                    }
                    result_data.append(row_data)

        if not lokasi_filter and not harga_filter:
            return jsonify({
                "success": True,
                "kecamatan_list": sorted(list(kecamatan_set)),
                "range_harga_list": sorted(list(range_harga_set))
            })

        if not result_data:
            return jsonify({"success": True, "data": []})

        # Manual Median Calculation
        def get_median(key):
            values = sorted([r[key] for r in result_data])
            n = len(values)
            if n == 0: return 0
            mid = n // 2
            return values[mid] if n % 2 != 0 else (values[mid - 1] + values[mid]) / 2.0

        recommended_specs = {
            "kamar_tidur": int(get_median("Kamar Tidur")),
            "kamar_mandi": int(get_median("Kamar Mandi")),
            "luas_tanah": int(get_median("Luas Tanah")),
            "luas_bangunan": int(get_median("Luas Bangunan")),
            "daya_listrik": int(get_median("Daya Listrik")),
            "jumlah_lantai": int(get_median("Jumlah Lantai")),
            "carport": int(get_median("Carport"))
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
    app.run(host="0.0.0.0", port=7860)