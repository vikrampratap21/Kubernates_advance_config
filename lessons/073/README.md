# Horizontal Pod Autoscaler CUSTOM METRICS & PROMETHEUS

[YouTube Tutorial](https://youtu.be/)

prometheus-adapter: https://github.com/kubernetes-sigs/prometheus-adapter
Options for examples: http_requests_total, cpu

## Steps

- Create EKS cluster
```bash
eksctl create cluster -f eks.yaml
```

helm search repo prometheus-adapter
