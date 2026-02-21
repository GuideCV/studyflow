import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getNotes, createNote, getFlashcards, createFlashcard } from '../api';
import { ChevronLeft, Plus, FileText, Brain, Play, X, ChevronRight } from 'lucide-react';

const Notes = () => {
    const { subjectId } = useParams();
    const navigate = useNavigate();
    const [view, setView] = useState('notes');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [showCardModal, setShowCardModal] = useState(false);
    const [showStudyModal, setShowStudyModal] = useState(false);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [newNote, setNewNote] = useState({ title: '', content: '' });
    const [newCard, setNewCard] = useState({ front: '', back: '' });

    useEffect(() => { fetchData(); }, [subjectId, view]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data: d } = view === 'notes' ? await getNotes(subjectId) : await getFlashcards(subjectId);
            setData(d);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleCreateNote = async (e) => {
        e.preventDefault();
        await createNote({ ...newNote, subject_id: parseInt(subjectId) });
        fetchData(); setShowNoteModal(false); setNewNote({ title: '', content: '' });
    };

    const handleCreateCard = async (e) => {
        e.preventDefault();
        await createFlashcard({ ...newCard, subject_id: parseInt(subjectId) });
        fetchData(); setShowCardModal(false); setNewCard({ front: '', back: '' });
    };

    return (
        <div className="animate-fade-up" style={{ position: 'relative' }}>
            <div className="blob-bg" style={{ width: '350px', height: '350px', background: '#fce4ea', top: '-80px', right: '-60px' }} />

            {/* Back */}
            <button onClick={() => navigate('/')}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '500', fontFamily: "'DM Sans', sans-serif", marginBottom: '1.5rem', padding: 0, transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--pink-600)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
                <ChevronLeft size={18} />
                <span>Back to Dashboard</span>
            </button>

            {/* Toolbar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', position: 'relative', zIndex: 1 }}>
                {/* Tabs */}
                <div style={{ display: 'flex', background: 'var(--bg-warm)', padding: '4px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
                    {[{ key: 'notes', label: 'Notes', icon: <FileText size={16} /> }, { key: 'flashcards', label: 'Flashcards', icon: <Brain size={16} /> }].map(tab => (
                        <button key={tab.key} onClick={() => setView(tab.key)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.55rem 1.25rem',
                                borderRadius: '0.6rem', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600',
                                fontFamily: "'DM Sans', sans-serif",
                                background: view === tab.key ? 'white' : 'transparent',
                                color: view === tab.key ? 'var(--pink-600)' : 'var(--text-muted)',
                                boxShadow: view === tab.key ? 'var(--shadow-sm)' : 'none',
                                transition: 'all 0.2s ease',
                            }}>
                            {tab.icon}
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                    <button className="btn-outline" onClick={() => { if (view === 'flashcards' && data.length) { setCurrentCardIndex(0); setFlipped(false); setShowStudyModal(true); } }}
                        disabled={view === 'notes' || data.length === 0}
                        style={{ opacity: view === 'notes' || data.length === 0 ? 0.4 : 1 }}>
                        <Play size={16} />
                        <span>Study</span>
                    </button>
                    <button className="btn-primary" onClick={() => view === 'notes' ? setShowNoteModal(true) : setShowCardModal(true)}>
                        <Plus size={18} />
                        <span>Add {view === 'notes' ? 'Note' : 'Card'}</span>
                    </button>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem 0' }}>
                    <div style={{ width: '36px', height: '36px', border: '3px solid var(--pink-200)', borderTopColor: 'var(--pink-500)', borderRadius: '50%' }} className="animate-spin" />
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem', position: 'relative', zIndex: 1 }}>
                    {view === 'notes' ? (
                        data.map(note => (
                            <div key={note.id} className="card" style={{ padding: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                    <h3 style={{ fontSize: '1.1rem' }}>{note.title}</h3>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{new Date(note.created_at).toLocaleDateString()}</span>
                                </div>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.65', display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    {note.content}
                                </p>
                            </div>
                        ))
                    ) : (
                        data.map(card => (
                            <div key={card.id} className="card" style={{ padding: '1.5rem', minHeight: '180px', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
                                <span className="label" style={{ textAlign: 'center' }}>Question</span>
                                <p style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', lineHeight: '1.5' }}>{card.front}</p>
                                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem' }}>
                                    <span className="label" style={{ textAlign: 'center' }}>Answer</span>
                                    <p style={{ color: 'var(--pink-600)', fontWeight: '600', fontSize: '0.9rem' }}>{card.back}</p>
                                </div>
                            </div>
                        ))
                    )}

                    {data.length === 0 && (
                        <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 2rem' }}>
                            <p style={{ color: 'var(--text-muted)' }}>No {view} found. Create some to get started!</p>
                        </div>
                    )}
                </div>
            )}

            {/* Note Modal */}
            {showNoteModal && (
                <div className="modal-overlay" onClick={() => setShowNoteModal(false)}>
                    <div className="modal-body" style={{ maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
                        <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem' }}>Create Note</h2>
                        <form onSubmit={handleCreateNote}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label className="label">Title</label>
                                <input required className="input-field" value={newNote.title} onChange={e => setNewNote({ ...newNote, title: e.target.value })} placeholder="Note title" />
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label className="label">Content</label>
                                <textarea required rows={8} className="input-field" value={newNote.content} onChange={e => setNewNote({ ...newNote, content: e.target.value })} placeholder="Write your note content here..." />
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <button type="button" className="btn-outline" style={{ flex: 1 }} onClick={() => setShowNoteModal(false)}>Cancel</button>
                                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Save Note</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Card Modal */}
            {showCardModal && (
                <div className="modal-overlay" onClick={() => setShowCardModal(false)}>
                    <div className="modal-body" style={{ maxWidth: '440px' }} onClick={e => e.stopPropagation()}>
                        <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem' }}>Create Flashcard</h2>
                        <form onSubmit={handleCreateCard}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label className="label">Question (Front)</label>
                                <textarea required rows={3} className="input-field" value={newCard.front} onChange={e => setNewCard({ ...newCard, front: e.target.value })} placeholder="What is photosynthesis?" />
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label className="label">Answer (Back)</label>
                                <textarea required rows={3} className="input-field" value={newCard.back} onChange={e => setNewCard({ ...newCard, back: e.target.value })} placeholder="The process plants use to convert light energy..." />
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <button type="button" className="btn-outline" style={{ flex: 1 }} onClick={() => setShowCardModal(false)}>Cancel</button>
                                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Save Card</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Study Modal */}
            {showStudyModal && data.length > 0 && (
                <div style={{ position: 'fixed', inset: 0, background: 'var(--bg-base)', zIndex: 60, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                    <div className="blob-bg" style={{ width: '500px', height: '500px', background: '#fce4ea', top: '-150px', left: '-100px' }} />

                    <button onClick={() => setShowStudyModal(false)}
                        style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.5rem' }}
                        onMouseEnter={e => e.currentTarget.style.color = 'var(--pink-600)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                    >
                        <X size={28} />
                    </button>

                    <div style={{ width: '100%', maxWidth: '520px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                        <p className="label" style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '0.8rem' }}>
                            Card {currentCardIndex + 1} of {data.length}
                        </p>

                        <div className="card" onClick={() => setFlipped(!flipped)}
                            style={{ minHeight: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2.5rem', cursor: 'pointer', borderColor: flipped ? 'var(--pink-300)' : 'var(--border-light)' }}>
                            <div className="animate-fade-in" key={`${currentCardIndex}-${flipped}`}>
                                <span className="label" style={{ textAlign: 'center' }}>{flipped ? 'Answer' : 'Question'}</span>
                                <p style={{ fontSize: '1.35rem', fontWeight: '600', lineHeight: '1.6', marginTop: '0.75rem', color: flipped ? 'var(--pink-600)' : 'var(--text-primary)' }}>
                                    {flipped ? data[currentCardIndex].back : data[currentCardIndex].front}
                                </p>
                                {!flipped && <p style={{ marginTop: '2rem', fontSize: '0.8rem', color: 'var(--text-muted)' }} className="animate-pulse">Tap to reveal answer</p>}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem' }}>
                            <button className="btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '0.85rem' }}
                                onClick={() => { setFlipped(false); setCurrentCardIndex(p => (p + 1) % data.length); }}>
                                <span>Next Card</span>
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notes;
