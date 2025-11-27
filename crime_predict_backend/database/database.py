import os
from supabase import create_client, Client
import supabase
from dotenv import load_dotenv

load_dotenv()

url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_KEY")

supabase_cli: Client = create_client(url, key)
