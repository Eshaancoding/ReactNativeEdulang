import * as React from 'react'
import * as firebase from 'firebase'
import {Text, View, StyleSheet, Image} from "react-native"

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    image: {
        height: "50%",
        width: "50%",
    },
    text: {
        position: "absolute",
        left: '50%',
        top: '50%',
        transform: [{
            translateX: -50, 
            translateY: 50
        }]

        // ADD A FONT PLEASE
    }
})

export default function Splash ({navigation}:any) {
    React.useEffect(() => {
        setTimeout(() => {
            firebase.auth().onAuthStateChanged(async (user) => {
                if (user) navigation.replace("Tabs")            // if valid user, navigate to actual home screen
                else navigation.replace("Welcome Screen")       // if invalid user, navigate to log in/sign up screen
            })
        }, 3000) // if exceed 3 seconds, then escape
    }, [])  

    return (
        <View style={styles.container}>
           <Image style={styles.image} source={require("../assets/images/RealEduLangLogo.png")} />
           <Text style={styles.text} />
        </View>
    )
}
