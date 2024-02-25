#!/bin/bash

gcloud compute network-endpoint-groups create wefly-api-server-staging-neg --region=asia-northeast1 --network-endpoint-type=serverless --cloud-run-service=wefly-api-server-staging
gcloud compute network-endpoint-groups create wefly-client-staging-neg --region=asia-northeast1 --network-endpoint-type=serverless --cloud-run-service=wefly-client-staging
gcloud compute backend-services create wefly-staging-backend --global
gcloud compute backend-services add-backend wefly-staging-backend --global --network-endpoint-group=wefly-client-staging-neg --network-endpoint-group-region=asia-northeast1
gcloud compute backend-services create wefly-api-server-staging-backend --global
gcloud compute backend-services add-backend wefly-api-server-staging-backend --global --network-endpoint-group=wefly-api-server-staging-neg --network-endpoint-group-region=asia-northeast1
gcloud compute url-maps create wefly-staging-url-map --default-service=wefly-staging-backend
gcloud compute url-maps import wefly-staging-url-map --global --source=../url-map-staging.yml --quiet
gcloud compute target-https-proxies create wefly-staging-https-proxy \
    --ssl-certificates=wefly-staging-certificate \
    --url-map=wefly-staging-url-map
gcloud compute forwarding-rules create wefly-staging-forwarding-rule  \
    --target-https-proxy=wefly-staging-https-proxy \
    --global \
    --ports=443