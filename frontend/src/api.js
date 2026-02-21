import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
});

export const getSubjects = () => api.get('/subjects/');
export const createSubject = (data) => api.post('/subjects/', data);

export const getNotes = (subjectId) => api.get(`/notes/${subjectId}`);
export const createNote = (data) => api.post('/notes/', data);

export const getExams = () => api.get('/exams/');
export const createExam = (data) => api.post('/exams/', data);

export const getFlashcards = (subjectId) => api.get(`/flashcards/${subjectId}`);
export const createFlashcard = (data) => api.post('/flashcards/', data);

export const generateStudyMaterial = (data) => api.post('/ai/generate/', data);

export default api;
