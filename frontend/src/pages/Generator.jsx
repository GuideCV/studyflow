import { useState, useEffect } from 'react';
import { getSubjects, generateStudyMaterial } from '../api';
import { Wand2, Sparkles, FileText, Brain, Lightbulb, CheckCircle2 } from 'lucide-react';

const Generator = () => {
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [resourceText, setResourceText] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => { getSubjects().then(r => setSubjects(r.data)).catch(console.error); }, []);

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (!selectedSubject) return;
        setLoading(true); setSuccess(false);
        try {
            await generateStudyMaterial({ resource_text: resourceText, subject_id: parseInt(selectedSubject) });
            setSuccess(true); setResourceText('');
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    return (
        <div className="animate-fade-up" style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
            <div className="blob-bg" style={{ width: '450px', height: '450px', background: '#fce4ea', top: '-120px', left: '-100px' }} />
            <div className="blob-bg" style={{ width: '300px', height: '300px', background: '#ffe4e6', bottom: '0', right: '-80px' }} />

            {/* Header */}
            <header style={{ textAlign: 'center', marginBottom: '2.5rem', position: 'relative', zIndex: 1 }}>
                <div style={{
                    width: '64px', height: '64px', borderRadius: '20px', margin: '0 auto 1.25rem',
                    background: 'linear-gradient(135deg, #ef7a9a, #fb7185)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 8px 24px rgba(239,122,154,0.25)'
                }}>
                    <Wand2 color="white" size={28} />
                </div>
                <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>AI Study <span className="gradient-text">Assistant</span></h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '500px', margin: '0 auto', lineHeight: '1.6' }}>
                    Paste your learning resources and let AI craft notes and flashcards tailored to your subject.
                </p>
            </header>

            {/* Main form card */}
            <div className="card" style={{ padding: '2.5rem', position: 'relative', zIndex: 1, overflow: 'hidden' }}>
                {/* Loading Overlay */}
                {loading && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(254,246,248,0.9)', backdropFilter: 'blur(4px)', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: '40px', height: '40px', border: '3px solid var(--pink-200)', borderTopColor: 'var(--pink-500)', borderRadius: '50%', marginBottom: '1rem' }} className="animate-spin" />
                        <h3 style={{ fontSize: '1.15rem', fontFamily: "'Playfair Display', serif", marginBottom: '0.35rem' }}>Synthesizing Knowledge...</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Analyzing your resource and creating materials.</p>
                    </div>
                )}

                {/* Success banner */}
                {success && (
                    <div style={{ marginBottom: '1.5rem', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', background: '#dcfce7', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#166534', fontSize: '0.875rem', fontWeight: '500' }}>
                        <CheckCircle2 size={18} />
                        <span>Materials generated! Check your subject dashboard.</span>
                    </div>
                )}

                <form onSubmit={handleGenerate}>
                    {/* Step 1 */}
                    <div style={{ marginBottom: '2rem' }}>
                        <label className="label">1. Choose Subject</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.6rem' }}>
                            {subjects.map(s => (
                                <button key={s.id} type="button" onClick={() => setSelectedSubject(s.id)}
                                    style={{
                                        padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1.5px solid',
                                        borderColor: selectedSubject === s.id ? 'var(--pink-400)' : 'var(--border-light)',
                                        background: selectedSubject === s.id ? 'var(--pink-50)' : 'var(--bg-input)',
                                        color: selectedSubject === s.id ? 'var(--pink-700)' : 'var(--text-secondary)',
                                        fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer',
                                        fontFamily: "'DM Sans', sans-serif", textAlign: 'left',
                                        transition: 'all 0.2s ease'
                                    }}>
                                    {s.name}
                                </button>
                            ))}
                            {subjects.length === 0 && (
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic', gridColumn: '1 / -1', padding: '0.5rem 0' }}>No subjects yet—create one first!</p>
                            )}
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div style={{ marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <label className="label" style={{ margin: 0 }}>2. Paste Resource Text</label>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '500' }}>{resourceText.length} characters</span>
                        </div>
                        <textarea required rows={10} className="input-field" value={resourceText} onChange={e => setResourceText(e.target.value)}
                            placeholder="Paste textbook chapters, lecture notes, or articles here..." />
                    </div>

                    <button type="submit" className="btn-primary"
                        disabled={loading || !selectedSubject || !resourceText}
                        style={{ width: '100%', justifyContent: 'center', padding: '0.9rem', fontSize: '1rem' }}>
                        <Sparkles size={20} />
                        <span>Generate Study Materials</span>
                    </button>
                </form>
            </div>

            {/* Info cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '2rem', position: 'relative', zIndex: 1 }}>
                {[
                    { icon: <FileText size={18} style={{ color: 'var(--pink-500)' }} />, title: 'Smart Summaries', desc: 'Condensed notes highlighting key concepts.' },
                    { icon: <Brain size={18} style={{ color: 'var(--rose-500)' }} />, title: 'Flashcard Deck', desc: 'Auto-generated Q&A for active recall.' },
                    { icon: <Lightbulb size={18} style={{ color: '#f59e0b' }} />, title: 'Context Aware', desc: 'Subject-specific for better accuracy.' },
                ].map((item, i) => (
                    <div key={i} style={{ padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', background: 'white' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            {item.icon}
                            <h4 style={{ fontSize: '0.9rem', fontFamily: "'DM Sans', sans-serif", fontWeight: '600' }}>{item.title}</h4>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Generator;
