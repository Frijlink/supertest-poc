import 'dotenv/config'
import request from "supertest"

export async function getBoardsFromMember(key, token, statusCode = 200) {
    const url = `/1/members/me/boards?key=${key}&token=${token}`
    const response = await request
        (process.env.API_URL)
        .get(url)
        .send()
        .expect(statusCode)

    return response.body
}

export async function getMemberOrganizations (memberId, key, token, statusCode = 200) {
    const url = `/1/members/${memberId}/organizations?key=${key}&token=${token}`
    const response = await request
        (process.env.API_URL)
        .get(url)
        .send()
        .expect(statusCode)

    return response.body
}