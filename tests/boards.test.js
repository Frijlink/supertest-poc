import 'dotenv/config'
import { expect } from "chai"
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

    before(async () => {
        const memberId = (await getTokenInfo(key, token)).idMember
        const organizations = await getMemberOrganizations(memberId, key, token)
        organizationId = organizations[0].id
    })

    it("POST /boards/ should create a board", async () => {
        const response = await createBoard(key, token, boardName, backgroundColour, visibility)

        expect(response.idOrganization).to.eql(organizationId)
        expect(response.name).to.eql(boardName)
        expect(response.closed).to.eql(false)
        expect(response.prefs.background).to.eql(backgroundColour)
        expect(response.prefs.permissionLevel).to.eql(visibility)
        boardId = response.id
    })

    it("GET /boards/{boardId} should retrieve a board", async () => {
        const response = await getBoard(boardId, key, token)

        expect(response.idOrganization).to.eql(organizationId)
        expect(response.name).to.eql(boardName)
        expect(response.closed).to.eql(false)
        expect(response.prefs.background).to.eql(backgroundColour)
        expect(response.prefs.permissionLevel).to.eql(visibility)
    })

    it("PUT /boards/{boardId} should update a board", async () => {
        const response = await updateBoard(boardId, key, token, updatedBoardName, updatedBackgroundColour, updatedVisibility)

        expect(response.idOrganization).to.eql(organizationId)
        expect(response.name).to.eql(updatedBoardName)
        expect(response.closed).to.eql(false)
        expect(response.prefs.background).to.eql(updatedBackgroundColour)
        expect(response.prefs.permissionLevel).to.eql(updatedVisibility)
    })

    it("PUT /boards/{boardId} should close a board", async () => {
        await closeBoard(boardId, key, token)

        const response = await getBoard(boardId, key, token)
        expect(response.closed).to.be.true
    })

    it("DELETE /boards/{boardId} should delete a board", async () => {
        await deleteBoard(boardId, key, token)
    }).timeout(5000)

    after(async () => {
        const boards = await getBoardsFromMember(key, token)
        for (const board of boards) {
            await deleteBoard(board.id, key, token)
        }
    })
})