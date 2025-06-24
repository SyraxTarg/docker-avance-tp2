"""This file contains the registration repository"""
from datetime import datetime
from typing import Optional
from sqlalchemy.orm import Session, aliased
from sqlalchemy import func
from models.registration_model import Registration
from models.event_model import Event
from models.profile_model import Profile
from models.user_model import User
from enums.payment_status import PaymentStatusEnum

def get_number_registrations_for_event(db: Session, event_id: int)->int:
    """used to get the number of registrations from an event"""
    return db.query(Registration).filter(Registration.event_id == event_id).count()

def add_registration(db: Session, registration: Registration)->None:
    """used to add a registration in db"""
    db.add(registration)

def commit_registration(db: Session)->None:
    """used to commit changes"""
    db.commit()

def refresh_registration(db: Session, registration: Registration)->None:
    """used to refresh registration"""
    db.refresh(registration)

def get_registration_by_profile_and_event(db: Session, profile_id: int, event_id: int)->Optional[Registration]:
    """used to fetch a registration by its profile and event"""
    return db.query(Registration).filter(
        Registration.profile_id == profile_id,
        Registration.event_id == event_id
    ).first()


def get_all_registration_by_profile_and_event(db: Session, event_id: int)->list[Registration]:
    """used to fetch registrations by its event"""
    return db.query(Registration).filter(
        Registration.event_id == event_id
    ).all()

def get_registration_by_id(db: Session, registration_id: int)->Optional[Registration]:
    """used to fetch a registration by its id"""
    return db.query(Registration).filter(
        Registration.id == registration_id,
    ).first()

def delete_registration(db: Session, registration: Registration)->None:
    """used to delete a registration from db"""
    db.delete(registration)

def get_registrations_filters(
    db: Session,
    date: Optional[datetime],
    event_id: Optional[int],
    profile_id: Optional[int],
    email: Optional[str],
    event_email: Optional[str],
    payment_status: Optional[PaymentStatusEnum],
    offset: int,
    limit: int
) -> list[Registration]:
    """Used to fetch registrations from db according to given filters"""

    # Aliases pour éviter les conflits
    EventProfile = aliased(Profile)
    RegistrantProfile = aliased(Profile)
    EventUser = aliased(User)
    RegistrantUser = aliased(User)

    query = db.query(Registration)

    if date is not None:
        query = query.filter(func.date(Registration.registered_at) == date.date())

    if event_id is not None:
        query = query.filter(Registration.event_id == event_id)

    if profile_id is not None:
        query = query.filter(Registration.profile_id == profile_id)

    if payment_status is not None:
        query = query.filter(Registration.payment_status == payment_status)

    if event_email is not None:
        query = query \
            .join(Registration.event) \
            .join(EventProfile, Event.profile_id == EventProfile.id) \
            .join(EventUser, EventProfile.user_id == EventUser.id) \
            .filter(EventUser.email == event_email)

    if email is not None:
        query = query \
            .join(RegistrantProfile, Registration.profile_id == RegistrantProfile.id) \
            .join(RegistrantUser, RegistrantProfile.user_id == RegistrantUser.id) \
            .filter(RegistrantUser.email == email)

    return query.order_by(Registration.registered_at.desc()).offset(offset).limit(limit).all()


def get_registrations_from_user(db: Session, profile_id: int, offset: int, limit: int)->list[Registration]:
    """used to fetch registrations according to their user"""
    return db.query(Registration).filter(Registration.profile_id == profile_id).offset(offset).limit(limit).all()


def get_count_registrations_from_user(
    db: Session,
    profile_id: Optional[int],
    email: Optional[str],
    event_email: Optional[str],
    date: Optional[datetime],
    event_id: Optional[int],
    payment_status: Optional[PaymentStatusEnum]
) -> int:
    """Used to fetch the total count of registrations for a user"""
    # Alias pour éviter les conflits de jointure
    EventProfile = aliased(Profile)
    RegistrantProfile = aliased(Profile)
    EventUser = aliased(User)
    RegistrantUser = aliased(User)

    query = db.query(Registration)

    if profile_id is not None:
        query = query.filter(Registration.profile_id == profile_id)

    if payment_status is not None:
        query = query.filter(Registration.payment_status == payment_status)

    if event_email is not None:
        query = query \
            .join(Registration.event) \
            .join(EventProfile, Event.profile_id == EventProfile.id) \
            .join(EventUser, EventProfile.user_id == EventUser.id) \
            .filter(EventUser.email == event_email)

    if email is not None:
        query = query \
            .join(RegistrantProfile, Registration.profile_id == RegistrantProfile.id) \
            .join(RegistrantUser, RegistrantProfile.user_id == RegistrantUser.id) \
            .filter(RegistrantUser.email == email)

    if date is not None:
        query = query.filter(func.date(Registration.registered_at) == date.date())

    if event_id is not None:
        query = query.filter(Registration.event_id == event_id)

    return query.count()


def get_registrations_for_event_by_user(db: Session, profile_id: int, event_id: Optional[int], offset: int, limit: int)->list[Registration]:
    """used to fetch registrations from db according to their event and user"""
    query = db.query(Registration).join(Registration.event).filter(Event.profile_id == profile_id)

    if event_id:
        query = query.filter(Event.id == event_id)

    return query.offset(offset).limit(limit).all()
