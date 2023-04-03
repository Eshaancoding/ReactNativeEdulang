import { useState } from "react";
import { Header } from "../components/Header";
import { HeaderSection } from "../components/HeaderSection";
import BookList from "../components/BookList";
import { useEffect } from "react";
import { getCloudBooks } from "../../Storage/BookStorage";
import { useIsFocused } from "@react-navigation/native";
import FeedbackModal from "../components/FeedBackModal";
import Background from "../components/Background";
import { Box } from "native-base";
import { useAtom } from "jotai";
import { translatedLanguageAtom } from "../../Storage/UserStorage";

export default function LibraryHome ({ navigation, route }: any) {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("")
    const [searchData, setSearchData] = useState([]);
    const [feedbackModal, setfeedbackModal] = useState(false);
    const [translatedLanguage, setTranslatedLanguage] = useAtom(translatedLanguageAtom)
    const isFocused = useIsFocused();

    // get 
    useEffect(() => {
        async function asyncFunc () {
            const data = await getCloudBooks(translatedLanguage)
            setData(data)
            searchBarChange(data, search)
            setIsLoading(false)
        }
        asyncFunc()
    }, [isFocused, translatedLanguage])        

    // update based on search 
    function searchBarChange (dataSearch:any, text:string) {
        setSearch(text)
        dataSearch.filter((book:any) => {
            return book.title.toLowerCase().includes(text.toLowerCase());
        }) 
    }

    // elements
    return (
        <Box bg="tertiary.100" flex={1}>
        <HeaderSection title="Library Books" />
        <Background />
        <Header
            smallMarginTop
            title="Library"
            onSearchBarChange={(text:string) => searchBarChange(data, text)}
            onFeedbackPress={() => setfeedbackModal(true)}
        />

        <BookList
            item={searchData}
            navigation={navigation}
            NoMessage="No library books found at the moment."
            isLoading={isLoading}
        />

        <FeedbackModal
            visible={feedbackModal}
            hideModal={() => setfeedbackModal(false)}
        />
        </Box>
    )
};
