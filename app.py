import os
from flask import Flask, request, render_template, jsonify
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader, TextLoader, CSVLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.schema import Document
from langchain_mistralai import ChatMistralAI
from langchain_core.prompts import ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains import create_retrieval_chain
from langchain_community.retrievers import BM25Retriever
from langchain_text_splitters import CharacterTextSplitter
import requests
from bs4 import BeautifulSoup
import pandas as pd
import numpy as np
import json
from typing import List, Dict, Any, Optional, Union
import re
from tqdm import tqdm
import logging
import hashlib
from medical3 import MedicalDataProcessor, MedicalVectorStore, MedicalEntityExtractor, ClinicalDecisionSupportSystem
# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()
MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")
PUBMED_API_KEY = os.getenv("PUBMED_API_KEY")  # Optional for higher rate limits

# Initialize Flask app
app = Flask(__name__)

# Initialize the Clinical Decision Support System
cdss = ClinicalDecisionSupportSystem()
@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        # Get input from the form
        patient_ehr = request.form.get("patient_ehr")
        clinical_question = request.form.get("clinical_question")

        # Log the input
        logger.info(f"Received patient EHR: {patient_ehr}")
        logger.info(f"Received clinical question: {clinical_question}")

        # Initialize the system with patient EHR
        logger.info("Initializing system with patient EHR...")
        if not cdss.initialize_with_patient_ehr(patient_ehr=patient_ehr):
            logger.error("Failed to initialize the system with patient EHR.")
            return render_template("index.html", error="Failed to initialize the system with patient EHR.")

        # Get recommendation
        logger.info("Generating clinical recommendation...")
        recommendation = cdss.get_clinical_recommendation(clinical_question)

        # Log the recommendation
        logger.info(f"Generated recommendation: {recommendation}")

        # Render the result in the HTML template
        return render_template("index.html", recommendation=recommendation, patient_ehr=patient_ehr, clinical_question=clinical_question)

    # Render the form for GET requests
    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True)
