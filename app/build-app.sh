#!/bin/bash

eval $(minikube docker-env)

# Build Docker images
echo "Building Docker images..."
docker build -t auth-api -f auth/Dockerfile.api auth
docker build -t auth-grpc -f auth/Dockerfile.grpc auth
docker build -t customer-api -f customer/Dockerfile.api customer
echo "Docker images built successfully."

# Apply Kubernetes configurations
echo "Applying Kubernetes configurations..."
kubectl apply -f k8s/auth/
kubectl apply -f k8s/customer/
kubectl apply -f k8s/
echo "Kubernetes configurations applied successfully."

# Restart pods to use the new images
echo "Restarting pods to use the new images..."
kubectl delete pod -l app=auth-api
kubectl delete pod -l app=auth-grpc
kubectl delete pod -l app=customer-api
echo "Build and deployment complete."

echo "Starting minikube tunnel..."
minikube tunnel