# Setup Kubectl
#### Install a specific version of kubectl binary on the runner.

Acceptable values are latest or any semantic version string like 1.15.0. Use this action in workflow to define which version of kubectl will be used.

```yaml
- uses: azure/k8s-actions/setup-kubectl@master
  with:
    version: '<version>' # default is latest stable
  id: install
```
