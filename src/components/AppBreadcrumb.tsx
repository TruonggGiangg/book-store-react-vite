import { Breadcrumb } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const AppBreadcrumb = () => {
    const { t } = useTranslation();
    const location = useLocation();

    // Chuyển đổi pathname thành mảng các phần tử
    const pathSnippets = location.pathname.split('/').filter(i => i);

    // Tạo các items breadcrumb
    const breadcrumbItems = pathSnippets.map((_, index) => {
        const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
        const breadcrumbName = pathSnippets[index];

        // Chuyển đổi tên route thành text hiển thị có hỗ trợ đa ngôn ngữ
        const getDisplayName = (name: string) => {
            return t(`breadcrumb.${name}`, { defaultValue: name.charAt(0).toUpperCase() + name.slice(1) });
        };

        return {
            title: <Link to={url}>{getDisplayName(breadcrumbName)}</Link>
        };
    });

    // Thêm Home vào đầu breadcrumb
    const items = [
        {
            title: <Link to="/">{t('breadcrumb.home', 'Home')}</Link>
        },
        ...breadcrumbItems
    ];

    return (
        <Breadcrumb items={items} />
    );
};

export default AppBreadcrumb; 