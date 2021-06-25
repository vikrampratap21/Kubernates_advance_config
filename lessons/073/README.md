# Horizontal Pod Autoscaler CUSTOM METRICS & PROMETHEUS

[YouTube Tutorial](https://youtu.be/)

prometheus-adapter: https://github.com/kubernetes-sigs/prometheus-adapter
walkthrough: https://github.com/kubernetes-sigs/prometheus-adapter/blob/master/docs/walkthrough.md
Options for examples: http_requests_total, cpu

## Steps

- Create EKS cluster
```bash
eksctl create cluster -f eks.yaml
```

helm search repo prometheus-adapter
helm template prometheus-community/prometheus-adapter -f 4-prometheus-adapter/values.yaml --output-dir 4-prometheus-adapter
Configuration Walkthroughs https://github.com/kubernetes-sigs/prometheus-adapter/blob/master/docs/config-walkthrough.md
Prometheus https://prometheus.io/docs/instrumenting/clientlibs/
Prometheus Node.js Library https://github.com/siimon/prom-client

kubectl get apiservice
kubectl get --raw /apis/custom.metrics.k8s.io/v1beta1

node server.js