import mongoose, { Document, Schema } from "mongoose";

// Interface that define data types strictly
export interface IPrediction extends Document {
  kecamatan: string;
  kamar_tidur: number;
  kamar_mandi: number;
  luas_tanah: number;
  luas_bangunan: number;
  daya_listrik: number;
  jumlah_lantai: number;
  carport: number;
  kamar_tidur_pembantu: number;
  kamar_mandi_pembantu: number;
  predicted_price: number;
}

const predictionSchema = new Schema<IPrediction>(
    {
    kecamatan: { type: String, required: true },
    kamar_tidur: { type: Number, required: true },
    kamar_mandi: { type: Number, required: true },
    luas_tanah: { type: Number, required: true },
    luas_bangunan: { type: Number, required: true },
    daya_listrik: { type: Number, required: true },
    jumlah_lantai: { type: Number, required: true },
    carport: { type: Number, required: true },
    kamar_tidur_pembantu: { type: Number, default: 0 },
    kamar_mandi_pembantu: { type: Number, default: 0 },
    predicted_price: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const Prediction = mongoose.model<IPrediction>('Prediction', predictionSchema);

export default Prediction;