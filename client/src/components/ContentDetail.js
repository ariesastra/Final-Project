import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { StyleSheet, View, ScrollView } from "react-native";
import { Text, Box, Pressable, Button, Badge, useToast } from "native-base";

import { useQuery, useMutation } from "@apollo/client";
import { GET_CONTENT_DETAIL, GET_USER_CONTENT_ID } from "../../queries";
import {
  POST_USER_CONTENT,
  UPDATE_STATUS_USER_CONTENT,
  PATCH_LIKE,
} from "../../mutations";
import YoutubePlayer from "react-native-youtube-iframe";

import { Ionicons } from "@expo/vector-icons";
import ErrorPage from "./ErrorPage";
import LoadingPage from "./LoadingPage";

export default function ContentDetail({ navigation, route }) {
  const { id } = route.params;
  const [selected, setSelected] = useState(0);
  const [flaggingData, setFlaggingData] = useState(false);
  const [accesstoken, setAccessToken] = useState("");
  const toast = useToast();

  const getStorage = async () => {
    try {
      const value = await AsyncStorage.getItem("@access_token");
      if (value !== null) {
        setAccessToken(value);
      }
    } catch (e) {
      console.error(e);
    }
  };
  const {
    loading: loadingContent,
    error: errorContent,
    data: ContentData,
  } = useQuery(GET_USER_CONTENT_ID, {
    variables: {
      accessToken: accesstoken,
      contentId: id,
    },
  });

  useEffect(() => {
    getStorage();
    getLike();
  }, []);

  const getLike = async () => {
    try {
      const accesstoken = await AsyncStorage.getItem("@access_token");
      if (!ContentData) {
        setFlaggingData(true);
        if (!flaggingData) {
          await PostUserContent({
            variables: {
              accessToken: accesstoken,
              contentId: id,
            },
          });
          status = "started";
          if (ContentData.getUserContentById.isLike) {
            setSelected(1);
          } else {
            setSelected(0);
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const [
    PostUserContent,
    {
      data: dataPostUserContent,
      loading: loadingPostUserContent,
      error: errorPostUserContent,
    },
  ] = useMutation(POST_USER_CONTENT, {
    refetchQueries: [GET_USER_CONTENT_ID],
  });

  status = "started";

  const [
    PutUserContent,
    {
      data: dataPutUserContent,
      loading: loadingPutUserContent,
      error: errorPutUserContent,
    },
  ] = useMutation(UPDATE_STATUS_USER_CONTENT, {
    refetchQueries: [GET_USER_CONTENT_ID],
  });

  const [
    PatchLike,
    { data: dataPatchLike, loading: loadingPatchLike, error: errorPatchLike },
  ] = useMutation(PATCH_LIKE, {
    refetchQueries: [GET_USER_CONTENT_ID],
  });

  // useEffect(() => {
  //   console.log(status);
  // }, [status]);

  const { loading, error, data } = useQuery(GET_CONTENT_DETAIL, {
    variables: {
      accessToken: accesstoken,
      contentId: id,
    },
  });

  let status;

  if (loading) return <LoadingPage />;
  if (error) return <ErrorPage />;
  // if (loadingContent) return <Text>Loading...</Text>;
  // if (errorContent) return <Text>Error...</Text>;

  const handleFinish = async (e) => {
    e.preventDefault();
    // console.log(ContentData.getUserContentById.status);
    if (ContentData.getUserContentById.status == "started") {
      const statusContent = await PutUserContent({
        variables: {
          accessToken: accesstoken,
          contentId: id,
        },
      });

      console.log(statusContent.data.putUserContent.message, "<<<<<<<<");
      let message = statusContent.data.putUserContent.message;
      toast.show({
        title: "Excellent !",
        description: message,
        placement: "top",
        status: "success",
      });
    }
  };

  if (ContentData.getUserContentById) {
    // console.log("masukk di bawah");
    status = ContentData.getUserContentById.status;
  }

  const handleLike = async (e) => {
    e.preventDefault();
    if (selected == 0) {
      await PatchLike({
        variables: {
          accessToken: accesstoken,
          contentId: id,
        },
      });
      setSelected(1);
    } else {
      await PatchLike({
        variables: {
          accessToken: accesstoken,
          contentId: id,
        },
      });
      setSelected(0);
    }
  };

  // console.log(ContentData);

  const handleIconLike = () => {
    if (ContentData) {
      if (ContentData?.getUserContentById?.isLike == "true") {
        return <Ionicons name="heart" size={26} color="red" />;
      } else {
        return <Ionicons name="heart-outline" size={26} color="red" />;
      }
    } else {
      return <Ionicons name="heart-outline" size={26} color="red" />;
    }
  };

  return (
    <Box height="100%">
      <ScrollView>
        <View>
          <YoutubePlayer
            height={250}
            videoId={data.getContentById.youtubeUrl}
          />
          <View>
            {status == "finish" ? (
              <Badge
                marginLeft="3"
                space={{
                  base: 2,
                  md: 4,
                }}
                mx={{
                  base: "auto",
                  md: 0,
                }}
                colorScheme="success"
              >
                Finish
              </Badge>
            ) : null}
            <View style={styles.containerTitle}>
              <Text style={styles.title}>{data.getContentById.title}</Text>
            </View>
            <Box style={styles.containerLike}>
              <Text style={styles.like}>
                <Pressable onPress={(e) => handleLike(e)}>
                  {handleIconLike()}
                </Pressable>
              </Text>
              {/* <Text style={styles.textLike}>{data.getContentById.likes}</Text> */}
            </Box>

            <Text style={styles.titleDescription}>Description</Text>

            <Text style={styles.description}>
              {data.getContentById.description}
            </Text>
          </View>
        </View>
      </ScrollView>
      <Box style={styles.boxButtonFinish}>
        {status == "started" ? (
          <Button style={styles.buttonFinish} onPress={(e) => handleFinish(e)}>
            Finish
          </Button>
        ) : null}
      </Box>
    </Box>
  );
}

const styles = StyleSheet.create({
  mainPlayerView: {
    flex: 1,
    alignItems: "center",
  },
  containerTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 10,
  },
  title: {
    paddingTop: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: "grey",
    padding: 10,
    textAlign: "justify",
  },
  containerLike: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingRight: 20,
    // bottom: 100,
    // right: 20,
    // position: "absolute",
  },
  like: {
    fontSize: 18,
    fontWeight: "bold",
    color: "grey",
    paddingRight: 5,
    // bottom: -30,
    // right: 45,
    // position: "absolute",
  },
  boxButtonFinish: {
    position: "absolute",
    bottom: 15,
    // top: "58%",
    right: 15,
    alignSelf: "center",
    // width: "80%",
  },
  buttonFinish: {
    marginTop: 10,
  },
  textLike: {
    fontSize: 20,
    // fontWeight: "bold",
    marginTop: 0,
    // bottom: -17,
    // right: 10,
    // position: "absolute",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  titleDescription: {
    marginTop: 10,
    fontWeight: "bold",
    fontSize: 20,
    color: "black",
    padding: 10,
    marginBottom: -12,
  },
  description: {
    marginTop: 5,
    fontSize: 15,
    color: "grey",
    textAlign: "justify",
    padding: 10,
    marginRight: 5,
  },
});
