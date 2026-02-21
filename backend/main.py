from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import datetime

import models
import schemas
import database
from database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Study Buddy API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Subjects
@app.post("/subjects/", response_model=schemas.Subject)
def create_subject(subject: schemas.SubjectCreate, db: Session = Depends(get_db)):
    db_subject = models.Subject(name=subject.name, color=subject.color)
    db.add(db_subject)
    db.commit()
    db.refresh(db_subject)
    return db_subject

@app.get("/subjects/", response_model=List[schemas.Subject])
def read_subjects(db: Session = Depends(get_db)):
    return db.query(models.Subject).all()

# Notes
@app.post("/notes/", response_model=schemas.Note)
def create_note(note: schemas.NoteCreate, db: Session = Depends(get_db)):
    db_note = models.Note(**note.dict())
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note

@app.get("/notes/{subject_id}", response_model=List[schemas.Note])
def read_notes(subject_id: int, db: Session = Depends(get_db)):
    return db.query(models.Note).filter(models.Note.subject_id == subject_id).all()

# Exams
@app.post("/exams/", response_model=schemas.Exam)
def create_exam(exam: schemas.ExamCreate, db: Session = Depends(get_db)):
    db_exam = models.Exam(**exam.dict())
    db.add(db_exam)
    db.commit()
    db.refresh(db_exam)
    return db_exam

@app.get("/exams/", response_model=List[schemas.Exam])
def read_exams(db: Session = Depends(get_db)):
    return db.query(models.Exam).all()

# Flashcards
@app.post("/flashcards/", response_model=schemas.Flashcard)
def create_flashcard(flashcard: schemas.FlashcardCreate, db: Session = Depends(get_db)):
    db_flashcard = models.Flashcard(**flashcard.dict())
    db.add(db_flashcard)
    db.commit()
    db.refresh(db_flashcard)
    return db_flashcard

@app.get("/flashcards/{subject_id}", response_model=List[schemas.Flashcard])
def read_flashcards(subject_id: int, db: Session = Depends(get_db)):
    return db.query(models.Flashcard).filter(models.Flashcard.subject_id == subject_id).all()

# AI Service Mock
@app.post("/ai/generate/")
def generate_study_material(request: schemas.AIServiceRequest, db: Session = Depends(get_db)):
    # This is a placeholder for actual AI generation logic
    # In a real app, you'd use OpenAI/Anthropic/Gemini API here
    text = request.resource_text
    
    # Simple logic to "generate" some mock cards and notes
    mock_note = models.Note(
        title=f"AI Generated Note - {datetime.datetime.now().strftime('%H:%M')}",
        content=f"Summary of resource:\n\n{text[:200]}...",
        subject_id=request.subject_id
    )
    
    mock_flashcard = models.Flashcard(
        front=f"Key Concept from Resource",
        back=f"Detail: {text[:50]}",
        subject_id=request.subject_id
    )
    
    db.add(mock_note)
    db.add(mock_flashcard)
    db.commit()
    
    return {"message": "AI generated study materials created", "note_id": mock_note.id}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
