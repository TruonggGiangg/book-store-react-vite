import { useState, useEffect } from "react";
import { useAppProvider } from "@/components/context/app.context";
import ScaleLoader from "react-spinners/ScaleLoader";
import homeImg from "@/assets/img/1623843888132.png";
import HomeSlider from "@/components/client/home/slider";

const HomePage = () => {
    const { currUser, role } = useAppProvider();
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Opacity sẽ giảm dần từ 1 -> 0 khi cuộn xuống 300px
    const opacity = Math.max(0, 1 - scrollY / 400);

    return (
        <>
            <HomeSlider />
            <div style={{ display: "flex", width: "100%", flexDirection: "column" }}>
                {/* Ảnh có hiệu ứng mờ dần */}


                {/* Nội dung */}
                <div style={{
                    padding: "20px",

                }}>
                    {Array.from({ length: 12 }).map((_, index) => (
                        <div key={index}>
                            {`${role} ${JSON.stringify(currUser)}`}
                            <br />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default HomePage;
