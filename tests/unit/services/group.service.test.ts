import { describe, it, expect, vi, beforeEach } from "vitest"

const mockTxClient = vi.hoisted(() => ({
  groupMember: { create: vi.fn() },
  groupJoinRequest: { create: vi.fn(), update: vi.fn() },
  notification: { create: vi.fn() },
}))

const mockPrisma = vi.hoisted(() => ({
  group: {
    findFirst: vi.fn(),
  },
  groupJoinRequest: {
    findUnique: vi.fn(),
  },
  $transaction: vi.fn((cb: Function) => cb(mockTxClient)),
}))

const mockClassRepo = vi.hoisted(() => ({ findFirst: vi.fn() }))
const mockGroupRepo = vi.hoisted(() => ({
  create: vi.fn(),
  findMany: vi.fn(),
  findByInviteCode: vi.fn(),
  findById: vi.fn(),
  addMember: vi.fn(),
  removeMember: vi.fn(),
  createJoinRequest: vi.fn(),
  updateJoinRequest: vi.fn(),
  findJoinRequests: vi.fn(),
  count: vi.fn(),
}))

vi.mock("@/lib/prisma", () => ({ prisma: mockPrisma }))
vi.mock("@/repositories/class.repository", () => ({ classRepository: mockClassRepo }))
vi.mock("@/repositories/group.repository", () => ({ groupRepository: mockGroupRepo }))
vi.mock("@/repositories/base.repository", () => ({
  paginateResponse: vi.fn((items, total) => ({ items, total })),
}))
vi.mock("@/lib/sse", () => ({ pushEvent: vi.fn() }))

import { groupService } from "@/services/group.service"

describe("groupService", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("createGroup", () => {
    it("creates group when class exists", async () => {
      mockClassRepo.findFirst.mockResolvedValue({ id: "c1" })
      mockGroupRepo.create.mockResolvedValue({ id: "g1", name: "Team Alpha" })
      mockGroupRepo.addMember.mockResolvedValue({})

      const result = await groupService.createGroup({ name: "Team Alpha", classId: "c1", maxSize: 5 }, "u1")

      expect(result.name).toBe("Team Alpha")
      expect(mockGroupRepo.create).toHaveBeenCalled()
      expect(mockGroupRepo.addMember).toHaveBeenCalledWith("g1", "u1", "leader")
    })

    it("throws when class not found", async () => {
      mockClassRepo.findFirst.mockResolvedValue(null)
      await expect(groupService.createGroup({ name: "Team", classId: "bad", maxSize: 5 }, "u1"))
        .rejects.toThrow("Class not found")
    })
  })

  describe("joinGroupByCode", () => {
    it("joins group with valid code", async () => {
      mockGroupRepo.findByInviteCode.mockResolvedValue({
        id: "g1",
        name: "Team Alpha",
        isActive: true,
        maxSize: 5,
        classId: "c1",
        members: [],
        creatorId: "u2",
      })
      mockPrisma.group.findFirst.mockResolvedValue(null)
      mockTxClient.groupMember.create.mockResolvedValue({ id: "m1" })
      mockTxClient.notification.create.mockResolvedValue({})

      const result = await groupService.joinGroupByCode("code123", "u1")
      expect(result.id).toBe("m1")
    })

    it("throws when group is full", async () => {
      mockGroupRepo.findByInviteCode.mockResolvedValue({
        id: "g1",
        isActive: true,
        maxSize: 1,
        members: [{ user: { id: "u1" } }, { user: { id: "u2" } }],
      })
      await expect(groupService.joinGroupByCode("code", "u3")).rejects.toThrow("Group is full")
    })

    it("throws when already member", async () => {
      mockGroupRepo.findByInviteCode.mockResolvedValue({
        id: "g1",
        isActive: true,
        maxSize: 5,
        members: [{ user: { id: "u1" } }],
      })
      await expect(groupService.joinGroupByCode("code", "u1")).rejects.toThrow("Already a member of this group")
    })
  })

  describe("approveJoinRequest", () => {
    it("approves pending request", async () => {
      mockPrisma.groupJoinRequest.findUnique.mockResolvedValue({
        id: "r1",
        groupId: "g1",
        userId: "u3",
        status: "PENDING",
        group: {
          maxSize: 5,
          members: [],
        },
      })
      mockTxClient.groupJoinRequest.update.mockResolvedValue({ id: "r1", status: "APPROVED" })
      mockTxClient.groupMember.create.mockResolvedValue({})
      mockTxClient.notification.create.mockResolvedValue({})

      const result = await groupService.approveJoinRequest("r1", "u2")
      expect(result.status).toBe("APPROVED")
    })

    it("throws when request not found", async () => {
      mockPrisma.groupJoinRequest.findUnique.mockResolvedValue(null)
      await expect(groupService.approveJoinRequest("bad", "u2")).rejects.toThrow("Join request not found")
    })

    it("throws when request is not pending", async () => {
      mockPrisma.groupJoinRequest.findUnique.mockResolvedValue({
        id: "r1",
        status: "REJECTED",
        group: { maxSize: 5, members: [] },
      })
      await expect(groupService.approveJoinRequest("r1", "u2")).rejects.toThrow("Join request is no longer pending")
    })

    it("throws when group is full", async () => {
      mockPrisma.groupJoinRequest.findUnique.mockResolvedValue({
        id: "r1",
        groupId: "g1",
        userId: "u3",
        status: "PENDING",
        group: {
          maxSize: 1,
          members: [{ userId: "u1" }, { userId: "u2" }],
        },
      })
      await expect(groupService.approveJoinRequest("r1", "u2")).rejects.toThrow("Group is full")
    })
  })

  describe("leaveGroup", () => {
    it("removes member when group exists", async () => {
      mockGroupRepo.findById.mockResolvedValue({ id: "g1" })
      mockGroupRepo.removeMember.mockResolvedValue({})

      const result = await groupService.leaveGroup("g1", "u1")
      expect(result.success).toBe(true)
      expect(mockGroupRepo.removeMember).toHaveBeenCalledWith("g1", "u1")
    })

    it("throws when group not found", async () => {
      mockGroupRepo.findById.mockResolvedValue(null)
      await expect(groupService.leaveGroup("bad", "u1")).rejects.toThrow("Group not found")
    })
  })
})
