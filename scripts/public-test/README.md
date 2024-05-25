# Public test

> Redirect public domain to local development to test with real domain

## Expose your local port with a tunnel

### Setup

```sh
brew tap omrikiei/ktunnel && brew install omrikiei/ktunnel/ktunnel
```

### Create the tunnel

```sh
ktunnel expose --namespace default --force admin-local 8080:3002
```

### Expose through a virtual service

```sh
kubectl apply -f scripts/public-test/k8s.yaml
```

### Connect to your local admin with

https://admin-local.beta.gatherwise.com/
