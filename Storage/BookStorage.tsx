import { auth, db } from '../firebase';
import AsyncStorage from '@react-native-community/async-storage';
import { useAtom } from "jotai";
import { atomWithReset, RESET } from "jotai/utils"

// atom decl
export const dataAtom = atomWithReset([] as any)
export const titlesAtom = atomWithReset({} as any)
export const favBooksAtom = atomWithReset([] as any)
export const completedBooksAtom = atomWithReset([] as any)

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
    const [titles, setTitles] = useAtom(titlesAtom)
    const [favBooks, setFavBooks] = useAtom(favBooksAtom)
    const [completedBooks, setCompletedBooks] = useAtom(completedBooksAtom)

    setData(await getStorage("data", []))
    setTitles(await getStorage("titles", {}))
    setFavBooks(await getStorage("favBooks", []))
    setCompletedBooks(await getStorage("completedBooks", []))
}

export async function clearAllStorageData () {
    const [data, setData] = useAtom(dataAtom)
    const [titles, setTitles] = useAtom(titlesAtom)
    const [favBooks, setFavBooks] = useAtom(favBooksAtom)
    const [completedBooks, setCompletedBooks] = useAtom(completedBooksAtom)

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
    const snapshot = await db.collection("Books").get()
    snapshot.forEach((doc:any) => {
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
    const [titles, setTitles] = useAtom(titlesAtom)

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

    setData(data)
    setTitles(titles)
    await setStorage("data", data) 
    await setStorage("titles", titles) 
}

export async function getFavBooks(data:any, titles:any, use_full_data:boolean=false) {
    const [favBooks, setFavBooks] = useAtom(favBooksAtom) 

    if (use_full_data === true) {
        if (favBooks) {
            var arr:any[] = [];
            titles.forEach((value:any, index:number) => {
                if (favBooks.indexOf(value) >= 0) {
                    arr.push(data[index]);
                }
            });
            return arr
        } else {
            return undefined
        }
    } else {
        return favBooks
    }
}

export async function getCompletedBooks(data:any, titles:any, use_full_data:boolean=false) {
    const [completedBooks, setCompletedBooks] = useAtom(completedBooksAtom)
    if (use_full_data === true) {
        
        
        if (completedBooks) {
            var arr:any[] = [];
            titles.forEach((value:any, index:number) => {
                if (completedBooks.indexOf(value) >= 0) {
                    arr.push(data[index]);
                }
            });
            return arr
        } else {
            return undefined
        }
    } else {
        return completedBooks
    }
}

export async function setBookAsComplete(item:any) {
    const [completedBooks, setCompletedBooks] = useAtom(completedBooksAtom)
    completedBooks.push(item.title)
    setCompletedBooks(completedBooks)
    await setStorage("completedBooks", completedBooks)
    return completedBooks
}

export async function removeFromCompleted(item:any) {
    const [completedBooks, setCompletedBooks] = useAtom(completedBooksAtom)    

    const index = completedBooks.indexOf(item.title)
    if (index > -1) {
        completedBooks.splice(index, 1)
        setCompletedBooks(completedBooks)
        await setStorage("completedBooks", completedBooks) 
    }
    return completedBooks
}

export async function addToFav(item:any) {
    const [favBooks, setFavBooks] = useAtom(favBooksAtom)
    favBooks.push(item.title)
    setFavBooks(favBooks)
    await setStorage("favBooks", favBooks)
    return true
}

export async function removeFromFav(item:any) {
    const [favBooks, setFavBooks] = useAtom(favBooksAtom)
    const index = favBooks.indexOf(item.title)
    if (index > -1) {
        favBooks.splice(index, 1)
        setFavBooks(favBooks)
        await setStorage("favBooks", favBooks)
    }
    return false
}

export async function removeFromData(item:any) {
    const [data, setData] = useAtom(dataAtom)
    
    const index = data.indexOf(item.title)
    if (index > -1) {
        data.splice(index, 1)
        setData(data)
    }
}

// ****************************** FIREBASE ******************************
export async function getAdminBooks() {
    const snapshot = await db 
        .collection("BooksReview")
        .get();

    var datas:any = [];

    snapshot.forEach((doc) => {
        datas.push({ ...doc.data(), "isAdmin": true, "id": doc.id });
    });

    return datas
}


export async function uploadBook(item:any, directBook = false) {
    var collectionSelect = "BooksReview"
    if (directBook === true) {
        collectionSelect = "Books"
    }
    let uid = auth.currentUser?.uid;
    const document = db.collection(collectionSelect).doc(item.title + " " + uid!.toString())

    await document.set({ title: item.title, language: item.language, description: item.description, lenPages: Object.keys(item.book).length, source: item.source })

    for (var i = 0; i < Object.keys(item.book).length; i++) {
        const keySet = "page" + (i + 1).toString()
        await document.collection(keySet).doc((i + 1).toString()).set({ value: item.book[i] }).catch((e) => {
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

    const document = db.collection(collectionName).doc(id)
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
        await db
            .collection("BooksReview")
            .doc(id)
            .collection("page" + (i + 1).toString())
            .doc((i + 1).toString())
            .delete()
    }
    await db.collection("BooksReview").doc(id).delete()

    // Then store new set into actual books
    const collectionSelect = "Books"
    let uid = auth.currentUser?.uid;
    const document = db.collection(collectionSelect).doc(item.title + " " + uid!.toString())

    document.set({ title: item.title, language: item.language, description: item.description, source: item.source, lenPages: Object.keys(item.book).length })

    for (var i = 0; i < Object.keys(item.book).length; i++) {
        const keySet = "page" + (i + 1).toString()
        await document.collection(keySet).doc((i + 1).toString()).set({ value: item.book[i] }).catch((e) => {
            i = item.length
        })
        // To avoid writing too much at the same time :)
        await delay(1100)
    }
}