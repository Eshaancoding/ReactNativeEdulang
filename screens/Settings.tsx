import * as React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";
import { setUserInfo } from "../Storage/UserStorage";
import { clearAllStorageData } from "../Storage/BookStorage";
import { deleteAccount } from "../Storage/UserStorage";
import { Box, Heading, Icon, Stack, FormControl, Select, Button, Flex, Spacer } from "native-base";
import { logoutUserFirebase } from "../Storage/UserStorage";
import { MaterialIcons } from "@expo/vector-icons";
import Background from "./components/Background";
import { LanguageSelector } from "./components/LanguageSelector";

export default function Settings({ navigation }: any) {
  // load information
  const { t } = useTranslation();
  const [gradeLevel, setGradeLevel] = useState("0");
  const [nativelanguage, setnativeLanguage] = useState({});
  const [translatedlanguage, setTranslatedLanguage] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // save info
  async function SaveInfo() {
    if (translatedlanguage == nativelanguage) {
      Alert.alert("Translate language and native language cannot be the same!");
    } else {
      await setUserInfo(
        nativelanguage,
        translatedlanguage,
        Number(gradeLevel),
        undefined
      );
      navigation.replace("Splash");
    }
  }

  // delete user
  async function DeleteUser() {
    Alert.alert(
      "Confirm on deleting on your account?",
      "Would you like to delete your account? All storage data (books you have created, favorites, downloaded books, etc.) will be lost forever!",
      [
        {
          text: "Confirm",
          onPress: async () => {
            await clearAllStorageData();
            await deleteAccount();
            navigation.replace("Welcome Screen");
          },
        },
        { text: "Cancel", style: "cancel" },
      ]
    );
  }

  // elements
  return (
    <Box bg="tertiary.100" flex={1}>
      <Heading mt="1/4" ml="4" color="info.400">
        Settings
      </Heading>
      <Background />
      <Box mx="4">
        <FormControl>
          <Stack mt={5} space={2.5} w="100%">
            <FormControl.Label>Select your new grade level:</FormControl.Label>
            {!isLoading && (
              <>
                <Select
                  w={{
                    base: "100%",
                  }}
                  dropdownIcon={
                    <Icon
                      as={<MaterialIcons name="person" />}
                      size={5}
                      ml="2"
                      color="muted.400"
                    />
                  }
                  placeholder="Grade"
                  onValueChange={(value:string) => setGradeLevel(value)}
                  defaultValue={gradeLevel}
                >
                  <Select.Item label="Grade 1" value="1" />
                  <Select.Item label="Grade 2" value="2" />
                  <Select.Item label="Grade 3" value="3" />
                  <Select.Item label="Grade 4" value="4" />
                  <Select.Item label="Grade 5" value="5" />
                </Select>
                <FormControl.Label>
                  Select your translated language:
                </FormControl.Label>
                <LanguageSelector
                  placeholder="Translated Language"
                  onValueChange={setTranslatedLanguage}
                  defaultValue={translatedlanguage}
                />
              </>
            )}
          </Stack>
        </FormControl>

        <Flex marginTop={4} direction="row" justify="center">
          <Button w="1/4" rounded={10} onPress={SaveInfo}>
            {t("general.save")}
          </Button>
          <Spacer />
          <Button
            w="1/4"
            rounded={10}
            onPress={() => {
              logoutUserFirebase().then(() => {
                navigation.replace("Welcome Screen");
              });
            }}
          >
            Logout
          </Button>
          <Spacer />
          <Button w="1/3" rounded={10} onPress={DeleteUser}>
            Delete User
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}
