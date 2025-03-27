import { useState, useEffect } from "react";
import { useAppProvider } from "@/components/context/app.context";
import ScaleLoader from "react-spinners/ScaleLoader";
import homeImg from "@/assets/img/1623843888132.png";
import HomeSlider from "@/components/client/home/slider";
import { getAllBookApi, getAllCategoryApi, getAllEventApi } from "@/services/api";
import Container from "@/components/layout/client/container.layout";
import EventHome from "@/components/client/home/envent";
import Product from "@/components/client/home/product";

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
    const [loadingExtra, setLoadingExtra] = useState<boolean>(false);



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
        const fetchCategories = async () => {
            setLoadingCategories(true);
            const res = await getAllCategoryApi('isBook=true');
            if (res.data) {
                const categories = res.data.result;
                setDataCategory(categories);
            }
            setLoadingCategories(false);
        };


        const fetchEvents = async () => {
            setLoadingEvents(true);
            const resEvent = await getAllEventApi('current=1&pageSize=4&sort=-createdAt');
            if (resEvent.data) {
                setDataEvent(resEvent.data.result);
            }
            setLoadingEvents(false);
        };

        const fetchExtraData = async () => {
            setLoadingExtra(true);
            try {
                const [hotBooks, newBooks, hotTools] = await Promise.all([
                    getAllBookApi('current=1&pageSize=12&sort=-sold&isBook=true'),
                    getAllBookApi('current=1&pageSize=12&sort=-createdAt&isBook=true'),
                    getAllBookApi('current=1&pageSize=12&sort=-sold&isBook=false')
                ]);
                if (hotBooks.data) setDataBookHot(hotBooks.data.result);
                if (newBooks.data) setDataBookNew(newBooks.data.result);
                if (hotTools.data) setDataToolsHot(hotTools.data.result);
            } catch (error) {
                console.error("Error fetching extra book data", error);
            }
            setLoadingExtra(false);
        };

        const fetchData = async () => {
            await fetchCategories();
            await fetchEvents();
            await fetchExtraData();
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (dataCategory.length > 0) {
            fetchBooks(dataCategory);
        }
    }, [dataCategory]);

    return (
        <div style={{ marginTop: '100px' }}>
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
                loadingExtra={loadingExtra}
            />
        </div>
    );
};

export default HomePage;
