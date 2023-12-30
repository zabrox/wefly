#!/bin/bash

gcloud api-gateway api-configs delete wefly-api-config-new --api=wefly-api --quiet > /dev/null 2>&1
gcloud api-gateway api-configs create wefly-api-config-new --api=wefly-api --openapi-spec=gateway.yml
if [[ $? -ne 0 ]]; then
    echo "Error creating API config"
    exit 1
fi
gcloud api-gateway gateways update wefly-gateway --api=wefly-api --api-config=wefly-api-config-new --location=asia-northeast1
if [[ $? -ne 0 ]]; then
    echo "Error updating gateway"
    exit 1
fi
gcloud api-gateway api-configs delete wefly-api-config --api=wefly-api --quiet > /dev/null 2>&1
gcloud api-gateway api-configs create wefly-api-config --api=wefly-api --openapi-spec=gateway.yml
if [[ $? -ne 0 ]]; then
    echo "Error creating API config"
    exit 1
fi
gcloud api-gateway gateways update wefly-gateway --api=wefly-api --api-config=wefly-api-config --location=asia-northeast1
if [[ $? -ne 0 ]]; then
    echo "Error updating gateway"
    exit 1
fi