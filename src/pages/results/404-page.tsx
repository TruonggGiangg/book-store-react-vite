



import React from "react";
import Lottie from "lottie-react";
import notAuthorizedAnimation from "@/assets/animation/loginAnimation.json"; // Đường dẫn đến file JSON của Lottie

const NotFoundPage = () => {
    const handleBackHome = () => {
        window.location.href = "/"; // Điều hướng về trang chủ
    };

    return (
        <>
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                textAlign: "center",
                backgroundColor: "#f8f8f8",
            }}>
                <Lottie animationData={notAuthorizedAnimation} style={styles.animation} />
                <h1 style={styles.title}>404</h1>
                <p style={styles.subTitle}>
                    Sorry, the page you are looking for might have been removed, had its name changed, or is temporarily unavailable
                </p>
                <button style={styles.button} onClick={handleBackHome}>Back Home</button>
            </div>
        </>

    );
};

const styles = {

    animation: {
        width: 300,
        height: 300,
    },
    title: {
        fontSize: "48px",
        fontWeight: "bold",
        color: "#ff5733",
    },
    subTitle: {
        fontSize: "18px",
        color: "#555",
        marginBottom: "20px",
    },
    button: {
        backgroundColor: "#ff5733",
        color: "#fff",
        border: "none",
        padding: "10px 20px",
        fontSize: "16px",
        borderRadius: "5px",
        cursor: "pointer",
        transition: "0.3s",
    },
};

export default NotFoundPage;
