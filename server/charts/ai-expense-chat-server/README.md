# 🚀 AI Expense Chat Server - Deployment Guide

This repository contains the Helm chart for the AI Expense Chat Server. The chart is hosted as an OCI artifact in the GitHub Container Registry (GHCR).

Quick-start guide to deploying the AI Expense Server via Helm OCI and Gateway API.

## 📋 Prerequisites
- Kubernetes Cluster (k3d, Minikube, or Cloud) 

- Helm 3.8+ (Required for OCI support)

- Traefik v3+ installed with Gateway API support enabled.

## 💁 Use Me!

If you want all these prerequisites pre-configured on your github codespace! then use one of my 'cluster on demand' setup, you'll be ready in no time (no separate setup required)!
- [k3d-cluster-on-demand](https://github.com/VinZCodz/k3d-cluster-on-demand)

-OR-

-  [minikube-cluster-on-demand](https://github.com/VinZCodz/minikube-cluster-on-demand)


## 1️⃣ Setup Namespace & Secrets
Now, on your cluster. 

Create the namespace and inject the sensitive credentials before installing the chart.

```
kubectl create namespace ai-expense-chat-app

# Create secret with the exact name referenced in chart values
kubectl create secret generic ai-expense-chat-secrets \
  --namespace ai-expense-chat-app \
  --from-literal=MODEL="your_Groq_chat_model_name" \
  --from-literal=GROQ_API_KEY="your_key" \
  --from-literal=TURSO_DATABASE_URL="your_url" \
  --from-literal=TURSO_AUTH_TOKEN="your_token" \
  --from-literal=TURSO_RO_AUTH_TOKEN="your_readonly_token"
```

## 2️⃣ Pull & Configure
Pull the OCI artifact to inspect/edit values or install directly.

```
# Pull and untar to get values.yaml (optional)
helm pull oci://ghcr.io/vinzcodz/charts/ai-expense-chat-server --version latest --untar

# Get your Codespace URL (strip https://)
export APP_HOST=$(gp url 8080 | sed 's|https://||') //If hosted then paste directly the Domain name.
```

## 3️⃣ Deploy
Run the installation using the Gateway API settings and the correct Service Port. 

- Edit the values.yaml in chart downloaded above, with your Gateway API settings.

-OR-

- Run directly 
```
helm upgrade --install ai-expense oci://ghcr.io/vinzcodz/charts/ai-expense-chat-server \
  --version latest \
  --namespace ai-expense-chat-app \
  --set existingSecretName="ai-expense-chat-secrets" \
  --set httpRoute.enabled=true \
  --set httpRoute.hostnames[0]="$APP_HOST" \
  --set httpRoute.parentRefs[0].name="traefik-gateway" \
  --set httpRoute.parentRefs[0].namespace="kube-system"
```

## 4️⃣ Verification & Health Checks
- Check A: Is the traffic route accepted?
```
kubectl get httproute -n ai-expense-chat-app
```
Status should show ```'Accepted: True'``` and ```'Programmed: True'```

- Check B: Connectivity Test

```
curl -I https://$APP_HOST/
```
Shows: ```Welcome to Expense Agent endpoints!```

## SRE Notes:

- Port Alignment: The 8080 port in your Codespace maps to the Traefik LoadBalancer, which the HTTPRoute then maps to your service on port 3001.

- Traefik v3: Ensure Traefik is started with  ```--set providers.kubernetesGateway.enabled=true``` to recognize the HTTPRoute resource.