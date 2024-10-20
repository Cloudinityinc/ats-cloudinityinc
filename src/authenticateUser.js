import { AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js";
import UserPool from "./CognitoConfig";

const authenticateUser = (username, password, newPassword) => {
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username: username, Pool: UserPool });
    const authDetails = new AuthenticationDetails({
      Username: username,
      Password: password,
    });

    user.authenticateUser(authDetails, {
      onSuccess: (data) => resolve({ status: "success", data }),
      onFailure: (err) => reject(err),
      newPasswordRequired: (userAttributes, requiredAttributes) => {
        // Remove non-modifiable attributes
        delete userAttributes.email_verified; // example attribute
        delete userAttributes.email; // Remove this if the email attribute is immutable

        if (!newPassword) {
          resolve({
            status: "newPasswordRequired",
            user,
            userAttributes,
            requiredAttributes,
          });
        } else {
          user.completeNewPasswordChallenge(newPassword, userAttributes, {
            onSuccess: (data) => resolve({ status: "success", data }),
            onFailure: (err) => reject(err),
          });
        }
      },
    });
  });
};

export default authenticateUser;
