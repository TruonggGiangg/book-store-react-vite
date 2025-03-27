import Lottie from "lottie-react";
import loadingAnimation from "@/assets/animation/loadingAnimation.json"
interface IProps {
    isLoading: boolean
}


const LoadingPage = (props: IProps) => {

    const { isLoading } = props;

    return (
        <>
            <div style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: "translate(-50%, -50%)"
            }}>
                <Lottie animationData={loadingAnimation} loop={true} style={{ width: "20%" }} />
            </div>
        </>
    )
}

export default LoadingPage