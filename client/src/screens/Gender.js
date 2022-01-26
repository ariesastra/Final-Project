import { useState } from "react";
import {
  FormControl,
  Button,
  Stack,
  CheckIcon,
  WarningOutlineIcon,
  Box,
  Center,
  NativeBaseProvider,
  Select,
  Heading,
  Text,
} from "native-base";
import { Entypo } from "@expo/vector-icons";

export default function Gender({ navigation, route }) {
  const [gender, setGender] = useState("");
  const { phoneNumber } = route.params.form;
  
  return (
    <NativeBaseProvider>
      <Center flex={1} px="3">
        <Box
          w={{
            base: "90%",
            md: "25%",
          }}
        >
          <Text style={{ textAlign: "center", fontSize: 20, marginBottom: 10 }}>
            What's your gender?
          </Text>
          <FormControl>
            <Stack mx="4">
              <Select
                defaultValue={gender}
                isRequired={true}
                onValueChange={(itemValue) => setGender(itemValue)}
                minWidth="200"
                accessibilityLabel="Choose Service"
                placeholder="Choose Gender"
                _selectedItem={{
                  bg: "teal.600",
                  endIcon: <CheckIcon size={5} />,
                }}
              >
                <Select.Item label="Male" value="male" key={1} />
                <Select.Item label="Female" value="female" key={2} />
              </Select>
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                Gender required.
              </FormControl.ErrorMessage>
            </Stack>
            {gender ? (
              <Button
                size="sm"
                variant={"solid"}
                _text={{
                  color: "#1F2937",
                }}
                style={{
                  marginTop: 10,
                  width: 100,
                  height: 50,
                  alignSelf: "center",
                }}
                px="3"
                onPress={() =>
                  navigation.navigate("DateBirth", {
                    form: { gender, phoneNumber },
                  })
                }
              >
                <Heading color={"white"}>Next</Heading>
              </Button>
            ) : (
              <Button
                size="sm"
                variant={"solid"}
                _text={{
                  color: "#1F2937",
                }}
                colorScheme="gray"
                style={{
                  marginTop: 10,
                  width: 100,
                  height: 50,
                  alignSelf: "center",
                }}
                px="3"
              >
                <Entypo name="block" size={24} color="black" />
              </Button>
            )}
          </FormControl>
        </Box>
      </Center>
    </NativeBaseProvider>
  );
}
