import { getCategoryApi, getRoleApi } from "@/services/api"
import { Descriptions, Drawer, Image, notification, Tag } from "antd"
import dayjs from "dayjs"
import { useEffect, useState } from "react"

interface IProps {
    isOpenDetailModal: boolean
    setIsOpenDetailModal: (v: boolean) => void
    dataDetailModal: IGetBook | null
    setDataDetailModal: (v: IGetBook | null) => void
}


const BookDetail = (props: IProps) => {

    const { isOpenDetailModal,
        setIsOpenDetailModal,
        dataDetailModal,
        setDataDetailModal } = props

    // const [currentCategory, setCurrentCategory] = useState<IGetCategories[] | []>([]);
    const [category, setCategory] = useState<IGetCategories[] | []>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);


    useEffect(() => {
        const fetchRole = async () => {
            if (!Array.isArray(dataDetailModal?.attributes?.classification)) return;

            try {
                if (!Array.isArray(dataDetailModal?.attributes?.classification)) {
                    setIsLoading(false);
                    return;
                }

                // Gọi API lấy chi tiết từng danh mục
                const responses = await Promise.all(
                    dataDetailModal.attributes.classification.map(async (item) => {
                        if (!item) return null;

                        const res = await getCategoryApi(item);
                        return res?.data || null;

                    })
                );

                // Cập nhật state
                setCategory(responses.filter((item): item is IGetCategories => item !== null));
            } catch (error) {
                console.error("Lỗi khi lấy danh mục:", error);
            }
        }
        fetchRole()
    }, [dataDetailModal])

    return (
        <>
            <>
                <Drawer title="User detail"
                    open={isOpenDetailModal}
                    onClose={() => { setIsOpenDetailModal(false) }}
                    width={"64%"}
                >
                    <Descriptions title="Thông tin sách" bordered column={2}>
                        <Descriptions.Item label="ID" span={2}>
                            <Tag style={{
                                fontSize: "14px",
                                padding: "6px"
                            }}>
                                {dataDetailModal?._id}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Tên sách">{dataDetailModal?.title}</Descriptions.Item>
                        <Descriptions.Item label="Tác giả">{dataDetailModal?.author}</Descriptions.Item>
                        <Descriptions.Item label="Giá bán">{dataDetailModal?.price}</Descriptions.Item>
                        <Descriptions.Item label="Đã bán">{dataDetailModal?.sold}</Descriptions.Item>
                        <Descriptions.Item label="Số lượng tồn">{dataDetailModal?.stock}</Descriptions.Item>
                        <Descriptions.Item label="Đánh giá">{dataDetailModal?.rating}</Descriptions.Item>
                        <Descriptions.Item label="Logo">
                            {

                                dataDetailModal?.logo
                                    ?
                                    (

                                        <Image
                                            width={200}
                                            src={`${import.meta.env.VITE_BACKEND_URL}/images/product/${dataDetailModal.logo}`}
                                            alt="Logo"
                                        />
                                    )
                                    :
                                    'Không có ảnh'

                            }
                        </Descriptions.Item>
                        <Descriptions.Item label="Ảnh bìa">
                            {
                                Array.isArray(dataDetailModal?.coverImage) && dataDetailModal.coverImage.length > 0 ? (
                                    dataDetailModal.coverImage.map((img, index) => (
                                        <Image

                                            key={index}
                                            width={200}
                                            src={`${import.meta.env.VITE_BACKEND_URL}/images/product/${img}`}
                                            alt={`Cover ${index + 1}`}
                                            style={{ marginRight: 8 }}
                                        />
                                    ))
                                ) : (
                                    'Không có ảnh'
                                )}
                        </Descriptions.Item>

                        {
                            dataDetailModal?.isBook === true
                                ?
                                <>

                                    <Descriptions.Item label="Ngôn ngữ">{dataDetailModal?.attributes?.language}</Descriptions.Item>
                                    <Descriptions.Item label="ISBN">{dataDetailModal?.attributes?.isbn}</Descriptions.Item>
                                    <Descriptions.Item label="Số trang">{dataDetailModal?.attributes?.pages}</Descriptions.Item>
                                    <Descriptions.Item label="Nhà xuất bản">{dataDetailModal?.attributes?.publisher}</Descriptions.Item>
                                    <Descriptions.Item label="Ngày xuất bản">
                                        {dayjs(dataDetailModal?.attributes?.publishedDate).format("YYYY-MM-DD")}
                                    </Descriptions.Item>
                                    <>
                                        <Descriptions.Item label="Thể loại">

                                            {
                                                // category.length !== 0
                                                //     ?
                                                category.map((x) => {
                                                    return (
                                                        <Tag style={{
                                                            fontSize: "14px",
                                                            padding: "6px"
                                                        }}>{x.name}</Tag>
                                                    )
                                                })
                                                // :
                                                // 'Không có dữ liệu'
                                            }

                                        </Descriptions.Item>
                                    </>
                                </>
                                :
                                <>
                                    <Descriptions.Item label="Công dụng">
                                        {
                                            category.map((x, i) => {
                                                return (
                                                    <Tag key={i} style={{
                                                        fontSize: "14px",
                                                        padding: "6px"
                                                    }}>{x.name}</Tag>
                                                )
                                            })
                                        }

                                    </Descriptions.Item>
                                </>
                        }

                        <Descriptions.Item label="Ngày tạo">
                            {dayjs(dataDetailModal?.createdAt).format("YYYY-MM-DD")}

                        </Descriptions.Item>
                        <Descriptions.Item label="Người tạo">
                            {dataDetailModal?.createdBy ? dataDetailModal?.createdBy.email : "N/A"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày cập nhật">
                            {dataDetailModal?.updatedAt ? new Date(dataDetailModal?.updatedAt).toLocaleString() : "N/A"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Người cập nhật">
                            {dataDetailModal?.updatedBy ? dataDetailModal?.updatedBy.email : "N/A"}
                        </Descriptions.Item>


                    </Descriptions>
                </Drawer>
            </>
        </>
    )

}

export default BookDetail;
