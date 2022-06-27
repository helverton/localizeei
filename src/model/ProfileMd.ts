export default class ProfileMd {
  _id: string
  email: string
  user_name: string

  role: string
  doc_type: string
  doc_num: string
  first_name?: string
  last_name?: string
  company_name?: string

  state: string
  city: string
  zip_code?: string
  street_num: string

  plan: string

  created_at: Date
  updated_at?: Date
}
