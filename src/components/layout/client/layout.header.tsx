import { Header } from "antd/es/layout/layout";
import { useAppProvider } from "../../context/app.context";
import {
    Avatar,
    Badge,
    Button,
    Dropdown,
    Grid,
    Input,
    Switch,
    Tooltip,
} from "antd";
import {
    MoonOutlined,
    SearchOutlined,
    ShoppingCartOutlined,
    SunOutlined,
} from "@ant-design/icons";
import { logoutApi } from "@/services/api";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import logo_light from "@/assets/logo/light-logo.png";
import logo_dark from "@/assets/logo/dark-logo.png";
import { useEffect, useState } from "react";
import Container from "./container.layout";
import ThemeToggle from "./toggle-theme.layout";

const { useBreakpoint } = Grid;

const LayoutHeader = () => {
    const nav = useNavigate();
    const {
        isDarkTheme,
        setIsDarkTheme,
        setIsLoading,
        setIsAuthenticated,
        setCurrUser,
        currUser,
        setRole,
    } = useAppProvider();
    const [t, i18n] = useTranslation("global");
    const screens = useBreakpoint();

    const logout = async () => {
        setIsLoading(true);
        const res = await logoutApi();
        if (res.data) {
            localStorage.removeItem("access_token");
            setCurrUser(null);
            setIsAuthenticated(false);
            setRole(null);
        }
        setIsLoading(false);
    };

    const changeLang = () => {
        const newLang = i18n.language === "vi" ? "en" : "vi";
        i18n.changeLanguage(newLang);
    };

    const [scrollY, setScrollY] = useState(0);
    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const maxScroll = Math.min(scrollY, 400);
    const headerHeight = Math.max(60, 100 - maxScroll / 5);
    const logoSize = Math.max(30, 60 - maxScroll / 10);
    const avatarSize = Math.max(28, 48 - maxScroll / 10);
    const opacity = Math.min(0.5 + (scrollY / 400) * 0.7, 1);
    const backgroundColor = `rgba(${isDarkTheme ? "20, 20, 20" : "255, 255, 255"}, ${opacity})`;

    return (
        <Header
            style={{
                height: `${headerHeight}px`,
                position: "fixed",
                top: 0,
                right: 0,
                left: 0,
                zIndex: 1000,
                backgroundColor,
                transition: "all 0.3s ease-in-out",
                backdropFilter: `blur(${scrollY > 50 ? 8 : 0}px)`,
                display: "flex",
                alignItems: "center",
                padding: "0px",
                borderBottom: isDarkTheme
                    ? "1px solid rgba(255, 255, 255, 0.1)"
                    : "1px solid rgba(0, 0, 0, 0.1)",
            }}
        >
            <Container>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    {/* Logo */}
                    <div
                        onClick={() => nav("/")}
                        style={{
                            height: `${logoSize}px`,
                            width: `${logoSize}px`,
                            marginLeft: 16,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                        }}
                    >
                        <img
                            src={isDarkTheme ? logo_dark : logo_light}
                            alt="logo"
                            style={{
                                height: "100%",
                                width: "100%",
                                objectFit: "contain",
                            }}
                        />
                    </div>

                    {/* Search input */}
                    {(screens.lg || screens.xl || screens.xxl) && (
                        <Input
                            placeholder={t("header.search")}
                            prefix={<SearchOutlined />}
                            style={{
                                borderRadius: 6,
                                margin: screens.xxl ? "0 32px" : "0 16px",
                                width: screens.xxl ? "50%" : "40%",
                                fontSize: screens.xxl ? "18px" : "14px",
                                transition: "all 0.3s ease-in-out",
                            }}
                        />
                    )}

                    {/* Tools: Language, Dark mode, Cart, Avatar/Login */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: screens.xxl ? 16 : 12,
                            marginRight: 16,
                        }}
                    >


                        <Switch
                            onChange={changeLang}
                            checkedChildren="VI"
                            unCheckedChildren="EN"
                        />



                        {/* Cart */}
                        <div style={{ cursor: "pointer", marginRight: "8px", display: "flex", alignItems: "center", marginTop: " 2px" }}>
                            <Tooltip title="Giỏ hàng" >
                                <Badge count={0} showZero>
                                    <ShoppingCartOutlined
                                        style={{
                                            fontSize: 30, // Tăng font size icon
                                            border: "none",
                                        }}
                                        onClick={() => nav("/payment")}
                                    />
                                </Badge>

                            </Tooltip>
                        </div>


                        <ThemeToggle />






                        {/* Avatar or login */}
                        {currUser ? (
                            <Dropdown
                                menu={{
                                    items: [
                                        { key: "profile", label: "Hồ sơ" },
                                        {
                                            key: "logout",
                                            label: "Đăng xuất",
                                            onClick: logout,
                                        },
                                    ],
                                }}
                                placement="bottomLeft"
                                trigger={["click"]}
                            >
                                <Avatar size={"large"} style={{ cursor: "pointer", transition: "all 0.3s ease-in-out" }}>
                                    {currUser.name[0]}
                                </Avatar>
                            </Dropdown>
                        ) : (
                            <Button onClick={() => nav("/login")} type="primary">
                                Đăng nhập
                            </Button>
                        )}
                    </div>
                </div>
            </Container>
        </Header>
    );
};

export default LayoutHeader;
