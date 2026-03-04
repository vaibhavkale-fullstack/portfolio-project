
export interface signup{
    full_name:string;
    email:string;
    password:string;
}

export interface signupRes{
    message:string;
    token:string;
    username:string;
}

export interface login{
    email:string;
    password:string;
}

export interface loginRes{
    message:string;
    token:string;
    username:string;
}

export interface profileRes{
    message:string;
    token?:string;
}