# Kubernetes create secret
Create a generic secret or docker-registry secret in Kubernetes cluster.

Assumes that the secret will be created in the cluster context which was set earlier in the workflow by using either [`azure/k8s-actions/aks-set-context`](https://github.com/Azure/k8s-actions/tree/master/aks-set-context) or [`azure/k8s-actions/k8s-set-context`](https://github.com/Azure/k8s-actions/tree/master/k8s-set-context)

```yaml
    - name: Set imagePullSecret
      uses: azure/k8s-actions/k8s-set-secret@master
      with:
        namespace: 'myapp'
        container-registry-url: 'containerregistry.contoso.com'
        container-registry-username: ${{ secrets.DOCKER_USERNAME }}
        container-registry-password: ${{ secrets.DOCKER_PASSWORD }}
        secret-name: 'contoso-cr'
      id: set-secret
```
