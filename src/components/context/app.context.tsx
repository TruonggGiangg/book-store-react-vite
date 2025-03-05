import { getAccountApi, getRoleApi } from "@/services/api";
import { createContext, useContext, useEffect, useState } from "react";
import { ScaleLoader } from "react-spinners";

interface IAppContext {
    isAuthenticated: boolean;
    isLoading: boolean;
    currUser: ICurrUser | null;
    role: string | null;
    isDarkTheme: boolean
    setIsAuthenticated: (v: boolean) => void;
    setIsLoading: (v: boolean) => void;
    setCurrUser: (v: ICurrUser | null) => void;
    setRole: (v: string | null) => void
    setIsDarkTheme: (v: boolean) => void
}

export const CurrentUserContext = createContext<IAppContext | null>(null);

type TProps = {
    children: React.ReactNode
}

export const AppProvider = (props: TProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true)
    const [currUser, setCurrUser] = useState<ICurrUser | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [role, setRole] = useState<string | null>(null)
    const [isDarkTheme, setIsDarkTheme] = useState<boolean>(false)

    useEffect(() => {
        const fetchAccount = async () => {
            setIsLoading(true)
            const resAccount = await getAccountApi();
            if (resAccount.data) {
                setIsAuthenticated(true);
                setCurrUser(resAccount.data.user);
                const resRole = await getRoleApi(resAccount.data.user.role);
                if (resRole.data) setRole(resRole.data.name);
                setIsLoading(false);
            } else {
                setIsAuthenticated(false);
                setCurrUser(null);
                setRole(null);
                setIsLoading(false);
            }
            setIsLoading(false);
        };

        fetchAccount();
    }, []);

    return (
        isLoading === false
            ?
            <CurrentUserContext.Provider value={{ isAuthenticated, currUser, isLoading, role, isDarkTheme, setCurrUser, setIsAuthenticated, setIsLoading, setRole, setIsDarkTheme }}>
                {props.children}
            </CurrentUserContext.Provider>
            :
            <div style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: "translate(-50%, -50%)"
            }}>
                <ScaleLoader
                    color={'#ff5733'}
                    loading={isLoading}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                />
            </div>
    );
};

export const useAppProvider = () => {
    const currentUserContext = useContext(CurrentUserContext);
    if (!currentUserContext) {
        throw new Error(
            "useCurrentUser has to be used within <CurrentUserContext.Provider>"
        )
    }
    return currentUserContext
}
