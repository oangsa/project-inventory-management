export interface User {
    id: number         
    name: string
    joinDate: Date    
    username: string      
    password: string
    role: string
    branch: string
    companyId: number
    company: Company     

    CreatedInviteCode?: InviteCode[]
}

export interface Company {
    id: number         
    name: string      

    Employee: User[]
    Branch: Branch[]
    stock: Product[]
}

export interface Branch {
    id: number         
    name: string
    companyId: number
    company: Company     

    //Setting
    lowestNoti: number
    provider: string
    dependencies: string

    Stock: Product[]
}

export interface InviteCode {
    id: number         
    code: string      
    providedRole: string
    creater: User        
    createrId: number
    expiredDate: Date
    createDate: Date    
}

export interface Product {
    id: number         
    name: string
    price: number
    remain: number
    latestRefill: Date
    latestEdit: Date
    useInBranch: Branch      
    branchId: number
    useInCompany: Company     
    companyId: number
}