#!/bin/sh

# Setting default environment variables
export APP_INNTEKT_API_PATH="${APP_INNTEKT_API_PATH:-/http://dp-inntekt-api/v1/inntekt/uklassifisert}"

# replace env for nginx conf
envsubst '$APP_INNTEKT_API_PATH' < /etc/nginx/conf.d/app.conf.template > /etc/nginx/conf.d/default.conf

# replace above envs
echo "Startup.... "
/usr/local/openresty/bin/openresty -g 'daemon off;'
exec "$@"
