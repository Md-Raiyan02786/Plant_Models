from flask import Flask, render_template, request, jsonify
import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing import image
from flask_cors import CORS
import os
from io import BytesIO

# Initialize Flask app with templates folder
app = Flask(__name__, template_folder="templates", static_folder="static")
CORS(app)

# Dictionary of models for different plants
MODEL_PATHS = {
    "tomato": "Plant-Disease-Model.keras",
    "potato": "potatoes.h5",
    "pepper": "Pepper Bell Classification Model.keras"
}

labels = ["Healthy", "Diseased"]  # Define Labels

@app.route('/')
def home():
    return render_template("index.html")  # Ensure 'index.html' exists inside 'templates' folder

@app.route('/predict', methods=['POST'])
def predict():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file uploaded"})

        file = request.files['file']
        plant = request.form.get("plant")

        if not plant or plant not in MODEL_PATHS:
            return jsonify({"error": "Invalid plant selection"})

        model_path = MODEL_PATHS[plant]

        if not os.path.exists(model_path):
            return jsonify({"error": f"Model file for {plant} not found."})

        # Load the correct model
        model = tf.keras.models.load_model(model_path)

        # Convert file to BytesIO and load image
        img = image.load_img(BytesIO(file.read()), target_size=(224, 224))
        file.seek(0)  # Reset file pointer after reading

        # Preprocess image
        img_array = image.img_to_array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        # Make prediction
        prediction = model.predict(img_array)
        result = labels[np.argmax(prediction)]

        return jsonify({"prediction": result})

    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    app.run(debug=True)
