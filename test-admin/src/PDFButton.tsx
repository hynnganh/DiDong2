import { BlobProvider } from "@react-pdf/renderer";
import MyDocument from "./MyDocument";
import { HiOutlinePrinter } from "react-icons/hi";
import React, { useEffect, useState } from "react";

/* ===== Types ===== */
interface PDFButtonProps {
  cartId?: number | string;
}

interface Product {
  productName?: string;
  name?: string;
  price: number;
  specialPrice?: number;
  quantity: number;
}

interface CartData {
  cartId?: number | string;
  username?: string;
  products?: Product[];
}

/* ===== Component ===== */
const PDFButton: React.FC<PDFButtonProps> = ({ cartId }) => {
  const [data, setData] = useState<CartData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const id = cartId || localStorage.getItem("globalCartId");
      const token = localStorage.getItem("jwt-token");
      const email = localStorage.getItem("userEmail");

      if (!id) {
        setError(new Error("No cart ID found"));
        setLoading(false);
        return;
      }

      if (!token) {
        setError(new Error("No token found"));
        setLoading(false);
        return;
      }

      if (!email) {
        setError(new Error("No email found"));
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8080/api/public/users/${email}/carts/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Network error: ${response.status}`);
        }

        const result: CartData = await response.json();
        setData(result);
      } catch (err: unknown) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [cartId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error.message}</div>;
  if (!data) return null;

  const styles = {
    btn: {
      borderRadius: "3px",
      display: "flex",
      alignItems: "center",
      gap: "4px",
      padding: "6px 10px",
      fontSize: "12px",
      color: "#ffd700",
      fontWeight: 700,
      cursor: "pointer",
      userSelect: "none" as const,
      backgroundColor: "#ffd70000",
      textDecoration: "none",
      transition: "background-color 0.3s, color 0.3s",
    },
    hover: {
      backgroundColor: "#ffd70010",
    },
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.backgroundColor = styles.hover.backgroundColor;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.backgroundColor = styles.btn.backgroundColor;
  };

  return (
    <BlobProvider
      document={
        <MyDocument
          data={{
            ...data,
            username: localStorage.getItem("username") || undefined,
          }}
        />
      }
    >
      {({ url, loading: pdfLoading, error: pdfError }) => {
        if (pdfLoading) return <div>Đang tạo file PDF...</div>;
        if (pdfError) return <div>Lỗi khi tạo PDF</div>;
        if (!url) return <div>Không thể tạo file PDF</div>;

        return (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.btn}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <HiOutlinePrinter size={17} />
            <span>PRINT</span>
          </a>
        );
      }}
    </BlobProvider>
  );
};

export default PDFButton;
