# Usage

```yaml
    # Assumes that the secret will be created in the cluster context which was set in the action above
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
