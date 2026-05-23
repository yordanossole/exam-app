import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Screen from '../components/Screen';
import TabBar from '../components/TabBar';

export default function TopicStatsPage() {
    const { state } = useAppContext();
    const { stats } = state;
    const navigate = useNavigate();

    if (!stats) return <Screen><div className="loader">Loading stats...</div></Screen>;

    return (
        <Screen style={{ background: '#f1f3fe', paddingBottom: 70 }}>
            <header style={navHeader}>
                <button onClick={() => navigate(-1)} style={backBtn}>←</button>
                <span style={title}>Detailed Performance</span>
                <div style={{ width: 32 }} />
            </header>

            <main style={{ padding: 20 }}>
                <div style={summaryCard}>
                    <div style={{ fontSize: 40, fontWeight: 700, color: '#0058bc' }}>{stats.overall_accuracy}%</div>
                    <div style={{ color: '#717786', fontSize: 14 }}>Overall Accuracy</div>
                </div>

                <h3 style={{ fontSize: 17, fontWeight: 600, color: '#181c23', marginBottom: 16 }}>Breakdown by Topic</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {stats.subject_stats.map((stat, i) => (
                        <div key={i} style={statRow}>
                            <div style={{ flex: 1 }}>
                                <div style={subjectLabel}>{stat.subject}</div>
                                <div style={topicLabel}>{stat.topic}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ ...accLabel, color: stat.accuracy > 70 ? '#006e28' : '#bc000a' }}>{stat.accuracy}%</div>
                                <div style={countLabel}>{stat.correct_count}/{stat.total_count} correct</div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <TabBar />
        </Screen>
    );
}

const navHeader = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', background: '#fff', borderBottom: '1px solid #e0e2ed' };
const backBtn = { background: 'none', border: 'none', fontSize: 24, color: '#0058bc' };
const title = { fontSize: 17, fontWeight: 600 };
const summaryCard = { background: '#fff', borderRadius: 16, padding: 32, textAlign: 'center', border: '1px solid #e0e2ed', marginBottom: 24 };
const statRow = { background: '#fff', borderRadius: 12, padding: 16, border: '1px solid #e0e2ed', display: 'flex', alignItems: 'center', justifyContent: 'space-between' };
const subjectLabel = { fontSize: 12, fontWeight: 600, color: '#0058bc', textTransform: 'uppercase' };
const topicLabel = { fontSize: 16, fontWeight: 500, color: '#181c23' };
const accLabel = { fontSize: 18, fontWeight: 700 };
const countLabel = { fontSize: 12, color: '#717786' };
