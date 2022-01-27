import React, { useState, useEffect } from "react";
import { StyleSheet, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

import {
  Box,
  AspectRatio,
  Image,
  Text,
  IconButton,
  Icon,
  Modal,
  Button,
} from "native-base";

import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useQuery } from "@apollo/client";
import { GET_CONTENT_CARD } from "../../queries";
// import ErrorPage from "../components/errorPage";
import LoadingPage from "./LoadingPage";
import ErrorPage from "./ErrorPage";

export default function ContentHorizontal({ navigation }) {
  const [access_token, setAccessToken] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [subscription, setSubscription] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      const fetchSubs = async () => {
        if (!subscription) {
          const cekSubs = await AsyncStorage.getItem("@subscription");
          setSubscription(cekSubs);
        }
      };
      fetchSubs();
    }, [])
  );

  // Buat narik Access Token
  const getStorage = async () => {
    try {
      const value = await AsyncStorage.getItem("@access_token");
      if (value !== null) {
        // value previously stored
        setAccessToken(value);
      }
    } catch (e) {
      // error reading value
      console.error(e);
    }
  };

  useEffect(() => {
    getStorage();
  }, []);

  const { loading, error, data } = useQuery(GET_CONTENT_CARD, {
    variables: {
      accessToken: access_token,
    },
  });

  if (loading) return <LoadingPage />;
  if (error) return <ErrorPage />;

  const handleSubs = () => {
    navigation.navigate("SubcribePage");
    setShowModal(false);
  };

  console.log(subscription);

  if (subscription) {
    return (
      <FlatList
        horizontal
        data={data.getContents}
        renderItem={({ item }) => {
          return (
            <Box
              w="360"
              h="250"
              rounded="lg"
              overflow="hidden"
              marginTop="3"
              _dark={{
                borderColor: "gray.800",
                backgroundColor: "gray.800",
              }}
              _web={{
                shadow: 2,
                borderWidth: 0,
              }}
              _light={{
                backgroundColor: "primary.50",
              }}
              marginRight="5"
              borderColor="gray.300"
              borderWidth="1"
            >
              <Box h="150" w="500">
                <AspectRatio>
                  <Image
                    h="150"
                    w="400"
                    // maxW="100%"
                    // borderColor="white"
                    borderWidth="1"
                    source={{
                      uri: item.imgThumbnail,
                    }}
                    alt="image"
                  />
                </AspectRatio>
              </Box>

              <Box style={styles.titleContent}>
                <Text style={styles.textContent}>{item.title}</Text>
              </Box>
              <Box style={styles.iconContent}>
                {(() => {
                  if (item.LevelId == 1) {
                    return (
                      <IconButton
                        paddingTop="-5"
                        icon={<Icon as={AntDesign} name="playcircleo" />}
                        borderRadius="full"
                        _icon={{
                          color: "orange.500",
                          size: "md",
                        }}
                        _hover={{
                          bg: "orange.600:alpha.20",
                        }}
                        _pressed={{
                          bg: "orange.600:alpha.20",
                          _icon: {
                            name: "playcircleo",
                          },
                          _ios: {
                            _icon: {
                              size: "lg",
                            },
                          },
                        }}
                        _ios={{
                          _icon: {
                            size: "lg",
                          },
                        }}
                        onPress={() =>
                          navigation.navigate("Content Detail", {
                            id: item.id,
                          })
                        }
                      />
                    );
                  } else {
                    if (subscription == "true") {
                      return (
                        <IconButton
                          paddingTop="-5"
                          icon={<Icon as={AntDesign} name="playcircleo" />}
                          borderRadius="full"
                          _icon={{
                            color: "orange.500",
                            size: "md",
                          }}
                          _hover={{
                            bg: "orange.600:alpha.20",
                          }}
                          _pressed={{
                            bg: "orange.600:alpha.20",
                            _icon: {
                              name: "playcircleo",
                            },
                            _ios: {
                              _icon: {
                                size: "lg",
                              },
                            },
                          }}
                          _ios={{
                            _icon: {
                              size: "lg",
                            },
                          }}
                          onPress={() =>
                            navigation.navigate("Content Detail", {
                              id: item.id,
                            })
                          }
                        />
                      );
                    } else {
                      return (
                        <>
                          <IconButton
                            paddingTop="-5"
                            icon={<Icon as={MaterialIcons} name="lock" />}
                            borderRadius="full"
                            _icon={{
                              color: "gray.500",
                              size: "md",
                            }}
                            _hover={{
                              bg: "orange.600:alpha.20",
                            }}
                            _pressed={{
                              bg: "orange.600:alpha.20",
                              _icon: {
                                name: "lock",
                              },
                              _ios: {
                                _icon: {
                                  size: "lg",
                                },
                              },
                            }}
                            _ios={{
                              _icon: {
                                size: "lg",
                              },
                            }}
                            onPress={() => setShowModal(true)}
                          ></IconButton>
                          <Modal
                            isOpen={showModal}
                            onClose={() => setShowModal(false)}
                          >
                            <Modal.Content maxWidth="300px" maxHeight="200px">
                              <Modal.CloseButton />
                              <Modal.Header>
                                Subscribe to continue
                                <Button
                                  marginTop="2"
                                  onPress={() => handleSubs(false)}
                                >
                                  Join
                                </Button>
                              </Modal.Header>
                            </Modal.Content>
                          </Modal>
                        </>
                      );
                    }
                  }
                })()}
              </Box>
            </Box>
          );
        }}
      ></FlatList>
    );
  } else {
    return <LoadingPage />;
  }
}

const styles = StyleSheet.create({
  titleContent: {
    paddingLeft: 19,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 20,
    marginTop: 10,
  },
  textContent: {
    textAlign: "justify",
  },
  iconContent: {
    bottom: 5,
    right: 5,
    position: "absolute",
    alignItems: "flex-end",
  },
});
