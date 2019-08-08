# Log in to a container registry
Use this GitHub Action to [log in to a private container registry](https://docs.docker.com/engine/reference/commandline/login/) such as [Azure Container registry](https://azure.microsoft.com/en-us/services/container-registry/). Once login is done, the next set of actions in the workflow can perform tasks such as building, tagging and pushing containers.

```yaml
- uses: azure/container-actions/docker-login@master
  with:
    username: '<username>'
    password: '<password>'
    loginServer: '<login server>' # default: index.docker.io
    email: '<email id>'
```

## You can build and push container registry by using the following example
```yaml
- uses: azure/container-actions/docker-login@master
      with:
        login-server: demoe.azurecr.io
        username: ${{ secrets.REGISTRY_USERNAME }}
        password: ${{ secrets.REGISTRY_PASSWORD }}
    
    - run: |
        docker build . -t demo.azurecr.io/k8sdemo:${{ github.sha }}
        docker push demoe.azurecr.io/k8sdemo:${{ github.sha }}
```

### Prerequisite
Get the username and password of your container registry and create secrets for them. For Azure Container registry refer to **admin [account document](https://docs.microsoft.com/en-us/azure/container-registry/container-registry-authentication#admin-account)** for username and password.

Now add the username and password as [a secret](https://developer.github.com/actions/managing-workflows/storing-secrets/) in the GitHub repository.
