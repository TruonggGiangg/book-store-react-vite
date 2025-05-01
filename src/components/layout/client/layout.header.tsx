"use client";

import type React from "react";

import { Header } from "antd/es/layout/layout";
import { useAppProvider } from "../../context/app.context";
import {
  Avatar,
  Button,
  Dropdown,
  Input,
  Switch,
  Grid,
  List,
  Spin,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { getRoleApi, logoutApi, searchBooksApi } from "@/services/api";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import logo_light from "@/assets/logo/light-logo.png";
import logo_dark from "@/assets/logo/dark-logo.png";
import { useEffect, useState, useRef } from "react";
import Container from "./container.layout";
import ThemeToggle from "./toggle-theme.layout";
import Cart from "./cart.layout";
import { debounce } from "lodash";
import img404 from "@/assets/img/book-with-broken-pages.gif";
const { useBreakpoint } = Grid;

// Define a Book type for search results

const LayoutHeader = () => {
  const nav = useNavigate();
  const {
    role,
    isDarkTheme,
    setIsDarkTheme,
    setIsLoading,
    setIsAuthenticated,
    setCurrUser,
    currUser,
    setRole,
  } = useAppProvider();
  const [t, i18n] = useTranslation("global");
  const screens = useBreakpoint();

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<IGetBook[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchInputRef = useRef<HTMLDivElement>(null);



  // Function to fetch search results
  const fetchSearchResults = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      // Replace this with your actual API call
      const response = await searchBooksApi(query);
      if (response.data && response.data && response.data.result) {
        setSearchResults(response.data.result);
        // If you need pagination info
        // setPaginationMeta(response.data.data.meta);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error searching books:", error);
      // For demo purposes, let's add some mock data
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounce search to avoid too many requests
  const debouncedSearch = debounce(fetchSearchResults, 300);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
    setShowResults(!!value.trim());
  };

  // Handle clicking on a search result
  const handleResultClick = (bookId: string) => {
    nav(`/book/${bookId}`);
    setShowResults(false);
    setSearchQuery("");
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const logout = async () => {
    setIsLoading(true);
    const res = await logoutApi();
    if (res.data) {
      localStorage.removeItem("access_token");
      setCurrUser(null);
      setIsAuthenticated(false);
      setRole(null);
    }
    setIsLoading(false);
  };

  const changeLang = () => {
    const newLang = i18n.language === "vi" ? "en" : "vi";
    i18n.changeLanguage(newLang);
  };

  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const maxScroll = Math.min(scrollY, 400);
  const headerHeight = Math.max(60, 100 - maxScroll / 5);
  const logoSize = Math.max(30, 60 - maxScroll / 10);
  const avatarSize = Math.max(28, 48 - maxScroll / 10);
  const opacity = Math.min(0.5 + (scrollY / 400) * 0.7, 1);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const backgroundColor = `rgba(${isDarkTheme ? "20, 20, 20" : "255, 255, 255"
    }, ${opacity})`;
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.onerror = null; // Ngăn lỗi lặp vô hạn
    e.currentTarget.src = img404; // Thay bằng ảnh mặc định
  };
  return (
    <Header
      style={{
        height: `${headerHeight}px`,
        position: "fixed",
        top: 0,
        right: 0,
        left: 0,
        zIndex: 1000,
        backgroundColor,
        transition: "all 0.3s ease-in-out",
        backdropFilter: `blur(${scrollY > 50 ? 8 : 0}px)`,
        display: "flex",
        alignItems: "center",
        padding: "0px",
        borderBottom: isDarkTheme
          ? "1px solid rgba(255, 255, 255, 0.1)" // Light border cho dark mode
          : "1px solid rgba(0, 0, 0, 0.1)", // Dark border cho light mode
      }}
    >
      <Container>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Logo */}
          <div
            style={{
              height: `${60}px`,
              width: `${60}px`, // Đặt width = height
              marginLeft: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
            onClick={() => {
              nav("/");
            }}
          >
            <img
              src={isDarkTheme ? logo_dark : logo_light}
              style={{
                height: "100%",
                width: "100%", // Width bằng height
                objectFit: "contain",
              }}
            />
          </div>

          {/* Ô tìm kiếm (ẩn trên mobile) */}
          {(screens.lg || screens.xl || screens.xxl) && (
            <div
              ref={searchInputRef}
              style={{
                position: "relative",
                margin: screens.xxl ? "0 32px" : "0 16px",
                width: screens.xxl ? "50%" : "40%",
              }}
            >
              <Input
                placeholder={t("header.search")}
                prefix={<SearchOutlined />}
                value={searchQuery}
                onChange={handleSearchChange}
                style={{
                  borderRadius: 6,
                  fontSize: screens.xxl ? "18px" : "14px",
                  transition: "all 0.3s ease-in-out",
                  width: "100%",
                }}
              />

              {/* Search Results Dropdown */}
              {showResults && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    backgroundColor: isDarkTheme ? "#1f1f1f" : "#fff",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                    borderRadius: "0 0 8px 8px",
                    zIndex: 1001,
                    maxHeight: "400px",
                    overflowY: "auto",
                    border: isDarkTheme
                      ? "1px solid #333"
                      : "1px solid #e8e8e8",
                  }}
                >
                  {isSearching ? (
                    <div style={{ padding: "20px", textAlign: "center" }}>
                      <Spin size="small" />
                      <div style={{ marginTop: "8px" }}>Đang tìm kiếm...</div>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <List
                      itemLayout="horizontal"
                      dataSource={searchResults}
                      renderItem={(book) => (
                        <List.Item
                          onClick={() => handleResultClick(book._id)}
                          onMouseEnter={() => setHoveredId(book._id)}
                          onMouseLeave={() => setHoveredId(null)}
                          style={{
                            cursor: "pointer",
                            padding: "12px 16px",
                            transition: "background-color 0.2s",
                            backgroundColor:
                              hoveredId === book._id
                                ? isDarkTheme
                                  ? "#2a2a2a"
                                  : "#f5f5f5"
                                : isDarkTheme
                                  ? "#1f1f1f"
                                  : "#fff",
                          }}
                        >
                          <List.Item.Meta
                            avatar={
                              <img
                                src={
                                  `${import.meta.env.VITE_BACKEND_URL
                                  }/images/product/${book.logo}` ||
                                  "/placeholder.svg"
                                }
                                alt={book.title}
                                style={{
                                  width: 40,
                                  height: 60,
                                  objectFit: "cover",
                                }}
                                loading="lazy"
                                onError={handleImageError}
                              />
                            }
                            title={book.title}
                            description={book.price.toLocaleString() + " VNĐ"}
                          />
                        </List.Item>
                      )}
                    />
                  ) : searchQuery.trim() ? (
                    <div
                      style={{
                        padding: "20px",
                        textAlign: "center",
                        color: isDarkTheme ? "#aaa" : "#666",
                      }}
                    >
                      Không tìm thấy sách phù hợp
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          )}

          {/* Toggle Dark Mode & Avatar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: screens.xxl ? 16 : 12,
              marginRight: 16,
            }}
          >
            <Switch
              onChange={changeLang}
              checkedChildren="VI"
              unCheckedChildren="EN"
            />
            <ThemeToggle />
            <Cart />
            {/* Avatar Dropdown (Ẩn Avatar nếu chưa đăng nhập) */}
            {currUser ? (
              <Dropdown
                menu={{
                  items: [

                    {
                      key: "profile",
                      label: "Hồ sơ",
                      onClick: () => {
                        nav("/account");
                      },
                    },




                    {
                      key: "history",
                      label: "Lịch sử mua",
                      onClick: () => {
                        nav("/history");
                      },
                    },
                    ...(role && typeof role === "string" && role.includes("ADMIN")
                      ? [
                        {
                          key: "admin",
                          label: "Trang quản trị",
                          onClick: () => {
                            nav("/admin");
                          },
                        },
                      ]
                      : []),
                    { key: "logout", label: "Đăng xuất", onClick: logout },
                  ],
                }}
                placement="bottomLeft"
                trigger={["click"]}
              >
                <Avatar
                  size="large"
                  style={{
                    cursor: "pointer",
                    transition: "all 0.3s ease-in-out",
                  }}
                >
                  {currUser.name[0]}
                </Avatar>
              </Dropdown>
            ) : (
              <Button onClick={() => nav("/login")} type="primary">
                Đăng nhập
              </Button>
            )}
          </div>
        </div>
      </Container>
    </Header>
  );
};

export default LayoutHeader;
