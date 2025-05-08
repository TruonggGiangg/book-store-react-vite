import type React from "react";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEventApi } from "@/services/api";
import Container from "@/components/layout/client/container.layout";
import { Skeleton } from "antd";
import { useAppProvider } from "@/components/context/app.context";

// Assuming baseURL is configured somewhere

// Interfaces (assuming these are defined elsewhere)

// EventPage Component

// Skeleton Component
// Skeleton Component using Ant Design
const SkeletonLoader: React.FC = () => {
  const { isDarkTheme } = useAppProvider();
  return (
    <div style={{ marginTop: "172px" }}>
      <Container>
        <div
          style={{
            backgroundColor: isDarkTheme ? "#1f1f1f" : "#ffffff",
            borderRadius: "8px",
            padding: "24px",
            boxShadow: isDarkTheme
              ? "0 2px 8px rgba(255, 255, 255, 0.1)"
              : "0 2px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* Title Skeleton */}
          <Skeleton
            active
            title={{
              width: "60%",
              style: {
                margin: "0 auto 16px",
                height: "36px",
                borderRadius: "4px",
              },
            }}
            paragraph={false}
          />
          {/* Image Skeleton */}
          <Skeleton.Image
            active
            style={{
              width: "100%",
              height: "300px",
              borderRadius: "8px",
              margin: "0 auto 16px",
              display: "block",
            }}
          />
          {/* Description Skeleton */}
          <div style={{ padding: "24px" }}>
            <Skeleton
              active
              title={false}
              paragraph={{
                rows: 3,
                width: ["100%", "80%", "90%"],
                style: { marginBottom: "8px" },
              }}
            />
          </div>
          {/* Created Skeleton */}
          <Skeleton
            active
            title={false}
            paragraph={{
              rows: 1,
              width: "200px",
              style: { margin: "0 0 8px auto" },
            }}
          />
          {/* Created By Skeleton */}
          <Skeleton
            active
            title={false}
            paragraph={{
              rows: 1,
              width: "150px",
              style: { margin: "0 0 16px auto" },
            }}
          />
        </div>
      </Container>
    </div>
  );
};

// EventPage Component
const EventPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<IGetEvent | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isDarkTheme } = useAppProvider();

  useEffect(() => {
    if (!id) {
      setError("Event ID is missing");
      setLoading(false);
      return;
    }

    const fetchEvent = async () => {
      setLoading(true);
      try {
        const response = await getEventApi(id);
        if (response.data) {
          setEvent(response.data);
        } else {
          setError("Event not found");
        }
      } catch (err) {
        setError("Failed to fetch event details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return <SkeletonLoader />;
  }

  if (error || !event) {
    return (
      <div
        style={{
          marginTop: "172px",
          textAlign: "center",
          padding: "20px",
          fontSize: "18px",
          color: isDarkTheme ? "#ff6b6b" : "#d32f2f",
        }}
      >
        Error: {error || "Event not found"}
      </div>
    );
  }

  return (
    <div style={{ marginTop: "172px" }}>
      <Container>
        <div
          className="event-page"
          style={{
            backgroundColor: isDarkTheme ? "#1f1f1f" : "#ffffff",
            borderRadius: "8px",
            padding: "24px",
            boxShadow: isDarkTheme
              ? "0 2px 8px rgba(255, 255, 255, 0.1)"
              : "0 2px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h1
            style={{
              fontSize: "36px",
              fontWeight: "700",
              color: isDarkTheme ? "#f5f5f5" : "#333",
              margin: "0 0 16px 0",
              textAlign: "center",
            }}
          >
            {event.name}
          </h1>
          {event.image && (
            <img
              src={`${import.meta.env.VITE_BACKEND_URL}/images/event/${
                event.image
              }`}
              alt={event.name}
              style={{
                maxWidth: "100%",
                width: "100%",
                borderRadius: "8px",
                margin: "0 auto 16px",
                display: "block",
              }}
            />
          )}
          <div
            style={{
              padding: "24px",
              fontSize: "16px",
              lineHeight: "1.6",
              color: isDarkTheme ? "#e0e0e0" : "#444",
              marginBottom: "16px",
            }}
            dangerouslySetInnerHTML={{ __html: event.description }}
          />
          <div
            style={{
              fontSize: "14px",
              color: isDarkTheme ? "#b0b0b0" : "#666",
              marginBottom: "8px",
              textAlign: "right",
            }}
          >
            <strong style={{ fontWeight: "600" }}>Tạo lúc:</strong>{" "}
            {event.createdAt
              ? new Date(event.createdAt).toLocaleDateString()
              : "N/A"}
          </div>
          <div
            style={{
              fontSize: "14px",
              color: isDarkTheme ? "#b0b0b0" : "#666",
              marginBottom: "16px",
              textAlign: "right",
            }}
          >
            <strong style={{ fontWeight: "600" }}>Tạo bởi:</strong>{" "}
            {event.createdBy?.email || "Unknown"}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default EventPage;
