<div align="center">

# 🤖 ML Service — House Price Prediction

A Python and Flask-based microservice that hosts the Machine Learning model. This API accepts specification inputs, performs encoding and scaling, runs inference using the XGBoost algorithm, and returns a price estimate.

</div>

---

## Tech Stack

![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?style=flat-square&logo=flask&logoColor=white)
![XGBoost](https://img.shields.io/badge/XGBoost-189AB4?style=flat-square&logo=xgboost&logoColor=white)
![Pandas](https://img.shields.io/badge/Pandas-150458?style=flat-square&logo=pandas&logoColor=white)
![NumPy](https://img.shields.io/badge/NumPy-013243?style=flat-square&logo=numpy&logoColor=white)
![scikit-learn](https://img.shields.io/badge/scikit--learn-F7931E?style=flat-square&logo=scikit-learn&logoColor=white)

- **Python 3 & Flask** — Runtime and web framework
- **XGBoost** — Gradient boosting model for price inference
- **Pandas & NumPy** — Data manipulation and numerical operations
- **Scikit-learn** — Preprocessing (encoding & scaling)

---

## Installation & Running

1. Navigate to the ml-service directory:
   ```bash
   cd ml-service
   ```

2. Create and activate a virtual environment:
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # Linux / Mac
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install all library dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the Flask server:
   ```bash
   python app.py
   ```

The ML service will be running at `http://127.0.0.1:5000`.