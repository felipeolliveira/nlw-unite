from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

class __DBConnectionHandler: 
    def __init__(self) -> None:
        """
        Initializes a new instance of the DBConnect class.
        """
        self.__database_soquet='sqlite'
        self.__database_connection='storage.sqlite'
        self.__connection_string = f"{self.__database_soquet}:///{self.__database_connection}"
        self.__engine = None
        self.session = None

    def connect_to_db(self) -> None:
        """
        Connects to the database using the connection string.
        """
        self.__engine = create_engine(self.__connection_string)

    def get__engine(self):
        """
        Returns the database engine.
        """
        return self.__engine
    
    def __enter__(self):
        session_maker = sessionmaker()
        self.session = session_maker(bind=self.__engine)
        return self

    def __exit__(self, exc_type, exc_value, exc_traceback):
        self.session.close()

db_connection_handler = __DBConnectionHandler()
