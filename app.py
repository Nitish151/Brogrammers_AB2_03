from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
from medical3 import ClinicalDecisionSupportSystem
import logging

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Allow all origins (for development)

# Enable logging
logging.basicConfig(level=logging.INFO)

# Initialize the Clinical Decision Support System
cdss = ClinicalDecisionSupportSystem()

@app.route("/", methods=["POST"])
def process_request():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON"}), 400

        patient_ehr = data.get("patient_ehr")
        clinical_question = data.get("clinical_question")

        if not patient_ehr or not clinical_question:
            return jsonify({"error": "Missing required fields"}), 400

        logging.info(f"Received Patient EHR: {patient_ehr}")
        logging.info(f"Received Clinical Question: {clinical_question}")

        if not cdss.initialize_with_patient_ehr(patient_ehr):
            return jsonify({"error": "Failed to initialize with EHR"}), 500

        recommendation = cdss.get_clinical_recommendation(clinical_question)

        return jsonify({"recommendation": recommendation})

    except Exception as e:
        logging.error(f"Error: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)