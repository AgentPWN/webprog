FROM python:3.9-slim
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV FLASK_APP=app.py
ENV FLASK_ENV=production
WORKDIR /app
RUN pip install --no-cache-dir flask pyjwt
COPY . /app/
EXPOSE 5003
RUN useradd -m ctfuser && chown -R ctfuser:ctfuser /app
USER ctfuser
CMD ["python", "app.py"]