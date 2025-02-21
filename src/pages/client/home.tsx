import { useAppProvider } from "@/components/context/app.context";
import ScaleLoader from "react-spinners/ScaleLoader";
const HomePage = () => {

    const { currUser, isLoading, role } = useAppProvider();

    return (
        <>
            {
                isLoading === false
                    ?
                    <div style={{ display: 'flex', width: '100%' }}>
                        <p>{`${role} ${JSON.stringify(currUser)}`}</p>
                    </div>
                    :
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
            }
        </>
    )
}

export default HomePage;