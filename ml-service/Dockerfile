# Gunakan base image Python yang ringan
FROM python:3.10-slim

# Buat direktori kerja
WORKDIR /app

# Salin file requirements dan instal dependensi
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Instal gunicorn untuk production server
RUN pip install --no-cache-dir gunicorn

# Salin seluruh file aplikasi (app.py, folder models, folder data)
COPY . .

# Hugging Face secara default menggunakan port 7860
EXPOSE 7860

# Jalankan aplikasi menggunakan gunicorn di port 7860
CMD ["gunicorn", "-b", "0.0.0.0:7860", "app:app", "--timeout", "120"]
