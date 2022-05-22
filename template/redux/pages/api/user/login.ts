import { NextApiRequest, NextApiResponse } from 'next'

const loginAPI = (req: NextApiRequest, res: NextApiResponse) => {
  const { email, password } = req.body
  if (!password || password !== 'password') {
    return res.status(401).json({ message: 'Invalid password' })
  }
  return res.status(200).json({ name: 'John Doe', email: email, token: '123456789' })
}
export default loginAPI
