import {
    CognitoIdentityProviderClient,
    SignUpCommand,
    ConfirmSignUpCommand,
    AdminInitiateAuthCommand,
    GetUserCommand,
    GlobalSignOutCommand
  } from '@aws-sdk/client-cognito-identity-provider';
  import crypto from 'crypto';
  
  const client = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });
  
  // 🔐 SecretHash calculator
  const calculateSecretHash = (clientId, clientSecret, username) => {
    return crypto
      .createHmac('SHA256', clientSecret)
      .update(username + clientId)
      .digest('base64');
  };
  
  // ✅ Register
  const registerUser = async (email, password) => {
    const secretHash = calculateSecretHash(
      process.env.COGNITO_APP_CLIENT_ID,
      process.env.COGNITO_APP_CLIENT_SECRET,
      email
    );
  
    const cmd = new SignUpCommand({
      ClientId: process.env.COGNITO_APP_CLIENT_ID,
      SecretHash: secretHash,
      Username: email,
      Password: password,
      UserAttributes: [{ Name: 'email', Value: email }]
    });
  
    return await client.send(cmd);
  };
  
  // ✅ Confirm sign-up
  const verifyUser = async (email, code) => {
    const secretHash = calculateSecretHash(
      process.env.COGNITO_APP_CLIENT_ID,
      process.env.COGNITO_APP_CLIENT_SECRET,
      email
    );
  
    const cmd = new ConfirmSignUpCommand({
      ClientId: process.env.COGNITO_APP_CLIENT_ID,
      SecretHash: secretHash,
      Username: email,
      ConfirmationCode: code
    });
  
    return await client.send(cmd);
  };
  
  // ✅ Login
  const loginUser = async (email, password) => {
    const secretHash = calculateSecretHash(
      process.env.COGNITO_APP_CLIENT_ID,
      process.env.COGNITO_APP_CLIENT_SECRET,
      email
    );
  
    const cmd = new AdminInitiateAuthCommand({
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      ClientId: process.env.COGNITO_APP_CLIENT_ID,
      AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
        SECRET_HASH: secretHash
      }
    });
  
    return await client.send(cmd);
  };
  
  // ✅ Get user info (access token required)
  const getUserInfo = async (accessToken) => {
    const cmd = new GetUserCommand({
      AccessToken: accessToken
    });
  
    return await client.send(cmd);
  };
  
  // ✅ Logout (global signout using access token)
  const logoutUser = async (accessToken) => {
    const cmd = new GlobalSignOutCommand({
      AccessToken: accessToken
    });
  
    return await client.send(cmd);
  };
  
  export default {
    registerUser,
    verifyUser,
    loginUser,
    getUserInfo,
    logoutUser
  };
  