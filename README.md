# Kubernetes Actions for GitHub

[GitHub Actions](https://help.github.com/en/articles/about-github-actions)  gives you the flexibility to build an automated software development lifecycle workflow. 

A set of GitHub Actions for deploying to a Kubernetes cluster, including [Azure Kubernetes service (AKS)](https://azure.microsoft.com/en-us/services/kubernetes-service/) and any generic Kubernetes cluster.

Get started today with a [free Azure account](https://azure.com/free/open-source)!

The repository contains the following GitHub Actions:
* [k8s-set-context](https://github.com/Azure/k8s-actions/tree/master/k8s-set-context): Used for setting the target K8s cluster context by providing kubeconfig or service account details
* [aks-set-context](https://github.com/Azure/k8s-actions/tree/master/aks-set-context): Used for setting the target AKS cluster context by providing Azure subscription details
* [k8s-create-secret](https://github.com/Azure/k8s-actions/tree/master/k8s-create-secret) : Create a generic secret or docker-registry secret in Kubernetes cluster.
* [K8s-deploy](https://github.com/Azure/k8s-actions/tree/master/k8s-deploy): Deploy manifest action for Kubernetes to bake and deploy manifests to a Kubernetes cluster.
* [setup-kubectl](https://github.com/Azure/k8s-actions/tree/master/setup-kubectl): Install a specific version of kubectl binary on runner

The [container-actions](https://github.com/Azure/container-actions/edit/master/README.md) contains:
* [docker-login](https://github.com/Azure/container-actions/tree/master/docker-login) : Actions to [log in to a private container registry](https://docs.docker.com/engine/reference/commandline/login/) such as [Azure Container registry](https://azure.microsoft.com/en-us/services/container-registry/). Once login is done, the next set of Actions in the workflow can perform tasks such as building, tagging and pushing containers.

> The docker-login Actions in this repository will be deleted in the near future. Please use the Docker Actions from [container-actions](https://github.com/Azure/container-actions/edit/master/README.md).


# Usage

Usage information for individual actions can be found in their respective directories.

For any credential like Azure Service Principal, Kubeconfig, add them as [secrets](https://developer.github.com/actions/managing-workflows/storing-secrets/) in the GitHub repository and then use them in the workflow.

In the above example the secret name is `REGISTRY_USERNAME` and `REGISTRY_PASSWORD` and it can be used in the workflow by using the following syntax:

```yaml
container-registry-username: ${{ secrets.REGISTRY_USERNAME }}
```

## End to end workflow for building container images and deploying to an Azure Kubernetes Service cluster

```yaml
on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@master
    
    - uses: azure/container-actions/docker-login@master
      with:
        login-server: contoso.azurecr.io
        username: ${{ secrets.REGISTRY_USERNAME }}
        password: ${{ secrets.REGISTRY_PASSWORD }}
    
    - run: |
        docker build . -t contoso.azurecr.io/k8sdemo:${{ github.sha }}
        docker push contoso.azurecr.io/k8sdemo:${{ github.sha }}
      
    # Set the target AKS cluster. 
    - uses: azure/k8s-actions/aks-set-context@master
      with:
        creds: '${{ secrets.AZURE_CREDENTIALS }}'
        cluster-name: contoso
        resource-group: contoso-rg
        
    - uses: azure/k8s-actions/k8s-create-secret@master
      with:
        container-registry-url: contoso.azurecr.io
        container-registry-username: ${{ secrets.REGISTRY_USERNAME }}
        container-registry-password: ${{ secrets.REGISTRY_PASSWORD }}
        secret-name: demo-k8s-secret

    - uses: azure/k8s-actions/k8s-deploy@master
      with:
        manifests: |
          manifests/deployment.yml
          manifests/service.yml
        images: |
          contoso.azurecr.io/k8sdemo:${{ github.sha }}
        imagepullsecrets: |
          demo-k8s-secret
```

## End to end workflow for building container images and deploying to a generic Kubernetes cluster

```yaml
on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@master
    
    - uses: azure/container-actions/docker-login@master
      with:
        login-server: contoso.azurecr.io
        username: ${{ secrets.REGISTRY_USERNAME }}
        password: ${{ secrets.REGISTRY_PASSWORD }}
    
    - run: |
        docker build . -t contoso.azurecr.io/k8sdemo:${{ github.sha }}
        docker push contoso.azurecr.io/k8sdemo:${{ github.sha }}
      
    - uses: azure/k8s-actions/k8s-set-context@master
      with:
        kubeconfig: ${{ secrets.KUBE_CONFIG }}
        
    - uses: azure/k8s-actions/k8s-create-secret@master
      with:
        container-registry-url: contoso.azurecr.io
        container-registry-username: ${{ secrets.REGISTRY_USERNAME }}
        container-registry-password: ${{ secrets.REGISTRY_PASSWORD }}
        secret-name: demo-k8s-secret

    - uses: azure/k8s-actions/k8s-deploy@master
      with:
        manifests: |
          manifests/deployment.yml
          manifests/service.yml
        images: |
          contoso.azurecr.io/k8sdemo:${{ github.sha }}
        imagepullsecrets: |
          demo-k8s-secret
```

# Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
