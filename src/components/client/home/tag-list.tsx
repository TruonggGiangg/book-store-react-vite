import { useAppProvider } from "@/components/context/app.context";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useRef, useState, useEffect } from "react";

const TagScroller = ({
    tags,
    renderTag,
}: {
    tags: string[];
    renderTag: (id: string) => JSX.Element | null;
}) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const { isDarkTheme } = useAppProvider();

    // Xác định style dựa trên chủ đề
    const themeStyles = {
        buttonBackground: isDarkTheme ? '#2a2a2a' : '#ffffff',
        buttonBorder: isDarkTheme ? '#444' : '#d9d9d9',
        buttonColor: isDarkTheme ? '#e0e0e0' : '#333',
        buttonDisabledColor: isDarkTheme ? '#666' : '#bfbfbf',
        buttonHoverBackground: isDarkTheme ? '#404040' : '#f5f5f5',
    };

    const checkScrollPosition = () => {
        if (scrollRef.current) {
            setCanScrollLeft(scrollRef.current.scrollLeft > 0);
            setCanScrollRight(
                scrollRef.current.scrollLeft + scrollRef.current.clientWidth < scrollRef.current.scrollWidth
            );
        }
    };

    useEffect(() => {
        checkScrollPosition();
        window.addEventListener("resize", checkScrollPosition);
        return () => window.removeEventListener("resize", checkScrollPosition);
    }, [tags]);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const scrollAmount = 150;
            scrollRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
            setTimeout(checkScrollPosition, 300);
        }
    };

    return (
        <div style={{ position: "relative", display: "flex", alignItems: "center", width: "100%" }}>
            {/* Nút bấm lướt trái */}
            <Button
                icon={<LeftOutlined />}
                shape="circle"
                size="small"
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                style={{
                    position: "absolute",
                    left: 0,
                    zIndex: 1,
                    backgroundColor: themeStyles.buttonBackground,
                    borderColor: themeStyles.buttonBorder,
                    color: canScrollLeft ? themeStyles.buttonColor : themeStyles.buttonDisabledColor,
                    opacity: canScrollLeft ? 1 : 0.5,
                    cursor: canScrollLeft ? "pointer" : "not-allowed",
                    boxShadow: isDarkTheme ? '0 2px 4px rgba(0, 0, 0, 0.3)' : '0 2px 4px rgba(0, 0, 0, 0.1)',
                }}
            />

            {/* Khu vực chứa danh sách tag */}
            <div
                ref={scrollRef}
                onScroll={checkScrollPosition}
                style={{
                    display: "flex",
                    gap: "8px",
                    overflowX: "hidden",
                    whiteSpace: "nowrap",
                    padding: "4px 30px",
                    scrollBehavior: "smooth",
                    width: "100%",
                    maskImage: "linear-gradient(to right, transparent, white 10%, white 90%, transparent)",
                    WebkitMaskImage: "linear-gradient(to right, transparent, white 10%, white 90%, transparent)",
                }}
            >
                {tags.map((category) => {
                    const tagElement = renderTag(category);
                    return tagElement ? <div key={category} style={{ flexShrink: 0 }}>{tagElement}</div> : null;
                })}
            </div>

            {/* Nút bấm lướt phải */}
            <Button
                icon={<RightOutlined />}
                shape="circle"
                size="small"
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                style={{
                    position: "absolute",
                    right: 0,
                    zIndex: 1,
                    backgroundColor: themeStyles.buttonBackground,
                    borderColor: themeStyles.buttonBorder,
                    color: canScrollRight ? themeStyles.buttonColor : themeStyles.buttonDisabledColor,
                    opacity: canScrollRight ? 1 : 0.5,
                    cursor: canScrollRight ? "pointer" : "not-allowed",
                    boxShadow: isDarkTheme ? '0 2px 4px rgba(0, 0, 0, 0.3)' : '0 2px 4px rgba(0, 0, 0, 0.1)',
                }}
            />
        </div>
    );
};

export default TagScroller;