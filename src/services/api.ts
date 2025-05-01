
import axios from "@/services/axios.custumize"

const baseURL = import.meta.env.VITE_BACKEND_URL

//AUTH
export const loginApi = (email: string, password: string) => {
    const url = `${baseURL}/api/v1/auth/login`
    return axios.post<IBackendRes<ILogin>>(url,
        {
            username: email,
            password
        },
        {
            withCredentials: true // 👈 QUAN TRỌNG: Cho phép gửi và nhận cookie
        }
    )
}

export const registerApi = (userData: IInputRegister) => {
    const url = `${baseURL}/api/v1/auth/register`;
    return axios.post<IBackendRes<any>>(url, userData);
};


export const getAccountApi = () => {
    const url = `${baseURL}/api/v1/auth/account`;
    return axios.get<IBackendRes<IGetAccountAPI>>(url);
};


export const logoutApi = () => {
    const url = `${baseURL}/api/v1/auth/logout`;
    return axios.post<IBackendRes<any>>(url);
};


//USER
export const getAllUserApi = (query: string) => {
    //
    const url = `${baseURL}/api/v1/users?${query}`;
    return axios.get<IBackendRes<IModelPaginate<IGetUser>>>(url);
};

export const createUserApi = (userData: ICreateUser) => {
    const url = `${baseURL}/api/v1/users`;
    return axios.post<IBackendRes<any>>(url, userData);
};

export const updateUserApi = (userData: ICreateUser, id: string) => {
    const url = `${baseURL}/api/v1/users/${id}`;
    return axios.put<IBackendRes<any>>(url, userData);
};

export const deleteUserApi = (id: string) => {
    const url = `${baseURL}/api/v1/users/${id}`;
    return axios.delete<IBackendRes<any>>(url);
};

export const getUserApi = (id: string) => {
    const url = `${baseURL}/api/v1/users/${id}`;
    return axios.get<IBackendRes<IGetUser>>(url)
}

//BOOK
export const getAllBookApi = (query: string) => {
    //
    const url = `${baseURL}/api/v1/books?${query}`;
    return axios.get<IBackendRes<IModelPaginate<IGetBook>>>(url);
};

export const getBookApi = (id: string) => {
    const url = `${baseURL}/api/v1/books/${id}`;
    return axios.get<IBackendRes<IGetBook>>(url);
}

export const createBookApi = (bookData: ICreateBook) => {
    const url = `${baseURL}/api/v1/books`;
    return axios.post<IBackendRes<any>>(url, bookData);
};


export const updateBookApi = (bookData: ICreateBook, id: string) => {
    const url = `${baseURL}/api/v1/books/${id}`;
    return axios.put<IBackendRes<any>>(url, bookData);
};

export const deleteBookApi = (id: string) => {
    const url = `${baseURL}/api/v1/books/${id}`;
    return axios.delete<IBackendRes<any>>(url);
};


export const searchBooksApi = (keyword: string, page: number = 1, pageSize: number = 10) => {
    const url = `${baseURL}/api/v1/books/search`;

    // Add query parameters
    const params = new URLSearchParams({
        keyword,
        page: page.toString(),
        pageSize: pageSize.toString()
    });

    return axios.get<IBackendRes<ISearchBooksResponse>>(`${url}?${params.toString()}`);
};



//ROLE
export const getRoleApi = (id: string) => {
    const url = `${baseURL}/api/v1/roles/${id}`;
    return axios.get<IBackendRes<IGetRole>>(url);
};

export const getAllRoleApi = () => {
    const url = `${baseURL}/api/v1/roles`;
    return axios.get<IBackendRes<IModelPaginate<IGetRole>>>(url);
};
export const updateRoleApi = (id: string, roleData: ICreateRole) => {
    const url = `${baseURL}/api/v1/roles/${id}`;
    return axios.put<IBackendRes<any>>(url, roleData);

};
export const createRoleApi = (roleData: ICreateRole) => {
    const url = `${baseURL}/api/v1/roles`;
    return axios.post<IBackendRes<any>>(url, roleData);
}

export const deleteRoleApi = (id: string) => {
    const url = `${baseURL}/api/v1/roles/${id}`;
    return axios.delete<IBackendRes<any>>(url);
}





//CATEGORY
export const createCategoryApi = (categoryData: ICreateCategory) => {
    const url = `${baseURL}/api/v1/categories`;
    return axios.post<IBackendRes<any>>(url, categoryData);
}



export const getAllCategoryApi = (query: string) => {
    const url = `${baseURL}/api/v1/categories?${query}`;
    return axios.get<IBackendRes<IModelPaginate<IGetCategories>>>(url);
};


export const getCategoryApi = (id: string) => {
    const url = `${baseURL}/api/v1/categories/${id}`;
    return axios.get<IBackendRes<IGetCategories>>(url);
};


export const updateCategoryApi = (categoryData: ICreateCategory, id: string) => {
    const url = `${baseURL}/api/v1/categories/${id}`;
    return axios.put<IBackendRes<any>>(url, categoryData);
};

export const deleteCategoryApi = (id: string) => {
    const url = `${baseURL}/api/v1/categories/${id}`;
    return axios.delete<IBackendRes<any>>(url);
};




//EVENT
export const getAllEventApi = (query: string) => {
    const url = `${baseURL}/api/v1/events?${query}`;
    return axios.get<IBackendRes<IModelPaginate<IGetEvent>>>(url);
};
export const createEventApi = (eventData: ICreateEvent) => {
    const url = `${baseURL}/api/v1/events`;
    return axios.post<IBackendRes<any>>(url, eventData);
}
export const getEventApi = (id: string) => {
    const url = `${baseURL}/api/v1/events/${id}`;
    return axios.get<IBackendRes<IGetEvent>>(url);
}
export const updateEventApi = (eventData: ICreateEvent, id: string) => {
    const url = `${baseURL}/api/v1/events/${id}`;
    return axios.put<IBackendRes<any>>(url, eventData);
}
export const deleteEventApi = (id: string) => {
    const url = `${baseURL}/api/v1/events/${id}`;
    return axios.delete<IBackendRes<any>>(url);
}


//ORDER


export const createOrderApi = (order: ICreateOrder) => {
    const url = `${baseURL}/api/v1/orders`;
    return axios.post<IBackendRes<any>>(url, order);
}

export const getAllOrderApi = (query: string) => {
    const url = `${baseURL}/api/v1/orders?${query}`;
    return axios.get<IBackendRes<IModelPaginate<IGetOrder>>>(url);
};

export const updateOrderApi = (orderData: ICreateOrder, id: string) => {
    const url = `${baseURL}/api/v1/orders/${id}`;
    return axios.put<IBackendRes<any>>(url, orderData);
};

export const getOrderApi = (id: string) => {
    const url = `${baseURL}/api/v1/orders/${id}`;
    return axios.get<IBackendRes<IGetEvent>>(url);
}

export const getAllPermissionApi = (query: string) => {
    const url = `${baseURL}/api/v1/permissions?${query}`;
    return axios.get<IBackendRes<IModelPaginate<IPermission>>>(url);
}
export const updatePermissionApi = (permissionData: IPermission, id: string) => {
    const url = `${baseURL}/api/v1/permissions/${id}`;
    return axios.put<IBackendRes<any>>(url, permissionData);
}

//permission

export const getPermissionApiByPath = (path: string) => {
    const url = `${baseURL}/api/v1/permissions?path=${path}`;
    return axios.get<IBackendRes<IPermission>>(url);
}
export const getPermissionApiById = (id: string) => {
    const url = `${baseURL}/api/v1/permissions/${id}`;
    return axios.get<IBackendRes<IPermission>>(url);
}
export const deletePermissionApi = (id: string) => {
    const url = `${baseURL}/api/v1/permissions/${id}`;
    return axios.delete<IBackendRes<any>>(url);
}

//UPLOAD FILE
export const uploadFile = (fileImg: any, folder: string) => {
    const boduFormData = new FormData();
    boduFormData.append('file', fileImg);
    return axios<IBackendRes<{
        fileName: string
    }>>({
        method: 'post',
        url: '/api/v1/files/upload',
        data: boduFormData,
        headers: {
            "Content-Type": "multipart/form-data",
            "folder_type": folder
        }

    })
};

