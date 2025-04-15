FROM python:3.10-slim
ENV PYTHONUNBUFFERED 1
ENV FLASK_APP=app/app.py
WORKDIR /app
EXPOSE 5000
COPY . /app
RUN apt-get update && apt-get install -y --no-install-recommends \
    nginx \
    && rm -rf /var/lib/apt/lists/*
RUN pip install --no-cache-dir -r ./app/requirements.txt
RUN chmod -R 755 /app/app/static
EXPOSE 5000
EXPOSE 80
COPY ./app/nginx.conf /etc/nginx/nginx.conf
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=5000
CMD ["sh", "-c", "flask run --host=0.0.0.0 --port=5000 & nginx -g 'daemon off;'"]
