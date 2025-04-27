export { };
declare global {


    //Data backend
    interface IBackendRes<T> {
        error?: string | string[];
        message: string;
        statusCode: number | string;
        data?: T;
    }
    interface IModelPaginate<T> {
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        },
        result: T[]
    }



    //Auth data
    interface ILogin {
        access_token: string;
        user: {
            _id: string
            name: string
            email: string
            role: string
            permission: IPermission[]
        }
    }



    interface IInputRegister {
        username: string;
        password: string;
        name: string;
        age: number;
        gender: string;
        address: string;
        email: string;
    }


    interface ICurrUser {
        _id: string
        name: string;
        email: string;
        role: string;
        permission: IPermission[]

    }

    interface IPermission {
        _id: string;
        apiPath: string;
        method: string;
        module: number;
    }

    interface IGetAccountAPI {
        user: ICurrUser
    }



    interface UserReference {
        _id: string;
        email: string;
    }


    //user
    interface IGetUser {
        _id: string
        name: string;
        email: string;
        age: number;
        gender: string;
        address: string;
        __v: number;
        role: string;// Mảng ID của Permissions
        createdAt?: Date;
        updatedAt?: Date;
        isDeleted?: Date;
        deletedAt?: Date;
        createdBy?: UserReference;
        updatedBy?: UserReference;
        deletedBy?: UserReference;
        password?: string;
    }


    interface ICreateUser {
        username: string;
        password: string;
        name: string;
        age: number;
        role: string;
        gender: string;
        address: string;
        email: string;
    }




    export interface ProductAttributes {
        publisher?: string;
        publishedDate?: Date | number; // Hỗ trợ cả timestamp và Date
        isbn?: string;
        language?: string;
        pages?: number;
        classification?: string[];
    }

    interface Review {
        userId: Types.ObjectId | string;
        comment: string;
        rating: number;
        createdAt: Date;
    }

    interface IGetBook {
        _id: Types.ObjectId | string;
        title: string;
        author: string[];
        isBook: boolean;
        price: number;
        stock: number;
        sold: number;
        description?: string;
        coverImage?: string[];
        logo?: string;
        attributes?: ProductAttributes;
        rating?: number;
        createdAt?: Date;
        updatedAt?: Date;
        isDeleted?: Date;
        deletedAt?: Date;
        createdBy?: UserReference;
        updatedBy?: UserReference;
        deletedBy?: UserReference;
        reviews?: Review[];
        __v?: number;
    }


    interface ICreateBook {
        title: string;
        author: string[];
        isBook: boolean;
        price: number;
        stock: number;
        sold?: number;
        description: string;
        coverImage?: string[];
        logo?: string;
        attributes: ProductAttributes;
    }




    interface IGetRole {
        _id?: string;
        name: string;
        description: string;
        permissions: string[]; // Mảng ID của Permissions
        createdAt?: Date;
        updatedAt?: Date;
        isDeleted?: Date;
        deletedAt?: Date;
        createdBy?: UserReference;
        updatedBy?: UserReference;
        deletedBy?: UserReference;
        password?: string;
    }


    interface IGetCategories {
        _id: string;
        name: string;
        isBook: boolean;
        description: string;
        image: string;
        createdAt?: Date;
        updatedAt?: Date;
        isDeleted?: Date;
        deletedAt?: Date;
        createdBy?: UserReference;
        updatedBy?: UserReference;
        deletedBy?: UserReference;
        password?: string;
    }


    interface ICreateCategory {
        name: string;
        isBook: boolean;
        description: string;
        image?: string;
    }




    interface IGetEvent {
        _id: Types.ObjectId | string;
        name: string;
        description: string;
        image?: string;
        createdAt?: Date;
        updatedAt?: Date;
        isDeleted?: Date;
        deletedAt?: Date;
        createdBy?: UserReference;
        updatedBy?: UserReference;
        deletedBy?: UserReference;
        reviews?: Review[];
        __v?: number;
    }
    interface ICreateEvent {
        name: string;
        description: string;
        image?: string;

    }

    interface IGetPermission {
        _id: string;
        apiPath: string;
        method: string;
        module: number;

    }
    interface ICreatePermission {
        _id: string;
        apiPath: string;
        method: string;
        module: number;
    }
    interface IUpdatePermission {
        apiPath: string;
        method: string;
    }
}

