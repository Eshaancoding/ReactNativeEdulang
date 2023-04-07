import React, {useState} from "react"
import { Box } from "native-base"
import { useTranslation } from "react-i18next"
import { dataAtom } from "../../Storage/BookStorage";
import { usernameAtom } from "../../Storage/UserStorage";
import { useAtom } from "jotai";
import { useIsFocused } from "@react-navigation/native";
import { Header } from "../components/Header";
import { HeaderSection } from "../components/HeaderSection";
import Background from "../components/Background";
import BookList from "../components/BookList";
import FeedbackModal from "../components/FeedBackModal";

export default function Home ({navigation}:any) {
    const {t} = useTranslation() ;
    const [username, setUsername] = useAtom(usernameAtom)
    const [data, setData] = useAtom(dataAtom)
    const [searchData, setSearchData] = useState([]);
    const [isLoading, setIsLoading] = useState(true)
    const [fbModal, setfeedbackModal] = useState(false)
    const [text, setText] = useState("")
    const isFocused = useIsFocused();

    // update information
    React.useEffect(() => {
        updateSearchData(data, text);
    }, [text, isFocused, data])    

    // Update search data when changed 
    function updateSearchData (dataFilter:any, t:string) {
        setText(t)
        if (t === "")
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
                onSearchBarChange={(t:string) => updateSearchData(data, t)}
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