#!/bin/bash

sudo docker login rg.fr-par.scw.cloud/djnd -u nologin -p $SCW_SECRET_TOKEN

# BUILD AND PUBLISH STOP YOUR GOVERNMENT
sudo docker build -f Dockerfile -t stopyourgovernment:latest .
sudo docker tag stopyourgovernment:latest rg.fr-par.scw.cloud/djnd/stopyourgovernment:latest
sudo docker push rg.fr-par.scw.cloud/djnd/stopyourgovernment:latest
