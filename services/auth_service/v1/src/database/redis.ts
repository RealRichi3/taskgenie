import { Client } from 'redis-om'
import { REDIS_URL } from '../config'

const redis_client = new Client()
    .open(REDIS_URL)
    .then(res => res)
    .catch(err => err)

export default redis_client