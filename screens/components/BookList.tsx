import React, { useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { View, Box, AspectRatio, Image, Text, Center, Pressable  } from "native-base";
const BookList = ({ navigation, item, NoMessage, isLoading}:any) => {
  const renderItem = ({item, index}:any) => {
    return (
      <View m={3} h="200" w="160" shadow={8} >
        <Pressable
          onPress={(e) => {
            navigation.navigate("Book Info", { item: item });
          }}
        >
          <Box bg="gray.50" h="160" borderRadius={15} overflow="hidden" justifyContent={"center"}>
            <AspectRatio w="90%" h="70%">
              <Image
                source={{
                  uri: `data:image/jpeg;base64,${item.source}`,
                }}
                alt="image"
              />
            </AspectRatio>
          </Box>
          <Text style={{ marginTop: 15, textAlign: 'center' }}>{item.title.replace(new RegExp("_", 'g'), " ")}</Text>

        </Pressable>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          height: 100,
        }}
      >
        <ActivityIndicator size={"large"} />
      </View>
    );
  } else if (item.length == 0) {
    return (
      <Center _text={{ textAlign: "center", marginX: 7 }} w="100%" h="100px">
        {NoMessage}
      </Center>
    );
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          style={{ marginTop: 20 }}
          contentContainerStyle={{ flexDirection: 'column', alignItems: 'center' }}
          showsHorizontalScrollIndicator={false}
          data={item}
          renderItem={renderItem}
          numColumns={2}
        />
      </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
  item: {
    marginHorizontal: 10,
    marginVertical: 5,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    marginBottom: 100
  },
  text: {
    textAlign: "center",
    paddingLeft: 30,
    paddingRight: 30,
  },
  image: {
    resizeMode: "contain",
    width: 150,
    height: 170,
    borderRadius: 15,
    overflow: "hidden",
  },
  ImageContainer: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    marginBottom: 5,
  },
});

export default BookList;