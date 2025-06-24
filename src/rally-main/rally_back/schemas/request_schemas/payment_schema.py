from pydantic import BaseModel


class RefundSchema(BaseModel):
    """the request schema for refund"""

    event_id: int
