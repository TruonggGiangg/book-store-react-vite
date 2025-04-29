import { useRef, useState, useEffect } from "react";
import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import { useAppProvider } from "@/components/context/app.context";

const ThemeToggle = () => {
    const { isDarkTheme, setIsDarkTheme } = useAppProvider();
    const [iconAnimating, setIconAnimating] = useState(false);
    const [rippleVisible, setRippleVisible] = useState(false);
    const [rippleStyle, setRippleStyle] = useState({});
    const buttonRef = useRef<HTMLLabelElement>(null);

    // Đọc trạng thái theme từ localStorage khi component load
    useEffect(() => {
        const savedTheme = localStorage.getItem("isDarkTheme");
        if (savedTheme) {
            setIsDarkTheme(JSON.parse(savedTheme)); // Đọc giá trị và set lại theme
        }
    }, [setIsDarkTheme]);

    const toggleTheme = (e: React.MouseEvent<HTMLLabelElement>) => {
        const newTheme = !isDarkTheme;
        setIsDarkTheme(newTheme); // Cập nhật trạng thái theme

        // Lưu trạng thái theme vào localStorage
        localStorage.setItem("isDarkTheme", JSON.stringify(newTheme));

        setIconAnimating(true);

        setTimeout(() => {
            setIconAnimating(false);
        }, 600); // Kết thúc hiệu ứng sau 600ms

        // Lấy vị trí click
        const { clientX, clientY } = e;
        const rippleSize = Math.max(window.innerWidth, window.innerHeight) * 2;

        setRippleStyle({
            width: `${rippleSize}px`,
            height: `${rippleSize}px`,
            left: `${clientX - rippleSize / 2}px`,
            top: `${clientY - rippleSize / 2}px`,
            transform: "scale(0)",
            opacity: 1
        });

        setRippleVisible(true);

        setTimeout(() => {
            setRippleStyle((prev) => ({ ...prev, transform: "scale(1.5)", opacity: 0 }));
        }, 10);

        setTimeout(() => {
            setRippleVisible(false);
        }, 600);
    };

    return (
        <div style={{ position: "relative" }}>
            <input type="checkbox" id="theme-checkbox" checked={isDarkTheme} onChange={() => { }} style={{ display: "none" }} />

            <label
                ref={buttonRef}
                htmlFor="theme-checkbox"
                onClick={toggleTheme}
                style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                    cursor: "pointer",
                    position: "relative",
                    overflow: "hidden",
                    transition: "background 0.6s ease-in-out",
                    background: isDarkTheme ? "#222" : "#ff5733",
                    color: isDarkTheme ? "#ff5733" : "#fff",
                }}
            >
                <span
                    style={{
                        display: "inline-block",
                        transition: "transform 0.6s ease-in-out",
                        transform: iconAnimating ? "scale(1.3) rotate(360deg)" : "scale(1) rotate(0deg)",
                    }}
                >
                    {isDarkTheme ? <MoonOutlined /> : <SunOutlined />}
                </span>
                {/* Hiệu ứng lan rộng */}
                {rippleVisible && (
                    <span
                        style={{
                            position: "fixed",
                            borderRadius: "50%",
                            background: isDarkTheme ? "rgba(20, 20, 20, 0.8)" : "rgba(255, 87, 51, 0.6)",
                            transition: "transform 0.6s ease-out, opacity 0.4s ease-out",
                            zIndex: 1,
                            ...rippleStyle,
                        }}
                    />
                )}
            </label>
        </div>
    );
};

export default ThemeToggle;
