import 'dotenv/config'
import request from "supertest"

export async function getTokenInfo(key, token) {
    const url = `/1/tokens/${token}?key=${key}&token=${token}`
    const response = await request(process.env.API_URL)
        .get(url)
        .send()
        .expect(200)

    return response.body
}