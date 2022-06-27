import makesDB from "@/services/makes.json"

export default async function handler(req, res) {
  res.status(200).json(makesDB)
}
