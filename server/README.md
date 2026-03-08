<div align="center">

# ⚙️ Server — API Gateway

A Node.js backend service acting as the API Gateway. It forwards requests from the React interface to the Machine Learning service (Flask) and manages the storage of prediction history in a MongoDB database.

</div>

---

## Tech Stack

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=flat-square&logo=mongoose&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=axios&logoColor=white)

- **Node.js & Express** — Backend runtime and web framework
- **MongoDB & Mongoose** — Database and ODM
- **Axios** — Internal HTTP communication to ML service

---

## Installation & Running

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install all dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file inside the `server` directory and adjust to your local environment:
   ```env
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   FLASK_API_URL=your_flask_api_url
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The server will be running at `http://localhost:3000`.