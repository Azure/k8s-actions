# Log out from a container registry

> The docker-login Actions in this repository will be deleted in the near future. Please use the Docker Actions from [container-actions](https://github.com/Azure/container-actions/edit/master/README.md).

Use this GitHub Action to delete the container registry context from the runner. The context file is created when [docker-login](https://github.com/Azure/k8s-actions/tree/master/docker-login) action is used.

```yaml
- uses: azure/container-actions/docker-logout@master
  id: logout
```

Refer to the action metadata file for details about all the inputs https://github.com/Azure/k8s-actions/blob/master/docker-logout/action.yml

