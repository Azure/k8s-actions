# Usage

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
    clusterUrl: '<your kubernetes cluster url>'
    certificate: '<service account certificate>' # ca.crt value from the result of the below script
    token: '<service account token>' # token value from the result of the below script
  id: login
```
PS: `kubeconfig` takes precedence (i.e. kubeconfig would be created using the value supplied in kubeconfig)

###Steps to get certificate and token: 
```sh
# Copy the secret name from the output of the get service account command
~/$ kubectl get serviceaccounts <service-account-name> -o yaml
~/$ kubectl get secret <service-account-secret-name> -o yaml
```