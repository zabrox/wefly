#!/bin/bash

gcloud compute forwarding-rules delete wefly-forwarding-rule --global --quiet
gcloud compute target-https-proxies delete wefly-https-proxy --quiet
gcloud compute url-maps delete wefly-url-map --global --quiet
gcloud compute backend-services delete wefly-api-server-backend --global --quiet
gcloud compute backend-services delete wefly-backend --global --quiet
gcloud compute network-endpoint-groups delete wefly-client-neg --region=us-central1 --quiet
gcloud compute network-endpoint-groups delete wefly-api-server-neg --region=us-central1 --quiet