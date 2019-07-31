# Usage
## Deploy manifest action for Kubernetes
### Assumes that the deployment target K8s cluster context was set earlier in the workflow by using either azure/k8s-actions/aks-set-context or azure/k8s-actions/k8s-set-context
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
  id: deploy
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
      id: login

    - uses: azure/k8s-actions/k8s-create-secret@master
      with:
        container-registry-url: demo.azurecr.io
        container-registry-username: ${{ secrets.REGISTRY_USERNAME }}
        container-registry-password: ${{ secrets.REGISTRY_PASSWORD }}
        secret-name: demo-k8s-secret
      id: set-secret

    - uses: azure/k8s-actions/k8s-deploy@master
      with:
        manifests: |
          manifests/deployment.yml
          manifests/service.yml
        images: |
          demo.azurecr.io/k8sdemo:${{ github.sha }}
        imagepullsecrets: |
          demo-k8s-secret
      id: deploy
```