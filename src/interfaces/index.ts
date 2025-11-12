export interface Index {
    name: string
    slug: string
    href: string
    icon: string
}

export interface Register {
    email: string
    first_name: string
    last_name: string
    password: string
}

export interface LogIn {
    email?: string
    phone?: string
    password: string
}

export interface Leads {
    email: string
    name: string
    phone: string
    message: string
}

export interface User {
    email: string
    first_name: string
    last_name: string
    description: string
}