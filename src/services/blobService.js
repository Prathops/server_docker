const { BlobServiceClient } = require('@azure/storage-blob');

const containerName = process.env.AZURE_BLOB_CONTAINER_NAME;
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;

const getContainerClient = () => {
  if (!connectionString) {
    throw new Error('AZURE_STORAGE_CONNECTION_STRING is not configured');
  }

  if (!containerName) {
    throw new Error('AZURE_BLOB_CONTAINER_NAME is not configured');
  }

  const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
  return blobServiceClient.getContainerClient(containerName);
};

const normalizeName = (name) => name.replace(/[^a-zA-Z0-9._-]/g, '_');

const uploadBuffer = async (buffer, { originalName, contentType }) => {
  const containerClient = getContainerClient();
  const blobName = `${Date.now()}-${normalizeName(originalName || 'upload.bin')}`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  await blockBlobClient.uploadData(buffer, {
    blobHTTPHeaders: {
      blobContentType: contentType || 'application/octet-stream'
    }
  });

  return blobName;
};

const downloadBlob = async (blobName) => {
  const containerClient = getContainerClient();
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  const exists = await blockBlobClient.exists();

  if (!exists) {
    throw new Error('blob_not_found');
  }

  const response = await blockBlobClient.download();

  return {
    stream: response.readableStreamBody,
    contentType: response.contentType
  };
};

const deleteBlob = async (blobName) => {
  const containerClient = getContainerClient();
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  await blockBlobClient.deleteIfExists();
};

const checkHealth = async () => {
  const containerClient = getContainerClient();
  await containerClient.getProperties();
};

module.exports = {
  uploadBuffer,
  downloadBlob,
  deleteBlob,
  checkHealth
};
