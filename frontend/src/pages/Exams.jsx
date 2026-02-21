import { useState, useEffect } from 'react';
import { getExams, createExam } from '../api';
import { Plus, Clock, CalendarHeart } from 'lucide-react';

const Exams = () => {
    const [exams, setExams] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newExam, setNewExam] = useState({ name: '', date: '', description: '' });

    useEffect(() => { fetchExams(); }, []);

    const fetchExams = async () => {
        try { const { data } = await getExams(); setExams(data); }
        catch (e) { console.error(e); }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        await createExam({ ...newExam, date: new Date(newExam.date).toISOString() });
        fetchExams(); setShowModal(false); setNewExam({ name: '', date: '', description: '' });
    };

    const isPast = (d) => new Date(d) < new Date();

    return (
        <div className="animate-fade-up" style={{ position: 'relative' }}>
            <div className="blob-bg" style={{ width: '400px', height: '400px', background: '#ffe4e6', top: '-100px', right: '-80px' }} />

            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', position: 'relative', zIndex: 1 }}>
                <div>
                    <h1 style={{ fontSize: '2.25rem', marginBottom: '0.35rem' }}>Important <span className="gradient-text">Exams</span></h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Stay on top of your upcoming assessments and deadlines.</p>
                </div>
                <button className="btn-primary" onClick={() => setShowModal(true)}>
                    <Plus size={18} />
                    <span>Add Exam</span>
                </button>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', position: 'relative', zIndex: 1 }}>
                {exams.map((exam, i) => {
                    const past = isPast(exam.date);
                    const dt = new Date(exam.date);
                    return (
                        <div key={exam.id} className="card" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', animationDelay: `${i * 0.06}s` }}>
                            {/* Date box */}
                            <div style={{
                                width: '56px', height: '56px', borderRadius: '14px', flexShrink: 0,
                                background: past ? '#f1f5f9' : 'linear-gradient(135deg, #fce4ea, #ffe4e6)',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                color: past ? '#94a3b8' : 'var(--pink-600)'
                            }}>
                                <span style={{ fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase' }}>{dt.toLocaleString('default', { month: 'short' })}</span>
                                <span style={{ fontSize: '1.35rem', fontWeight: '700', lineHeight: 1 }}>{dt.getDate()}</span>
                            </div>

                            {/* Info */}
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: '1.05rem', marginBottom: '0.2rem', fontFamily: "'DM Sans', sans-serif", fontWeight: '600' }}>{exam.name}</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem', lineHeight: 1.5 }}>{exam.description}</p>
                            </div>

                            {/* Meta */}
                            <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.4rem', justifyContent: 'flex-end' }}>
                                    <Clock size={13} />
                                    <span>{dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <span className={past ? 'badge badge-gray' : 'badge badge-green'}>
                                    {past ? 'Completed' : 'Upcoming'}
                                </span>
                            </div>
                        </div>
                    );
                })}

                {exams.length === 0 && (
                    <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', margin: '0 auto 1rem', background: 'var(--pink-100)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <CalendarHeart style={{ color: 'var(--pink-500)' }} size={28} />
                        </div>
                        <h2 style={{ fontSize: '1.35rem', marginBottom: '0.5rem' }}>No exams yet</h2>
                        <p style={{ color: 'var(--text-muted)', maxWidth: '380px', margin: '0 auto', lineHeight: '1.6' }}>Schedule your first exam to keep track of deadlines.</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-body" style={{ maxWidth: '440px' }} onClick={e => e.stopPropagation()}>
                        <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem' }}>Schedule Exam</h2>
                        <form onSubmit={handleCreate}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label className="label">Exam Name</label>
                                <input required className="input-field" value={newExam.name} onChange={e => setNewExam({ ...newExam, name: e.target.value })} placeholder="e.g. Midterm Physics" />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label className="label">Date & Time</label>
                                <input required type="datetime-local" className="input-field" value={newExam.date} onChange={e => setNewExam({ ...newExam, date: e.target.value })} />
                            </div>
                            <div style={{ marginBottom: '2rem' }}>
                                <label className="label">Description</label>
                                <textarea rows={3} className="input-field" value={newExam.description} onChange={e => setNewExam({ ...newExam, description: e.target.value })} placeholder="Topics, location, or notes..." />
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <button type="button" className="btn-outline" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Schedule</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Exams;
