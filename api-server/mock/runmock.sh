#!/bin/bash 

docker run --rm -d --name json-server -p 3001:3000 -v `pwd`:/data json-server 
