import {
  CognitoUserPool,
  CognitoUserAttribute,
} from "amazon-cognito-identity-js";

const poolData = {
  // UserPoolId: "us-east-2_3Ms1eFrei", // Replace with your Cognito User Pool ID
  // ClientId: "12gd95t82qp31uf8a5vgo0fkmb", // Replace with your Cognito App Client ID
  UserPoolId: process.env.REACT_APP_USER_POOL_ID, // Use environment variable
  ClientId: process.env.REACT_APP_CLIENT_ID, // Use environment variable
};

const userPool = new CognitoUserPool(poolData);

export const registerUser = async (username, password) => {
  const attributeList = [
    new CognitoUserAttribute({
      Name: "email",
      Value: username,
    }),
  ];

  return new Promise((resolve, reject) => {
    userPool.signUp(username, password, attributeList, null, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};
