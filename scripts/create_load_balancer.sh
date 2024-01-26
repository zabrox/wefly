#!/bin/bash

gcloud compute network-endpoint-groups create wefly-api-server-neg --region=asia-northeast1 --network-endpoint-type=serverless --cloud-run-service=wefly-api-server
gcloud compute network-endpoint-groups create wefly-client-neg --region=asia-northeast1 --network-endpoint-type=serverless --cloud-run-service=wefly-client
gcloud compute backend-services create wefly-backend --global
gcloud compute backend-services add-backend wefly-backend --global --network-endpoint-group=wefly-client-neg --network-endpoint-group-region=asia-northeast1
gcloud compute backend-services create wefly-api-server-backend --global
gcloud compute backend-services add-backend wefly-api-server-backend --global --network-endpoint-group=wefly-api-server-neg --network-endpoint-group-region=asia-northeast1
gcloud compute url-maps create wefly-url-map --default-service=wefly-backend
gcloud compute url-maps import wefly-url-map --global --source=../url-map.yml --quiet
gcloud compute target-https-proxies create wefly-https-proxy \
    --ssl-certificates=wefly-certificate \
    --url-map=wefly-url-map
gcloud compute forwarding-rules create wefly-forwarding-rule  \
    --target-https-proxy=wefly-https-proxy \
    --global \
    --ports=443