# Usage
### AKS set context. Used for setting the target AKS cluster context which will be used by other actions like azure/k8s-actions/k8s-deploy or azure/k8s-actions/k8s-create-secret 
```yaml
uses: azure/k8s-actions/aks-set-context@master
    with:
        creds: '<login to az, paste the output of `az ad sp create-for-rbac --sdk-auth` here>'
        resourceGroupName: '<resource group name>'
        clusterName: '<cluster name>'
    id: login
```

## Creds object example
Run `az ad sp create-for-rbac --sdk-auth` to generate the below object
For more details refer to https://docs.microsoft.com/en-us/cli/azure/ad/sp?view=azure-cli-latest#az-ad-sp-create-for-rbac
```json
{
  "clientId": "<client id>",
  "clientSecret": "<client secret>",
  "subscriptionId": "<subscription id>",
  "tenantId": "<tenant id>",
  "activeDirectoryEndpointUrl": "https://login.microsoftonline.com", // example urls
  "resourceManagerEndpointUrl": "https://management.azure.com/",
  "activeDirectoryGraphResourceId": "https://graph.windows.net/",
  "sqlManagementEndpointUrl": "https://management.core.windows.net:8443/",
  "galleryEndpointUrl": "https://gallery.azure.com/",
  "managementEndpointUrl": "https://management.core.windows.net/"
}
```