# Log in to a container registry
```yaml
- uses: azure/actions/k8s-docker-login@master
  with:
    username: '<username>'
    password: '<password>'
    loginServer: '<login server>' # default: index.docker.io
    email: '<email id>'
```

## You can build and push container registry by using the following example
```yaml
- uses: azure/k8s-actions/docker-login@master
      with:
        login-server: demoe.azurecr.io
        username: ${{ secrets.REGISTRY_USERNAME }}
        password: ${{ secrets.REGISTRY_PASSWORD }}
    
    - run: |
        docker build . -t demo.azurecr.io/k8sdemo:${{ github.sha }}
        docker push demoe.azurecr.io/k8sdemo:${{ github.sha }}
```