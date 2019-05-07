#!/bin/sh

# Setting default environment variables
export APP_INNTEKT_BASEURL="${APP_INNTEKT_BASEURL:-/http://dp-inntekt-api/v1/inntekt/uklassifisert}"
export RESOLVER=$(cat /etc/resolv.conf | grep -v '^#' | grep -m 1 nameserver | awk '{print $2}') # Picking the first nameserver.

# replace env for nginx conf
envsubst '$APP_INNTEKT_BASEURL $RESOLVER' < /etc/nginx/conf.d/app.conf.template > /etc/nginx/conf.d/default.conf


echo "Using APP_INNTEKT_BASEURL=${APP_INNTEKT_BASEURL}"


echo "Startup.... "
/usr/local/openresty/bin/openresty -g 'daemon off;'
exec "$@"
