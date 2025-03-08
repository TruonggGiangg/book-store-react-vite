import { useState, useEffect } from "react";
import { useAppProvider } from "@/components/context/app.context";
import ScaleLoader from "react-spinners/ScaleLoader";
import homeImg from "@/assets/img/1623843888132.png";
import HomeSlider from "@/components/client/home/slider";
import { getAllBookApi, getAllCategoryApi } from "@/services/api";
import Container from "@/components/layout/client/container.layout";

const HomePage = () => {
    // const { currUser, role } = useAppProvider();

    const [dataCategory, setDataCategory] = useState<IGetCategories[]>([]);
    const [booksByCategory, setBooksByCategory] = useState<Record<string, IGetBook[]>>({});
    const [loading, setLoading] = useState<boolean>(false);

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
            }

            setLoading(false);

        };
        fetchData();
    }, []);

    return (
        <div style={{ marginTop: '100px' }}>
            <HomeSlider data={dataCategory} setData={setDataCategory} loading={loading} dataBook={booksByCategory} />

            <Container>
                <div style={{ padding: "20px" }}>
                    {dataCategory.map((category) => (
                        <div key={category._id} style={{ marginBottom: "20px" }}>
                            <h2>{category.name}</h2>
                            <div style={{ display: "flex", gap: "10px", overflowX: "auto" }}>
                                {booksByCategory[category._id]?.length > 0 ? (
                                    booksByCategory[category._id].map((book) => (
                                        <div key={book._id} style={{ width: "150px", textAlign: "center" }}>
                                            <img src={`${import.meta.env.VITE_BACKEND_URL}/images/product/${book.logo}`} alt={book.title} style={{ width: "100%", height: "200px", objectFit: "cover" }} />
                                            <p>{book.title}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p>Không có sách nào</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </Container>


        </div >
    );
};

export default HomePage;
