import { useState, useEffect } from "react";
import HomeSlider from "@/components/client/home/slider";
import { getAllBookApi, getAllCategoryApi, getAllEventApi } from "@/services/api";
import EventHome from "@/components/client/home/envent";
import Product from "@/components/client/home/product";
import Container from "@/components/layout/client/container.layout";
import { Breadcrumb } from "antd";

const HomePage = () => {
    // const { currUser, role } = useAppProvider();

    const [dataCategory, setDataCategory] = useState<IGetCategories[]>([]);
    const [booksByCategory, setBooksByCategory] = useState<Record<string, IGetBook[]>>({});
    const [dataEvent, setDataEvent] = useState<IGetEvent[]>([]);
    const [dataBookHot, setDataBookHot] = useState<IGetBook[]>([]);
    const [dataBookNew, setDataBookNew] = useState<IGetBook[]>([]);
    const [dataToolsHot, setDataToolsHot] = useState<IGetBook[]>([]);

    const [loadingCategories, setLoadingCategories] = useState<boolean>(false);
    const [loadingBooks, setLoadingBooks] = useState<boolean>(false);
    const [loadingEvents, setLoadingEvents] = useState<boolean>(false);
    const [loadingHotBook, setLoadingHotBook] = useState<boolean>(false);
    const [loadingNewBook, setLoadingNewBook] = useState<boolean>(false);
    const [loadingHotTool, setLoadingHotTool] = useState<boolean>(false);




    const fetchBooks = async (categories: IGetCategories[]) => {
        setLoadingBooks(true);
        const booksData: Record<string, IGetBook[]> = {};
        await Promise.allSettled(
            categories.map(async (category) => {
                try {
                    const booksRes = await getAllBookApi(
                        `current=1&pageSize=4&sort=-sold&attributes.classification=/${category._id}/i`
                    );
                    if (booksRes.data) {
                        booksData[category._id] = booksRes.data.result || [];
                    }
                } catch (error) {
                    console.error(`Error fetching books for category ${category._id}`, error);
                    booksData[category._id] = [];
                }
            })
        );
        setBooksByCategory(booksData);
        setLoadingBooks(false);
    };

    useEffect(() => {
        const fetchEvents = async () => {
            setLoadingEvents(true);
            const resEvent = await getAllEventApi('current=1&pageSize=4&sort=-createdAt');
            if (resEvent.data) {
                setDataEvent(resEvent.data.result);
            }
            setLoadingEvents(false);
        };
        fetchEvents();
    }, [])


    useEffect(() => {


    }, [])


    useEffect(() => {
        const fetchCategories = async () => {
            setLoadingCategories(true);
            const res = await getAllCategoryApi('isBook=true');
            if (res.data) {
                const categories = res.data.result;
                setDataCategory(categories);
            }
            setLoadingCategories(false);
        };
        fetchCategories()
    }, [])


    // Fetch Hot Books
    useEffect(() => {
        const fetchHotBooks = async () => {
            setLoadingHotBook(true);
            try {
                const hotBooks = await getAllBookApi('current=1&pageSize=12&sort=-sold&isBook=true');
                if (hotBooks.data) setDataBookHot(hotBooks.data.result);
            } catch (error) {
                console.error("Error fetching hot books", error);
            }
            setLoadingHotBook(false);
        };
        fetchHotBooks();
    }, []);

    // Fetch New Books
    useEffect(() => {
        const fetchNewBooks = async () => {
            setLoadingNewBook(true);
            try {
                const newBooks = await getAllBookApi('current=1&pageSize=12&sort=-createdAt&isBook=true');
                if (newBooks.data) setDataBookNew(newBooks.data.result);
            } catch (error) {
                console.error("Error fetching new books", error);
            }
            setLoadingNewBook(false);
        };
        fetchNewBooks();
    }, []);

    // Fetch Hot Tools
    useEffect(() => {
        const fetchHotTools = async () => {
            setLoadingHotTool(true);
            try {
                const hotTools = await getAllBookApi('current=1&pageSize=12&sort=-sold&isBook=false');
                if (hotTools.data) setDataToolsHot(hotTools.data.result);
            } catch (error) {
                console.error("Error fetching hot tools", error);
            }
            setLoadingHotTool(false);
        };
        fetchHotTools();
    }, []);

    useEffect(() => {
        if (dataCategory.length > 0) {
            fetchBooks(dataCategory);
        }
    }, [dataCategory]);

    return (
        <div style={{ marginTop: '100px' }}>
            <Container>
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <Breadcrumb style={{ marginBottom: "16px" }}>
                        <Breadcrumb.Item>
                            Trang chủ
                        </Breadcrumb.Item>

                    </Breadcrumb>
                    <HomeSlider
                        data={dataCategory}
                        setData={setDataCategory}
                        loading={loadingCategories}
                        dataBook={booksByCategory}
                    />

                    <EventHome
                        dataEvent={dataEvent}
                        loading={loadingEvents}
                    />

                    <Product
                        loading={loadingBooks}
                        dataBook={booksByCategory}
                        dataCategory={dataCategory}
                        dataBookHot={dataBookHot}
                        dataBookNew={dataBookNew}
                        dataToolsHot={dataToolsHot}
                        loadingHotBook={loadingHotBook}
                        loadingNewBook={loadingNewBook}
                        loadingHotTool={loadingHotTool}
                    />
                </div>

            </Container>

        </div>
    );
};

export default HomePage;
