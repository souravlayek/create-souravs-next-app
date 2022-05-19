import { NextApiRequest, NextApiResponse } from 'next'

const helloApi = (req: NextApiRequest, res: NextApiResponse) => {
  // write your api logic here
  res.status(200).json({ name: 'John Doe' })
}
export default helloApi
