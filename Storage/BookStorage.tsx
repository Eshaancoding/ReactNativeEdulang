import * as firebase from "firebase"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useAtom } from "jotai";
import { atomWithReset, RESET } from "jotai/utils"

// atom decl
export const dataAtom = atomWithReset([] as any)
export const titlesAtom = atomWithReset({} as any)
export const favBooks = atomWithReset([] as any)
export const completedBooks = atomWithReset([] as any)

// ****************************** LOCAL STORAGE ******************************
const getStorage = async (key:string, defaultVal:any=null) => {
    const val = await AsyncStorage.getItem(key) 
    if (val == null || val == undefined) return defaultVal
    return JSON.parse(val)
}

const setStorage = async (key:string, val:any) => {
    await AsyncStorage.setItem(key, JSON.stringify(val))
}

export async function updateAtomData () {
    const [data, setData] = useAtom(dataAtom)
    const [titles, setTitles] = useAtom(dataAtom)
    const [favBooks, setFavBooks] = useAtom(dataAtom)
    const [completedBooks, setCompletedBooks] = useAtom(dataAtom)

    setData(await getStorage("data", []))
    setTitles(await getStorage("titles", {}))
    setFavBooks(await getStorage("favBooks", []))
    setCompletedBooks(await getStorage("completedBooks", []))
}

export async function clearAllStorageData () {
    const [data, setData] = useAtom(dataAtom)
    const [titles, setTitles] = useAtom(dataAtom)
    const [favBooks, setFavBooks] = useAtom(dataAtom)
    const [completedBooks, setCompletedBooks] = useAtom(dataAtom)

    setData(RESET)
    setTitles(RESET)
    setFavBooks(RESET)
    setCompletedBooks(RESET)
    
    await setStorage("data", [])    
    await setStorage("titles", {})    
    await setStorage("favBooks", [])    
    await setStorage("completedBooks", [])    
}

export const getCloudBooks = async (languageFilter:any) => {
    // First get local titles 
    const [titlesLang, setTitlesLang] = useAtom(titlesAtom)

    // Now
    var datas = [] as any
    const snapshot = await firebase.firestore().collection("Books").get()
    snapshot.forEach((doc) => {
        const data = doc.data()
        // Filter out language and check if cloud book is not in local storage
        if ((data.language == languageFilter && !titlesLang.includes(data.title)) || languageFilter == undefined) {
            datas.push({ ...data, id: doc.id, isFromLibrary: true, isAtHome: false })
        }
    })

    return datas
}

export const addBookLocally = async (title:string, description:string, language:any, book:any, imageBase64:any, isFromLibrary = false) => {
    const [data, setData] = useAtom(dataAtom)
    const [titles, setTitles] = useAtom(dataAtom)

    const length = data.length

    const obj = {
        bookId: length,
        title: title,
        language: language,
        description: description,
        source: imageBase64,
        book: book,
        isFromLibrary: isFromLibrary,
        isAtHome: true
    }
    titles.push(title)
    data.push(obj)

    await setStorage("data", data) 
    await setStorage("titles", titles) 
}

// ****************************** FIREBASE ******************************
export async function uploadBook(item:any, directBook = false) {
    var collectionSelect = "BooksReview"
    if (directBook === true) {
        collectionSelect = "Books"
    }
    let uid = firebase.auth()?.currentUser?.uid;
    const document = firebase.firestore().collection(collectionSelect).doc(item.title + " " + uid!.toString())

    await document.set({ title: item.title, language: item.language, description: item.description, lenPages: Object.keys(item.book).length, source: item.source })

    for (var i = 0; i < Object.keys(item.book).length; i++) {
        const keySet = "page" + (i + 1).toString()
        await document.collection(keySet).doc((i + 1).toString()).set({ value: item.book[i] }).catch((e) => {
            console.log(e)
            i = item.length
        })
        // To avoid writing too much at the same time :)
        await delay(1100)
    }
}



export async function getBookPages(id:any, lenPages:number, fromBookReview:boolean= false) {
    var collectionName = "Books"
    if (fromBookReview === true) {
        collectionName = "BooksReview"
    }

    const document = firebase.firestore().collection(collectionName).doc(id)
    const arr = []

    for (var i = 0; i < lenPages; i++) {
        const keySet = "page" + (i + 1).toString()
        const snapshot = await document.collection(keySet).doc((i + 1).toString()).get()
        arr.push(snapshot.data()!["value"])
    }

    return arr
}

export function delay(delayInMS:number) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(2);
        }, delayInMS);
    });
}

export async function acceptBook(item:any) {
    const id = item["id"]
    const lenPages = item["lenPages"]

    // Then delete the data about the selected item
    for (var i = 0; i < lenPages; i++) {
        await firebase.firestore()
            .collection("BooksReview")
            .doc(id)
            .collection("page" + (i + 1).toString())
            .doc((i + 1).toString())
            .delete()
    }
    await firebase.firestore().collection("BooksReview").doc(id).delete()

    // Then store new set into actual books
    const collectionSelect = "Books"
    let uid = firebase.auth()?.currentUser?.uid;
    const document = firebase.firestore().collection(collectionSelect).doc(item.title + " " + uid!.toString())

    document.set({ title: item.title, language: item.language, description: item.description, source: item.source, lenPages: Object.keys(item.book).length })

    for (var i = 0; i < Object.keys(item.book).length; i++) {
        const keySet = "page" + (i + 1).toString()
        await document.collection(keySet).doc((i + 1).toString()).set({ value: item.book[i] }).catch((e) => {
            console.log(e)
            i = item.length
        })
        // To avoid writing too much at the same time :)
        await delay(1100)
    }
}