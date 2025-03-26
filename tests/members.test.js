import 'dotenv/config'
import { expect, describe, it } from "vitest"
import { getTokenInfo } from '../api/token.js';
import { getBoardsFromMember, getMemberOrganizations } from '../api/members.js'

const key = process.env.API_KEY
const token = process.env.API_TOKEN

describe("Trello API: GET /members", () => {

    it("GET /members/me/boards should return boards of user", async () => {
        const boards = await getBoardsFromMember(key, token)

        expect(boards).toHaveLength(0)
    })

    it("GET /members/{membersId}/organizations should return organizations of user", async () => {
        const tokenInfo = await getTokenInfo(key, token)
        const memberId = tokenInfo.idMember

        const organizations = await getMemberOrganizations(memberId, key, token)

        expect(organizations).toHaveLength(1)
    })
})