const {
  SecretsManagerClient,
  GetSecretValueCommand,
} = require('@aws-sdk/client-secrets-manager');

const region = 'eu-central-1';
const client = new SecretsManagerClient({
  region,
});

const getSecretValue = async () => {
  const secretName = 'discordKeys'; // Replace with the actual secret name

  const command = new GetSecretValueCommand({ SecretId: secretName });

  try {
    const response = await client.send(command);

    if ('SecretString' in response) {
      const secretString = response.SecretString;
      const secretValue = JSON.parse(secretString);
      return secretValue;
    }
  } catch (err) {
    console.error('Error retrieving secret:', err);
  }
};

module.exports = {
  getSecretValue,
};
