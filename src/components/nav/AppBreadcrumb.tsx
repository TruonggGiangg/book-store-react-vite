import { Breadcrumb } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons'; // Import the Home icon from Ant Design

const AppBreadcrumb = () => {
    const location = useLocation();

    // Convert pathname to array of segments
    const pathSnippets = location.pathname.split('/').filter(i => i);

    // Create breadcrumb items
    const breadcrumbItems = pathSnippets.map((_, index) => {
        const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
        const breadcrumbName = pathSnippets[index];

        // Format display name (capitalize first letter)
        const getDisplayName = (name: string) => {
            return name.charAt(0).toUpperCase() + name.slice(1);
        };

        return {
            title: <Link to={url}>{getDisplayName(breadcrumbName)}</Link>
        };
    });

    // Add Home with icon at the start of breadcrumb
    const items = [
        {
            title: (
                <Link to="/">
                    <HomeOutlined /> {/* Use Home icon instead of text */}
                </Link>
            )
        },
        ...breadcrumbItems
    ];

    return (
        <div className="app-breadcrumb">
            <Breadcrumb items={items} />
        </div>
    );
};

export default AppBreadcrumb;