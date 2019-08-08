# Azure Kubernetes Service set context

Used for setting the target AKS cluster context which will be used by other actions like [`azure/k8s-actions/k8s-deploy`](https://github.com/Azure/k8s-actions/tree/master/k8s-deploy), [`azure/k8s-actions/k8s-create-secret`](https://github.com/Azure/k8s-actions/tree/master/k8s-create-secret) etc. or run any [kubectl]   (https://kubernetes.io/docs/reference/kubectl/overview/) commands.

```yaml
uses: azure/k8s-actions/aks-set-context@master
    with:
        creds: '${{ secrets.AZURE_CREDENTIALS }}' # Azure credentials
        resourceGroupName: '<resource group name>'
        clusterName: '<cluster name>'
    id: login
```

Refer to action metadata file for details about all the inputs https://github.com/Azure/k8s-actions/blob/master/aks-set-context/action.yml

## Azure credentials
Run `az ad sp create-for-rbac --sdk-auth` to generate an Azure Active Directory service principals.
For more details refer to: [az ad sp create-for-rbac](https://docs.microsoft.com/en-us/cli/azure/ad/sp?view=azure-cli-latest#az-ad-sp-create-for-rbac)

```json
{
  "clientId": "<client id>",
  "clientSecret": "<client secret>",
  "subscriptionId": "<subscription id>",
  "tenantId": "<tenant id>",
  "activeDirectoryEndpointUrl": "https://login.microsoftonline.com",
  "resourceManagerEndpointUrl": "https://management.azure.com/",
  "activeDirectoryGraphResourceId": "https://graph.windows.net/",
  "sqlManagementEndpointUrl": "https://management.core.windows.net:8443/",
  "galleryEndpointUrl": "https://gallery.azure.com/",
  "managementEndpointUrl": "https://management.core.windows.net/"
}
```
## Using secret
Now add the json output as [a secret](https://developer.github.com/actions/managing-workflows/storing-secrets/) in the GitHub repository. In the above example the secret name is `AZURE_CREDENTIALS` and it can be used in the workflow by using the following syntax:
```yaml
creds: '${{ secrets.AZURE_CREDENTIALS }}'
```
