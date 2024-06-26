Here's the modified code with comments added to each function and the API key removed:

```python
import streamlit as st
import google.generativeai as genai
import PyPDF2 as pdf
from dotenv import load_dotenv
import requests
import json  # Add this import statement
from streamlit import util

load_dotenv()

# Configure API key for generative AI
genai.configure(api_key='YOUR_API_KEY_HERE')

def get_gemini_response(input):
    """
    Generate response from Gemini AI model based on input prompt.

    Parameters:
        input (str): Input prompt for the model.

    Returns:
        str: Response generated by the model.
    """
    model = genai.GenerativeModel('gemini-pro')
    response = model.generate_content(input)
    return response.text

def input_pdf_text(uploaded_file):
    """
    Extract text from uploaded PDF file.

    Parameters:
        uploaded_file (str): Path to the uploaded PDF file.

    Returns:
        str: Text extracted from the PDF.
    """
    reader = pdf.PdfReader(uploaded_file)
    text = ""
    for page in range(len(reader.pages)):
        page = reader.pages[page]
        text += str(page.extract_text())
    return text

def input_pdf_from_url(pdf_url):
    """
    Download PDF from URL and extract text.

    Parameters:
        pdf_url (str): URL of the PDF.

    Returns:
        str: Text extracted from the PDF.
    """
    response = requests.get(pdf_url)
    with open("temp.pdf", "wb") as f:
        f.write(response.content)
    text = input_pdf_text("temp.pdf")
    return text

# Prompt Template
input_prompt = """
Hey! Act like a seasoned ATS (Application Tracking System) with a deep understanding of the tech industry, specifically in software engineering. Your task is to evaluate the resume based on the provided job description, focusing on software engineering skills and experience. Consider the competitiveness of the job market and provide comprehensive assistance for improving the resumes. Assign a percentage match based on the JD and identify any missing keywords with high accuracy.

Resume:
{text}

Job Description:
{jd}

Please provide your response in a single string with the following structure:
{{"JD Match": "%", "Missing Keywords": [], "Profile Summary": ""}}
"""

## Streamlit app

st.set_page_config(page_title="Page Title", layout="wide")

st.markdown("""
    <style>
        .reportview-container {
            margin-top: -2em;
        }
        .stDeployButton {display:none;}
        footer {visibility: hidden;}
        #stDecoration {display:none;}
    </style>
""", unsafe_allow_html=True)

st.title("Smart ATS")
st.text("Improve Your Resume ATS")
jd = st.text_area("Paste the Job Description")
pdf_link = st.text_input("Enter the URL of the PDF")

submit = st.button("Submit")

if submit:
    if pdf_link:
        text = input_pdf_from_url(pdf_link)
        response = get_gemini_response(input_prompt.format(text=text, jd=jd))
        response_json = json.loads(response)
        st.subheader("ATS Result:")
        st.json(response_json)
    else:
        st.error("Please provide a valid PDF URL")

# Define function to redirect to localhost:5173
def redirect_to_local():
    # Redirect to localhost:5173 using HTML redirection
    st.markdown("<meta http-equiv='refresh' content='0;URL=http://localhost:5173'>", unsafe_allow_html=True)

# Create a button that redirects when clicked
if st.button('Go back'):
    redirect_to_local()
```

Remember to replace `'YOUR_API_KEY_HERE'` with your actual API key if you're using this code. Also, ensure that the API key is handled securely and not exposed in public repositories or shared inappropriately.
