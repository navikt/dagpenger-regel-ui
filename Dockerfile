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


FROM nginx:alpine
COPY /build /usr/share/nginx/html/inntekter
EXPOSE 80
COPY k8s/default.nginx /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]
