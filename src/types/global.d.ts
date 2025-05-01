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
        confirmPassword: string;
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
        name: string
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
        username: sting
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



    //Book
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
        userName: string;
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

    interface ISearchBooksResponse {
        meta: IPaginationMeta;
        result: IGetBook[];
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
    interface ICreateRole {
        _id?: string;
        name: string;
        description: string;
        permissions: string[];
    }

    //Category
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



    //Event
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


    //Order
    export interface IOrderItem {
        productId: Types.ObjectId | string;
        name: string;
        author: string;
        price: number;
        quantity: number;
    }



    export interface IGetOrder {
        _id: Types.ObjectId | string;
        items: IOrderItem[];
        status: 'pending' | 'processing' | 'completed' | 'cancelled';
        totalAmount: number;
        numberPhone: string;
        shippingAddress: string;
        createdAt?: Date;
        updatedAt?: Date;
        isDeleted?: Date;
        createdBy?: UserReference;
        updatedBy?: UserReference;
        deletedBy?: UserReference;
    }

    export interface ICreateOrder {
        _id?: Types.ObjectId | string | null;
        items: IOrderItem[];
        status: 'pending' | 'processing' | 'completed' | 'cancelled';
        totalAmount: number;
        shippingAddress: string;
        numberPhone: string;
    }

    interface IGetPermission {
        _id: string;
        apiPath: string;
        method: string;
        module: number;
        name: string

    }
    interface ICreatePermission {
        _id?: string;
        apiPath: string;
        method: string;
        module: number;
    }
    interface IUpdatePermission {
        apiPath: string;
        method: string;
    }
}

