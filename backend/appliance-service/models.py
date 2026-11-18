from sqlalchemy import Column, Float, Integer, String
from database import Base


class Appliance(Base):
    __tablename__ = "appliances"

    id = Column(Integer, primary_key=True, index=True)
    image_url = Column(String(1000), nullable=True)
    manufacturer = Column(String(120), nullable=False)
    model = Column(String(120), nullable=False)
    output_kw = Column(Float, nullable=False)
    efficiency_percent = Column(Float, nullable=False)
    description = Column(String(2000), nullable=True)
