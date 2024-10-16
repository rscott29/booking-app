export const NotificationTypes = {
    FRIEND_REQUEST: 'friend_request',
    REJECT_FRIEND_REQUEST: 'reject_friend_request'
} as const;

export type NotificationTypes = typeof NotificationTypes[keyof typeof NotificationTypes];
