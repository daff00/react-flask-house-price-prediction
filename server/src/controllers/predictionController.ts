import { Request, Response } from 'express';
import axios from 'axios';
import Prediction from '../models/Prediction.js'; 

export const createPrediction = async (req: Request, res: Response): Promise<void> => {
  try {
    const userInput = req.body;
    const flaskApiUrl = process.env.FLASK_API_URL as string;

    const flaskResponse = await axios.post(`${flaskApiUrl}/predict`, userInput);

    if (!flaskResponse.data.success) {
      res.status(400).json({ success: false, error: 'ML Failed to predict.' });
      return;
    }

    const predictedPrice = flaskResponse.data.predicted_price;

    const newPrediction = await Prediction.create({
      ...userInput,
      predicted_price: predictedPrice,
    });

    res.status(201).json({ success: true, data: newPrediction });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error createPrediction:', error.message);
    }
    res.status(500).json({ success: false, error: "There's an error from the Gateway Server" });
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