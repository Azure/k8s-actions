# Usage

```yaml
- uses: ds-ms/k8s-actions/set-context@master
  with:
    kubeconfig: '<your kubeconfig>'
  id: login
```

```yaml
- uses: ds-ms/k8s-actions/set-context@master
  with:
    clusterUrl: '<your kubernetes cluster url>'
    certificate: '<service account certificate>' # ca.crt value from the result of the below script
    token: '<service account token>' # token value from the result of the below script
  id: login
```

```yaml
uses: ds-ms/k8s-actions/set-context@master
    with:
        servicePrincipalId: '<service principal id>'
        servicePrincipalKey: '<service principal key>'
        tenantId: '<tenant id>'
        subscriptionId: '<subscription id>'
        resourceGroupName: '<resource group name>'
        clusterName: '<cluster name>'
    id: login
```

PS: `kubeconfig` takes precedence (i.e. if all 3 are supplied, kubeconfig would be created using the value supplied in kubeconfig)

###Steps to get certificate and token: 
```sh
# Copy the secret name from the output of the get service account command
~/$ kubectl get serviceaccounts <service-account-name> -o yaml
~/$ kubectl get secret <service-account-secret-name> -o yaml
```

