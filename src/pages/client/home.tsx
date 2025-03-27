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
    const [loading, setLoading] = useState<boolean>(false);

    const [dataEvent, setDataEvent] = useState<IGetEvent[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const res = await getAllCategoryApi('isBook=true');
            if (res.data) {
                const categories = res.data.result;
                setDataCategory(categories);

                // Lấy danh sách sách theo từng category
                const booksData: Record<string, IGetBook[]> = {};
                await Promise.allSettled(
                    categories.map(async (category) => {
                        try {
                            const booksRes = await getAllBookApi(
                                `current=1&pageSize=4&attributes.classification=/${category._id}/i`
                            );
                            if (booksRes.data) {
                                booksData[category._id] = booksRes.data.result || []; // Đảm bảo luôn có mảng
                            }
                        } catch (error) {
                            console.error(`Error fetching books for category ${category._id}`, error);
                            booksData[category._id] = []; // Tránh lỗi nếu API thất bại
                        }
                    })
                );
                setBooksByCategory(booksData);


                const resEvent = await getAllEventApi('current=1&pageSize=4&sort=-createdAt');
                if (resEvent.data) {
                    setDataEvent(resEvent.data.result);
                }

            }

            setLoading(false);

        };
        fetchData();
    }, []);

    return (
        <div style={{ marginTop: '100px' }}>
            <HomeSlider
                data={dataCategory}
                setData={setDataCategory}
                loading={loading}
                dataBook={booksByCategory}
            />

            <EventHome
                dataEvent={dataEvent}
                loading={loading}
            />

            <Product
                loading={loading}
                dataBook={booksByCategory}
            >

            </Product>



        </div >
    );
};

export default HomePage;
