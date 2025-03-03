import React, { useState } from "react";
import axios from "axios";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedPlant, setSelectedPlant] = useState("tomato");
  const [prediction, setPrediction] = useState("");

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handlePlantChange = (event) => {
    setSelectedPlant(event.target.value);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("plant", selectedPlant);

    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setPrediction(response.data.prediction);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="container">
      <h1>Plant Disease Detection</h1>
      <label>Select Plant:</label>
      <select onChange={handlePlantChange} value={selectedPlant}>
        <option value="tomato">Tomato</option>
        <option value="potato">Potato</option>
        <option value="pepper">Pepper</option>
      </select>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Predict</button>
      {prediction && <h3>Prediction: {prediction}</h3>}
    </div>
  );
}

export default App;
