from fastapi import FastAPI, Depends 
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from backend import models, database
from fastapi.middleware.cors import CORSMiddleware
import os




# Create tables if they don't exist
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

# CORS middleware
# Allow frontend to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or specify ["http://127.0.0.1:5500"] etc.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Pydantic model
class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str | None = None
    website: str | None = None
    message: str

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/contacts")
def create_contact(contact: ContactCreate, db: Session = Depends(get_db)):
    new_contact = models.Contact(**contact.dict())
    db.add(new_contact)
    db.commit()
    db.refresh(new_contact)
    return {"status": "ok", "id": new_contact.id}

@app.get("/contacts")# List all contacts
def get_contacts(db: Session = Depends(get_db)):
    contacts = db.query(models.Contact).all()
    return contacts

@app.get("/contacts/{contact_id}") # Get contact by ID
def read_contact(contact_id: int, db: Session = Depends(get_db)):
    contact = db.query(models.Contact).filter(models.Contact.id == contact_id).first()
    if contact:
        return {"id": contact.id, "name": contact.name, "email": contact.email}
    return {"error": "Contact not found"}, 404

