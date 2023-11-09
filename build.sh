#!/bin/bash

sudo docker login rg.fr-par.scw.cloud/djnd -u nologin -p $SCW_SECRET_TOKEN

# BUILD AND PUBLISH CAMRIA GAME
sudo docker build -f Dockerfile -t camria-game:latest .
sudo docker tag camria-game:latest rg.fr-par.scw.cloud/djnd/camria-game:latest
sudo docker push rg.fr-par.scw.cloud/djnd/camria-game:latest
