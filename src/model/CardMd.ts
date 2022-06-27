export default class CardMd {
  _id: string
  idx: string

  fipeId: string
  vehicleType: string
  bodystyleId: number
  fuelId: number
  fuelName: string
  transmissionId: number
  transmissionName: string

  make: string
  model: string
  year: string
  version: string

  fipe: any
  fipeLast: any
  percentFipe: any

  priceColor: string
  priceComp: any

  href: string
  img: string
  name: string
  origin: string
  state: string
  city: string
  price: string
  detail: string
  region: string

  visited: boolean

  closed: boolean

  created_at: string
  updated_at?: string
}
