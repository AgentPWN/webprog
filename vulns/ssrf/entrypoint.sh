#!/bin/sh

# Start Flask app
python /app/app.py &

# Start the server
python /app/server.py &

# Wait for both to finish (supervisord can also be used)
wait
