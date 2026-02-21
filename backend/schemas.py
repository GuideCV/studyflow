from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class FlashcardBase(BaseModel):
    front: str
    back: str
    subject_id: int

class FlashcardCreate(FlashcardBase):
    pass

class Flashcard(FlashcardBase):
    id: int
    class Config:
        from_attributes = True

class NoteBase(BaseModel):
    title: str
    content: str
    subject_id: int

class NoteCreate(NoteBase):
    pass

class Note(NoteBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class SubjectBase(BaseModel):
    name: str
    color: str

class SubjectCreate(SubjectBase):
    pass

class Subject(SubjectBase):
    id: int
    notes: List[Note] = []
    flashcards: List[Flashcard] = []
    class Config:
        from_attributes = True

class ExamBase(BaseModel):
    name: str
    date: datetime
    description: str

class ExamCreate(ExamBase):
    pass

class Exam(ExamBase):
    id: int
    class Config:
        from_attributes = True

class AIServiceRequest(BaseModel):
    resource_text: str
    subject_id: int
