import 'dotenv/config'
import { expect, describe, it, beforeAll, afterAll } from "vitest"
import { closeBoard, createBoard, deleteBoard, getBoard, updateBoard } from '../api/boards.js';
import { getBoardsFromMember, getMemberOrganizations } from '../api/members.js'
import { getTokenInfo } from '../api/token.js';
import { generateBoardName } from '../utilities/test_data_generator.js'

const key = process.env.API_KEY
const token = process.env.API_TOKEN
var organizationId, boardId = ''

describe("Trello API: CRUD /boards", () => {
    const boardName = generateBoardName().replace(' ', '-').toLowerCase()
    const updatedBoardName = generateBoardName().replace(' ', '-').toLowerCase()
    const backgroundColour = 'purple'
    const updatedBackgroundColour = 'pink'
    const visibility = 'org'
    const updatedVisibility = 'private'

    beforeAll(async () => {
        const memberId = (await getTokenInfo(key, token)).idMember
        const organizations = await getMemberOrganizations(memberId, key, token)
        organizationId = organizations[0].id
    })

    it("POST /boards/ should create a board", async () => {
        const response = await createBoard(key, token, boardName, backgroundColour, visibility)

        expect(response.idOrganization).toBe(organizationId)
        expect(response.name).toBe(boardName)
        expect(response.closed).toBeFalsy()
        expect(response.prefs.background).toBe(backgroundColour)
        expect(response.prefs.permissionLevel).toBe(visibility)
        boardId = response.id
    })

    it("GET /boards/{boardId} should retrieve a board", async () => {
        const response = await getBoard(boardId, key, token)

        expect(response.idOrganization).toBe(organizationId)
        expect(response.name).toBe(boardName)
        expect(response.closed).toBeFalsy()
        expect(response.prefs.background).toBe(backgroundColour)
        expect(response.prefs.permissionLevel).toBe(visibility)
    })

    it("PUT /boards/{boardId} should update a board", async () => {
        const response = await updateBoard(boardId, key, token, updatedBoardName, updatedBackgroundColour, updatedVisibility)

        expect(response.idOrganization).toBe(organizationId)
        expect(response.name).toBe(updatedBoardName)
        expect(response.closed).toBeFalsy()
        expect(response.prefs.background).toBe(updatedBackgroundColour)
        expect(response.prefs.permissionLevel).toBe(updatedVisibility)
    })

    it("PUT /boards/{boardId} should close a board", async () => {
        await closeBoard(boardId, key, token)

        const response = await getBoard(boardId, key, token)
        expect(response.closed).toBeTruthy()
    })

    it("DELETE /boards/{boardId} should delete a board", async () => {
        await deleteBoard(boardId, key, token)
    })

    afterAll(async () => {
        const boards = await getBoardsFromMember(key, token)
        for (const board of boards) {
            await deleteBoard(board.id, key, token)
        }
    })
})