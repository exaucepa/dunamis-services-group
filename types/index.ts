export interface Product {
  id: string // uuid en Supabase = string en TS
  name: string // text
  price: number // numeric
  image: string // text
  category_id: string // uuid
  description: string // text
  stock: number // int4
  featured: boolean // bool
  created_at: string // timestamptz
}

export interface Category {
  id: string // uuid
  name: string // text
  image: string // text
  created_at: string // timestamptz
}

export interface Ad {
  id: string // uuid
  title: string // text
  image: string // text
  link: string // text
  active: boolean // bool
  order: number // int4
  created_at: string // timestamptz
}