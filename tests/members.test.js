import 'dotenv/config'
import { expect } from "chai"
import { getTokenInfo } from '../api/token.js';
import { getBoardsFromMember, getMemberOrganizations } from '../api/members.js'

const key = process.env.API_KEY
const token = process.env.API_TOKEN

describe("GET /members", () => {
    before(() => {
        console.log("top before")
    })
    after(() => {
        console.log("top after")
    })

    it("GET /members/me/boards should return boards of user", async () => {
        const response = await getBoardsFromMember(key, token)

        expect(response.length).to.eql(0)
    })

    it("GET /members/{membersId}/organizations should return organizations of user", async () => {
        const tokenInfo = await getTokenInfo(key, token)
        const memberId = tokenInfo.idMember

        const organizations = await getMemberOrganizations(memberId, key, token)

        expect(organizations.length).to.eql(1)
    })
})