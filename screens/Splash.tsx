import * as React from 'react'
import { auth } from '../firebase'
import {Text, View, StyleSheet, Image} from "react-native"
import { getUserInfoFirebase } from '../Storage/UserStorage'
import { updateAtomData } from '../Storage/BookStorage'

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
        }, {
            translateY: 50
        }]
    }
})

export default function Splash ({navigation}:any) {
    React.useEffect(() => {
        setTimeout(() => {
            auth.onAuthStateChanged(async (user:any) => {
                if (user) {                     // if valid user
                    await getUserInfoFirebase() // sets username, isAdmin, 
                    await updateAtomData();     // sets fav books and data etc.
                    navigation.replace("Tabs")  // navigate to actual home screen
                }
                else navigation.replace("Welcome Screen")       // if invalid user, navigate to log in/sign up screen
            }) }, 3000) // if exceed 3 seconds, then escape
    }, [])  

    return (
        <View style={styles.container}>
           <Image style={styles.image} source={require("../assets/images/RealEduLangLogo.png")} />
           <Text style={styles.text} />
        </View>
    )
}
