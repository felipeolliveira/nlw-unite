from sqlalchemy import Column, String, Integer
from src.models.settings.base import Base


class Events(Base):
    """
    Represents an event entity.

    Attributes:
        id (str): The unique identifier of the event.
        title (str): The title of the event.
        details (str): The details or description of the event.
        slug (str): The slug or URL-friendly version of the event title.
        maximum_attendees (int): The maximum number of attendees allowed for the event.
    """
    __tablename__ = 'events'

    id = Column(String, primary_key=True)
    title = Column(String, nullable=False)
    details = Column(String)
    slug = Column(String, nullable=False)
    maximum_attendees = Column(Integer, nullable=False)

    def __repr__(self):
        return f"Event [id={self.id}, title={self.title}, slug={self.slug}, details={self.details}, maximum_attendees={self.maximum_attendees}]"
