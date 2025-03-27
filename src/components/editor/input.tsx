import React from "react";
import { Editor } from "@tinymce/tinymce-react";

interface TinyMCEEditorProps {
    value?: string; // Giá trị của editor (do Form quản lý)
    onChange?: (content: string) => void; // Hàm cập nhật nội dung lên Form
    isDarkMode?: boolean;
}

const TinyMCEEditor: React.FC<TinyMCEEditorProps> = ({ value, onChange, isDarkMode }) => {


    return (
        <Editor

            apiKey="nh3mviwfmk63xgtxrbmarmw8ua15scl8zo9o89jyssh181ao" // Thay bằng API key nếu cần
            init={{


                height: 400,
                menubar: true, // Hiển thị thanh menu
                plugins:
                    "advlist autolink lists link image charmap print preview anchor searchreplace visualblocks code fullscreen insertdatetime media table paste code help wordcount",
                toolbar:
                    "undo redo | formatselect | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
            }}
            value={value} // Nhận giá trị từ Form
            onEditorChange={(newContent) => onChange?.(newContent)} // Gửi giá trị lên Form
        />
    );
};

export default TinyMCEEditor;
