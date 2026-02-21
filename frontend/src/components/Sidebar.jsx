import { useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Calendar,
    Wand2,
    GraduationCap,
    Flower2
} from 'lucide-react';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { title: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/' },
        { title: 'Exams', icon: <Calendar size={18} />, path: '/exams' },
        { title: 'AI Generator', icon: <Wand2 size={18} />, path: '/generate' },
    ];

    return (
        <div className="sidebar">
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem', padding: '0 0.5rem' }}>
                <div style={{
                    width: '40px', height: '40px', borderRadius: '12px',
                    background: 'linear-gradient(135deg, #ef7a9a, #fb7185)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(239,122,154,0.3)'
                }}>
                    <Flower2 color="white" size={22} />
                </div>
                <span style={{ fontSize: '1.35rem', fontWeight: '700', fontFamily: "'Playfair Display', serif" }} className="gradient-text">
                    StudyFlow
                </span>
            </div>

            {/* Nav */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.75rem',
                                padding: '0.7rem 1rem', borderRadius: '0.75rem',
                                border: 'none', cursor: 'pointer',
                                fontSize: '0.9rem', fontWeight: isActive ? '600' : '500',
                                fontFamily: "'DM Sans', sans-serif",
                                background: isActive ? 'linear-gradient(135deg, rgba(239,122,154,0.12), rgba(251,113,133,0.08))' : 'transparent',
                                color: isActive ? '#d42a5e' : '#8c6275',
                                transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(252,232,238,0.6)'; e.currentTarget.style.color = '#b81e4b'; } }}
                            onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#8c6275'; } }}
                        >
                            {item.icon}
                            <span>{item.title}</span>
                        </button>
                    );
                })}
            </nav>

            {/* Bottom card */}
            <div style={{ marginTop: 'auto', padding: '1rem', borderRadius: '1rem', background: 'linear-gradient(135deg, #fce4ea, #ffe4e6)', border: '1px solid #f5dce3' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <GraduationCap size={16} style={{ color: '#d42a5e' }} />
                    <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#d42a5e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Study Pro</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#8c6275', lineHeight: '1.4' }}>AI Credits: 45 / 50 remaining</p>
            </div>
        </div>
    );
};

export default Sidebar;
