# Use official Python base image
FROM python:3.9-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV FLASK_APP=app.py
ENV FLASK_ENV=production

# Create and set working directory
WORKDIR /app

# Install dependencies
RUN pip install --no-cache-dir flask pyjwt requests

# Copy application files
COPY . /app/

# Expose the necessary ports
EXPOSE 5002
EXPOSE 5008

# Set non-root user
RUN useradd -m ctfuser && chown -R ctfuser:ctfuser /app
USER ctfuser

# Copy the entrypoint script
COPY entrypoint.sh /app/entrypoint.sh

# Command to run the entrypoint script
CMD ["sh", "/app/entrypoint.sh"]
