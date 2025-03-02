import os
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

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()
MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")
PUBMED_API_KEY = os.getenv("PUBMED_API_KEY")  # Optional for higher rate limits

class MedicalDataProcessor:
    """Process medical data from various sources including EHRs, PubMed, and clinical guidelines."""
    
    def __init__(self):
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            separators=["\n\n", "\n", ".", " ", ""],
            length_function=len,
            is_separator_regex=False
        )
    
    def process_ehr_data(self, ehr_path: str = None, ehr_text: str = None) -> List[Document]:
        """Process structured EHR data (CSV format or raw text)."""
        try:
            if ehr_path and os.path.exists(ehr_path):
                if ehr_path.endswith('.csv'):
                    loader = CSVLoader(file_path=ehr_path)
                    documents = loader.load()
                else:
                    with open(ehr_path, 'r') as f:
                        ehr_text = f.read()
                    documents = [Document(page_content=ehr_text, metadata={"source": "patient_ehr"})]
            elif ehr_text:
                documents = [Document(page_content=ehr_text, metadata={"source": "patient_ehr"})]
            else:
                logger.warning("No EHR data provided")
                return []
                
            # Split the documents if they're raw text
            if len(documents) == 1 and len(documents[0].page_content) > 1000:
                documents = self.text_splitter.split_documents(documents)
                
            logger.info(f"Loaded {len(documents)} documents from EHR data")
            return documents
        except Exception as e:
            logger.error(f"Error processing EHR data: {e}")
            return []
    
    def fetch_pubmed_articles(self, query: str, max_results: int = 20) -> List[Document]:
        """Fetch articles from PubMed based on query."""
        base_url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils"
        
        # Search for article IDs
        search_url = f"{base_url}/esearch.fcgi"
        params = {
            "db": "pubmed",
            "term": query,
            "retmax": max_results,
            "retmode": "json",
            "tool": "ClinicalDecisionSystem",
            "email": "example@example.com"  # Replace with your email
        }
        
        # Only add API key if it's actually provided and not a placeholder
        if PUBMED_API_KEY and PUBMED_API_KEY != "your_pubmed_key_optional":
            params["api_key"] = PUBMED_API_KEY
            
        try:
            logger.info(f"Searching PubMed for: {query}")
            response = requests.get(search_url, params=params)
            response.raise_for_status()
            
            search_results = response.json()
            id_list = search_results.get("esearchresult", {}).get("idlist", [])
            
            if not id_list:
                logger.warning(f"No PubMed articles found for query: {query}")
                return []
                
            # Fetch article details
            documents = []
            for pmid in tqdm(id_list, desc="Fetching PubMed articles"):
                fetch_url = f"{base_url}/efetch.fcgi"
                fetch_params = {
                    "db": "pubmed",
                    "id": pmid,
                    "retmode": "xml"
                }
                
                # Only add API key if it's actually provided and not a placeholder
                if PUBMED_API_KEY and PUBMED_API_KEY != "your_pubmed_key_optional":
                    fetch_params["api_key"] = PUBMED_API_KEY
                    
                article_response = requests.get(fetch_url, params=fetch_params)
                article_response.raise_for_status()
                
                soup = BeautifulSoup(article_response.content, "xml")
                
                # Extract title, abstract, and metadata
                title = soup.find("ArticleTitle")
                title_text = title.text if title else "No title available"
                
                abstract_text = "No abstract available"
                abstract = soup.find("AbstractText")
                if abstract:
                    abstract_text = abstract.text
                
                # Extract publication date
                pub_date = "Unknown date"
                pub_date_elem = soup.find("PubDate")
                if pub_date_elem:
                    year = pub_date_elem.find("Year")
                    month = pub_date_elem.find("Month")
                    day = pub_date_elem.find("Day")
                    
                    year_text = year.text if year else ""
                    month_text = month.text if month else ""
                    day_text = day.text if day else ""
                    
                    pub_date = f"{year_text} {month_text} {day_text}".strip()
                
                # Extract authors
                authors = []
                author_list = soup.find("AuthorList")
                if author_list:
                    for author in author_list.find_all("Author"):
                        last_name = author.find("LastName")
                        fore_name = author.find("ForeName")
                        
                        author_name = ""
                        if last_name:
                            author_name += last_name.text
                        if fore_name:
                            author_name = f"{fore_name.text} {author_name}"
                            
                        if author_name:
                            authors.append(author_name)
                
                authors_text = ", ".join(authors) if authors else "Unknown authors"
                
                # Create document
                content = f"Title: {title_text}\nAuthors: {authors_text}\nPublication Date: {pub_date}\nPMID: {pmid}\n\nAbstract: {abstract_text}"
                metadata = {
                    "source": "pubmed",
                    "pmid": pmid,
                    "title": title_text,
                    "authors": authors_text,
                    "publication_date": pub_date
                }
                
                documents.append(Document(page_content=content, metadata=metadata))
            
            logger.info(f"Fetched {len(documents)} PubMed articles")
            return documents
        
        except Exception as e:
            logger.error(f"Error fetching PubMed articles: {e}")
            return []
    
    def process_clinical_guidelines(self, guidelines_path: str) -> List[Document]:
        """Process clinical guidelines from PDF files."""
        try:
            loader = PyPDFLoader(file_path=guidelines_path)
            documents = loader.load()
            split_docs = self.text_splitter.split_documents(documents)
            logger.info(f"Processed clinical guidelines into {len(split_docs)} chunks")
            return split_docs
        except Exception as e:
            logger.error(f"Error processing clinical guidelines: {e}")
            return []
    
    def process_medical_texts(self, text_path: str) -> List[Document]:
        """Process medical text files."""
        try:
            loader = TextLoader(file_path=text_path)
            documents = loader.load()
            split_docs = self.text_splitter.split_documents(documents)
            logger.info(f"Processed medical texts into {len(split_docs)} chunks")
            return split_docs
        except Exception as e:
            logger.error(f"Error processing medical texts: {e}")
            return []
    
    def create_sample_documents(self) -> List[Document]:
        """Create sample medical documents when external data sources are unavailable."""
        logger.info("Creating sample medical documents as fallback")
        
        sample_texts = [
            # Hypertension guidelines
            """
            Title: 2023 Hypertension Treatment Guidelines
            Authors: American Heart Association
            
            Abstract: Hypertension, defined as blood pressure ≥130/80 mm Hg, affects approximately 45% of adults in the United States. 
            First-line pharmacologic treatment includes thiazide diuretics, calcium channel blockers (CCBs), and ACE inhibitors or ARBs. 
            Initial treatment with two first-line agents from different classes is recommended for patients with stage 2 hypertension 
            (BP ≥140/90 mm Hg). Lifestyle modifications including the DASH diet, sodium restriction, physical activity, and weight loss 
            are strongly recommended for all patients. Treatment goals should be individualized, with a general target of <130/80 mm Hg 
            for most adults. For older adults (≥65 years), a less aggressive target of <140/90 mm Hg may be appropriate. Regular monitoring 
            and medication adjustment are essential for optimal blood pressure control.
            """,
            
            # Diabetes management
            """
            Title: Current Approaches to Diabetes Management
            Authors: American Diabetes Association
            
            Abstract: Management of type 2 diabetes mellitus (T2DM) focuses on glycemic control and cardiovascular risk reduction. 
            Target HbA1c should generally be <7.0%, but can be individualized based on patient factors. Metformin remains the preferred 
            initial pharmacologic agent. Second-line agents should be selected based on comorbidities: SGLT2 inhibitors or GLP-1 receptor 
            agonists are preferred for patients with established cardiovascular disease, heart failure, or chronic kidney disease. 
            SGLT2 inhibitors show particular benefit for heart failure with reduced ejection fraction and can slow progression of diabetic 
            kidney disease. Regular screening for complications, including retinopathy, neuropathy, and nephropathy, is essential. 
            Comprehensive diabetes care includes management of blood pressure (<140/90 mmHg), lipids (statin therapy based on CV risk), 
            and lifestyle modifications including medical nutrition therapy, physical activity, smoking cessation, and psychosocial care.
            """,
            
            # Antibiotic resistance
            """
            Title: Mechanisms of Antibiotic Resistance and Stewardship Approaches
            Authors: Infectious Diseases Society of America
            
            Abstract: Antimicrobial resistance continues to pose a significant global health threat. Common resistance mechanisms include 
            enzyme production (β-lactamases), efflux pumps, target site modification, and altered membrane permeability. Gram-negative 
            organisms like Pseudomonas aeruginosa, Acinetobacter baumannii, and Enterobacteriaceae with extended-spectrum β-lactamases 
            are of particular concern. Antibiotic stewardship programs implementing strategies such as prospective audit with feedback, 
            formulary restrictions, and education have shown effectiveness in reducing inappropriate antibiotic use. Empiric therapy 
            should be based on local antibiograms, with de-escalation once culture results are available. Duration of therapy should 
            be minimized to the shortest effective period. New diagnostic technologies enabling rapid identification of pathogens and 
            resistance mechanisms are improving targeted therapy. Prevention strategies, including vaccination, infection control 
            measures, and environmental interventions, remain essential components of comprehensive antimicrobial stewardship.
            """
        ]
        
        documents = []
        for i, text in enumerate(sample_texts):
            documents.append(Document(
                page_content=text,
                metadata={"source": "sample", "id": f"sample_{i}"}
            ))
        
        return documents


class MedicalVectorStore:
    """Create and manage vector stores for medical documents."""
    
    def __init__(self, persist_directory: str = "./medical_chroma_db"):
        self.persist_directory = persist_directory
        
        # Use a more widely available model that's more likely to work
        self.embeddings = HuggingFaceEmbeddings(
            model_name="all-MiniLM-L6-v2",
            model_kwargs={"device": "cpu"}
        )
    
    def create_vector_store(self, documents: List[Document], collection_name: str) -> Chroma:
        """Create a vector store from documents."""
        try:
            # Ensure the persist directory exists
            os.makedirs(f"{self.persist_directory}/{collection_name}", exist_ok=True)
            
            vector_store = Chroma.from_documents(
                documents=documents,
                embedding=self.embeddings,
                persist_directory=f"{self.persist_directory}/{collection_name}"
            )
            vector_store.persist()  # Make sure to persist the data to disk
            logger.info(f"Created vector store with {len(documents)} documents for collection: {collection_name}")
            return vector_store
        except Exception as e:
            logger.error(f"Error creating vector store: {e}")
            raise
    
    def load_vector_store(self, collection_name: str) -> Optional[Chroma]:
        """Load an existing vector store."""
        try:
            if os.path.exists(f"{self.persist_directory}/{collection_name}"):
                vector_store = Chroma(
                    persist_directory=f"{self.persist_directory}/{collection_name}",
                    embedding_function=self.embeddings
                )
                logger.info(f"Loaded vector store for collection: {collection_name}")
                return vector_store
            else:
                logger.warning(f"Vector store for collection {collection_name} does not exist")
                return None
        except Exception as e:
            logger.error(f"Error loading vector store: {e}")
            return None
    
    def add_documents(self, vector_store: Chroma, documents: List[Document]) -> Chroma:
        """Add documents to an existing vector store."""
        try:
            vector_store.add_documents(documents)
            vector_store.persist()  # Persist changes to disk
            logger.info(f"Added {len(documents)} documents to vector store")
            return vector_store
        except Exception as e:
            logger.error(f"Error adding documents to vector store: {e}")
            raise


class MedicalEntityExtractor:
    """Extract medical entities from text using LLM."""
    
    def __init__(self):
        self.llm = ChatMistralAI(
            temperature=0, 
            model="mistral-large-latest", 
            mistral_api_key=MISTRAL_API_KEY
        )
        
        self.prompt = ChatPromptTemplate.from_messages([
            SystemMessagePromptTemplate.from_template(
                """You are a medical entity extraction system. Extract the following entities from the input text:
                1. Medical conditions/diseases
                2. Medications/drugs
                3. Treatments/procedures
                4. Lab tests/results
                5. Vital signs
                6. Patient demographics
                
                Format your response as a JSON object with these categories as keys and arrays of extracted entities as values.
                If a category has no entities, use an empty array.
                
                Example format:
                {{
                "medical_conditions": ["type 2 diabetes", "hypertension"],
                "medications": ["Metformin 1000mg BID"],
                "treatments": [],
                "lab_tests": ["HbA1c 8.2%"],
                "vital_signs": ["blood pressure 145/90 mmHg"],
                "patient_demographics": ["58-year-old male"]
                }}
                """
            ),
            HumanMessagePromptTemplate.from_template("{text}")
        ])
        
    def extract_entities(self, text: str) -> Dict[str, List[str]]:
        try:
            chain = self.prompt | self.llm | StrOutputParser()
            result = chain.invoke({"text": text})
            
            # Log the raw response for debugging
            logger.debug(f"Raw API response: {result}")
            
            # Attempt to parse the JSON response
            try:
                entities = json.loads(result)
                logger.info(f"Extracted entities from text: {entities}")
                return entities
            except json.JSONDecodeError as json_err:
                logger.error(f"JSON parsing error: {json_err}. Raw response: {result}")
                # Attempt to fix common JSON formatting issues
                result = re.sub(r"'", '"', result)  # Replace single quotes with double quotes
                result = re.sub(r"(\w+):", r'"\1":', result)  # Ensure keys are quoted
                
                try:
                    entities = json.loads(result)
                    logger.info(f"Successfully parsed JSON after fixing format issues")
                    return entities
                except json.JSONDecodeError:
                    logger.error(f"Failed to parse JSON even after attempted fixes")
                    # Return default structure
                    return {
                        "medical_conditions": [],
                        "medications": [],
                        "treatments": [],
                        "lab_tests": [],
                        "vital_signs": [],
                        "patient_demographics": []
                    }
        except Exception as e:
            logger.error(f"Error extracting entities: {e}")
            return {
                "medical_conditions": [],
                "medications": [],
                "treatments": [],
                "lab_tests": [],
                "vital_signs": [],
                "patient_demographics": []
            }

class ClinicalDecisionSupportSystem:
    """RAG-based Clinical Decision Support System."""
    
    def __init__(self):
        self.llm = ChatMistralAI(
            temperature=0.2, 
            model="mistral-large-latest", 
            mistral_api_key=MISTRAL_API_KEY
        )
        
        self.data_processor = MedicalDataProcessor()
        self.vector_store = MedicalVectorStore()
        self.entity_extractor = MedicalEntityExtractor()
        
        # Hybrid retriever components
        self.bm25_retriever = None
        self.vector_retriever = None
        
        # Keep track of patient data
        self.patient_data = None
        self.patient_ehr_hash = None
        self.is_initialized = False
        
        # System prompt for the RAG chain
        self.system_prompt = """You are an advanced Clinical Decision Support System designed to assist healthcare professionals.
        
        Given the patient information and the retrieved medical literature, provide evidence-based recommendations:
        
        1. Summarize the key patient information
        2. Identify potential diagnoses based on the symptoms and patient history
        3. Recommend appropriate diagnostic tests to confirm or rule out diagnoses
        4. Suggest treatment options based on current clinical guidelines and research
        5. Highlight any precautions, contraindications, or potential drug interactions
        6. Provide references to relevant medical literature that supports your recommendations
        
        Your response should be comprehensive yet concise, organized into clear sections, and follow evidence-based medicine principles. 
        Always emphasize that the final decision rests with the healthcare provider and that your suggestions are meant to support, not replace, clinical judgment.
        
        IMPORTANT: If you are unsure or the information is insufficient, clearly state the limitations and recommend consulting additional resources or specialists.
        """
    
    def _generate_unique_id(self, text: str) -> str:
        """Generate a unique ID for the EHR text to track changes."""
        return hashlib.md5(text.encode()).hexdigest()
        
    def initialize_with_patient_ehr(self, 
                                   patient_ehr: str,
                                   medical_conditions: Optional[List[str]] = None,
                                   force_reinitialize: bool = False) -> bool:
        """Initialize the system with patient EHR data and relevant medical knowledge."""
        # Generate a hash for the EHR text to check if it's the same
        new_ehr_hash = self._generate_unique_id(patient_ehr)
        
        # Check if we already processed this EHR
        if self.patient_ehr_hash == new_ehr_hash and self.is_initialized and not force_reinitialize:
            logger.info("System already initialized with this EHR data")
            return True
        
        # Process the EHR data
        logger.info("Processing patient EHR data")
        self.patient_data = self.process_patient_ehr(patient_ehr)
        
        # Create a unique collection name based on the EHR content
        collection_name = f"patient_{new_ehr_hash[:8]}"
        
        # First, check if we already have a vector store for this patient
        existing_vector_store = self.vector_store.load_vector_store(collection_name)
        
        if existing_vector_store and not force_reinitialize:
            logger.info(f"Using existing vector store for patient {collection_name}")
            self.vector_retriever = existing_vector_store.as_retriever(
                search_type="similarity",
                search_kwargs={"k": 5}
            )
            self.patient_ehr_hash = new_ehr_hash
            self.is_initialized = True
            return True
        
        # Process and store documents
        try:
            # Start with patient EHR document
            documents = self.data_processor.process_ehr_data(ehr_text=patient_ehr)
            
            # Dynamically fetch relevant medical literature based on patient conditions
            conditions = medical_conditions if medical_conditions else self.patient_data.get("medical_conditions", [])
            
            if conditions:
                for condition in conditions:
                    # Fetch PubMed articles for each condition
                    query = f"{condition} treatment guidelines"
                    pubmed_docs = self.data_processor.fetch_pubmed_articles(query, max_results=5)
                    documents.extend(pubmed_docs)
            else:
                # If no conditions found, use sample documents
                logger.info("No medical conditions found, using sample documents")
                sample_docs = self.data_processor.create_sample_documents()
                documents.extend(sample_docs)
            
            # Create vector store
            if len(documents) > 0:
                vector_store = self.vector_store.create_vector_store(documents, collection_name)
                
                # Initialize vector retriever
                self.vector_retriever = vector_store.as_retriever(
                    search_type="similarity",
                    search_kwargs={"k": 5}
                )
                
                # Initialize BM25 retriever for hybrid search
                texts = [doc.page_content for doc in documents]
                text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
                split_texts = text_splitter.split_text(" ".join(texts))
                self.bm25_retriever = BM25Retriever.from_texts(split_texts)
                self.bm25_retriever.k = 5
                
                self.patient_ehr_hash = new_ehr_hash
                self.is_initialized = True
                logger.info("Clinical Decision Support System initialized successfully with patient EHR")
                return True
            else:
                logger.error("No documents were loaded")
                return False
                
        except Exception as e:
            logger.error(f"Error initializing the system: {e}")
            return False
        
    def process_patient_ehr(self, ehr_text: str) -> Dict[str, Any]:
        """Extract structured information from patient EHR text."""
        entities = self.entity_extractor.extract_entities(ehr_text)
        
        # Format patient data
        patient_data = {
            "medical_conditions": entities.get("medical_conditions", []),
            "medications": entities.get("medications", []),
            "treatments": entities.get("treatments", []),
            "lab_tests": entities.get("lab_tests", []),
            "vital_signs": entities.get("vital_signs", []),
            "demographics": entities.get("patient_demographics", [])
        }
        
        logger.info(f"Processed patient EHR data: {patient_data}")
        return patient_data
    
    def _hybrid_retrieval(self, query: str) -> List[Document]:
        """Perform hybrid retrieval combining BM25 and vector search results."""
        # Check if retrievers are initialized
        if self.vector_retriever is None:
            logger.error("Vector retriever not initialized. Make sure to call initialize_with_patient_ehr() first.")
            return []
            
        # Enhance query with patient data if available
        enhanced_query = query
        if self.patient_data:
            patient_info = []
            for key, value in self.patient_data.items():
                if value:
                    patient_info.append(f"{key}: {', '.join(value)}")
            
            patient_text = "\n".join(patient_info)
            enhanced_query = f"{query}\nPatient Information:\n{patient_text}"
            
        # Get results from vector retriever
        vector_docs = self.vector_retriever.get_relevant_documents(enhanced_query)
        
        # Add results from BM25 retriever if available
        bm25_docs = []
        if self.bm25_retriever is not None:
            bm25_docs = self.bm25_retriever.get_relevant_documents(enhanced_query)
        
        # Combine and deduplicate results
        all_docs = vector_docs + bm25_docs
        unique_docs = {}
        
        for doc in all_docs:
            # Create a hash based on content to identify duplicates
            content_hash = hash(doc.page_content)
            if content_hash not in unique_docs:
                unique_docs[content_hash] = doc
                
        logger.info(f"Retrieved {len(unique_docs)} unique documents from hybrid search")
        return list(unique_docs.values())
    
    def get_clinical_recommendation(self, clinical_question: str) -> str:
        """Get clinical recommendations for a specific patient case."""
        # Check if system is initialized
        if not self.is_initialized or self.vector_retriever is None:
            error_msg = "Error: System not initialized with patient EHR data. Please call initialize_with_patient_ehr() first."
            logger.error(error_msg)
            return error_msg
        
        # Retrieve relevant documents
        retrieved_docs = self._hybrid_retrieval(clinical_question)
        
        if not retrieved_docs:
            logger.warning("No relevant documents found. Falling back to direct LLM approach.")
            return self._direct_llm_recommendation(clinical_question)
        
        # Create prompt with context variable
        prompt_template = ChatPromptTemplate.from_messages([
            SystemMessagePromptTemplate.from_template(self.system_prompt),
            HumanMessagePromptTemplate.from_template(
                """Clinical Question: {question}
                
                {patient_info}
                
                Context: {context}
                
                Please provide evidence-based recommendations based on the retrieved medical literature."""
            )
        ])
        
        # Format patient information if available
        patient_info_text = self._format_patient_info()
        
        # Create RAG chain
        document_chain = create_stuff_documents_chain(self.llm, prompt_template)
        rag_chain = create_retrieval_chain(self.vector_retriever, document_chain)
        
        # Generate recommendation
        try:
            response = rag_chain.invoke({
                "question": clinical_question,
                "patient_info": patient_info_text
            })
            
            recommendation = response["answer"]
            logger.info("Generated clinical recommendation successfully")
            return recommendation
        except Exception as e:
            logger.error(f"Error generating recommendation: {e}")
            return self._direct_llm_recommendation(clinical_question)
    
    def _format_patient_info(self) -> str:
        """Format patient information into a readable string."""
        if not self.patient_data:
            return "No specific patient information provided."
            
        sections = []
        
        # Demographics
        if self.patient_data["demographics"]:
            sections.append(f"Patient Demographics: {', '.join(self.patient_data['demographics'])}")
        
        # Medical conditions
        if self.patient_data["medical_conditions"]:
            sections.append(f"Medical Conditions: {', '.join(self.patient_data['medical_conditions'])}")
        
        # Medications
        if self.patient_data["medications"]:
            sections.append(f"Current Medications: {', '.join(self.patient_data['medications'])}")
        
        # Treatments
        if self.patient_data["treatments"]:
            sections.append(f"Current/Past Treatments: {', '.join(self.patient_data['treatments'])}")
        
        # Lab tests
        if self.patient_data["lab_tests"]:
            sections.append(f"Lab Results: {', '.join(self.patient_data['lab_tests'])}")
        
        # Vital signs
        if self.patient_data["vital_signs"]:
            sections.append(f"Vital Signs: {', '.join(self.patient_data['vital_signs'])}")
        
        return "Patient Information:\n" + "\n".join(sections)
    
    def _direct_llm_recommendation(self, clinical_question: str) -> str:
        """Fallback method to generate recommendations directly using LLM without retrieval."""
        logger.info("Using direct LLM approach for recommendation")
        
        # Format patient information
        patient_info_text = self._format_patient_info()
        
        prompt = ChatPromptTemplate.from_messages([
            SystemMessagePromptTemplate.from_template(self.system_prompt),
            HumanMessagePromptTemplate.from_template(
                """Clinical Question: {question}
                
                {patient_info}
                
                Please provide evidence-based recommendations based on your medical knowledge."""
            )
        ])
        
        try:
            chain = prompt | self.llm | StrOutputParser()
            recommendation = chain.invoke({
                "question": clinical_question,
                "patient_info": patient_info_text
            })
            
            logger.info("Generated direct LLM recommendation successfully")
            return recommendation
        except Exception as e:
            logger.error(f"Error generating direct LLM recommendation: {e}")
            return "An error occurred while generating the clinical recommendation. Please try again or refine your query."

def verify_api_connectivity():
    """Verify Mistral API connectivity before proceeding."""
    try:
        # Simple test call to verify API access
        test_llm = ChatMistralAI(
            temperature=0,
            model="mistral-small", 
            mistral_api_key=MISTRAL_API_KEY
        )
        
        test_message = [{"role": "user", "content": "Hello"}]
        response = test_llm.invoke(test_message)
        logger.info("Mistral API connectivity verified successfully")
        return True
    except Exception as e:
        logger.error(f"Failed to connect to Mistral API: {e}")
        print("=" * 80)
        print("WARNING: Cannot connect to Mistral API. The system will operate in limited functionality mode.")
        print("=" * 80)
        return False


def main():
    """Main function to run the Clinical Decision Support System."""
    # Verify API connectivity
    if not verify_api_connectivity():
        return

    # Initialize the Clinical Decision Support System
    cdss = ClinicalDecisionSupportSystem()

    # Sample patient EHR
    sample_ehr = """
    Patient is a 65-year-old female with a history of chronic obstructive pulmonary disease (COPD) (diagnosed 7 years ago), osteoporosis, and gastroesophageal reflux disease (GERD). Current medications include Tiotropium (Spiriva) 18 mcg daily, Alendronate 70 mg weekly, and Omeprazole 20 mg daily. Recent lab results show a forced expiratory volume in 1 second (FEV1) of 55% predicted, vitamin D level of 18 ng/mL (deficient), and calcium level of 8.8 mg/dL. Imaging reveals a T-score of -2.8 at the lumbar spine, consistent with osteoporosis. Patient reports worsening shortness of breath on exertion, chronic cough with occasional sputum production, and mild back pain. She has a 30-pack-year smoking history but quit 5 years ago. She also reports occasional heartburn and difficulty swallowing.
    """

    # Initialize the system with patient EHR
    logger.info("Initializing system with patient EHR...")
    if not cdss.initialize_with_patient_ehr(patient_ehr=sample_ehr):
        logger.error("Failed to initialize the system with patient EHR.")
        return

    # Sample clinical question
    clinical_question = "What adjustments to chronic obstructive pulmonary disease would you recommend for this patient given the elevated symptoms?"

    # Get recommendation
    logger.info("Generating clinical recommendation...")
    recommendation = cdss.get_clinical_recommendation(clinical_question)
    
    # Display the recommendation
    print("\n" + "=" * 80)
    print("Clinical Recommendation:")
    print("=" * 80)
    print(recommendation)
    print("=" * 80)


if __name__ == "__main__":
    # Load environment variables
    load_dotenv()

    # Run the main function
    main()