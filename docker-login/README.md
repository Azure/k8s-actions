# Usage

```yaml
- uses: azure/actions/docker-login@master
  with:
    username: '<username>'
    password: '<password>'
    loginServer: '<login server>' # default: index.docker.io
    email: '<email id>'
```