# Testing Owner setup

# Kubernetes create secret
Create a [generic secret or docker-registry secret](https://kubernetes.io/docs/concepts/configuration/secret/) in Kubernetes cluster.

The secret will be created in the cluster context which was set earlier in the workflow by using either [`azure/k8s-actions/aks-set-context`](https://github.com/Azure/k8s-actions/tree/master/aks-set-context) or [`azure/k8s-actions/k8s-set-context`](https://github.com/Azure/k8s-actions/tree/master/k8s-set-context)

Refer to the action metadata file for details about all the inputs https://github.com/Azure/k8s-actions/blob/master/k8s-create-secret/action.yml

## For docker-registry secret (imagepullsecret)
```yaml
    - name: Set imagePullSecret
      uses: azure/k8s-actions/k8s-set-secret@master
      with:
        namespace: 'myapp'
        container-registry-url: 'containerregistry.contoso.com'
        container-registry-username: ${{ secrets.REGISTRY_USERNAME }}
        container-registry-password: ${{ secrets.REGISTRY_PASSWORD }}
        secret-name: 'contoso-cr'
      id: set-secret
```

## For generic secret
```yaml
    - uses: azure/k8s-actions/k8s-create-secret@master
      with:
        namespace: 'default'
        secret-type: 'generic'
        arguments:  --from-literal=account-name=${{ secrets.AZURE_STORAGE_ACCOUNT }} --from-literal=access-key=${{ secrets.AZURE_STORAGE_ACCESS_KEY }}
        secret-name: azure-storage
```

### Prerequisite
Get the username and password of your container registry and create secrets for them. For Azure Container registry refer to **admin [account document](https://docs.microsoft.com/en-us/azure/container-registry/container-registry-authentication#admin-account)** for username and password.

Now add the username and password as [a secret](https://developer.github.com/actions/managing-workflows/storing-secrets/) in the GitHub repository.

In the above example the secret name is `REGISTRY_USERNAME` and `REGISTRY_PASSWORD` and it can be used in the workflow by using the following syntax:
```yaml
container-registry-username: ${{ secrets.REGISTRY_USERNAME }}
```
