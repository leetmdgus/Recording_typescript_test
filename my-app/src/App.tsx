import { Routes, Route, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import RecordingPage from './pages/RecordingPage'
import MainPage from './Mainpage'
import SeniorDetails from './pages/Senior_details'
import Counsel from './pages/Counsel'
import CounselEnd from './pages/CounselEnd'
import Management from './pages/Management';
import Calendar from './pages/Calendar';

const Page = styled.div`
  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding: 16px;
`
const Card = styled.div`
  width: min(760px, 92vw);
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(8px);
  border: 1px solid var(--bd);
  border-radius: 20px;
  padding: clamp(16px, 3.5vw, 32px);
  box-shadow: 0 24px 60px rgba(15,23,42,0.1);
  text-align: center;
`
const H1 = styled.h1`
  margin: 0 0 8px;
  font-size: clamp(22px, 3.5vw, 32px);
  font-weight: 800;
  letter-spacing: -0.4px;
`
const Desc = styled.p`
  margin: 6px 0 0;
  color: var(--txt-muted);
`
const Row = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 18px;
`
const Button = styled.button<{ intent?: 'primary' | 'neutral' }>`
  appearance: none;
  border: 1px solid var(--bd);
  background: #fff;
  color: var(--txt-strong);
  padding: 12px 16px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  transition: transform .08s ease, box-shadow .2s ease, background .2s ease, opacity .2s ease;
  box-shadow: 0 6px 16px rgba(2,6,23,0.06);

  ${({ intent }) => intent === 'primary' && `
    color: #fff;
    border-color: transparent;
    background: linear-gradient(135deg, #2563eb 0%, #7c3aed 60%, #db2777 100%);
  `}
`

function Home() {
  const navigate = useNavigate()
  return (
    <Page>
      <Card>
        <H1>React Audio Demo</H1>
        <Desc>간단한 녹음 데모 · /RecordingPage로 이동합니다</Desc>
        <Row>
          <Button intent="primary" onClick={() => navigate('/RecordingPage')}>
            🎙️ RecordingPage로 이동
          </Button>
        </Row>
        <Desc style={{ marginTop: 12 }}>Tip: 마이크 권한은 페이지에서 요청합니다.</Desc>
      </Card>
    </Page>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/home" element={<Home />} />
      <Route path="/Senior_details" element={<SeniorDetails />} />
      <Route path="/Counsel" element={<Counsel />} />
      <Route path="/RecordingPage" element={<RecordingPage />} />
      <Route path="/CounselEnd" element={<CounselEnd />} />
      <Route path="/management" element={<Management />} />
      <Route path="/calendar" element={<Calendar />} />
    </Routes>
  )
}
