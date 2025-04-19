# Cognito Auth API

This project is a Node.js-based API that integrates with AWS Cognito for user authentication and management. It is designed to be deployed on AWS Lambda and supports Admin-based authentication flow with app secrets. The API is CORS-enabled and uses environment variables for configuration.

---

## Features

- **User Registration**: Register new users in the Cognito User Pool.
- **User Verification**: Confirm user sign-up using a verification code.
- **User Login**: Authenticate users using the Admin-based authentication flow.
- **User Info Retrieval**: Fetch user details using an access token.
- **User Logout**: Perform global sign-out for a user.

---

## Prerequisites

1. **AWS Cognito Setup**:

   - Create a Cognito User Pool.
   - Create an App Client with the following settings:
     - **Admin-based authentication flow** enabled.
     - **App Client Secret** enabled.
   - Note the following:
     - **User Pool ID**
     - **App Client ID**
     - **App Client Secret**

2. **Environment Variables**:

   - Create a `.env` file in the root of the project with the following variables:

     ```plaintext
     AWS_REGION=your-aws-region
     COGNITO_USER_POOL_ID=your-user-pool-id
     COGNITO_APP_CLIENT_ID=your-app-client-id
     COGNITO_APP_CLIENT_SECRET=your-app-client-secret
     PORT=3000
     CORS_ORIGIN=*
     ```

---

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo/cognito-auth-api.git
   cd cognito-auth-api
   ```

2. Install dependencies:

```bash
npm install
```

3. Set up the `.env` file as described in the Prerequisites section.

## Running the Application Locally

To run the application locally, use the following command:

```bash
node app.js
```

The API will be available at `http://localhost:3000`.

## API Endpoints

1. Register User

- Endpoint: POST /auth/register
- Description: Registers a new user in the Cognito User Pool.
- Request Body:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

- Response:

```json
{
  "UserConfirmed": false,
  "CodeDeliveryDetails": {
    "Destination": "u***@example.com",
    "DeliveryMedium": "EMAIL",
    "AttributeName": "email"
  }
}
```

2. Verify User

- Endpoint: POST /auth/verify
- Description: Confirms user sign-up using a verification code.
- Request Body:

```json
{
  "email": "user@example.com",
  "code": "123456"
}
```

3. Login User

- Endpoint: `POST /auth/login`
- Description: Authenticates a user and returns tokens.
- Request Body:

````json
{
  "email": "user@example.com",
  "password": "password123"
}

- Response:

```json
{
  "AccessToken": "access-token",
  "IdToken": "id-token",
  "RefreshToken": "refresh-token"
}
````

4. Get User Info

- Endpoint: GET /auth/userinfo
- Description: Retrieves user information using an access token.
- Headers:

```bash
Authorization: Bearer <access-token>
```

- Response:

```json
{
  "Username": "user-id",
  "UserAttributes": [
    { "Name": "email", "Value": "user@example.com" },
    { "Name": "email_verified", "Value": "true" }
  ]
}
```

5. Logout User

- Endpoint: POST /auth/logout
- Description: Logs out the user globally.
- Headers:

```bash
Authorization: Bearer <access-token>
```

- Response:

```json
{
  "message": "Successfully signed out"
}
```

## Deploying to AWS Lambda

This project is designed to run as a serverless authentication API using AWS Lambda and API Gateway, integrating with AWS Cognito.

Follow these steps to prepare and deploy the backend:

1. Install Dependencies

```bash
npm install --production
```

This ensures only runtime dependencies are included in the Lambda package.

2. Set Environment Variables
   Before deploying, configure the following Lambda environment variables:

| Variable                    | Description                               |
| --------------------------- | ----------------------------------------- |
| `AWS_REGION`                | Region of your Cognito User Pool          |
| `COGNITO_USER_POOL_ID`      | Cognito User Pool ID                      |
| `COGNITO_APP_CLIENT_ID`     | Cognito App Client ID                     |
| `COGNITO_APP_CLIENT_SECRET` | Cognito App Client Secret (if used)       |
| `CORS_ORIGIN`               | Allowed origin for frontend CORS requests |

These can be set in the Lambda Console or passed through deployment scripts.

3. Build the Deployment Package
   Zip the necessary files:

```bash
zip -r cognito-auth-api.zip . -x "*.git*" "node_modules/aws-sdk/*"
```

> AWS Lambda already includes the AWS SDK, so we exclude it from the zip to reduce size.

4. Create & Configure the Lambda Function

- Go to AWS Lambda Console
- Create a new function (Node.js 18.x)
- Set the handler to:

```plaintext
lambda-server.handler
```

- Upload your cognito-auth-api.zip
- Set your environment variables (as listed above)
- Assign an IAM role with permissions to interact with Cognito:

  - cognito-idp:SignUp
  - cognito-idp:AdminInitiateAuth
  - cognito-idp:ConfirmSignUp
  - cognito-idp:GetUser
  - cognito-idp:GlobalSignOut

5. Connect Lambda to API Gateway

- Create a HTTP API in API Gateway
- Add routes:

  - POST /auth/register → your Lambda
  - POST /auth/login → your Lambda
  - POST /auth/verify → your Lambda
  - GET /auth/userinfo → your Lambda
  - POST /auth/logout → your Lambda

- Deploy the API and test using Postman or curl

## Ready to Go!

Your authentication API is now live — serverless, secure, and scalable.
