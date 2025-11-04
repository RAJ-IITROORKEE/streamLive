# Photo-click-LAN
Python based LAN (Local Area Network) photo clicking application , made using Opencv

python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000