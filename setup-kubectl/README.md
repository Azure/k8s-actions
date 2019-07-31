# Usage
### Install a specific version of kubectl binary. Acceptable values are latest or any semantic version string like 1.15.0
```yaml
- uses: azure/k8s-actions/setup-kubectl@master
  with:
    version: '<version>' # default is latest stable
  id: install
```