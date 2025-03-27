import React, { useEffect } from "react";
import { useAppProvider } from "components/context/app.context";
import { useLocation, useNavigate } from "react-router-dom";



import { message } from "antd";
import LoadingPage from "../loading/loading";

interface IProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<IProps> = ({ children }) => {

    const location = useLocation();
    const { isAuthenticated, role, isLoading } = useAppProvider();
    const nav = useNavigate();


    useEffect(() => {
        if (!isAuthenticated) {
            nav('/login')
            message.warning({
                content: "Bạn cần phải login trước !!!"
            })
        }

        const isAdminRoute = location.pathname.includes("admin");
        if (isAdminRoute) {

            if (!role?.includes("ADMIN")) {
                nav('/not-authorized')
            }
        }
    }, [isAuthenticated, role])

    return (
        <>
            {isLoading === true
                ?
                <>
                    <LoadingPage isLoading={true} />
                </>
                :
                children
            }
        </>
    );
};

export default ProtectedRoute;
