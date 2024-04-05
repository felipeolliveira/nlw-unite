import pytest
from src.models.settings import db_connection_handler
from .events_repository import EventsRepository

db_connection_handler.connect_to_db()

@pytest.mark.skip(reason='new event will be inserted in the database, so this test will fail if run more than once')
def test_insert_event():
    event = {
        'uuid': 'uuid-test-event',
        'title': 'Test Event',
        'slug': 'test-event',
        'maximum_attendees': 100,
    }

    event_repository = EventsRepository()
    response = event_repository.insert_event(event)
    print(response)

def test_get_event_by_id():
    event_id = 'uuid-test-event'

    event_repository = EventsRepository()
    response = event_repository.get_event_by_id(event_id)
    print(response)