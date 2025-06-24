"""This file contains the comment repository"""
from typing import Optional
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import func
from models.comment_model import Comment
from models.event_model import Event
from models.profile_model import Profile
from models.user_model import User


def add_new_comment(db: Session, comment: Comment)->None:
    """
    Adding a new comment in database.

    Args:
        db (Session): The database session used to interact with the database.
        comment (Comment): The comment we want to add.
    """
    db.add(comment)

def commit_comment(db: Session)->None:
    """
    Commiting changes in the database

    Args:
        db (Session): The database session used to interact with the database.
    """
    db.commit()

def delete_comment(db: Session, comment: Comment)->None:
    """
    Deleting a comment from the database.

    Args:
        db (Session): The database session used to interact with the database.
        comment (Comment): The comment we want to delete.
    """
    db.delete(comment)

def refresh_comment(db: Session, comment: Comment)->None:
    """
    Refreshing an object

    Args:
        db (Session): The database session used to interact with the database.
        comment (Comment): The comment to refresh
    """
    db.refresh(comment)

def get_comment_by_event_id(db: Session, event_id: int, offset: int, limit: int)->list[Comment]:
    """
    Fetching comments by their event.

    Args:
        db (Session): The database session used to interact with the database.
        event_id (int): The id of the event
        offset (int): offset for pagination
        limit (int): limit for pagination

    Returns:
        list[Comment]
    """
    return db.query(Comment).filter(Comment.event_id == event_id).offset(offset).limit(limit).all()


def get_all_comments_by_event_id(db: Session, event_id: int)->list[Comment]:
    """
    Fetching comments by their event.

    Args:
        db (Session): The database session used to interact with the database.
        event_id (int): The id of the event

    Returns:
        list[Comment]
    """
    return db.query(Comment).filter(Comment.event_id == event_id).all()


def get_all_comments_by_user_id(db: Session, user_id: int)->list[Comment]:
    """
    Fetching comments by their user.

    Args:
        db (Session): The database session used to interact with the database.
        user_id (int): The id of the user


    Returns:
        list[Comment]
    """
    return db.query(Comment).filter(Comment.profile_id == user_id).all()


def get_all_comments(
    db: Session,
    offset: int,
    limit: int,
    email: Optional[str],
    event_email: Optional[str],
    date: Optional[datetime],
    search: Optional[str]
) -> list[Comment]:
    """
    Fetch all comments with optional filters.
    """
    query = db.query(Comment)

    if event_email is not None:
        query = query.join(Comment.event).join(Event.profile).join(Profile.user).filter(User.email == event_email)

    if email is not None:
        query = query.join(Comment.profile).join(Profile.user).filter(User.email == email)

    if date is not None:
        query = query.filter(func.date(Comment.created_at) == date.date())

    if search is not None:
        query = query.filter(Comment.content.ilike(f"%{search}%"))

    return query.offset(offset).limit(limit).all()


def get_all_comments_total_count(
    db: Session,
    event_id: Optional[int],
    profile_id: Optional[int],
    email: Optional[str],
    event_email: Optional[str],
    date: Optional[datetime],
    search: Optional[str],
)->int:
    """
    Fetching all the comments.

    Args:
        db (Session): The database session used to interact with the database.
        offset (int): offset for pagination
        limit (int): limit for pagination

    Returns:
        list[Comment]
    """
    query = db.query(Comment)

    if event_id is not None:
        query = query.filter(Comment.event_id == event_id)

    if profile_id is not None:
        query = query.filter(Comment.profile_id == profile_id)

    if event_email is not None:
        query = query.join(Comment.event).join(Event.profile).join(Profile.user).filter(User.email == event_email)

    if email is not None:
        query = query.join(Comment.profile).join(Profile.user).filter(User.email == email)

    if date is not None:
        query = query.filter(func.date(Comment.created_at) == date.date())

    if search is not None:
        query = query.filter(Comment.content.ilike(f"%{search}%"))

    return query.count()

def get_comment_by_id(db: Session, comment_id: int)->Comment:
    """
    Fetching comment by its id.

    Args:
        db (Session): The database session used to interact with the database.
        id (int): comment id

    Returns:
        Comment
    """
    return db.query(Comment).filter(Comment.id == comment_id).first()

def get_comments_by_profile_id(db: Session, profile_id: int, offset: int, limit: int)->list[Comment]:
    """
    Fetching comments by their profile.

    Args:
        db (Session): The database session used to interact with the database.
        profile_id (int): profile id
        offset (int): offset for pagination
        limit (int): limit for pagination

    Returns:
        list[Comment]
    """
    return db.query(Comment).filter(Comment.profile_id == profile_id).offset(offset).limit(limit).all()
