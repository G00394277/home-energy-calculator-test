from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import Base, engine, get_db
from models import Appliance
from schemas import ApplianceCreate, ApplianceRead

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Home Energy Calculator - Appliance Service", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok", "service": "appliance-service"}


@app.get("/appliances", response_model=list[ApplianceRead])
def list_appliances(db: Session = Depends(get_db)):
    return db.query(Appliance).order_by(Appliance.manufacturer, Appliance.model).all()


@app.post("/appliances", response_model=ApplianceRead, status_code=status.HTTP_201_CREATED)
def create_appliance(data: ApplianceCreate, db: Session = Depends(get_db)):
    appliance = Appliance(**data.model_dump())
    db.add(appliance)
    db.commit()
    db.refresh(appliance)
    return appliance


@app.get("/appliances/{appliance_id}", response_model=ApplianceRead)
def get_appliance(appliance_id: int, db: Session = Depends(get_db)):
    appliance = db.get(Appliance, appliance_id)
    if appliance is None:
        raise HTTPException(status_code=404, detail="Appliance not found")
    return appliance


@app.put("/appliances/{appliance_id}", response_model=ApplianceRead)
def update_appliance(appliance_id: int, data: ApplianceCreate, db: Session = Depends(get_db)):
    appliance = db.get(Appliance, appliance_id)
    if appliance is None:
        raise HTTPException(status_code=404, detail="Appliance not found")
    for key, value in data.model_dump().items():
        setattr(appliance, key, value)
    db.commit()
    db.refresh(appliance)
    return appliance


@app.delete("/appliances/{appliance_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_appliance(appliance_id: int, db: Session = Depends(get_db)):
    appliance = db.get(Appliance, appliance_id)
    if appliance is None:
        raise HTTPException(status_code=404, detail="Appliance not found")
    db.delete(appliance)
    db.commit()
    return None
