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
RUN pip install --no-cache-dir flask pyjwt flask_sqlalchemy

# Copy application files
COPY . /app/

# Expose the port the app runs on
EXPOSE 5004
# Ensure the 'instance' folder exists

# Set non-root user
RUN useradd -m ctfuser && chown -R ctfuser:ctfuser /app
USER ctfuser
RUN mkdir -p /app/instance && chown -R ctfuser:ctfuser /app/instance


# Command to run the application
CMD ["python", "app.py"]