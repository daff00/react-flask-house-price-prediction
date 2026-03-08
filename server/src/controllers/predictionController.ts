import { Request, Response } from 'express';
import axios from 'axios';
import Prediction from '../models/Prediction.js'; 
import connectDB from '../config/db.js';

// server/src/controllers/predictionController.ts

export const createPrediction = async (req: Request, res: Response) => {
  try {
    // 1. Pastikan koneksi DB (Sangat penting di Serverless)
    await connectDB();

    // 2. Kirim data ke Flask
    // Pastikan process.env.FLASK_API_URL sudah benar di Vercel
    console.log("DEBUG FLASK URL:", process.env.FLASK_API_URL);
    const flaskResponse = await axios.post(`${process.env.FLASK_API_URL}/predict`, req.body);

    // 3. Simpan ke MongoDB (Jika Flask berhasil)
    const newPrediction = await Prediction.create({
      ...req.body,
      predicted_price: flaskResponse.data.predicted_price
    });

    // 4. Kirim respon sukses
    res.status(200).json({
      success: true,
      data: newPrediction,
      prediction: flaskResponse.data
    });

  } catch (error: any) {
    console.error("Error di Controller:", error.message);
    
    // Kirim JSON agar tidak memicu error CORS "Missing Header"
    res.status(500).json({
      success: false,
      error: error.message,
      details: error.response?.data || "Internal Server Error"
    });
  }
};

export const getHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const history = await Prediction.find().sort({ createdAt: -1 }).limit(10);
    res.status(200).json({ success: true, count: history.length, data: history });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch prediction history.' });
  }
};

export const getSpecs = async (req: Request, res: Response): Promise<void> => {
  try {
    const flaskApiUrl = process.env.FLASK_API_URL as string;
    const flaskResponse = await axios.get(`${flaskApiUrl}/specs`, { params: req.query });
    res.status(200).json(flaskResponse.data);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch specification data from flask.' });
  }
};