import * as firebase from "firebase";
import axios from "axios";
import { server } from "../Server";
import { useAtom } from "jotai";
import { atomWithReset, RESET } from "jotai/utils"

// atom decl
export const gradeAtom = atomWithReset(-1)
export const nativeLanguageAtom = atomWithReset({} as any)
export const translatedLanguageAtom = atomWithReset({} as any)
export const usernameAtom = atomWithReset("")
export const isAdminAtom = atomWithReset(false)

// user functions from firebase 
export function createUser(email:string, password:string) {
    return new Promise((resolve, reject) => {
        firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(() => {
                resolve("success")
            })
            .catch((re) => {
                reject(re.code)

            });
    })
}

export function loginEmailPassword(email:string, password:string) {
    return new Promise((resolve, reject) => {
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(() => {
                resolve("success")
            })
            .catch((re) => {
                reject(re.code)
            });
    })
};

export async function logoutUserFirebase() {
    return firebase.auth().signOut()
}

export function getUserInfoFirebase() {
    const [grade, setGrade] = useAtom(gradeAtom)    
    const [nativelang, setNativeLanguage] = useAtom(nativeLanguageAtom)
    const [translatedLang, setTranslatedLanguage] = useAtom(translatedLanguageAtom)
    const [username, setUsername] = useAtom(usernameAtom)
    const [isAdmin, setIsAdmin] = useAtom(isAdminAtom)

    return new Promise((resolve, reject) => {
        firebase
            .firestore()
            .collection("userInfo")
            .doc(firebase.auth().currentUser!.uid)
            .onSnapshot(async (snapshot) => {
                if (snapshot) {
                    // Get data from snapshot
                    var grade = snapshot.data()!.grade
                    var nativeLanguage = snapshot.data()?.nativeLanguage
                    var translatedLanguageConfig = snapshot.data()?.translatedLanguageConfig
                    var username = snapshot.data()?.username
                    var isAdmin = snapshot.data()?.isAdmin

                    // Check if variable are undefined and set to default values
                    if (grade == undefined) {
                        await setUserInfo(undefined, undefined, 1, undefined, false)
                        grade = 1
                    }
                    if (nativeLanguage == undefined) {
                        const val = "EN"
                        await setUserInfo(val, undefined, undefined, undefined, false)
                        nativeLanguage = val

                    }
                    if (translatedLanguageConfig == undefined) {
                        const val = "XH"
                        await setUserInfo(undefined, val, undefined, undefined, false)
                        translatedLanguageConfig = val
                    }

                    // set atom types
                    setGrade(grade)                    
                    setNativeLanguage(nativeLanguage)
                    setTranslatedLanguage(translatedLanguageAtom)
                    setUsername(username)
                    setIsAdmin(isAdmin)

                    resolve([grade, nativeLanguage, translatedLanguageConfig, username, isAdmin])
                }
                else {
                    reject("Unable to get snapshot data")
                }
            });
    })
}

export function setUserInfo(nativelanguage:any, translatedlanguage:any, grade:any, username:any, set:boolean = true) {
    const [gradeA, setGrade] = useAtom(gradeAtom)    
    const [nativelang, setNativeLanguage] = useAtom(nativeLanguageAtom)
    const [translatedLang, setTranslatedLanguage] = useAtom(translatedLanguageAtom)
    const [usernameA, setUsername] = useAtom(usernameAtom)
    const [isAdmin, setIsAdmin] = useAtom(isAdminAtom)

    const info = {nativeLanguage: null, translatedLanguageConfig: null, grade: -1, username: "", isAdmin: false}

    if (nativelanguage != undefined && nativelanguage != null) info.nativeLanguage = nativelanguage
    if (translatedlanguage != undefined && translatedlanguage != null) info.translatedLanguageConfig = translatedlanguage
    if (grade != undefined && grade != null) info.grade = grade
    if (username != undefined && username != null) info.username = username
    info.isAdmin = false; // set default as no admin 

    if (set) {
        setGrade(info.grade)
        setNativeLanguage(info.nativeLanguage)
        setTranslatedLanguage(info.translatedLanguageConfig)
        setUsername(info.username)
        setIsAdmin(info.isAdmin)
    }

    return new Promise((resolve, reject) => {
        let uid = firebase.auth()?.currentUser?.uid;
        firebase
            .firestore()
            .collection("userInfo")
            .doc(uid)
            .set(info, {
                merge: true
            })
            .then(() => { resolve("success") })
            .catch((err) => { reject(err) });
    })
}

export const deleteAccount = () => {
    const [gradeA, setGrade] = useAtom(gradeAtom)    
    const [nativelang, setNativeLanguage] = useAtom(nativeLanguageAtom)
    const [translatedLang, setTranslatedLanguage] = useAtom(translatedLanguageAtom)
    const [usernameA, setUsername] = useAtom(usernameAtom)
    const [isAdmin, setIsAdmin] = useAtom(isAdminAtom)

    setGrade(RESET)
    setNativeLanguage(RESET)
    setTranslatedLanguage(RESET)
    setUsername(RESET)
    setIsAdmin(RESET)
   
    return new Promise((resolve, reject) => {
        firebase
            .firestore()
            .collection("userInfo")
            .doc(firebase.auth().currentUser!.uid)
            .delete()
            .then(() => {
                firebase.auth().currentUser!.delete();
                firebase.auth().signOut();
                resolve("Success")
            }).catch((e) => reject(e));
    })
};

export const test_request = async () => {
    const response = await axios({
        method: "post",
        url: `${server}/test`,
    })
    console.log("Test response:", JSON.parse(response.data["response"]))
}