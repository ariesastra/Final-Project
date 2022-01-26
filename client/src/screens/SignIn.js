import { useState, useEffect, Fragment } from "react";
import { useMutation } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Native Base
import {
  Box,
  Text,
  Heading,
  VStack,
  FormControl,
  Input,
  Button,
  HStack,
  Center,
  NativeBaseProvider,
  useToast,
  Alert,
  Spinner,
} from "native-base";

// Component
import { SIGN_IN } from "../../mutations";

export default function SignIn({ navigation, route }) {
  const toast = useToast();
  useEffect(() => {
    if (route.params?.message) {
      toast.show({
        title: "Success Activated Your Account",
        status: "success",
        placement: "top",
        description: "You can sign in to Active8 now",
      });
    }
  }, [route.params]);

  const [signInUser, {}] = useMutation(SIGN_IN);
  const [signIn, setSignIn] = useState({
    email: "",
    password: "",
  });
  const [newError, setNewError] = useState({
    status: "error",
    message: null,
  });
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(true);

  const submitLogin = (e) => {
    e.preventDefault();
    signInUser({
      variables: {
        email: signIn.email,
        password: signIn.password,
      },
    })
      .then((res) => {
        if (res.data?.signInUser?.error === "Please activate your account!") {
          navigation.navigate("Activate", {
            mauAktivasi: res.data.signInUser.error,
          });
        }
        if (res.data?.signInUser?.error) {
          const errors = res.data.signInUser.error;
          setNewError({
            ...newError,
            message: errors,
          });
          setIsLogin(true);
          setTimeout(() => {
            setIsLogin(false);
          }, 3000);
        } else {
          console.log({ SIGNIN: res.data.signInUser });
          const { access_token, isRegister, subscription } =
            res.data?.signInUser;
          storeData("@access_token", access_token);
          storeData("@isRegister", isRegister);
          storeData("@subscription", subscription);
          if (isRegister === "true") {
            navigation.navigate("ContentContainer");
          } else {
            navigation.navigate("UserProfileStack");
          }
        }
      })
      .catch((err) => {
        console.log({ err });
      });
  };

  // Alert Message
  useEffect(async () => {
    // await AsyncStorage.clear();
    if (route.params) {
      setIsLogin(false);
    }
    // Invoking Local Storage
    getStorage();
    setLoading(false);
  }, []);

  // Local Storage
  const storeData = async (name, value) => {
    try {
      await AsyncStorage.setItem(name, value);
      setLoading(false);
    } catch (e) {
      // saving error
      console.error(e);
    }
  };

  const getStorage = async () => {
    try {
      const value = await AsyncStorage.getItem("@access_token");
      if (value !== null) {
        // value previously stored
        const registerStat = await AsyncStorage.getItem("@isRegister");
        setLoading(false);
        if (registerStat === "true") {
          navigation.navigate("ContentContainer");
        } else if (registerStat === "false") {
          navigation.navigate("UserProfileStack");
        } else {
          console.log("stay");
        }
      }
    } catch (e) {
      // error reading value
      console.error(e);
    }
  };

  return (
    <NativeBaseProvider>
      <Center flex={1} px="3">
        {loading ? (
          <HStack space={2} alignItems="center">
            <Spinner accessibilityLabel="Loading posts" />
            <Heading color="primary.500" fontSize="md">
              Loading
            </Heading>
          </HStack>
        ) : (
          <Box safeArea p="2" py="8" w="90%" maxW="290">
            <Heading
              size="2xl"
              fontWeight="600"
              color="coolGray.800"
              _dark={{
                color: "warmGray.50",
              }}
              style={{ textAlign: "center" }}
            >
              Welcome
            </Heading>
            <Heading
              mt="1"
              _dark={{
                color: "warmGray.200",
              }}
              color="coolGray.600"
              fontWeight="medium"
              size="xs"
              style={{ textAlign: "center" }}
            >
              Sign in to Active8!
            </Heading>

            <VStack space={3} mt="5">
              {isLogin ? (
                <Alert w="100%" status={newError.status}>
                  <VStack space={2} flexShrink={1} w="100%">
                    <HStack
                      flexShrink={1}
                      space={2}
                      justifyContent="space-between"
                    >
                      <HStack space={2} flexShrink={1}>
                        <Alert.Icon mt="1" />
                        <Text
                          fontSize="md"
                          textAlign="center"
                          color="coolGray.800"
                        >
                          {newError.message}
                        </Text>
                      </HStack>
                      {/* <TouchableOpacity onPress={() => console.log("CLICKED")}>
                        <IconButton
                          variant="unstyled"
                          icon={<CloseIcon size="3" color="coolGray.600" />}
                        />
                      </TouchableOpacity> */}
                    </HStack>
                  </VStack>
                </Alert>
              ) : (
                route.params && (
                  <Fragment></Fragment>
                  // <Alert w="100%" status={route.params.status}>
                  //   <VStack space={2} flexShrink={1} w="100%">
                  //     <HStack
                  //       flexShrink={1}
                  //       space={2}
                  //       justifyContent="space-between"
                  //     >
                  //       <HStack space={2} flexShrink={1}>
                  //         <Alert.Icon mt="1" />
                  //         <Text
                  //           fontSize="md"
                  //           textAlign="center"
                  //           color="coolGray.800"
                  //         >
                  //           {route.params.message}
                  //         </Text>
                  //       </HStack>
                  //     </HStack>
                  //   </VStack>
                  // </Alert>
                )
              )}
              <FormControl>
                <FormControl.Label>Email</FormControl.Label>
                <Input
                  type="text"
                  name="email"
                  placeholder="input email..."
                  onChangeText={(value) =>
                    setSignIn({ ...signIn, email: value })
                  }
                />
              </FormControl>
              <FormControl>
                <FormControl.Label>Password</FormControl.Label>
                <Input
                  type="password"
                  name="password"
                  placeholder="input password..."
                  onChangeText={(value) =>
                    setSignIn({ ...signIn, password: value })
                  }
                />
              </FormControl>
              <Button
                mt="2"
                colorScheme="lightBlue"
                style={{ marginTop: 25 }}
                onPress={(e) => submitLogin(e)}
              >
                Sign in
              </Button>
              <HStack mt="6" justifyContent="center">
                <Text
                  fontSize="sm"
                  color="coolGray.600"
                  _dark={{
                    color: "warmGray.200",
                  }}
                >
                  Do not have a credentials ?{" "}
                </Text>
                <Text
                  _text={{
                    color: "indigo.500",
                    fontWeight: "medium",
                    fontSize: "sm",
                  }}
                  style={{ color: "indigo" }}
                  onPress={() => navigation.navigate("SignUp")}
                >
                  Sign Up
                </Text>
              </HStack>
            </VStack>
          </Box>
        )}
      </Center>
    </NativeBaseProvider>
  );
}
