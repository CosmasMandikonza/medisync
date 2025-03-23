#!/bin/bash

# Variables
RESOURCE_GROUP="MediSyncAI-Resources"
LOCATION="eastus"
STORAGE_ACCOUNT="medisyncstorage$(date +%s)"
FUNCTION_APP="medisync-functions-$(date +%s)"
COSMOSDB_ACCOUNT="medisync-cosmos-$(date +%s)"
SPEECH_SERVICE="medisync-speech-$(date +%s)"
VISION_SERVICE="medisync-vision-$(date +%s)"
OPENAI_SERVICE="medisync-openai-$(date +%s)"

# Create Resource Group
echo "Creating Resource Group..."
az group create --name $RESOURCE_GROUP --location $LOCATION

# Create Storage Account
echo "Creating Storage Account..."
az storage account create --name $STORAGE_ACCOUNT --resource-group $RESOURCE_GROUP --location $LOCATION --sku Standard_LRS

# Create Cosmos DB
echo "Creating Cosmos DB..."
az cosmosdb create --name $COSMOSDB_ACCOUNT --resource-group $RESOURCE_GROUP --kind GlobalDocumentDB
az cosmosdb sql database create --account-name $COSMOSDB_ACCOUNT --resource-group $RESOURCE_GROUP --name MediSyncDB
az cosmosdb sql container create --account-name $COSMOSDB_ACCOUNT --resource-group $RESOURCE_GROUP --database-name MediSyncDB --name Patients --partition-key-path "/id"
az cosmosdb sql container create --account-name $COSMOSDB_ACCOUNT --resource-group $RESOURCE_GROUP --database-name MediSyncDB --name Documents --partition-key-path "/id"

# Create Speech Service
echo "Creating Speech Service..."
az cognitiveservices account create --name $SPEECH_SERVICE --resource-group $RESOURCE_GROUP --kind SpeechServices --sku S0 --location $LOCATION --yes

# Create Computer Vision
echo "Creating Computer Vision..."
az cognitiveservices account create --name $VISION_SERVICE --resource-group $RESOURCE_GROUP --kind ComputerVision --sku S1 --location $LOCATION --yes

# Create OpenAI Service (Note: This may require additional permissions or might not be available in all regions)
echo "Creating OpenAI Service..."
# Note: For hackathon purposes, you might want to use an existing OpenAI resource or request one through the Azure portal

# Create Function App
echo "Creating Function App..."
az functionapp create --name $FUNCTION_APP --storage-account $STORAGE_ACCOUNT --consumption-plan-location $LOCATION --resource-group $RESOURCE_GROUP --runtime dotnet --functions-version 4

# Get keys and connection strings
echo "Getting keys and connection strings..."
STORAGE_CONNECTION=$(az storage account show-connection-string --name $STORAGE_ACCOUNT --resource-group $RESOURCE_GROUP --query connectionString --output tsv)
COSMOSDB_CONNECTION=$(az cosmosdb keys list --name $COSMOSDB_ACCOUNT --resource-group $RESOURCE_GROUP --type connection-strings --query connectionStrings[0].connectionString --output tsv)
SPEECH_KEY=$(az cognitiveservices account keys list --name $SPEECH_SERVICE --resource-group $RESOURCE_GROUP --query key1 --output tsv)
VISION_KEY=$(az cognitiveservices account keys list --name $VISION_SERVICE --resource-group $RESOURCE_GROUP --query key1 --output tsv)

# Configure Function App settings
echo "Configuring Function App settings..."
az functionapp config appsettings set --name $FUNCTION_APP --resource-group $RESOURCE_GROUP --settings "AzureWebJobsStorage=$STORAGE_CONNECTION" "CosmosDB_Connection=$COSMOSDB_CONNECTION" "Speech_Key=$SPEECH_KEY" "Speech_Region=$LOCATION" "Vision_Key=$VISION_KEY" "Vision_Endpoint=https://$LOCATION.api.cognitive.microsoft.com/" "CORS=*"

echo "Deployment complete! Here are your service details:"
echo "Function App: $FUNCTION_APP"
echo "Storage Account: $STORAGE_ACCOUNT"
echo "Cosmos DB: $COSMOSDB_ACCOUNT"
echo "Speech Service: $SPEECH_SERVICE"
echo "Vision Service: $VISION_SERVICE"