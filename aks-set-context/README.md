# Usage

```yaml
uses: azure/k8s-actions/aks-set-context@master
    with:
        creds: '<login to az, paste the output of az ad sp create-for-rbac here>'
        subscriptionId: '<subscription id>'
        resourceGroupName: '<resource group name>'
        clusterName: '<cluster name>'
    id: login
```

## creds object example
```json
{
  "appId": "<app id>",
  "displayName": "<display name>",
  "name": "<name>",
  "password": "<password>",
  "tenant": "<tenant id>"
}
```