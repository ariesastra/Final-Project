import { useState } from "react";
import {
  FormControl,
  Button,
  Stack,
  WarningOutlineIcon,
  Box,
  Center,
  NativeBaseProvider,
  Heading,
  Text,
} from "native-base";
import DatePicker from "react-native-datepicker";
import { Entypo } from "@expo/vector-icons";

export default function DateBirth({ navigation, route }) {
  const [dateBirth, setDateBirth] = useState("");
  const { phoneNumber, gender } = route.params.form;

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
            When's your birthday?
          </Text>
          <FormControl>
            <Stack mx="4">
              <DatePicker
                style={{ width: 300 }}
                date={dateBirth}
                mode="date"
                placeholder="select date"
                format="DD-MM-YYYY"
                minDate="01-01-1950"
                maxDate={new Date()}
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{
                  dateIcon: {
                    position: "absolute",
                    left: 0,
                    top: 4,
                    marginLeft: 0,
                  },
                  dateInput: {
                    marginLeft: 36,
                  },
                }}
                onDateChange={(date) => {
                  setDateBirth(date);
                }}
              />
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                dateBirth required
              </FormControl.ErrorMessage>
            </Stack>
            {dateBirth.length == 10 ? (
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
                  navigation.navigate("Height", {
                    form: { dateBirth, phoneNumber, gender },
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
