import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" }); // hoặc "auto" nếu muốn cuộn ngay lập tức
    }, [pathname]);

    return null;
};

export default ScrollToTop;
