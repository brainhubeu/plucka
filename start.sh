#!/bin/sh

# Create JSON file from environment variables
echo "{
  \"openWeatherApiKey\": \"${OPEN_WEATHER_API_KEY}\"
}" > /usr/share/nginx/html/config.json

# Start nginx
exec nginx -g 'daemon off;'
