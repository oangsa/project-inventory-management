export type roles = "admin" | "manager" | "employee"

export interface User {
    id: string         
    name: string
    joinDate: Date    
    username: string      
    password: string
    role: roles
    branch: string
    companyId: string
    company: Company     

    CreatedInviteCode?: InviteCode[]
}

export interface Company {
    id: string         
    name: string      

    Employee: User[]
    Branch: Branch[]
    stock: Product[]
}

export interface Branch {
    id: string         
    name: string
    companyId: string
    company: Company     

    //Setting
    lowestNoti: number
    provider: string
    dependencies: string

    Stock: Product[]
}

export interface InviteCode {
    id: string         
    code: string      
    providedRole: string
    creater: User        
    createrId: string
    expiredDate: Date
    createDate: Date    
}

export interface Product {
    id: string         
    name: string
    price: number
    remain: number
    latestRefill: Date
    latestEdit: Date
    useInBranch: Branch      
    branchId: string
    useInCompany: Company     
    companyId: string
}