"""This file contains the reason repository"""
from typing import Optional
from sqlalchemy.orm import Session
from models.reason_model import Reason

def add_reason(db: Session, reason: Reason)->None:
    """Used to add a reason in db"""
    db.add(reason)

def commit_reason(db: Session)->None:
    """Used to commit changes in db"""
    db.commit()

def refresh_reason(db: Session, reason: Reason)->None:
    """used to refresh a reason"""
    db.refresh(reason)

def get_reason_by_reason(db: Session, reason: str)->Optional[Reason]:
    """used to gat a reason object by its reason attribute"""
    return db.query(Reason).filter(Reason.reason == reason).first()

def get_all_reasons(db: Session, limit: Optional[int], offset: Optional[int])->list[Reason]:
    """used to fetch all the reasons from db"""
    query = db.query(Reason)

    if limit is not None:
        query = query.limit(limit)

    if offset is not None:
        query = query.offset(offset)

    return query.all()

def get_all_reasons_total_count(db: Session)->int:
    """used to fetch the total count of all the reasons from db"""
    return db.query(Reason).count()


def get_reason_by_id(db: Session, reason_id: int)->Optional[Reason]:
    """used to fetch a reason from db by its id."""
    return db.query(Reason).filter(Reason.id == reason_id).first()

def delete_reason(db: Session, reason: Reason)->None:
    """used to delete a reason from db"""
    db.delete(reason)
