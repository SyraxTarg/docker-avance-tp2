"""This file contains the enum containing the actions"""

from enum import Enum


class ActionEnum(str, Enum):
    """Enum used for action logs"""

    LOGIN = "login"
    REGISTRATION = "registration"
    LOGOUT = "logout"
    EVENT_CREATED = "event_created"
    EVENT_UPDATED = "event_updated"
    EVENT_DELETED = "event_deleted"
    EVENT_REGISTERED = "event_registered"
    EVENT_UNREGISTERED = "event_unregistered"
    USER_BANNED = "user_banned"
    PAYMENT_FAILED = "payment_failed"
    USER_SIGNALED = "user_signaled"
    USER_UNSIGNALED = "user_unsignaled"
    COMMENT_SIGNALED = "comment_signaled"
    COMMENT_BANNED = "comment_banned"
    COMMENT_UNSIGNALED = "comment_unsignaled"
    EVENT_SIGNALED = "event_signaled"
    EVENT_UNSIGNALED = "event_unsignaled"
    EVENT_BANNED = "event_banned"
    PROFILE_UPDATED = "profile_updated"
    TYPE_CREATED = "type_created"
    TYPE_DELETED = "type_deleted"
    REASON_CREATED = "reason_created"
    REASON_DELETED = "reason_deleted"
    EMAIL_UNBANNED = "email_unbanned"
