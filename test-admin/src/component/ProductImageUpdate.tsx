import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNotify, useRedirect } from "react-admin";
import axios from "axios";
import "./css/ProductImageUpload.css";

const ProductImageUpdate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const notify = useNotify();
  const redirect = useRedirect();
  const token = localStorage.getItem("jwt-token");

  // 🧹 cleanup preview tránh leak bộ nhớ
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // 👉 chọn file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  // 👉 upload
  const handleUpload = async () => {
    if (!file) {
      notify("Vui lòng chọn ảnh trước khi cập nhật", { type: "warning" });
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      await axios.put(
        `http://localhost:8080/api/admin/products/${id}/image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      notify("🎉 Cập nhật ảnh thành công!");
      redirect("/products");   // quay lại list
      window.location.reload(); // ép refresh ảnh mới
    } catch (err) {
      console.error(err);
      notify("❌ Cập nhật ảnh thất bại", { type: "error" });
    }
  };

  return (
    <div className="container">
      <h2>Cập nhật hình ảnh sản phẩm #{id}</h2>

      <div className="image-preview">
        {preview ? (
          <img src={preview} className="preview-img" />
        ) : (
          <p>Chưa chọn hình ảnh</p>
        )}
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="file-input"
      />

      <button onClick={handleUpload} className="upload-button">
        Cập nhật
      </button>
    </div>
  );
};

export default ProductImageUpdate;
