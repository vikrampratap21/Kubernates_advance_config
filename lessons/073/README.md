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
kubectl get --raw /apis/custom.metrics.k8s.io/v1beta1 | jq

curl localhost:8081/hello
curl localhost:8081/metrics








eksctl create cluster -f eks.yaml
(mention mac m1 chip)
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
helm search repo prometheus-adapter
helm template custom-metrics prometheus-community/prometheus-adapter -n monitoring -f 6-prometheus-adapter/values.yaml --output-dir 6-prometheus-adapter

If we want to find all http_requests_total series ourselves in the Prometheus dashboard, we'd write 

```
http_requests_total{namespace!="",pod!=""}
```
to find all http_requests_total series that were associated with a namespace and pod.

- seriesQuery: 'http_requests_total{namespace!="",pod!=""}'

```
sum(rate(http_requests_total{namespace="demo",pod="express-5cb98c455d-6pnwl"}[2m])) by (pod)
```

# Clean UP
helm repo remove prometheus-adapter


E0626 04:20:56.476552       1 reflector.go:138] k8s.io/client-go/informers/factory.go:134: Failed to watch *v1.Node: failed to list *v1.Node: nodes is forbidden: User "system:serviceaccount:monitoring:custom-metrics-prometheus-adapter" cannot list resource "nodes" in API group "" at the cluster scope

pods.metrics.k8s.io
custom.metrics.k8s.io

kubectl get --raw /apis/metrics.k8s.io/v1beta1 | jq
kubectl get --raw /apis/custom.metrics.k8s.io/v1beta1 | jq


kubectl get --raw /apis/metrics.k8s.io/v1beta1 | jq

kubectl get --raw /apis/metrics.k8s.io/v1beta1/namespaces/moniotirng/pods | jq

kubectl top pods

Error from server (ServiceUnavailable): the server is currently unable to handle the request (get pods.metrics.k8s.io)

$ kubectl -n monitoring-adapter exec -it prometheus-adapter-57d96ff446-97wbw sh
kubectl exec [POD] [COMMAND] is DEPRECATED and will be removed in a future version. Use kubectl kubectl exec [POD] -- [COMMAND] instead.
/ $ wget -qO- http://prometheus-kube-prometheus-prometheus.default.svc:9090/prometheus/api/v1/query?query=sum%28%28node_memory_MemTotal_bytes%7Bjob%3D%22node-exporter%22%7D+-+node_memory_MemAvailable_bytes%7Bjob%3D%22node-exporter%22%7D%29+%2A+on+%28namespace%2C+pod%29+gr
oup_left%28node%29+node_namespace_pod%3Akube_pod_info%3A%7B%7D%29+by+%28node%29







curl -H "Content-Type: application/json" -d '{"number": 10}' localhost:8081/fibonacci


## Steps

- Go over express app
- Open 2 tabs and run it locally
```
node 0-express/server.js
```
```
curl localhost:8081/fibonacci \
    -H "Content-Type: application/json" \
    -d '{"number": 10}'
```
```
curl localhost:8081/fibonacci \
    -H "Content-Type: application/json" \
    -d '{"number": 20}'
```
```
curl localhost:8081/metrics
```
- Open eks.yaml file and create EKS cluster
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










## Clean Up
```
eksctl delete cluster -f eks.yaml
```