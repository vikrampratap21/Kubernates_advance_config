# Horizontal Pod Autoscaler CUSTOM METRICS & PROMETHEUS

[YouTube Tutorial](https://youtu.be/)

# Steps

## 1. Run Sample App Locally

- Go over express app `0-express`
- Open 2 tabs and run it locally
```
node 0-express/server.js
```
> Server listening at http://0.0.0.0:8081
```
curl localhost:8081/fibonacci \
    -H "Content-Type: application/json" \
    -d '{"number": 10}'
```
> Fibonacci number is 89!
```
curl localhost:8081/fibonacci \
    -H "Content-Type: application/json" \
    -d '{"number": 20}'
```
> Fibonacci number is 10946!
```
curl localhost:8081/metrics
```
> \# HELP http_requests_total Total number of http requests  
> \# TYPE http_requests_total counter  
> \# http_requests_total{method="POST"} 4

## 2. Create EKS Cluster Using eksctl
- Open `eks.yaml` file and create EKS cluster
```
eksctl create cluster -f eks.yaml
```
- Create namespaces
```
kubectl apply -f 1-namespaces
```
- Create Prometheus CRDs
```
kubectl apply -f 2-prometheus-operator-crd
```
- Opebn 2 tabs and deploy Prometheus Operator
```
watch -n 1 -t kubectl get pods -n monitoring
```
```
kubectl apply -f 3-prometheus-operator
```
```
kubectl logs -l app.kubernetes.io/name=prometheus-operator -f -n monitoring
```
- Deploy Prometheus Operator
```
kubectl apply -f 4-prometheus
```
```
kubectl logs -l app.kubernetes.io/instance=prometheus -f -n monitoring
```

- Deploy Demo app
```
kubectl apply -f 5-demo/0-deployment.yaml
```
```
kubectl apply -f 5-demo/1-service.yaml
```
- Open Prometheus Target page
```
kubectl port-forward svc/prometheus-operated 9090 -n monitoring
```
- Go to http://localhost:9090
- Create Service Monitor for express app
```
kubectl apply -f 5-demo/2-service-monitor.yaml
```
- Go back to http://localhost:9090 target section
- Use `http` to query Prometheus (empty)
- Port forward express app
```
kubectl port-forward svc/express 8081 -n demo
```
- Use curl to hit fibonacci enpont twice
```
curl localhost:8081/fibonacci \
    -H "Content-Type: application/json" \
    -d '{"number": 10}'
```
- Use `http` to query Prometheus
- Deploy HPA
```
kubectl apply -f 5-demo/3-hpa-http-requests.yaml
```
```
kubectl get hpa -n demo
```
```
kubectl describe hpa express-http-requests -n demo
```
```
kubectl get --raw /apis/custom.metrics.k8s.io/v1beta1 | jq
```
- Deploy Prometheus adapter
```

```



```
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm search repo prometheus-adapter --max-col-width 23
```

```
helm install custom-metrics prometheus-community/prometheus-adapter \
--namespace monitoring \
 --version 2.14.2 \
--values 8-prometheus-adapter-helm/1-values.yaml
```






## Clean Up
```
helm repo remove prometheus-community
eksctl delete cluster -f eks.yaml
```