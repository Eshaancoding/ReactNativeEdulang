import { AntDesign } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { Dimensions, Image } from "react-native";
import { Center } from "native-base";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";

export default function BookReader({ route }: any) {
    const { item } = route.params;
    const [page, setPage] = useState(0);
    const [leftButtonDisabled, setLeftButtonDisabled] = useState(true);
    const [rightButtonDisabled, setRightButtonDisabled] = useState(false);
    const [height, setHeight] = useState(100);
    const lenPages = Object.keys(item.book).length;

    // determine screen orientation
    const [orientation, setOrientation] = useState("POTRAIT");
    function determineAndSetOrien() {
        let width = Dimensions.get("window").width;
        let height = Dimensions.get("window").height;
        if (width < height) setOrientation("POTRAIT");
        else setOrientation("LANDSCAPE");
    }

    useEffect(() => {
        determineAndSetOrien();
        Dimensions.addEventListener("change", determineAndSetOrien);
    }, []);

    useEffect(() => {
        Image.getSize(
            "data:image/png;base64,${item.book[0]}",
            (width: number, height: number) => {
                const div = height / width;
                const windowWidth = Dimensions.get("window").width;
                setHeight(Math.floor(windowWidth * div));
            }
        );

        setLeftButtonDisabled(true);
        setLeftButtonDisabled(false);
        if (lenPages === 1) {
            setLeftButtonDisabled(true);
            setLeftButtonDisabled(true);
        }
    }, [Dimensions.get("window")]);

    function changePage(increment: boolean) {
        var new_page = 0;
        if (increment && page < lenPages) {
            setPage((page) => page + 1);
            new_page = page + 1;
        } else if (!increment && page > 0) {
            setPage((page) => page - 1);
            new_page = page - 1;
        }
        if (lenPages == 1) {
            setLeftButtonDisabled(true);
            setRightButtonDisabled(true);
        } else if (new_page <= 0) {
            setLeftButtonDisabled(true);
            setRightButtonDisabled(false);
        } else if (new_page >= lenPages - 1) {
            setLeftButtonDisabled(false);
            setRightButtonDisabled(true);
        } else {
            setLeftButtonDisabled(false);
            setRightButtonDisabled(false);
        }
    }

    const images = [
        {
            url: `data:image/jpeg;base64,${item.book[page]}`,
        },
    ];

    if (orientation == "PORTRAIT") {
        return (
            <>
                <View style={styles.container}>
                    <ImageViewer
                        style={{
                            width: "100%",
                            height: height,
                        }}
                        imageUrls={images}
                        backgroundColor="#FFFFFF"
                    />
                </View>

                <View style={styles.bar}>
                    <View
                        style={{
                            flex: 1,
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <TouchableOpacity
                            disabled={leftButtonDisabled}
                            style={styles.Button}
                            onPress={() => changePage(false)}
                        >
                            <AntDesign
                                name="arrowleft"
                                size={24}
                                color={leftButtonDisabled ? "grey" : "black"}
                            />
                        </TouchableOpacity>
                        <Text style={styles.PageNumDisplay}>
                            Page {page + 1}/{lenPages}
                        </Text>
                        <TouchableOpacity
                            disabled={rightButtonDisabled}
                            style={styles.Button}
                            onPress={() => changePage(true)}
                        >
                            <AntDesign
                                name="arrowright"
                                size={24}
                                color={rightButtonDisabled ? "grey" : "black"}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </>
        );
    } else {
        return (
            <Center>
                <View
                    style={{
                        width: "90%",
                        height: "100%",
                        alignItems: "center",
                        paddingBottom: 10,
                    }}
                >
                    <View style={styles.horizontalContainer}>
                        <TouchableOpacity
                            disabled={leftButtonDisabled}
                            style={styles.Button}
                            onPress={() => changePage(false)}
                        >
                            <AntDesign
                                name="arrowleft"
                                size={24}
                                color={leftButtonDisabled ? "grey" : "black"}
                            />
                        </TouchableOpacity>
                        <ImageViewer
                            style={{
                                width: "100%",
                                height: "100%",
                            }}
                            imageUrls={images}
                            backgroundColor="#FFFFFF"
                        />
                        <TouchableOpacity
                            disabled={rightButtonDisabled}
                            style={styles.Button}
                            onPress={() => changePage(true)}
                        >
                            <AntDesign
                                name="arrowright"
                                size={24}
                                color={rightButtonDisabled ? "grey" : "black"}
                            />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.PageNumDisplay}>
                        Page {page + 1}/{lenPages}
                    </Text>
                </View>
            </Center>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
  },
  bar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: 100,
    backgroundColor: "white",
  },
  Button: {
    padding: 15,
  },
  PageNumDisplay: {
    fontSize: 15,
  },
  horizontalContainer: {
    width: "100%",
    height: "100%",
    paddingBottom: 10,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  }
});

