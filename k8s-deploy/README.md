# Deploy manifest action for Kubernetes
Use this action to bake and deploy manifests to Kubernetes clusters.

Assumes that the deployment target K8s cluster context was set earlier in the workflow by using either [`azure/k8s-actions/aks-set-context`](https://github.com/Azure/k8s-actions/tree/master/aks-set-context) or [`azure/k8s-actions/k8s-set-context`](https://github.com/Azure/k8s-actions/tree/master/k8s-set-context)

#### Artifact substitution
The deploy action takes as input a list of container images which can be specified along with their tags or digests. The same is substituted into the non-templatized version of manifest files before application to the cluster to ensure that the right version of the image is pulled by the cluster nodes.

#### Manifest stability
Rollout status is checked for the Kubernetes objects deployed. This is done to incorporate stability checks while computing the task status as success/failure.

#### Secret handling 
 The manifest files specfied as inputs are augmented with appropriate imagePullSecrets before deploying to the cluster.



```yaml
- uses: azure/k8s-actions/k8s-deploy@master
  with:
    namespace: 'myapp' # optional
    images: 'contoso.azurecr.io/myapp:${{ event.run_id }} '
    imagepullsecrets: |
      image-pull-secret1
      image-pull-secret2
    manifests: '/manifests/*.*'
    kubectl-version: 'latest' # optional
```

## End to end workflow for building container images and deploying to a Kubernetes cluster

```yaml
on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@master
    
    - uses: azure/k8s-actions/docker-login@master
      with:
        login-server: demo.azurecr.io
        username: ${{ secrets.REGISTRY_USERNAME }}
        password: ${{ secrets.REGISTRY_PASSWORD }}
    
    - run: |
        docker build . -t demo.azurecr.io/k8sdemo:${{ github.sha }}
        docker push demo.azurecr.io/k8sdemo:${{ github.sha }}
      
    - uses: azure/k8s-actions/k8s-set-context@master
      with:
        kubeconfig: ${{ secrets.KUBE_CONFIG }}
        
    - uses: azure/k8s-actions/k8s-create-secret@master
      with:
        container-registry-url: demo.azurecr.io
        container-registry-username: ${{ secrets.REGISTRY_USERNAME }}
        container-registry-password: ${{ secrets.REGISTRY_PASSWORD }}
        secret-name: demo-k8s-secret

    - uses: azure/k8s-actions/k8s-deploy@master
      with:
        manifests: |
          manifests/deployment.yml
          manifests/service.yml
        images: |
          demo.azurecr.io/k8sdemo:${{ github.sha }}
        imagepullsecrets: |
          demo-k8s-secret
```
