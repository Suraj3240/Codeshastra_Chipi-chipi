import streamlit as st
import google.generativeai as genai
import os
from youtube_search import YoutubeSearch

# Configure GenerativeAI
genai.configure(api_key='YOUR_API_KEY') 

# Function to get Gemini response
def get_gemini_response(input):
    # Initialize GenerativeModel
    model = genai.GenerativeModel('gemini-pro')
    # Generate content based on input
    response = model.generate_content(input)
    return response.text

# Function to search for YouTube videos based on a query
def search_youtube_videos(query, max_results=9):
    # Use YoutubeSearch library to get search results
    results = YoutubeSearch(query, max_results=max_results).to_dict()
    return results

# Prompt Template for extracting key skills
key_skills_prompt = """
Hey! Extract key skills from the given job description. Consider the job requirements and extract the most relevant skills for the position.

Job Description:
{jd}

Please provide your response in a single string with the following structure:
["Skill1", "Skill2", "Skill3", ...]
"""

# Streamlit app
st.set_page_config(page_title="Page Title", layout="wide")

# Custom CSS to hide some elements
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

# App title
st.title("Extract Key Skills from the Job Description and Recommend YouTube Videos")

# Input for job description
jd = st.text_area("Paste the Job Description")

# Button to trigger the search
submit = st.button("Get Recommended Videos")

if submit:
    if jd != "":
        # Extract key skills from the job description
        key_skills_response = get_gemini_response(key_skills_prompt.format(jd=jd))
        key_skills = eval(key_skills_response)  # Convert string to list
        
        # Generate a query for YouTube video search based on extracted key skills
        query = " ".join(key_skills)
        
        # Search for YouTube videos based on the query
        videos = search_youtube_videos(query)
        if videos:
            st.subheader("Recommended YouTube Videos:")
            for video in videos[:9]:
                video_id = video['id']
                thumbnail = f"https://i.ytimg.com/vi/{video_id}/hqdefault.jpg"
                video_link = f"https://www.youtube.com/watch?v={video_id}"
                st.image(thumbnail, width=200)
                st.markdown(f"[{video['title']}]({video_link})")
        else:
            st.subheader("No YouTube videos found for the extracted key skills.")

# Define function to redirect to localhost:5173
def redirect_to_local():
    # Redirect to localhost:5173 using HTML redirection
    st.markdown("<meta http-equiv='refresh' content='0;URL=http://localhost:5173'>", unsafe_allow_html=True)

# Create a button that redirects when clicked
if st.button('Go back'):
    redirect_to_local()
