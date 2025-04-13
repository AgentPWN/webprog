# Use official Python base image
FROM python:3.9-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV FLASK_APP=app.py
ENV FLASK_ENV=production
ENV FLAG=flag{y0u_br0k3_7h3_jw7}

# Create and set working directory
WORKDIR /app
RUN pip install --no-cache-dir --upgrade pip
# Install dependencies
RUN pip install --no-cache-dir flask pyjwt

# Copy application files
COPY app.py /app/

# Expose the port the app runs on
EXPOSE 5001

# Set non-root user
RUN useradd -m ctfuser && chown -R ctfuser:ctfuser /app
USER ctfuser

# Command to run the application
CMD ["python3", "app.py"]