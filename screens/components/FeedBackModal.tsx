import React, { useState } from "react";
import {
  View,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  Alert,
} from "react-native";
import {auth, db} from "../../firebase"
import CustomButton from "../globals/CustomButton";
import { Center, VStack } from "native-base";

const FeedbackModal = ({ visible, hideModal }:any) => {
  const [feedbackText, setfeedbackText] = useState("");

  const SubmitFeedback = () => {
    if (feedbackText == "") {
      Alert.alert("Please enter feedback!")
    } else {
      auth.onAuthStateChanged((user) => {
        if (user) {
          db
            .collection("feedbacks")
            .add({
              userEmail: user.email,
              feedback: feedbackText,
              timeStampp: Date.now(),
            })
            .then(() => {
              Alert.alert("Feedback sent.")
              hideModal();
            })
            .catch((err) => {
              Alert.alert(err);
            });
        }
      });
    }
  };

  return (
    <Modal transparent onRequestClose={hideModal} visible={visible}>
      <Center mt="3/6">
        <View style={styles.modalView}>
          <Text style={{ alignSelf: "center", margin: 10 }}>
            Submit your feedback for our app!
          </Text>
          <TextInput
            onChangeText={setfeedbackText}
            style={styles.textinput}
            textAlignVertical="top"
            multiline
            placeholder="Enter here"
          />

          <VStack space={3}>
            <CustomButton title="Cancel" onPress={hideModal} />
            <CustomButton title="Submit" onPress={SubmitFeedback} />
          </VStack>
        </View>
      </Center>
    </Modal>
  );
};
export default FeedbackModal;

const styles = StyleSheet.create({
  modalView: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 7,
  },
  textinput: {
    margin: 10,

    padding: 10,
    width: "90%",
    height: 100,
    backgroundColor: "#eee",
  },
  buttonStyle: {
    borderRadius: 4,
    padding: 10,
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6aa598",
    // marginHorizontal: 20,
  },
});
