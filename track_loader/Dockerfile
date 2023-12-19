FROM python:3.10-alpine3.16
WORKDIR /app
COPY *.py ./
COPY *.json ./
COPY areas.cup ./
COPY requirements.txt ./
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
ENV GOOGLE_APPLICATION_CREDENTIALS="/app/wefly-407313-855d6567493e.json"
ENTRYPOINT ["python", "./main.py"]