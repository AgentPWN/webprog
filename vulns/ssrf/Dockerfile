FROM python:3.9-slim
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV FLASK_APP=app.py
ENV FLASK_ENV=production
WORKDIR /app
RUN pip install --no-cache-dir flask pyjwt requests
COPY . /app/
EXPOSE 5002
EXPOSE 5008
RUN useradd -m ctfuser && chown -R ctfuser:ctfuser /app
USER ctfuser
COPY entrypoint.sh /app/entrypoint.sh
CMD ["sh", "/app/entrypoint.sh"]
