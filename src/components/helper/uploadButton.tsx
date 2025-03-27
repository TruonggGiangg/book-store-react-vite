import { PlusOutlined } from '@ant-design/icons';

interface IProps {
    isDarkTheme: boolean
}

const UploadButton = (props: IProps) => {

    const { isDarkTheme } = props;

    return (

        <button style={{ border: 0, background: 'none' }} type="button">
            <PlusOutlined
                style={{
                    marginTop: 8,
                    color: isDarkTheme ? "#f5f5f5" : "#333", // Màu chữ
                }}
            />
            <div style={{
                marginTop: 8,
                color: isDarkTheme ? "#f5f5f5" : "#333", // Màu chữ
            }}>Upload</div>
        </button>

    );
}

export default UploadButton;