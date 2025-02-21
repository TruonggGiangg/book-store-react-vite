import React from "react"
import { ScaleLoader } from "react-spinners"

interface IProps {
    isLoading: boolean
}


const Loadinge = (props: IProps) => {

    const { isLoading } = props;

    return (
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
    )
}