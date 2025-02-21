import { useAppProvider } from "@/components/context/app.context";
import { getAccountApi, getRoleApi } from "@/services/api";
import { message } from "antd";
import { useEffect } from "react";
const HomePage = () => {
    const { currUser, setCurrUser, isLoading, setIsLoading, setIsAuthenticated, setRole, role } = useAppProvider();

    // useEffect(() => {

    //     const fetchAccount = async () => {
    //         setIsLoading(true);

    //         const resAccount = await getAccountApi();

    //         if (resAccount.data) {
    //             setIsAuthenticated(true);
    //             setCurrUser(resAccount.data.user);
    //             const resRole = await getRoleApi(resAccount.data.user.role);
    //             if (resRole.data) setRole(resRole.data.name);
    //         } else {
    //             setIsAuthenticated(false);
    //             setCurrUser(null);
    //             setRole(null);
    //             message.error({ content: "Lấy thông tin thất bại" });
    //         }
    //         setIsLoading(false);


    //     };

    //     fetchAccount();


    // }, []);


    return (
        <>
            <h1>{`${JSON.stringify(currUser)}`}</h1 >
        </>
    )
}

export default HomePage;