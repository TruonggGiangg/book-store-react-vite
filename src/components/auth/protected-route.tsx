import React, { useEffect } from "react";
import { useAppProvider } from "components/context/app.context";
import { useLocation, useNavigate } from "react-router-dom";


import { ScaleLoader } from "react-spinners";
import { message } from "antd";

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
    }, [])

    return (
        <>
            {isLoading === true
                ?
                <>
                    <div style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: "translate(-50%, -50%)"
                    }}>
                        <ScaleLoader
                            color={'#000000'}
                            loading={isLoading}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                        />

                    </div>
                </>
                :
                children
            }
        </>
    );
};

export default ProtectedRoute;
