#!/bin/bash

pushd ../api-server 
npm start &
popd

pushd ../client 
npm run dev &
pod

wait