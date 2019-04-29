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



# # setup http proxy
ARG http_proxy=http://webproxy-utvikler.nav.no:8088
ENV http_proxy ${http_proxy}
ENV https_proxy ${http_proxy}
ENV HTTP_PROXY ${http_proxy}
ENV HTTPS_PROXY ${http_proxy}
ENV no_proxy 155.55.,192.168.,10.,local,rtv.gov,adeo.no,nav.no,aetat.no,devillo.no,oera.no,localhost,127.

#



# Installing the dependencies
RUN apk add --no-cache --update bash gettext

COPY /build /usr/local/openresty/nginx/html/inntekter/
EXPOSE 80
COPY k8s/default.nginx /etc/nginx/conf.d/app.conf.template
COPY k8s/start-nginx.sh       /usr/sbin/start-nginx
RUN chmod u+x /usr/sbin/start-nginx
CMD ["start-nginx"]
