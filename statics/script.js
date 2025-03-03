function uploadImage() {
    const fileInput = document.getElementById("imageUpload");
    const plantSelect = document.getElementById("plantSelect").value;
    const resultText = document.getElementById("result");

    if (!fileInput.files.length) {
        alert("Please select an image.");
        return;
    }

    let formData = new FormData();
    formData.append("file", fileInput.files[0]);
    formData.append("plant", plantSelect);  // Ensure this is sent

    fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            resultText.innerHTML = `<b>Error:</b> ${data.error}`;
        } else {
            resultText.innerHTML = `Prediction: <b>${data.prediction}</b>`;
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });
}
