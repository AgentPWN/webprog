FROM python:3.9-slim
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV FLASK_APP=app.py
ENV FLASK_ENV=production
WORKDIR /app
RUN pip install --no-cache-dir flask pyjwt flask_sqlalchemy
COPY . /app/
EXPOSE 5004
RUN useradd -m ctfuser && chown -R ctfuser:ctfuser /app
USER ctfuser
RUN mkdir -p /app/instance && chown -R ctfuser:ctfuser /app/instance
CMD ["python", "app.py"]