import React from "react";
import { useMutation } from "@apollo/client";
import { POST_MACRO } from "../../mutations/index";
import { useState, useEffect } from "react";
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
  Text,
  useToast,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  ScrollView,
  Modal,
  HStack,
  VStack,
} from "native-base";
import LoadingPage from "../components/LoadingPage";
import ErrorPage from "../components/ErrorPage";
import { Entypo } from "@expo/vector-icons";

export const Example = ({ navigation }) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [postMacro, {}] = useMutation(POST_MACRO);
  const [showModal, setShowModal] = useState(false);
  const [formMacro, setFormMacro] = useState({
    gender: "",
    age: 0,
    height: 0,
    weight: 0,
    activitylevel: 0,
    goal: "",
  });

  const [resultMacro, setResultMacro] = useState({
    calorie: 0,
    carbs: 0,
    fat: 0,
    protein: 0,
  });

  useEffect(() => {
    // console.log(formMacro);
  }, [formMacro]);

  const onSubmitMacro = async (e) => {
    try {
      e.preventDefault();
      console.log("SUBMIT");
      setLoading(true);
      console.log({ formMacro });
      const sendMacro = await postMacro({
        variables: formMacro,
      });
      console.log(sendMacro);
      setResultMacro({
        calorie: sendMacro.data.postMacro.calorie,
        carbs: sendMacro.data.postMacro.balanced.carbs,
        fat: sendMacro.data.postMacro.balanced.fat,
        protein: sendMacro.data.postMacro.balanced.protein,
      });
      setShowModal(true);
      // toast.show({
      //   title: "Your daily calorie needs",
      //   status: "success",
      //   description: `${sendMacro.data.postMacro.calorie} calories`,
      //   placement: "top",
      // });
    } catch (err) {
      console.log({ err });
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <Center flex={1} px="3">
        <LoadingPage />
      </Center>
    );
  if (error)
    return (
      <Center flex={1} px="3">
        <ErrorPage />
      </Center>
    );
  return (
    <Box
      w={{
        base: "90%",
        md: "25%",
      }}
    >
      <ScrollView>
        <FormControl isRequired onSadmubmit={onSubmitMacro}>
          <Text
            style={{
              textAlign: "center",
              fontSize: 22,
              marginBottom: 15,
              marginTop: 15,
            }}
          >
            Calculate your daily food needs
          </Text>
          <Stack mx="4">
            <FormControl.Label>Gender</FormControl.Label>
            <Select
              onValueChange={(itemValue) =>
                setFormMacro({ ...formMacro, gender: itemValue })
              }
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
            <FormControl.HelperText marginBottom="5">
              Select your gender.
            </FormControl.HelperText>
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              Gender required.
            </FormControl.ErrorMessage>
          </Stack>
          <Stack mx="4">
            <FormControl.Label>Age</FormControl.Label>
            <NumberInput
              min={0}
              max={80}
              onChange={(val) => setFormMacro({ ...formMacro, age: val })}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <FormControl.HelperText marginBottom="5">
              It cannot be negative or bigger than 80.
            </FormControl.HelperText>
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              Age required
            </FormControl.ErrorMessage>
          </Stack>

          <Stack mx="4">
            <FormControl.Label>Height</FormControl.Label>
            <NumberInput
              min={130}
              max={230}
              onChange={(val) => setFormMacro({ ...formMacro, height: val })}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <FormControl.HelperText marginBottom="5">
              It cannot be smaller than 130 or bigger than 230.
            </FormControl.HelperText>
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              Height required.
            </FormControl.ErrorMessage>
          </Stack>

          <Stack mx="4">
            <FormControl.Label>Weight</FormControl.Label>
            <NumberInput
              min={40}
              max={160}
              onChange={(val) => setFormMacro({ ...formMacro, weight: val })}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <FormControl.HelperText marginBottom="5">
              It cannot be smaller than 40 or bigger than 160.
            </FormControl.HelperText>
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              Weight required.
            </FormControl.ErrorMessage>
          </Stack>
          <Stack mx="4">
            <FormControl.Label>Activity Level</FormControl.Label>
            <Select
              onValueChange={(itemValue) =>
                setFormMacro({ ...formMacro, activitylevel: itemValue })
              }
              minWidth="200"
              accessibilityLabel="Choose Service"
              placeholder="Choose Intensity"
              _selectedItem={{
                bg: "teal.600",
                endIcon: <CheckIcon size={5} />,
              }}
            >
              <Select.Item label="BMR" value={1} key={1} />
              <Select.Item
                label="Sedentary: little or no exercise"
                value={2}
                key={2}
              />
              <Select.Item label="Exercise 1-3 times/week" value={3} key={3} />
              <Select.Item label="Exercise 4-5 times/week" value={4} key={4} />
              <Select.Item
                label="Daily exercise or intense exercise 3-4 times/week"
                value={5}
                key={5}
              />
              <Select.Item
                label="Intense exercise 6-7 times/week"
                value={6}
                key={6}
              />
            </Select>
            <FormControl.HelperText marginBottom="5">
              How much u train a week
            </FormControl.HelperText>
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              Activity Level required.
            </FormControl.ErrorMessage>
          </Stack>

          <Stack mx="4">
            <FormControl.Label>Goal</FormControl.Label>
            <Select
              onValueChange={(itemValue) =>
                setFormMacro({ ...formMacro, goal: itemValue })
              }
              minWidth="200"
              accessibilityLabel="What is your goal?"
              placeholder="What is your goal?"
              _selectedItem={{
                bg: "teal.600",
                endIcon: <CheckIcon size={5} />,
              }}
            >
              <Select.Item label="maintain weight" value={1} key="maintain" />
              <Select.Item label="Mild weight loss" value="mildlose" key={2} />
              <Select.Item label="Weight loss" value="weightlose" key={3} />
              <Select.Item
                label="Extreme weight loss"
                value="extremelose"
                key={4}
              />
              <Select.Item label="Mild weight gain" value="mildgain" key={5} />
              <Select.Item label="Weight gain" value="weightgain" key={6} />
              <Select.Item
                label="extremegain"
                value="Extreme weight gain"
                key={7}
              />
            </Select>
            <FormControl.HelperText>Select your goal.</FormControl.HelperText>
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              Goals required.
            </FormControl.ErrorMessage>
          </Stack>
          {formMacro.gender &&
          formMacro.age >= 0 &&
          formMacro.age <= 80 &&
          formMacro.height >= 130 &&
          formMacro.height <= 230 &&
          formMacro.weight >= 40 &&
          formMacro.weight <= 160 &&
          formMacro.activitylevel &&
          formMacro.goal ? (
            <Button
              size="lg"
              variant={"solid"}
              style={{ marginTop: 10 }}
              px="3"
              onPress={onSubmitMacro}
              marginBottom="5"
              colorScheme="lightBlue"
            >
              Submit
            </Button>
          ) : (
            <Button
              size="lg"
              variant={"solid"}
              style={{ marginTop: 10 }}
              px="3"
              marginBottom="5"
              colorScheme="gray"
            >
              <Box style={{ flexDirection: "row", alignItems: "center" }}>
                <Text marginRight={2} fontSize={18}>
                  Submit
                </Text>
                <Entypo name="block" size={20} color="black" />
              </Box>
            </Button>
          )}
        </FormControl>
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <Modal.Content maxWidth="260px">
            <Modal.Header>Result</Modal.Header>
            <Modal.Body>
              <VStack space={5}>
                <HStack alignItems="center" justifyContent="space-between">
                  <Text fontWeight="medium">Total Daily Calorie Intake</Text>
                  <Text color="blueGray.400">{resultMacro.calorie} cal</Text>
                </HStack>
                <HStack alignItems="center">
                  <Text fontWeight="medium">With a balance diet you need:</Text>
                </HStack>
                <HStack alignItems="center" justifyContent="space-between">
                  <Text fontSize="xs">Carbs</Text>
                  <Text color="blueGray.400" fontSize="xs">
                    {resultMacro.carbs} g
                  </Text>
                </HStack>
                <HStack alignItems="center" justifyContent="space-between">
                  <Text fontSize="xs">Fat</Text>
                  <Text color="blueGray.400" fontSize="xs">
                    {resultMacro.fat} g
                  </Text>
                </HStack>
                <HStack alignItems="center" justifyContent="space-between">
                  <Text fontSize="xs">Protein</Text>
                  <Text color="blueGray.400" fontSize="xs">
                    {resultMacro.protein} g
                  </Text>
                </HStack>
              </VStack>
            </Modal.Body>
            <Modal.Footer>
              <Button
                flex={1}
                onPress={() => setShowModal(false)}
                colorScheme="lightBlue"
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      </ScrollView>
    </Box>
  );
};

export default function Macro({ navigation }) {
  return (
    <NativeBaseProvider>
      <Center flex={1} px="3">
        <Example navigation={navigation} />
      </Center>
    </NativeBaseProvider>
  );
}
