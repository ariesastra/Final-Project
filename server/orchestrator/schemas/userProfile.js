const { gql } = require("apollo-server");
const axios = require("axios");

const typeDefs = gql`
  type Level {
    id: ID
    name: String
  }
  type UserProfile {
    id: ID
    UserId: ID
    phoneNumber: String
    subscription: String
    gender: String
    dateBirth: String
    LevelId: String
    goals: String
    bmi: String
    health: String
    healthy_bmi_range: String
    createdAt: String
    updatedAt: String
    Level: Level
    User: User
  }

  type Log {
    id: ID
    height: String
    weight: String
    bmi: String
    health: String
    LevelId: ID
    UserId: ID
    createdAt: String
  }

  type ResponUserProfile {
    UserProfile: UserProfile
    Log: Log
  }

  type Query {
    getUserProfile(access_token: String): ResponUserProfile
    getUserLogs(access_token: String): [Log]
  }

  type Mutation {
    postUserProfile(
      access_token: String
      height: Int
      weight: Int
      activityLevel: Int
      phoneNumber: String
      gender: String
      dateBirth: String
      goals: String
    ): Message
    postUserLog(access_token: String, height: Int, weight: Int): Message
    patchUserProfile(access_token: String): Message
  }
`;

const resolvers = {
  Query: {
    getUserProfile: async (_, args) => {
      try {
        const { access_token } = args;
        const { data: user } = await axios.get(
          "http://localhost:3000/api/user-profiles",
          { headers: { access_token } }
        );
        return user;
      } catch (err) {
        return err;
      }
    },
    getUserLogs: async (_, args) => {
      try {
        const { access_token } = args;
        const { data: logs } = await axios.get(
          "http://localhost:3000/api/log-history",
          { headers: { access_token } }
        );
        return logs;
      } catch (err) {
        return err;
      }
    },
  },
  Mutation: {
    postUserProfile: async (_, args) => {
      try {
        const { access_token } = args;
        const { data } = await axios.post(
          "http://localhost:3000/api/user-profiles",
          args,
          { headers: { access_token } }
        );
        // console.log(data);
        return { message: data.message };
      } catch (err) {
        return { error: [err.response.data.error] };
      }
    },
    postUserLog: async (_, args) => {
      try {
        const { access_token } = args;
        const { data } = await axios.post(
          "http://localhost:3000/api/log-history",
          args,
          { headers: { access_token } }
        );
        return { message: "Your latest body development has been added" };
      } catch (err) {
        return { error: ["Error create post user log"] };
      }
    },
    patchUserProfile: async (_, args) => {
      try {
        const { access_token } = args;
        const { data } = await axios.patch(
          "http://localhost:3000/api/user-profiles/updateSubs",
          null,
          {
            headers: { access_token },
          }
        );
        return { message: data.message };
      } catch (err) {
        return { error: err.response.data.error };
      }
    },
  },
};

module.exports = { typeDefs, resolvers };
