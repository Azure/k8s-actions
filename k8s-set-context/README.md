# Usage
### Used for setting the target K8s cluster context which will be used by other actions like azure/k8s-actions/k8s-deploy or azure/k8s-actions/k8s-create-secret
```yaml
- uses: azure/actions/k8s-set-context@master
  with:
    kubeconfig: '<your kubeconfig>'
    context: '<context name>'  # chooses the current-context from kubeconfig if not provided
  id: login
```

```yaml
- uses: azure/actions/k8s-set-context@master
  with:
    k8s-url: '<your kubernetes cluster url>'
    k8s-secret: '<service account token>' # token value from the result of the below script
  id: login
```
PS: `kubeconfig` takes precedence (i.e. kubeconfig would be created using the value supplied in kubeconfig)

## Steps to get Kubeconfig of a K8s cluster: 

### For AKS
```sh
az aks get-credentials --name
                       --resource-group
                       [--admin]
                       [--file]
                       [--overwrite-existing]
                       [--subscription]
```
Refer to https://docs.microsoft.com/en-us/cli/azure/aks?view=azure-cli-latest#az-aks-get-credentials

### For any K8s cluster
Please refer to https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/


## Steps to get Service account: 
```sh
# k8s-url: Run in your local shell to get server K8s URL
kubectl config view --minify -o jsonpath={.clusters[0].cluster.server}

# k8s-secret: Run following sequential commands to get the secret value:
Get service account secret names by running
kubectl get serviceAccounts <service-account-name> -n <namespace> -o=jsonpath={.secrets[*].name}

Use the output of the above command 
kubectl get secret <service-account-secret-name> -n <namespace> -o json
```
