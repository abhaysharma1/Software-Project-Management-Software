import { notificationRepository } from "@/repositories/notification.repository"

export const notificationService = {
  async listNotifications(userId: string) {
    return notificationRepository.findManyByUser(userId)
  },

  async getUnreadCount(userId: string) {
    return notificationRepository.count({ recipientId: userId, isRead: false })
  },

  async markAsRead(id: string, userId: string) {
    const notification = await notificationRepository.findById(id)
    if (!notification || notification.recipientId !== userId) {
      throw new Error("Notification not found")
    }
    return notificationRepository.update(id, { isRead: true })
  },

  async markAllAsRead(userId: string) {
    await notificationRepository.updateMany(
      { recipientId: userId, isRead: false },
      { isRead: true }
    )
    return { success: true }
  },

  async deleteNotification(id: string, userId: string) {
    const notification = await notificationRepository.findById(id)
    if (!notification || notification.recipientId !== userId) {
      throw new Error("Notification not found")
    }
    await notificationRepository.delete(id)
    return { success: true }
  },
}
