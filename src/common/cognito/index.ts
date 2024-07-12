import * as aws from 'aws-sdk';
import { getEnv } from '../utils';
import {
  SearchPaginationTokenType,
  UsersListType,
} from 'aws-sdk/clients/cognitoidentityserviceprovider';

const cognito = new aws.CognitoIdentityServiceProvider({
  region: getEnv('COGNITO_USER_POOL_REGION'),
});

type CognitoUserAttributes =
  | {
      Name: 'email';
      Value: string;
    }
  | {
      Name: 'custom:demo_reminder_enable';
      Value: '1' | '0';
    };

// Cognito에서 모든 유저를 조회하는 함수
export const listAllEnabledUserEmails = async () => {
  let paginationToken: SearchPaginationTokenType | undefined = undefined;
  const allUsers = [];
  do {
    const result = await cognito
      .listUsers({
        UserPoolId: getEnv('COGNITO_USER_POOL_ID'),
        Limit: 1,
        PaginationToken: paginationToken,
      })
      .promise();
    const users: UsersListType = result.Users || [];
    const filteredUsers = users.filter((user) => {
      const demoReminderEnable = user.Attributes?.find(
        (attr: CognitoUserAttributes) => attr.Name === 'custom:demo_reminder_enable',
      );
      return demoReminderEnable && demoReminderEnable.Value === '1';
    });
    allUsers.push(...filteredUsers);

    // pagination
    paginationToken = result.PaginationToken;
  } while (paginationToken);

  return allUsers.map(
    (user) => user.Attributes!.find((attr: CognitoUserAttributes) => attr.Name === 'email')!.Value,
  );
};
