FROM python:3.9-slim
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV FLASK_APP=app.py
ENV FLASK_ENV=production
ENV FLAG=flag{jwt_n0n3_4lg0_byp4ss_1s_d4ng3r0us}
WORKDIR /app
RUN pip install --no-cache-dir flask pyjwt
COPY . /app/
EXPOSE 5000
RUN useradd -m ctfuser && chown -R ctfuser:ctfuser /app
USER ctfuser
CMD ["python", "app.py"]