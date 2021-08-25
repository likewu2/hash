import { gql } from "@apollo/client";

export const createUser = gql`
  mutation createUser($email: String!) {
    createUser(email: $email) {
      __typename
      id
      createdAt
    }
  }
`;

export const verifyEmail = gql`
  mutation verifyEmail($verificationId: ID!, $verificationCode: String!) {
    verifyEmail(
      verificationId: $verificationId
      verificationCode: $verificationCode
    ) {
      __typename
      id
      createdById
      createdAt
      updatedAt
      accountId
      entityTypeId
      entityTypeVersionId
      entityTypeName
      visibility
      properties {
        shortname
        emails {
          address
          primary
          verified
        }
      }
    }
  }
`;

export const sendLoginCode = gql`
  mutation sendLoginCode($emailOrShortname: String!) {
    sendLoginCode(emailOrShortname: $emailOrShortname) {
      __typename
      id
      createdAt
    }
  }
`;

export const loginWithLoginCode = gql`
  mutation loginWithLoginCode(
    $verificationId: ID!
    $verificationCode: String!
  ) {
    loginWithLoginCode(
      verificationId: $verificationId
      verificationCode: $verificationCode
    ) {
      __typename
      id
      createdById
      createdAt
      updatedAt
      accountId
      entityTypeId
      entityTypeVersionId
      entityTypeName
      visibility
      properties {
        shortname
        emails {
          address
          primary
          verified
        }
      }
    }
  }
`;

export const logout = gql`
  mutation logout {
    logout
  }
`;

export const meQuery = gql`
  query me {
    me {
      id
      createdById
      accountId
      entityTypeId
      entityTypeVersionId
      entityTypeName
      visibility
      properties {
        shortname
        emails {
          address
          primary
          verified
        }
      }
    }
  }
`;
