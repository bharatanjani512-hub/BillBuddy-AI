import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

print("Starting request...")

try:
    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents="Reply with only the word: Hello",
    )

    print("SUCCESS")
    print(response.text)

except Exception as e:
    print("FAILED")
    print(type(e).__name__)
    print(e)

print("Program Finished")