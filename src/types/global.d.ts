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
        apiPath: string;
        method: string;
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

}

