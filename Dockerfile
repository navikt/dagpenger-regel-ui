FROM navikt/nginx-oidc:latest

ENV APP_DIR="/app" \
	APP_PATH_PREFIX="/inntekter" \
	APP_CALLBACK_PATH="/inntekter/oidc/callback"

COPY build /app/inntekter/

COPY nais/proxy.nginx      /nginx/proxy.nginx
EXPOSE 3000 443
