FROM node:10

EXPOSE 3000

# Grab gosu for easy step-down from root
ENV GOSU_VERSION=1.7
RUN set -x 
RUN wget -O /usr/local/bin/gosu "https://github.com/tianon/gosu/releases/download/$GOSU_VERSION/gosu-$(dpkg --print-architecture)" 
RUN wget -O /usr/local/bin/gosu.asc "https://github.com/tianon/gosu/releases/download/$GOSU_VERSION/gosu-$(dpkg --print-architecture).asc" 
RUN export GNUPGHOME="$(mktemp -d)" 
RUN gpg --keyserver keys.openpgp.org --recv-keys B42F6819007F00F88E364FD4036A9C25BF357DD4 
RUN gpg --batch --verify /usr/local/bin/gosu.asc /usr/local/bin/gosu 
RUN rm -r /usr/local/bin/gosu.asc "$GNUPGHOME" || true
RUN chmod +x /usr/local/bin/gosu 
RUN gosu nobody true

# Setup env
ENV APP_USER=node
ENV HOME=/home/node

# Copy files
WORKDIR $HOME/app
COPY . $HOME/app/

# Fix permissions and install app
RUN chown -R $APP_USER:$APP_USER $HOME/app && \
  gosu $APP_USER:$APP_USER npm install

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]

# Run node server
CMD ["node", "index.js"]