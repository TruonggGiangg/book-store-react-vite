import { Header } from "antd/es/layout/layout"
import { useAppProvider } from "../../context/app.context"
import { Avatar, Button, Dropdown, Input, MenuProps, message, Switch } from "antd";
import {
    MoonOutlined,
    SearchOutlined,
    SunOutlined,
} from '@ant-design/icons';
import { logoutApi } from "@/services/api";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import logo_light from '@/assets/logo/light-logo.png';
import logo_dark from '@/assets/logo/dark-logo.png';
import { useEffect, useState } from "react";
const LayoutHeader = () => {

    //điều hướng
    const nav = useNavigate()

    //context provider
    const { isDarkTheme, setIsDarkTheme, setIsLoading, setIsAuthenticated, setCurrUser, isAuthenticated, currUser, setRole } = useAppProvider();


    //ngôn ngữ
    const [t, i18n] = useTranslation("global");

    //logic
    const logout = async () => {
        setIsLoading(true)
        const res = await logoutApi();
        if (res.data) {
            localStorage.removeItem('access_token')
            setCurrUser(null);
            setIsAuthenticated(false);
            setRole(null)
            message.success({
                content: 'Đăng xuất thành công'
            })
            localStorage.removeItem('access_token')
        } else {
            message.error({
                content: 'Lỗi server'
            })
        }
        setIsLoading(false)
    }

    const change = async () => {
        const newLang = i18n.language === "vi" ? "en" : "vi";
        i18n.changeLanguage(newLang)
    }


    //components
    const menuAvatar: MenuProps["items"] = [
        { key: "profile", label: "Hồ sơ" },
        { key: "logout", label: "Đăng xuất", onClick: () => { logout() } },
    ];


    // Trạng thái cuộn
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Tính toán giá trị opacity (0 -> 1) dựa trên scrollY
    // Kích thước to hơn ban đầu, thu nhỏ khi cuộn
    const maxScroll = Math.min(scrollY, 400); // Giới hạn tối đa là 400px

    const headerHeight = Math.max(60, 100 - maxScroll / 5);
    const logoSize = Math.max(40, 70 - maxScroll / 10);
    const inputHeight = Math.max(36, 50 - maxScroll / 10);
    const avatarSize = Math.max(32, 50 - maxScroll / 10);
    const gapSize = Math.max(10, 20 - maxScroll / 20);
    const paddingSize = Math.max(16, 120 - maxScroll / 3);
    const widthInput = Math.max(1000, 1200 - maxScroll / 20);
    const opacity = Math.min(0.5 + (scrollY / 400) * 0.7, 1);
    const backgroundColor = `rgba(${isDarkTheme ? "20, 20, 20" : "255, 255, 255"}, ${opacity})`;

    return (
        <>
            <Header
                style={{
                    height: `${headerHeight}px`,
                    padding: ` ${paddingSize} 16px`,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    position: "fixed",
                    top: 0,
                    right: 0,
                    left: 0,
                    zIndex: 1000,
                    transition: "all 0.3s ease-in-out",
                    backgroundColor: `${backgroundColor}`,
                    backdropFilter: `blur(${scrollY > 50 ? 8 : 0}px)`,
                    borderBottom: `1px solid rgba(0, 0, 0, ${Math.min(scrollY / 200, 0.1)})`, // Viền dần xuất hiện khi cuộn
                }}
            >

                <div style={{

                }}>
                    <div style={{ height: `${logoSize}px` }}>
                        <img src={isDarkTheme ? logo_dark : logo_light} style={{ height: "100%", objectFit: "contain" }} />
                    </div>
                </div>
                {/* Ô tìm kiếm */}
                <Input
                    placeholder={t("header.search")}
                    prefix={<SearchOutlined style={{ padding: "8px" }} />}
                    style={{

                        borderRadius: 6,
                        color: isDarkTheme ? "#f5f5f5" : "#333",
                        margin: "0 16px",
                        height: `${inputHeight}px`,
                        width: `${widthInput}px`,
                        transition: "all 0.3s ease-in-out",
                    }}
                />

                {/* Toggle Dark Mode & Avatar */}
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    {/* Toggle Dark Mode */}
                    <Switch
                        onChange={() => setIsDarkTheme(!isDarkTheme)}
                        checkedChildren={<MoonOutlined />}
                        unCheckedChildren={<SunOutlined />}
                        style={{ width: 44 }}
                    />
                    <Switch
                        onChange={() => i18n.changeLanguage(i18n.language === "vi" ? "en" : "vi")}
                        checkedChildren={"VI"}
                        unCheckedChildren={"EN"}
                        style={{ width: 44 }}
                    />

                    {/* Avatar với Dropdown */}
                    <Dropdown menu={{ items: [{ key: "profile", label: "Hồ sơ" }, { key: "logout", label: "Đăng xuất", onClick: () => logout() }] }} placement="bottomLeft" trigger={["click"]}>
                        {currUser ? (
                            <Avatar size={avatarSize} style={{ cursor: "pointer", transition: "all 0.3s ease-in-out" }}>
                                {currUser.name[0]}
                            </Avatar>
                        ) : (
                            <Button onClick={() => nav('/login')} type="primary" size="small">
                                Đăng nhập
                            </Button>
                        )}
                    </Dropdown>
                </div>
            </Header>

        </>

    )
}
export default LayoutHeader