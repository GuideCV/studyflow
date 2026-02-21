import { useState, useEffect } from 'react';
import { getSubjects, createSubject } from '../api';
import { Plus, BookOpen, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const colors = [
    { name: 'Rose', value: '#e54d78' },
    { name: 'Peach', value: '#f59e0b' },
    { name: 'Lavender', value: '#8b5cf6' },
    { name: 'Mint', value: '#10b981' },
    { name: 'Sky', value: '#3b82f6' },
];

const Dashboard = () => {
    const [subjects, setSubjects] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newSubject, setNewSubject] = useState({ name: '', color: '#e54d78' });
    const navigate = useNavigate();

    useEffect(() => { fetchSubjects(); }, []);

    const fetchSubjects = async () => {
        try { const { data } = await getSubjects(); setSubjects(data); }
        catch (e) { console.error(e); }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await createSubject(newSubject);
            fetchSubjects();
            setShowModal(false);
            setNewSubject({ name: '', color: '#e54d78' });
        } catch (e) { console.error(e); }
    };

    return (
        <div className="animate-fade-up" style={{ position: 'relative' }}>
            {/* Decorative blobs */}
            <div className="blob-bg" style={{ width: '400px', height: '400px', background: '#fce4ea', top: '-100px', right: '-100px' }} />
            <div className="blob-bg" style={{ width: '300px', height: '300px', background: '#ffe4e6', bottom: '50px', left: '-80px' }} />

            {/* Header */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', position: 'relative', zIndex: 1 }}>
                <div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '500', marginBottom: '0.25rem' }}>
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </p>
                    <h1 style={{ fontSize: '2.25rem', marginBottom: '0.35rem' }}>Welcome Back, <span className="gradient-text">Scholar</span></h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Organize your subjects and study materials in one place.</p>
                </div>
                <button className="btn-primary" onClick={() => setShowModal(true)}>
                    <Plus size={18} />
                    <span>New Subject</span>
                </button>
            </header>

            {/* Subject grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem', position: 'relative', zIndex: 1 }}>
                {subjects.map((s, i) => (
                    <div
                        key={s.id}
                        className="card"
                        onClick={() => navigate(`/notes/${s.id}`)}
                        style={{ padding: '1.5rem', cursor: 'pointer', animationDelay: `${i * 0.08}s` }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                            <div style={{
                                width: '44px', height: '44px', borderRadius: '12px',
                                background: `${s.color}15`, display: 'flex',
                                alignItems: 'center', justifyContent: 'center', color: s.color
                            }}>
                                <BookOpen size={22} />
                            </div>
                            <div style={{ display: 'flex', gap: '0.4rem' }}>
                                <span className="badge badge-pink">{s.notes.length} notes</span>
                                <span className="badge badge-pink">{s.flashcards.length} cards</span>
                            </div>
                        </div>

                        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.35rem' }}>{s.name}</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem', lineHeight: '1.5' }}>
                            Explore notes and flashcards for this subject.
                        </p>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: s.color, fontSize: '0.85rem', fontWeight: '600' }}>
                            <span>Open</span>
                            <ArrowRight size={15} />
                        </div>
                    </div>
                ))}

                {subjects.length === 0 && (
                    <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 2rem' }}>
                        <div style={{
                            width: '64px', height: '64px', borderRadius: '50%', margin: '0 auto 1rem',
                            background: 'var(--pink-100)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <Sparkles style={{ color: 'var(--pink-500)' }} size={28} />
                        </div>
                        <h2 style={{ fontSize: '1.35rem', marginBottom: '0.5rem' }}>Start Your Journey</h2>
                        <p style={{ color: 'var(--text-muted)', maxWidth: '380px', margin: '0 auto', lineHeight: '1.6' }}>
                            Create your first subject to begin organizing notes and generating flashcards with AI.
                        </p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-body" style={{ maxWidth: '440px' }} onClick={e => e.stopPropagation()}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>New Subject</h2>
                        <form onSubmit={handleCreate}>
                            <div style={{ marginBottom: '1.25rem' }}>
                                <label className="label">Subject Name</label>
                                <input
                                    autoFocus required
                                    className="input-field"
                                    value={newSubject.name}
                                    onChange={e => setNewSubject({ ...newSubject, name: e.target.value })}
                                    placeholder="e.g. Advanced Mathematics"
                                />
                            </div>
                            <div style={{ marginBottom: '2rem' }}>
                                <label className="label">Accent Color</label>
                                <div style={{ display: 'flex', gap: '0.6rem' }}>
                                    {colors.map(c => (
                                        <button key={c.value} type="button"
                                            onClick={() => setNewSubject({ ...newSubject, color: c.value })}
                                            style={{
                                                width: '36px', height: '36px', borderRadius: '50%',
                                                background: c.value, border: 'none', cursor: 'pointer',
                                                outline: newSubject.color === c.value ? `3px solid ${c.value}` : 'none',
                                                outlineOffset: '3px', transition: 'all 0.2s ease'
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <button type="button" className="btn-outline" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
