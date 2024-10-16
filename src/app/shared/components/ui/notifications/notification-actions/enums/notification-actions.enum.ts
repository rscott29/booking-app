export const NotificationActions = {
    APPROVE_FRIEND_REQUEST: 'approve_friend_request',
    REJECT_FRIEND_REQUEST: 'reject_friend_request'
} as const;

export type NotificationAction = typeof NotificationActions[keyof typeof NotificationActions];
