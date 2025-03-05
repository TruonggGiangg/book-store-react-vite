import { Header } from "antd/es/layout/layout"
import { useAppProvider } from "../../context/app.context"
import { Avatar, Button, Divider, Dropdown, Input, MenuProps, message, Switch } from "antd";
import {
    MoonOutlined,
    SearchOutlined,
    SunOutlined,
} from '@ant-design/icons';
import { logoutApi } from "@/services/api";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

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


    return (
        <>
            <Header

                style={{
                    padding: "32px 16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: isDarkTheme ? "1px solid #333" : "1px solid #dddddd"
                    // backgroundColor: isDarkTheme ? '#141414' : '#ffffff',

                }}
            >
                {/* Ô tìm kiếm */}
                <Input

                    placeholder={t("header.search")}
                    prefix={<SearchOutlined />}
                    style={{
                        flex: "1",
                        borderRadius: 8,
                        // background: isDarkTheme ? "#141414" : "#ffffff",
                        color: isDarkTheme ? "#f5f5f5" : "#333333",
                        margin: "0 100px",

                    }}
                />

                {/* Toggle Dark Mode & Avatar */}
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    {/* Toggle Dark Mode */}
                    <Switch

                        onChange={() => setIsDarkTheme(!isDarkTheme)}
                        checkedChildren={<MoonOutlined />}
                        unCheckedChildren={<SunOutlined />}

                    />

                    <Switch
                        onChange={change}
                        checkedChildren={"VI"}
                        unCheckedChildren={"EN"}

                    />
                    {/* Avatar với Dropdown */}
                    <Dropdown menu={{ items: menuAvatar }} placement="bottomLeft" trigger={["click"]}>
                        {
                            currUser !== null
                                ?
                                <Avatar size="large" style={{ cursor: "pointer" }} >
                                    {currUser.name[0]}
                                </Avatar>
                                :
                                <>
                                    <Button onClick={() => { nav('/login') }} type="primary">Đăng nhập</Button>
                                </>
                        }
                    </Dropdown>
                </div>
            </Header>

        </>

    )
}
export default LayoutHeader