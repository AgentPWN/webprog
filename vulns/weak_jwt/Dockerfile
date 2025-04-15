FROM python:3.9-slim
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV FLASK_APP=app.py
ENV FLASK_ENV=production
WORKDIR /app
RUN pip install --no-cache-dir --upgrade pip
RUN pip install --no-cache-dir flask pyjwt
COPY . /app/
EXPOSE 5001
RUN useradd -m ctfuser && chown -R ctfuser:ctfuser /app
USER ctfuser
CMD ["python3", "app.py"]