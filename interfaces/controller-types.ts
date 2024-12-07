export type roles = "admin" | "manager" | "employee"
export type providers = "line" | "discord"

export interface User {
    id: string
    name: string
    joinDate: Date
    username: string
    password: string
    role: roles
    branchId: string
    branch: Branch
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
    provider: providers
    dependencies: string

    Stock: Product[]
    User: User[]
}

export interface InviteCode {
    id: string
    code: string
    providedRole: string
    useInBranch: string,
    creater: User
    createrId: string
    expiredDate: Date
    createDate: Date
    isUse: boolean
}

export interface Product {
    id: string
    productCode: string
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
