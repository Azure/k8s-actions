# Usage

```yaml
- uses: azure/k8s-actions/k8s-deploy@master
  with:
    aks-name: 'contoso-dev'
    aks-resource-group: 'contoso-dev-rg'
    namespace: 'myapp'
    images: 'contoso.azurecr.io/myapp:${{ event.run_id }} '
    imagepullsecrets: |
      image-pull-secret1
      image-pull-secret2
    manifests: '/manifests/*.*'
    kubectl-version: 'latest' # optional
  id: deploy
```
