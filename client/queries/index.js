import { gql } from "@apollo/client";

export const GET_USER = gql`
  query GetUsers($accessToken: String) {
    getUserProfile(access_token: $accessToken) {
      UserProfile {
        id
        UserId
        User {
          email
          fullName
          id
        }
      }
    }
  }
`;

export const GET_COACHES = gql`
  query GetCoaches {
    getCoaches {
      id
      name
      imgCoach
      age
      bio
      description
    }
  }
`;

export const GET_COACH_DETAIL = gql`
  query GetCoachDetail($getCoachDetailId: ID) {
    getCoachDetail(id: $getCoachDetailId) {
      id
      name
      imgCoach
      age
      bio
      description
    }
  }
`;

export const GET_LEVEL = gql`
  query GetLevels {
    getLevel {
      id
      name
      thumbnail
      description
    }
  }
`;

export const GET_CONTENT_CARD = gql`
  query Query($accessToken: String) {
    getContents(access_token: $accessToken) {
      id
      likes
      title
      imgThumbnail
      LevelId
    }
  }
`;

export const GET_USER_LOGS = gql`
  query GetUserLogs($accessToken: String) {
    getUserLogs(access_token: $accessToken) {
      id
      height
      weight
      bmi
      health
      LevelId
      UserId
      createdAt
    }
  }
`;
export const GET_CONTENT_DETAIL = gql`
  query GetContentById($accessToken: String, $contentId: ID) {
    getContentById(access_token: $accessToken, ContentId: $contentId) {
      id
      youtubeUrl
      description
      likes
      title
      imgThumbnail
      statusLike
    }
  }
`;

export const GET_USER_CONTENT_ID = gql`
  query GetUserContentById($accessToken: String, $contentId: ID) {
    getUserContentById(access_token: $accessToken, ContentId: $contentId) {
      UserId
      ContentId
      isLike
      status
    }
  }
`;

export const GET_TRANSACTION_TOKEN = gql`
  query TransactionToken($accessToken: String) {
    transactionToken(access_token: $accessToken) {
      token
      error
    }
  }
`;

export const GET_USER_PROFILE = gql`
query GetUserProfile($accessToken: String) {
  getUserProfile(access_token: $accessToken) {
    UserProfile {
      phoneNumber
      subscription
      gender
      dateBirth
      bmi
      health
      goals
      healthy_bmi_range
      Level {
        name
      }
      User {
        fullName
        email
      }
    }
  }
}
`;
