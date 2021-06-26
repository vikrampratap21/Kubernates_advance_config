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



Configuration Walkthroughs https://github.com/kubernetes-sigs/prometheus-adapter/blob/master/docs/config-walkthrough.md
Prometheus https://prometheus.io/docs/instrumenting/clientlibs/
Prometheus Node.js Library https://github.com/siimon/prom-client

kubectl get apiservice

node server.js

kubectl port-forward svc/prometheus-operated 9090 -n monitoring
kubectl port-forward svc/express 8081 -n demo
kubectl describe hpa express -n demo
kubectl get --raw /apis/custom.metrics.k8s.io/v1beta1

curl localhost:8081/hello
curl localhost:8081/metrics








eksctl create cluster -f eks.yaml
(mention mac m1 chip)
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
helm search repo prometheus-adapter
helm template custom-metrics prometheus-community/prometheus-adapter -n monitoring -f 6-prometheus-adapter/values.yaml --output-dir 6-prometheus-adapter



# Clean UP
helm repo remove prometheus-adapter
