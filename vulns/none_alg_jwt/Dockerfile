# Use official Python base image
FROM python:3.9-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV FLASK_APP=app.py
ENV FLASK_ENV=production
ENV FLAG=flag{jwt_n0n3_4lg0_byp4ss_1s_d4ng3r0us}

# Create and set working directory
WORKDIR /app

# Install dependencies
RUN pip install --no-cache-dir flask pyjwt

# Copy application files
COPY . /app/

# Expose the port the app runs on
EXPOSE 5000

# Set non-root user
RUN useradd -m ctfuser && chown -R ctfuser:ctfuser /app
USER ctfuser

# Command to run the application
CMD ["python", "app.py"]