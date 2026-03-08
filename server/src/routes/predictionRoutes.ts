import express from 'express';
import { createPrediction, getHistory, getSpecs } from '../controllers/predictionController.js';

const router = express.Router();

router.post('/', createPrediction);
router.get('/history', getHistory);
router.get('/specs', getSpecs);

export default router;