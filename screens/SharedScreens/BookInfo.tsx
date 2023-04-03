import { View, TouchableOpacity, Image, StyleSheet, Modal } from "react-native";
import { Box, VStack, Text } from "native-base";
import * as NativeBase from "native-base";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import { useAtom } from "jotai";
import {
    acceptBook,
    favBooksAtom,
    titlesAtom,
    uploadBook,
    removeFromFav,
    addToFav,
    removeFromCompleted,
    removeFromData,
} from "../../Storage/BookStorage";
import { Alert } from "react-native";
import { getBookPages, addBookLocally } from "../../Storage/BookStorage";
import AntDesign from "react-native-vector-icons/AntDesign"
import CustomButton from "../globals/CustomButton";
import { SIZES } from "../../constants";

export default function BookInfo ({ navigation, route }: any) {
    const { t } = useTranslation();
    const [modalVisible, setModalVisible] = useState(false);
    const [isFav, setIsFav] = useState(false);
    const { item } = route.params;
    const isAdmin = Object.keys(item).includes("isAdmin");
    const [modalTitle, setModalTitle] = useState("");
    const isFocused = useIsFocused();
    const [favList, setFavList] = useAtom(favBooksAtom);
    const [titles, setTitles] = useAtom(titlesAtom);

    // check if book is in fav list
    useEffect(() => {
        if (favList.some((book: any) => book === item.title)) setIsFav(true);
    }, [favList]);

    // upload
    async function uploadBookMod() {
        setModalTitle("Uploading to Books Review...");
        setModalVisible(true);
        await uploadBook(item);
        setModalVisible(false);
        navigation.navigate({ name: "Home Screen" });
    }

    // Accept the book
    async function addToBooks() {
        if (item.book == undefined || item.book.length === 0) {
            Alert.alert("You must read the book first before you submit!");
        } else {
            setModalTitle("Accepting Book...");
            setModalVisible(true);
            await acceptBook(item);
            setModalVisible(false);
            navigation.navigate({ name: "Home Screen" });
        }
    }

    // Delete book
    async function deleteBook() {
        await removeFromFav(item);
        await removeFromCompleted(item);
        await removeFromData(item);

        navigation.navigate("Home Screen");
    }

    // downloading book from firebase
    async function downloadBook() {
        // check if we have it
        if (titles.includes(item.title)) {
            Alert.alert("You have already downloaded this book!");
            return;
        }

        // set modal
        setModalTitle("Downloading Book...");
        setModalVisible(true);

        // Download pages if necessary
        if (item.book == undefined || item.book.length === 0)
            item.book = await getBookPages(
                item.id,
                item.lenPages,
                item.isAdmin
            );

        // finally add the book
        await addBookLocally(
            item.title,
            item.description,
            item.language,
            item.book,
            item.source,
            true
        );

        // Navigation
        navigation.navigate("Home Screen");
    }

    // getting pages if user wants to start reading cloud book
    async function StartReading() {
        if (item.book == undefined || item.book.length === 0) {
            setModalTitle("Getting Pages...");
            setModalVisible(true);
            const pages = await getBookPages(
                item.id,
                item.lenPages,
                item.isAdmin
            );
            item.book = pages;
            setModalVisible(false);
        }

        // navigate to book reader
        navigation.navigate("Book Reader", { item: item });
    }

    // Display Icons
    function DisplayIcons(props: any) {
        if (isAdmin) {
            // Return the check
            return (
                <TouchableOpacity>
                    <AntDesign name="check" size={24} onPress={addToBooks} />
                </TouchableOpacity>
            );
        } else {
            // regular user; book from the library or the home page
            return (
                <>
                    {isFav &&
                        item.isAtHome && ( // Display Favorite icon
                            <TouchableOpacity
                                onPress={async () =>
                                    setIsFav(await removeFromFav(item))
                                }
                            >
                                <AntDesign name="heart" size={24} color="red" />
                            </TouchableOpacity>
                        )}
                    {!isFav && item.isAtHome && (
                        <TouchableOpacity
                            onPress={async () => setIsFav(await addToFav(item))}
                        >
                            <AntDesign name="hearto" size={24} color="black" />
                        </TouchableOpacity>
                    )}

                    {/* Display upload button only if it is not in library */}
                    {!item.isFromLibrary && (
                        <TouchableOpacity onPress={uploadBookMod}>
                            <AntDesign
                                style={{ marginLeft: 10 }}
                                name="clouduploado"
                                size={28}
                                color="black"
                            />
                        </TouchableOpacity>
                    )}

                    {/* Delete the book, only if it is not from the library */}
                    {item.isAtHome && (
                        <TouchableOpacity onPress={deleteBook}>
                            <AntDesign
                                style={{ marginLeft: 10, marginTop: 3 }}
                                name="closecircleo"
                                size={23}
                                color="black"
                            />
                        </TouchableOpacity>
                    )}

                    {/* Set the download icon */}
                    {item.isFromLibrary && !item.isAtHome && (
                        <TouchableOpacity onPress={downloadBook}>
                            <AntDesign
                                style={{ marginLeft: 10, marginTop: 3 }}
                                name="download"
                                size={23}
                                color="black"
                            />
                        </TouchableOpacity>
                    )}
                </>
            );
        }
    }

    return (
        <Box bg="tertiary.100" flex={1}>
            <View style={styles.contentContainer}>
                <NativeBase.View>
                    <Text fontSize={32} my={3}>
                        {item.title.replace(new RegExp("_", "g"), " ")}
                    </Text>
                </NativeBase.View>
                <Image
                    source={{ uri: `data:image/jpeg;base64,${item.source}` }}
                    style={{
                        height: 350,
                        width: SIZES.width,
                        resizeMode: "contain",
                    }}
                />
                <Text>Description: {item.description}</Text>
                <View
                    style={{
                        marginTop: 5,
                        alignSelf: "flex-end",
                        flexDirection: "row",
                        paddingHorizontal: 15,
                    }}
                >
                    <DisplayIcons />
                </View>
            </View>
            <VStack mb="40" space={3}>
                <CustomButton
                    title={t("book_info.start_reading")}
                    onPress={() => StartReading()}
                    customWidth="70%"
                />
            </VStack>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
            >
                <View style={styles.modalView}>
                    <Text>{modalTitle}</Text>
                    <View style={{ width: "100%", height: 20 }} />
                </View>
            </Modal>
        </Box>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  contentContainer: {
    flex: 1,

    alignItems: "center",
    marginTop: 5,
  },
  buttonContainer: {
    justifyContent: "flex-end",
    marginBottom: 20,
  },
  loginButtons: {
    alignItems: "center",
    justifyContent: "space-evenly",
    marginBottom: 130,
  },
  modalView: {
    margin: 20,
    marginTop: 60,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
