# Usage

```yaml
uses: azure/k8s-actions/aks-set-context@master
    with:
        creds: '<login to az, paste the output of `az ad sp create-for-rbac --sdk-auth` here>'
        subscriptionId: '<subscription id>'
        resourceGroupName: '<resource group name>'
        clusterName: '<cluster name>'
    id: login
```

## creds object example
Run `az ad sp create-for-rbac --sdk-auth` to generate the below object

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