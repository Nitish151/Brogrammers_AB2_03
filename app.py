from flask import Flask, request, render_template
from langchain_community.document_loaders import PubMedLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.chains import RetrievalQA
from langchain_openai import OpenAI
from langchain.prompts import PromptTemplate
import os

# Initialize Flask app
app = Flask(__name__)

# Set OpenAI API key using your actual token
os.environ["OPENAI_API_KEY"] = "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"

# =====================================
# 1. Load PubMed Data & Create Vector DB
# =====================================

def create_vector_db():
    # Fetch PubMed articles using your base query
    query = "diabetes treatment"
    loader = PubMedLoader(query=query)
    documents = loader.load()

    # Update each document's metadata with a title if not already present
    for doc in documents:
        if not doc.metadata.get("title"):
            # Extract the title from the first line of the page content, if possible
            lines = doc.page_content.strip().split("\n")
            if lines:
                doc.metadata["title"] = lines[0].strip()
            else:
                doc.metadata["title"] = "No Title"

    # Split documents into chunks
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        separators=["\n\n", "\n", ". ", " ", ""]
    )
    split_docs = text_splitter.split_documents(documents)

    # Create embeddings and store in Chroma DB
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

    vector_db = Chroma.from_documents(
        documents=split_docs,
        embedding=embeddings,
        persist_directory="./chroma_db_data",
        collection_name="pubmed_articles",
    )
    vector_db.persist()
    return vector_db

# =====================================
# 2. Initialize RAG Pipeline Components
# =====================================

# Initialize the embedding model
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

# Load the pre-existing Chroma DB
vector_db = Chroma(
    persist_directory="./chroma_db_data",
    embedding_function=embeddings,
    collection_name="pubmed_articles",
)

# Configure the retriever using Maximal Marginal Relevance
retriever = vector_db.as_retriever(
    search_type="mmr",
    search_kwargs={"k": 5, "fetch_k": 20}
)

# Custom prompt template for generating answers
prompt_template = """Use the following medical research excerpts to answer the question.
If you don't know the answer, say you don't know. Keep answers technical but clear.

Context:
{context}

Question: {question}
Answer:"""

PROMPT = PromptTemplate(
    template=prompt_template,
    input_variables=["context", "question"]
)

llm = OpenAI(
    model_name="gpt-3.5-turbo-instruct",  # You can also use "gpt-4"
    temperature=0.2
)

# =====================================
# 3. Create RetrievalQA Chain
# =====================================

qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=retriever,
    return_source_documents=True,
    chain_type_kwargs={"prompt": PROMPT}
)

# =====================================
# 4. Query Interface
# =====================================

def ask_question(question):
    result = qa_chain.invoke({"query": question})

    # Format answer with sources (display only valid URLs)
    answer = result["result"]
    sources = []

    for doc in result["source_documents"]:
        url = doc.metadata.get("url")
        if url and url.startswith("http"):  # Only include valid URLs
            sources.append(url)

    # If no valid URLs are found, display a message
    sources_text = "\n".join(sources) if sources else "No direct URLs available."

    return f"Answer: {answer}\n\nSources:\n{sources_text}"

# =====================================
# 5. Flask Routes
# =====================================

@app.route("/", methods=["GET", "POST"])
def home():
    if request.method == "POST":
        question = request.form.get("question")
        response = ask_question(question)
        return render_template("index.html", response=response)
    return render_template("index.html", response=None)

# =====================================
# 6. Run Flask App
# =====================================

if __name__ == "__main__":
    # Create vector DB if it doesn't already exist
    if not os.path.exists("./chroma_db_data"):
        print("Creating vector database...")
        create_vector_db()

    # Run the Flask app
    app.run(debug=True)