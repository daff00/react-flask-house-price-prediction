<div align="center">

# 🏡 House Price Prediction System

A machine learning-based application to predict house prices in the Tangerang Regency area and provide specification recommendations based on budget range. Built using a multi-tier architecture.

</div>

---

## System Architecture

- **Client** — User interface (React + Vite + Tailwind CSS)
- **Server** — API Gateway and prediction history management (Node.js + Express + MongoDB)
- **ML Service** — Machine learning model inference and data processing (Python + Flask + XGBoost)

---

## How to Run the Application

This application consists of three separate services that must be run in parallel, each in their own terminal. Please follow the setup instructions in each directory:

1. [ML Service Setup Guide](./ml-service/README.md)
2. [Server / API Gateway Setup Guide](./server/README.md)
3. [Client / Frontend Setup Guide](./client/README.md)