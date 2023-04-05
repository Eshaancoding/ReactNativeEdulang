import * as React from 'react'
import { auth } from '../firebase'
import {Text, View, StyleSheet, Image} from "react-native"
import { getUserInfoFirebase } from '../Storage/UserStorage'
import { updateAtomData } from '../Storage/BookStorage'
import Background from './components/Background'
import Animated, {useAnimatedStyle} from 'react-native-reanimated'

const styles = StyleSheet.create({
    bg: {
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    image: {
        height: 300,
        width: 250,
    },
    text: {
        position: 'absolute',
        color: 'black',
        fontSize: 20,
        bottom: 30,
        textAlign: 'center',
        width: '100%',
        fontFamily: 'Inter-V'
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
        <View>
            <Background />
            <View style={styles.bg}>
                <Image resizeMode="cover" style={styles.image} source={require("../assets/images/RealEduLangLogo.png")} />
            </View>
            <Text style={styles.text}>Loading...</Text>
        </View>
    )
}
