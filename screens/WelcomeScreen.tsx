import React, {useState} from "react"
import { Box } from "native-base"
import { useTranslation } from "react-i18next"
import { dataAtom } from "../Storage/BookStorage";
import { usernameAtom, isAdminAtom, getUserInfoFirebase } from "../Storage/UserStorage";
import { useAtom } from "jotai";
import { useIsFocused } from "@react-navigation/native";
import { updateAtomData } from "../Storage/BookStorage";
import { Header } from "./components/Header";
import { HeaderSection } from "./components/HeaderSection";
import Background from "./components/Background";
import BookList from "./components/BookList";
import FeedbackModal from "./components/FeedBackModal";

export default function Home ({navigation}:any) {
    const {t} = useTranslation() ;
    const [username, setUsername] = useAtom(usernameAtom)
    const [data, setData] = useAtom(dataAtom)
    const [searchData, setSearchData] = useState([]);
    const [isLoading, setIsLoading] = useState(true)
    const [fbModal, setfeedbackModal] = useState(false)
    const isFocused = useIsFocused();

    // update information
    React.useEffect(() => {
        async function update () {
            await getUserInfoFirebase() // sets username, isAdmin, 
            await updateAtomData();     // sets fav books and data etc.
            setIsLoading(false)         // set is loading to false
            updateSearchData(data, ""); // update search data (no search results yet so just copy all data)
        }
        update()
    }, [isFocused])    

    // Update search data when changed 
    function updateSearchData (dataFilter:any, text:string) {
        if (text === "")
            setSearchData(dataFilter)    
        else
            setSearchData(dataFilter.filter((book:any) => {
                return book.title.toLowerCase().includes(text.toLowerCase())
            })) 
    }

    // elements
    return (
        <Box bg="tertiary.100" flex={1}>
            <Background />
            <Header 
                title={`${t("home.welcome")} ${username}`}
                onSearchBarChange={(text:string) => updateSearchData(data, text)}
                onFeedbackPress={() => setfeedbackModal(true)}
            />
            <HeaderSection
                title="Books"
                buttonTitle="Add Book"
                onButtonClick={() => {
                    navigation.navigate({
                        name: "Add Book: Info",
                        params: { navigateTo: "Live Translation" },
                    });
                }}
            />
            <BookList
                item={searchData}
                navigation={navigation}
                NoMessage="No books found. Add a book from library or add a custom book!"
                isLoading={isLoading}
            />

            <FeedbackModal
                visible={fbModal}
                hideModal={() => setfeedbackModal(false)}
            />
        </Box>
    )
}