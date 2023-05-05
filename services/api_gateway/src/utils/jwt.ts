import jwt from 'jsonwebtoken'
import { JWT_ACCESS_EXP, JWT_ACCESS_SECRET } from '../config'

async function encodeData(data: object) {
    const encoded_data = jwt.sign(data, JWT_ACCESS_SECRET, { expiresIn: JWT_ACCESS_EXP })

    return encoded_data
}

async function decodeData(token: string) {
    const decoded_data = jwt.verify(token, JWT_ACCESS_SECRET)

    return decoded_data
}

export {
    encodeData,
    decodeData
}

export default {
    encodeData,
    decodeData
}