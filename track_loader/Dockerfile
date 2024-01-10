FROM python:3.10-alpine3.16
WORKDIR /app
COPY *.py ./
COPY areas.cup ./
COPY requirements.txt ./
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
ENTRYPOINT ["python", "./main.py"]