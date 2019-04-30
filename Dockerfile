## TODO : navikt/nginx-oidc not ready

#FROM navikt/nginx-oidc:latest
#
#ENV APP_DIR="/app" \
#	APP_PATH_PREFIX="/inntekter" \
#	APP_CALLBACK_PATH="/inntekter/oidc-callback-url"
#
#COPY build /app/inntekter/
#
#COPY k8s/proxy.nginx      /nginx/proxy.nginx
#EXPOSE 3000 443


FROM openresty/openresty:alpine

# Installing the dependencies
RUN apk add --no-cache --update bash gettext

COPY ./build /usr/local/openresty/nginx/html/inntekter/
EXPOSE 80
COPY k8s/default.nginx /etc/nginx/conf.d/app.conf.template
COPY k8s/start-nginx.sh       /usr/sbin/start-nginx
RUN chmod u+x /usr/sbin/start-nginx
CMD ["start-nginx"]
