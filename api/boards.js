import 'dotenv/config'
import request from "supertest"

export async function getBoard(boardId, key, token) {
    const url = `/1/boards/${boardId}?key=${key}&token=${token}`
    const response = await request(process.env.API_URL)
        .get(url)
        .expect(200)

    return response.body
}

export async function deleteBoard(boardId, key, token) {
    const url = `/1/boards/${boardId}?key=${key}&token=${token}`
    const response = await request(process.env.API_URL)
        .delete(url)
        .expect(200)

    return response.body
}

export async function createBoard(key, token, name, colour, visibility) {
    const body = {
        name,
        key,
        token,
        "prefs_background": colour,
        "prefs_permissionLevel": visibility
    }
    const response = await request(process.env.API_URL)
        .post('/1/boards/')
        .send(body)
        .set('Accept', 'application/json')
        .expect(200)

    return response.body
}

export async function updateBoard(boardId, key, token, name, colour, visibility) {
    const body = {
        key,
        token,
        name,
        'prefs/background': colour,
        'prefs/permissionLevel': visibility
    }
    const response = await request(process.env.API_URL)
        .put(`/1/boards/${boardId}`)
        .send(body)
        .set('Accept', 'application/json')
        .expect(200)

    return response.body
}

export async function closeBoard(boardId, key, token) {
    const body = {
        key,
        token,
        closed: true
    }
    const response = await request(process.env.API_URL)
        .put(`/1/boards/${boardId}`)
        .send(body)
        .set('Accept', 'application/json')
        .expect(200)

    return response.body
}