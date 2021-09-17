FROM redis:5-alpine

# Adapt to nais platform requirements
RUN sed -i 's|^redis:x:[0-9]*:|redis:x:1069:|' /etc/group
RUN sed -i 's|^redis:x:[0-9]*:[0-9]*:|redis:x:1069:1069:|' /etc/passwd

USER redis

ENTRYPOINT ["/bin/sh", "-c", "set -e;echo Running as $(id);mkdir /tmp/redis-data;cd /tmp/redis-data;exec /usr/local/bin/docker-entrypoint.sh \"$0\" \"$@\""]
CMD ["redis-server"]
