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

//BOOK
export const getAllBookApi = (query: string) => {
    //
    const url = `${baseURL}/api/v1/books?${query}`;
    return axios.get<IBackendRes<IModelPaginate<IGetBook>>>(url);
};


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



//ROLE
export const getRoleApi = (id: string) => {
    const url = `${baseURL}/api/v1/roles/${id}`;
    return axios.get<IBackendRes<IGetRole>>(url);
};

export const getAllRoleApi = () => {
    const url = `${baseURL}/api/v1/roles`;
    return axios.get<IBackendRes<IModelPaginate<IGetRole>>>(url);
};





//CATEGORY
export const getAllCategoryApi = (query: string) => {
    const url = `${baseURL}/api/v1/categories?${query}`;
    return axios.get<IBackendRes<IModelPaginate<IGetCategories>>>(url);
};


export const getCategoryApi = (id: string) => {
    const url = `${baseURL}/api/v1/categories/${id}`;
    return axios.get<IBackendRes<IGetCategories>>(url);
};

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

