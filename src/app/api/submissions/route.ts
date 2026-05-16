import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const submitSchema = z.object({
  milestoneId: z.string().uuid(),
  content: z.string().min(10).max(10000),
  notes: z.string().max(2000).optional(),
})

const gradeSchema = z.object({
  submissionId: z.string().uuid(),
  grade: z.number().int().min(0).max(100),
  feedback: z.string().max(5000).optional(),
})

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await req.json()
    const data = submitSchema.parse(body)

    const milestone = await prisma.milestone.findUnique({
      where: { id: data.milestoneId },
      include: { project: true },
    })
    if (!milestone) {
      return NextResponse.json({ error: "Milestone not found" }, { status: 404 })
    }

    if (milestone.project.ownerId !== session.user.id && session.user.role === "STUDENT") {
      return NextResponse.json({ error: "Not your project" }, { status: 403 })
    }

    // Check existing submission
    const existing = await prisma.milestoneSubmission.findFirst({
      where: { milestoneId: data.milestoneId, userId: session.user.id },
    })
    if (existing) {
      return NextResponse.json({ error: "Already submitted" }, { status: 400 })
    }

    const submission = await prisma.milestoneSubmission.create({
      data: {
        milestoneId: data.milestoneId,
        userId: session.user.id,
        content: data.content,
        notes: data.notes,
      },
    })

    await prisma.milestone.update({
      where: { id: data.milestoneId },
      data: { status: "SUBMITTED" },
    })

    await prisma.activityLog.create({
      data: {
        type: "MILESTONE_SUBMITTED",
        description: `submitted milestone "${milestone.title}"`,
        projectId: milestone.projectId,
        userId: session.user.id,
      },
    })

    // Notify teacher
    const project = await prisma.project.findUnique({
      where: { id: milestone.projectId },
      include: { class: true },
    })
    if (project) {
      await prisma.notification.create({
        data: {
          type: "STATUS_CHANGE",
          title: "Milestone Submitted",
          message: `${session.user.name} submitted "${milestone.title}" for ${project.title}`,
          recipientId: project.class.teacherId,
          senderId: session.user.id,
        },
      })
    }

    return NextResponse.json(submission, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  const session = await auth()
  if (!session || (session.user.role !== "TEACHER" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const data = gradeSchema.parse(body)

    const submission = await prisma.milestoneSubmission.findUnique({
      where: { id: data.submissionId },
      include: { milestone: { include: { project: { include: { class: true } } } } },
    })
    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 })
    }

    const updated = await prisma.milestoneSubmission.update({
      where: { id: data.submissionId },
      data: { grade: data.grade, feedback: data.feedback },
    })

    const milestoneStatus = data.grade >= 50 ? "APPROVED" : "REJECTED"
    await prisma.milestone.update({
      where: { id: submission.milestoneId },
      data: { status: milestoneStatus, completedAt: new Date() },
    })

    await prisma.activityLog.create({
      data: {
        type: milestoneStatus === "APPROVED" ? "MILESTONE_APPROVED" : "MILESTONE_REJECTED",
        description: `${milestoneStatus === "APPROVED" ? "approved" : "rejected"} milestone "${submission.milestone.title}" with grade ${data.grade}`,
        projectId: submission.milestone.projectId,
        userId: session.user.id,
      },
    })

    await prisma.notification.create({
      data: {
        type: milestoneStatus === "APPROVED" ? "MILESTONE_APPROVED" : "MILESTONE_REJECTED",
        title: `Milestone ${milestoneStatus === "APPROVED" ? "Approved" : "Rejected"}`,
        message: `Your milestone "${submission.milestone.title}" was ${milestoneStatus === "APPROVED" ? "approved" : "rejected"} with grade ${data.grade}`,
        recipientId: submission.userId,
        senderId: session.user.id,
      },
    })

    // Recalculate project completion %
    const milestones = await prisma.milestone.findMany({
      where: { projectId: submission.milestone.projectId },
    })
    const totalWeight = milestones.reduce((s, m) => s + m.weight, 0)
    const completedWeight = milestones
      .filter((m) => m.status === "APPROVED")
      .reduce((s, m) => s + m.weight, 0)
    const completionPct = totalWeight > 0 ? Math.round((completedWeight / totalWeight) * 100) : 0

    await prisma.project.update({
      where: { id: submission.milestone.projectId },
      data: { completionPct },
    })

    return NextResponse.json(updated)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
