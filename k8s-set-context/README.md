# Kubernetes set context

Used for setting the target K8s cluster context which will be used by other actions like [`azure/k8s-actions/k8s-deploy`](https://github.com/Azure/k8s-actions/tree/master/k8s-deploy), [`azure/k8s-actions/k8s-create-secret`](https://github.com/Azure/k8s-actions/tree/master/k8s-create-secret) etc. or run any kubectl commands.

```yaml
- uses: azure/actions/k8s-set-context@master
  with:
    kubeconfig: '<your kubeconfig>'v# Use secret (https://developer.github.com/actions/managing-workflows/storing-secrets/)
    context: '<context name>'  # Optional, uses the current-context from kubeconfig by default
  id: login
```

```yaml
- uses: azure/actions/k8s-set-context@master
  with:
    k8s-url: '<your kubernetes cluster url>'
    k8s-secret: '<service account token>' # token value from the result of the below script
  id: login
```

Use secret (https://developer.github.com/actions/managing-workflows/storing-secrets/) in workflow for kubeconfig or k8s-values.

PS: `kubeconfig` takes precedence (i.e. kubeconfig would be created using the value supplied in kubeconfig)

Refer to the action metadata file for details about all the inputs https://github.com/Azure/k8s-set-context/blob/master/k8s-set-context/action.yml

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

#### k8s-url: Run in your local shell to get server K8s URL
```sh
kubectl config view --minify -o jsonpath={.clusters[0].cluster.server}
```
#### k8s-secret: Run following sequential commands to get the secret value:
Get service account secret names by running
```sh
kubectl get sa <service-account-name> -n <namespace> -o=jsonpath={.secrets[*].name}
```

Use the output of the above command 
```sh
kubectl get secret <service-account-secret-name> -n <namespace> -o json
```
## Using secret for Kubeconfig or Service Account
Now add the values as [a secret](https://developer.github.com/actions/managing-workflows/storing-secrets/) in the GitHub repository. In the example below the secret name is `KUBE_CONFIG` and it can be used in the workflow by using the following syntax:
```yaml
 - uses: azure/k8s-actions/k8s-set-context@master
      with:
        kubeconfig: ${{ secrets.KUBE_CONFIG }}
```
