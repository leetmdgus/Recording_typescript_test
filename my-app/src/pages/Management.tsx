// src/pages/CounselEnd.tsx
import styled from 'styled-components'
import { Link, useLocation } from 'react-router-dom'

/* ------------------------ styled ------------------------ */
const Page = styled.div`
  min-height: 100dvh;
  display: grid;
  grid-template-rows: auto 1fr auto;
  background: linear-gradient(180deg, #b2c8f2ff 0%, #f6f7f9ff 40%, #ffffff 100%);
  color: #0f172a;
`
const Top = styled.div`
  padding: 16px 16px 8px;
  position: relative;
  display: grid;
  place-items: center;
  gap: 10px;
`
const Title = styled.div`
  font-size: 22px; font-weight: 900;
  margin: 30px 0 15px;
  color: #3375d8ff;
`
const InfoCard = styled.div`
  width: min(680px, 90vw);
  height: 16vh;
  position:relative;
  background: #fff; border: 2px solid #8fb4ecff; border-radius: 14px;
  padding: 34px 16px; box-shadow: 0 10px 28px rgba(2,6,23,.06);
  display: grid; gap: 8px; text-align: left;
  margin-bottom: 20px;
  .cap { font-weight: 800; color:#334155; font-size:15px; text-align: center; margin-bottom:5px}
  .cap1 { font-weight: 800; color:#948f8fff; font-size:12px; text-align: center;}
  .cap2 { font-weight: 800; color:#948f8fff; font-size:12px; text-align: center;}

  img {
    position: absolute;    /* div 위에 겹치기 */
    top: -20px;             /* 위쪽에서 살짝 내려오기 */
    left: 50%;          /* 가로 중앙 */
    transform: translateX(-50%); /* 자기 크기의 절반만큼 당기기 */
    
    width: 48px;
    height: 48px;
    margin-right: 16px;
    border-radius: 24px;
    border: 1px solid #A1BBFF;
    background: #EBF1FF;
    object-fit: cover;
    object-position: center;
  }
`

const Card = styled.div`
  width: 100%;
  min-height: 0;
  overflow: auto;
  padding: 10px 12px;
  padding-bottom: 96px;
  border-radius: 22px 22px 0 0;
  margin: 0;
  box-sizing: border-box;
  background: #fff;
  border: 1px solid #e5e7eb;
  box-shadow: 0 8px 24px rgba(2,6,23,.06);
`
const Footer = styled.footer`
  position: sticky; bottom: 0; background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
  border-top: 2px solid #dcdee1ff;
  padding: 14px 16px 18px;
  display: grid; gap: 10px;
`

// const Btn = styled.button<{ intent?: 'primary'|'neutral' }>`
//   padding: 12px; border-radius: 12px; font-weight: 800; font-size: 15px; cursor: pointer;
//   border: none;
//   ${({intent}) => intent==='primary'
//     ? `background:#2563eb; color:#fff;`
//     : `background:#f1f5f9; color:#0f172a;`}
//   &:disabled { opacity:.6; cursor:not-allowed; }
// `

const BottomNav = styled.nav`
  display: grid; grid-template-columns: repeat(3,1fr); gap: 8px;
  padding-top: 6px;

  .item {
    display: grid; place-items: center; gap: 4px;
    color: #94a3b8; font-size: 18px; font-weight: 700;
    text-decoration: none;               /* Link 기본 밑줄 제거 */
    background: transparent;             /* 버튼처럼 보이게 */
    border: none;
    cursor: pointer;
    padding: 8px 0;
    border-radius: 10px;
  }
  .item.active { color:#2563eb; }
`

export default function Management() {
  // const navigate = useNavigate()
  const location = useLocation()
  console.log('location.state:', location.state)

  const { pathname } = useLocation();

  return (
    <Page>
      <Top>
        <Title>물품 관리</Title>

        <InfoCard>
          <img src="/senior_details_img/AI_profile.png" alt="Status Icon" />
          <div className="cap">아직 알파 테스트 단계입니다.</div>
          <div className="cap1">조금만 기다려 주세요.</div>
          <div className="cap2">
          </div>
        </InfoCard>
      </Top>

      <Card>

      </Card>

      <Footer>
        {/* 하단 탭 (형식만) */}
        {/* <BottomNav>
          <div className="item">📄</div>
          <div className="item">🏠</div>
          <div className="item">📅</div>
        </BottomNav> */}

        <BottomNav>
      <Link
        to="/management"
        className={`item ${pathname.startsWith('/management') ? 'active' : ''}`}
        aria-label="Management"
      >
        📄
      </Link>

      <Link
        to="/"
        className={`item ${pathname === '/' ? 'active' : ''}`}
        aria-label="Home"
      >
        🏠
      </Link>

      <Link
        to="/calendar"
        className={`item ${pathname.startsWith('/calendar') ? 'active' : ''}`}
        aria-label="Calendar"
      >
        📅
      </Link>
    </BottomNav>


      </Footer>
    </Page>
  )
}
