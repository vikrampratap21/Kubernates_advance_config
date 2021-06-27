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
> \# http_requests_total{method="POST"} 2

## 2. Create EKS Cluster Using eksctl
- Open `eks.yaml` file and create EKS cluster
```
eksctl create cluster -f eks.yaml
```
> 2021-06-26 18:22:20 [ℹ]  nodegroup "general" has 1 node(s)  
> 2021-06-26 18:22:20 [ℹ]  node "ip-192-168-11-151.ec2.internal" is ready  
> 2021-06-26 18:24:23 [ℹ]  kubectl command should work with "/Users/antonputra/.kube/config", try 'kubectl get nodes'  
> 2021-06-26 18:24:23 [✔]  EKS cluster "my-cluster-v4" in "us-east-1" region is ready
## 3. Create Namespaces in Kubernetes
- Create `demo` and `monitoring` namespaces
  - `1-namespaces/0-demo.yaml`
  - `1-namespaces/1-monitoring.yaml`
```
kubectl apply -f 1-namespaces
```
> namespace/demo created  
> namespace/monitoring created

## 4. Create Prometheus Operator CRDs
- Create Prometheus CRDs and RBAC
  - `2-prometheus-operator-crd/0-rbac.yaml`
  - `2-prometheus-operator-crd/1-alertmanagerconfigs.yaml`
  - `2-prometheus-operator-crd/2-alertmanagers.yaml`
  - `2-prometheus-operator-crd/3-podmonitors.yaml`
  - `2-prometheus-operator-crd/4-probes.yaml`
  - `2-prometheus-operator-crd/5-prometheuses.yaml`
  - `2-prometheus-operator-crd/6-prometheusrules.yaml`
  - `2-prometheus-operator-crd/7-servicemonitors.yaml`
  - `2-prometheus-operator-crd/8-thanosrulers.yaml` 
```
kubectl apply -f 2-prometheus-operator-crd
```
> clusterrole.rbac.authorization.k8s.io/prometheus-crd-view created  
> clusterrole.rbac.authorization.k8s.io/prometheus-crd-edit created  
> customresourcedefinition.apiextensions.k8s.io/alertmanagerconfigs.monitoring.coreos.com created  
> customresourcedefinition.apiextensions.k8s.io/alertmanagers.monitoring.coreos.com created  
> customresourcedefinition.apiextensions.k8s.io/podmonitors.monitoring.coreos.com created  
> customresourcedefinition.apiextensions.k8s.io/probes.monitoring.coreos.com created  
> customresourcedefinition.apiextensions.k8s.io/prometheuses.monitoring.coreos.com created  
> customresourcedefinition.apiextensions.k8s.io/prometheusrules.monitoring.coreos.com created  
> customresourcedefinition.apiextensions.k8s.io/servicemonitors.monitoring.coreos.com created  
> customresourcedefinition.apiextensions.k8s.io/thanosrulers.monitoring.coreos.com created  

## 5. Deploy Prometheus Operator on Kubernetes
- Create Prometheus Operator deployment files
  - `3-prometheus-operator/0-rbac.yaml`
  - `3-prometheus-operator/1-deployment.yaml`
  - `3-prometheus-operator/2-service.yaml`
```
kubectl apply -f 3-prometheus-operator
```
> serviceaccount/prometheus-operator created  
> clusterrole.rbac.authorization.k8s.io/prometheus-operator created  
> clusterrolebinding.rbac.authorization.k8s.io/prometheus-operator created  
> deployment.apps/prometheus-operator created  
> service/prometheus-operator created  
```
kubectl get pods -n monitoring
```
> NAME&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;READY&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;STATUS&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;RESTARTS&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;AGE  
prometheus-operator-585f487768-745xp&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1/1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Running&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;11m  
```
kubectl logs -n monitoring \
-l app.kubernetes.io/name=prometheus-operator
```
> level=info ts=2021-06-27T01:44:00.696399754Z caller=operator.go:355 component=prometheusoperator msg="successfully synced all caches"  
> level=info ts=2021-06-27T01:44:00.702534377Z caller=operator.go:267 component=thanosoperator msg="successfully synced all caches"  
> level=info ts=2021-06-27T01:44:00.79632208Z caller=operator.go:287 component=alertmanageroperator msg="successfully synced all caches"  

## 6. Deploy Prometheus on Kubernetes
- Create Prometheus deployment files
  - `4-prometheus/0-rbac.yaml`
  - `4-prometheus/1-prometheus.yaml`
```
kubectl apply -f 4-prometheus
```
> serviceaccount/prometheus created  
> clusterrole.rbac.authorization.k8s.io/prometheus created  
> clusterrolebinding.rbac.authorization.k8s.io/prometheus created  
> prometheus.monitoring.coreos.com/prometheus created  
```
kubectl get pods -n monitoring
```
> NAME&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;READY&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;STATUS&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;RESTARTS&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;AGE  
prometheus-operator-585f487768-745xp&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1/1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Running&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;11m  
prometheus-prometheus-0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2/2&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Running&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5m17s  
```
kubectl logs -n monitoring \
-l app.kubernetes.io/instance=prometheus
```
> level=info ts=2021-06-27T01:50:04.190Z caller=main.go:995 msg="Completed loading of configuration file" filename=/etc/prometheus/config_out/prometheus.env.yaml totalDuration=507.082µs remote_storage=3.213µs web_handler=388ns query_engine=1.274µs scrape=74.372µs scrape_sd=3.853µs notify=996ns notify_sd=1.554µs rules=34.528µs  

## 7. Deploy Sample Express App
- Open new terminal tab and run port forward command
```
kubectl get svc -n monitoring
```
> prometheus-operated&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;READY&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ClusterIP&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;READY&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;None&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;READY&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<none>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;READY&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;9090/TCP&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;READY&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3m26s. 
```
kubectl port-forward svc/prometheus-operated 9090 -n monitoring
```
> Forwarding from 127.0.0.1:9090 -> 9090  
> Forwarding from [::1]:9090 -> 9090  
- Go to http://localhost:9090 target section

- Create following files
  - `5-demo/0-deployment.yaml`
  - `5-demo/1-service.yaml`
  - `5-demo/2-service-monitor.yaml`
  - `5-demo/3-hpa-http-requests.yaml`
```
kubectl apply -f 5-demo
```
> deployment.apps/express created  
> service/express created  
> servicemonitor.monitoring.coreos.com/express created  
> horizontalpodautoscaler.autoscaling/http created  

- Go back to `http://localhost:9090` target page and query `http`
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
> Fibonacci number is 89!  
- Use `http` to query Prometheus
- Get hpa
```
kubectl get hpa -n demo
```
> http&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Deployment/express&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\<unknown>/500m&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3m42s
```
kubectl describe hpa http -n demo
```
> Warning&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FailedGetPodsMetric&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;109s (x13 over 4m50s)  horizontal-pod-autoscaler  unable to get metric http_requests_per_second: unable to fetch metrics from custom metrics API: no custom metrics API (custom.metrics.k8s.io) registered
```
kubectl get --raw /apis/custom.metrics.k8s.io/v1beta1 | jq
```
> Error from server (NotFound): the server could not find the requested resource  

## 8. Deploy Prometheus Adapter

- Create following files
  - `6-prometheus-adapter/0-adapter/0-rbac.yaml`
  - `6-prometheus-adapter/0-adapter/1-configmap.yaml`
  - `6-prometheus-adapter/0-adapter/2-deployment.yaml`
  - `6-prometheus-adapter/0-adapter/3-service.yaml`
  - `6-prometheus-adapter/1-custom-metrics/0-rbac.yaml`
  - `6-prometheus-adapter/1-custom-metrics/1-apiservice.yaml`

- Run PromQL `http_requests_total{namespace!="",pod!=""}` query
- Update `6-prometheus-adapter/0-adapter/1-configmap.yaml`
```yaml
    rules:
    - seriesQuery: 'http_requests_total{namespace!="",pod!=""}'
      resources:
        overrides:
          namespace:
            resource: namespace
          pod: 
            resource: pod
      name:
        matches: "^(.*)_total"
        as: "${1}_per_second"
      metricsQuery: 'sum(rate(<<.Series>>{<<.LabelMatchers>>}[2m])) by (<<.GroupBy>>)'
```
- Deploy Prometheus Adapter
```
kubectl apply -f 6-prometheus-adapter/0-adapter
```
> serviceaccount/custom-metrics-prometheus-adapter created  
> clusterrolebinding.rbac.authorization.k8s.io/prometheus-adapter-system-auth-delegator created  
> clusterrolebinding.rbac.authorization.k8s.io/prometheus-adapter-resource-reader created  
> clusterrole.rbac.authorization.k8s.io/prometheus-adapter-resource-reader created 
> rolebinding.rbac.authorization.k8s.io/prometheus-adapter-auth-reader created  
> configmap/custom-metrics-prometheus-adapter created  
> deployment.apps/custom-metrics-prometheus-adapter created  
> service/custom-metrics-prometheus-adapter created  

- Create API Service for custom metrics
```
kubectl apply -f 6-prometheus-adapter/1-custom-metrics
```
> clusterrole.rbac.authorization.k8s.io/prometheus-adapter-server-resources created  
> clusterrolebinding.rbac.authorization.k8s.io/prometheus-adapter-hpa-controller created  
> apiservice.apiregistration.k8s.io/v1beta1.custom.metrics.k8s.io created  

```
kubectl get apiservice
```
```
kubectl get --raw /apis/custom.metrics.k8s.io/v1beta1 | jq
```
> "name": "pods/http_requests_per_second",  
```
kubectl get hpa -n demo
```
> http&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Deployment/express&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0/500m&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20m
- Open 3 tabs
```
watch -n 1 -t kubectl get hpa -n demo
```
```
watch -n 1 -t kubectl get pods -n demo
```
```                    
for ((i=1;i<=500;i++)); do 
    echo -n $i-;
    curl -d '{"number": 10}' -H "Content-Type: application/json" \
    "localhost:8081/fibonacci"; 
done
```

## 9. Scale based on CPU

- Deploy cadvisor
  - `7-cadvisor/0-rbac.yaml`
  - `7-cadvisor/1-podsecuritypolicy.yaml`
  - `7-cadvisor/2-daemonset.yaml`
  - `7-cadvisor/3-service.yaml`
  - `7-cadvisor/4-service-monitor.yaml`
```
kubectl apply -f 7-cadvisor
```
> serviceaccount/cadvisor created  
> clusterrole.rbac.authorization.k8s.io/cadvisor created  
> clusterrolebinding.rbac.authorization.k8s.io/cadvisor created  
> podsecuritypolicy.policy/cadvisor created  
> daemonset.apps/cadvisor created  
> service/cadvisor created  
> servicemonitor.monitoring.coreos.com/cadvisor created  
    
- Go to `localhost:9090` target section
- Deplopy Metrics API Service
  - `6-prometheus-adapter/2-resource-metrics/0-rbac.yaml`
  - `6-prometheus-adapter/2-resource-metrics/1-apiservice.yaml`
    
```
kubectl apply -f 6-prometheus-adapter/2-resource-metrics
```
> clusterrole.rbac.authorization.k8s.io/prometheus-adapter-metrics created  
> clusterrolebinding.rbac.authorization.k8s.io/prometheus-adapter-hpa-controller-metrics created  
> apiservice.apiregistration.k8s.io/v1beta1.metrics.k8s.io created
    
- Update `6-prometheus-adapter/0-adapter/1-configmap.yaml`
```yaml
    resourceRules:
      cpu:
        containerQuery: sum(rate(container_cpu_usage_seconds_total{<<.LabelMatchers>>, container_label_io_kubernetes_container_name!=""}[3m])) by (<<.GroupBy>>)
        nodeQuery: sum(rate(container_cpu_usage_seconds_total{<<.LabelMatchers>>, id='/'}[3m])) by (<<.GroupBy>>) by (<<.GroupBy>>)
        resources:
          overrides:
            container_label_io_kubernetes_pod_namespace:
              resource: namespace
            node:
              resource: node
            container_label_io_kubernetes_pod_name:
              resource: pod
        containerLabel: container_label_io_kubernetes_container_name
      memory:
        containerQuery: sum(container_memory_working_set_bytes{<<.LabelMatchers>>, container_label_io_kubernetes_container_name!=""}) by (<<.GroupBy>>)
        nodeQuery: sum(container_memory_working_set_bytes{<<.LabelMatchers>>,id='/'}) by (<<.GroupBy>>)
        resources:
          overrides:
            container_label_io_kubernetes_pod_namespace:
              resource: namespace
            node:
              resource: node
            container_label_io_kubernetes_pod_name:
              resource: pod
        containerLabel: container_label_io_kubernetes_container_name
      window: 3m
```
```
kubectl apply -f 6-prometheus-adapter/0-adapter/1-configmap.yaml
```
> configmap/custom-metrics-prometheus-adapter configured
```
kubectl rollout restart deployment \
custom-metrics-prometheus-adapter -n monitoring
```
> deployment.apps/custom-metrics-prometheus-adapter restarted
```
kubectl get apiservice
```
```
kubectl top pod -n demo
```
```
kubectl top pod -n monitoring
```

## 10. Create CPU based HPA

- Create CPU based HPA
  - `5-demo/4-hpa-cpu.yaml`
```
kubectl apply -f 5-demo/4-hpa-cpu.yaml
```

- Test with curl
```
curl localhost:8081/fibonacci \
    -H "Content-Type: application/json" \
    -d '{"number": 47}'
```

## Deploy with helm

- Delete Prometheus Adapter
```
kubectl delete -f 6-prometheus-adapter/0-adapter
```
```
kubectl delete -f 6-prometheus-adapter/1-custom-metrics
```
```
kubectl delete -f 6-prometheus-adapter/2-resource-metrics
```
```
kubectl get pods -n monitoring
```
```
kubectl get apiservice
```
```
kubectl top pods -n monitoring
```
    
- Get default from default values - https://github.com/prometheus-community/helm-charts/tree/main/charts/prometheus-adapter
    
```
kubectl delete -f 6-prometheus-adapter/2-resource-metrics
```

```
helm repo add prometheus-community \
    https://prometheus-community.github.io/helm-charts
helm search repo prometheus-adapter --max-col-width 23
```
- Create `values.yaml` to override default values

```
helm install custom-metrics \
prometheus-community/prometheus-adapter \
--namespace monitoring \
 --version 2.14.2 \
--values values.yaml
```

```
kubectl get --raw /apis/custom.metrics.k8s.io/v1beta1 | jq | grep http
```
## Clean Up
```
helm repo remove prometheus-community
eksctl delete cluster -f eks.yaml
```
