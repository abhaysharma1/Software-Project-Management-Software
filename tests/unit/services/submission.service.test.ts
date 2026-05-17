import { describe, it, expect, vi, beforeEach } from "vitest"

const mockTxClient = vi.hoisted(() => ({
  milestoneSubmission: { create: vi.fn(), update: vi.fn() },
  milestone: { update: vi.fn(), findMany: vi.fn() },
  activityLog: { create: vi.fn() },
  notification: { create: vi.fn() },
  project: { update: vi.fn() },
}))

const mockPrisma = vi.hoisted(() => ({
  $transaction: vi.fn((cb: Function) => cb(mockTxClient)),
  ...mockTxClient,
}))

const mockSubmissionRepo = vi.hoisted(() => ({
  findByMilestoneAndUser: vi.fn(),
  findById: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
}))

const mockMilestoneRepo = vi.hoisted(() => ({
  findById: vi.fn(),
  update: vi.fn(),
  findManyByProject: vi.fn(),
}))

const mockNotifRepo = vi.hoisted(() => ({ create: vi.fn() }))
const mockActivityLogRepo = vi.hoisted(() => ({ create: vi.fn() }))
const mockProjectRepo = vi.hoisted(() => ({ update: vi.fn() }))

vi.mock("@/lib/prisma", () => ({
  prisma: mockPrisma,
}))

vi.mock("@/repositories/submission.repository", () => ({
  submissionRepository: mockSubmissionRepo,
}))
vi.mock("@/repositories/milestone.repository", () => ({
  milestoneRepository: mockMilestoneRepo,
}))
vi.mock("@/repositories/notification.repository", () => ({
  notificationRepository: mockNotifRepo,
}))
vi.mock("@/repositories/activity-log.repository", () => ({
  activityLogRepository: mockActivityLogRepo,
}))
vi.mock("@/repositories/project.repository", () => ({
  projectRepository: mockProjectRepo,
}))
vi.mock("@/lib/sse", () => ({ pushEvent: vi.fn() }))

import { submissionService } from "@/services/submission.service"

describe("submissionService", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("submitMilestone", () => {
    const validMilestone = {
      id: "m1",
      title: "Setup",
      projectId: "p1",
      project: {
        title: "My Project",
        ownerId: "s1",
        class: { teacherId: "t1" },
      },
    }

    it("submits milestone successfully", async () => {
      mockMilestoneRepo.findById.mockResolvedValue(validMilestone as any)
      mockSubmissionRepo.findByMilestoneAndUser.mockResolvedValue(null)
      mockTxClient.milestoneSubmission.create.mockResolvedValue({ id: "sub1", content: "Work done" })
      mockTxClient.milestone.update.mockResolvedValue({})
      mockTxClient.activityLog.create.mockResolvedValue({})
      mockTxClient.notification.create.mockResolvedValue({})

      const result = await submissionService.submitMilestone(
        { milestoneId: "m1", content: "This is my work done here" },
        "s1", "Alice", "STUDENT"
      )

      expect(result.id).toBe("sub1")
      expect(mockTxClient.milestone.update).toHaveBeenCalledWith({
        where: { id: "m1" },
        data: { status: "SUBMITTED" },
      })
    })

    it("throws when milestone not found", async () => {
      mockMilestoneRepo.findById.mockResolvedValue(null)
      await expect(
        submissionService.submitMilestone({ milestoneId: "bad", content: "Work done" }, "s1", "Alice", "STUDENT")
      ).rejects.toThrow("Milestone not found")
    })

    it("throws when already submitted", async () => {
      mockMilestoneRepo.findById.mockResolvedValue(validMilestone as any)
      mockSubmissionRepo.findByMilestoneAndUser.mockResolvedValue({ id: "existing" })

      await expect(
        submissionService.submitMilestone({ milestoneId: "m1", content: "Work done" }, "s1", "Alice", "STUDENT")
      ).rejects.toThrow("Already submitted")
    })

    it("throws when student tries to submit another's project", async () => {
      mockMilestoneRepo.findById.mockResolvedValue(validMilestone as any)
      mockSubmissionRepo.findByMilestoneAndUser.mockResolvedValue(null)

      await expect(
        submissionService.submitMilestone({ milestoneId: "m1", content: "Work done" }, "s2", "Bob", "STUDENT")
      ).rejects.toThrow("Not your project")
    })
  })

  describe("gradeSubmission", () => {
    const validSubmission = {
      id: "sub1",
      content: "My work",
      userId: "s1",
      milestoneId: "m1",
      milestone: {
        title: "Setup",
        projectId: "p1",
        project: { class: { teacherId: "t1" } },
      },
    }

    it("grades and approves when grade >= 50", async () => {
      mockSubmissionRepo.findById.mockResolvedValue(validSubmission as any)
      mockTxClient.milestoneSubmission.update.mockResolvedValue({ id: "sub1", grade: 85 })
      mockTxClient.milestone.update.mockResolvedValue({})
      mockTxClient.milestone.findMany.mockResolvedValue([
        { weight: 2, status: "SUBMITTED" },
        { weight: 3, status: "APPROVED" },
      ])
      mockTxClient.notification.create.mockResolvedValue({})
      mockTxClient.project.update.mockResolvedValue({})

      const result = await submissionService.gradeSubmission(
        { submissionId: "sub1", grade: 85 },
        "t1",
        "TEACHER"
      )

      expect(result.grade).toBe(85)
      expect(mockTxClient.milestone.update).toHaveBeenCalledWith({
        where: { id: "m1" },
        data: { status: "APPROVED", completedAt: expect.any(Date) },
      })
    })

    it("grades and rejects when grade < 50", async () => {
      mockSubmissionRepo.findById.mockResolvedValue(validSubmission as any)
      mockTxClient.milestoneSubmission.update.mockResolvedValue({ id: "sub1", grade: 40 })
      mockTxClient.milestone.update.mockResolvedValue({})
      mockTxClient.milestone.findMany.mockResolvedValue([{ weight: 1, status: "SUBMITTED" }])
      mockTxClient.notification.create.mockResolvedValue({})
      mockTxClient.project.update.mockResolvedValue({})

      const result = await submissionService.gradeSubmission(
        { submissionId: "sub1", grade: 40 },
        "t1",
        "TEACHER"
      )

      expect(result.grade).toBe(40)
      expect(mockTxClient.milestone.update).toHaveBeenCalledWith({
        where: { id: "m1" },
        data: { status: "REJECTED", completedAt: expect.any(Date) },
      })
    })

    it("throws when submission not found", async () => {
      mockSubmissionRepo.findById.mockResolvedValue(null)
      await expect(
        submissionService.gradeSubmission({ submissionId: "bad", grade: 85 }, "t1", "TEACHER")
      ).rejects.toThrow("Submission not found")
    })

    it("throws when user is not TEACHER or ADMIN", async () => {
      mockSubmissionRepo.findById.mockResolvedValue(validSubmission as any)
      await expect(
        submissionService.gradeSubmission({ submissionId: "sub1", grade: 85 }, "s1", "STUDENT")
      ).rejects.toThrow("Only teachers can grade submissions")
    })

    it("throws when TEACHER tries to grade another class's project", async () => {
      const otherClassSubmission = {
        ...validSubmission,
        milestone: {
          ...validSubmission.milestone,
          project: { class: { teacherId: "other-teacher" } },
        },
      }
      mockSubmissionRepo.findById.mockResolvedValue(otherClassSubmission as any)
      await expect(
        submissionService.gradeSubmission({ submissionId: "sub1", grade: 85 }, "t1", "TEACHER")
      ).rejects.toThrow("Not your class's project")
    })

    it("allows ADMIN to grade any project", async () => {
      mockSubmissionRepo.findById.mockResolvedValue(validSubmission as any)
      mockTxClient.milestoneSubmission.update.mockResolvedValue({ id: "sub1", grade: 85 })
      mockTxClient.milestone.update.mockResolvedValue({})
      mockTxClient.milestone.findMany.mockResolvedValue([{ weight: 1, status: "SUBMITTED" }])
      mockTxClient.notification.create.mockResolvedValue({})
      mockTxClient.project.update.mockResolvedValue({})

      const result = await submissionService.gradeSubmission(
        { submissionId: "sub1", grade: 85 },
        "admin1",
        "ADMIN"
      )

      expect(result.grade).toBe(85)
    })
  })
})
