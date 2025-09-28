import styled, { css } from 'styled-components'
import { Link,  useLocation } from 'react-router-dom'
import CircleChart from '../components/CircleChart'


type Senior = {
  id: string
  name: string
  time: string   // "13:00" 등
  badges: Array<'남성' | '여성' | '은둔형' | '우울형' | '일반'>
  address: string
  note1: string
  note2: string
}

const Page = styled.div`
  font-family: 'Pretendard',  sans-serif;
  display: grid;
  
  grid-template-rows: auto 1fr auto;
  background: #EBF1FF;
`;

const Header = styled.header`
  width: 100%;
  padding: 16px 32px;
  background: #FFFFFF;
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 2px solid #e0e0e0;

  display: flex;
  align-items: center;
  justify-content: center; /* 기본은 h1을 중앙 */

  h1 {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
    color: #333;
  }

  nav {
    position: absolute; /* h1을 중앙에 고정하기 위해 nav는 왼쪽 고정 */
    left: 32px;
    
    a {
      text-decoration: none;
      color: #333;
      font-weight: 500;
      transition: color 0.3s;
    }
  }
`;

const SeniorDetail = styled.div`
  width: 100%;
  height: 150px;
  flex-shrink: 0;
  background: #FFF;
  box-shadow: 0 -1px 13.3px 0 rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 2px 16px;
  font-family: 'Pretendard',  sans-serif;
  
  img {
    width: 108px;
    height: 108px;
  }

  .details-item {
    padding: 4px 0px 0px 20px;
    background: #FFF;
    display: flex;
    flex-direction: row;

    h2 {
      margin: 0 4px 0 0;
      min-width: 40px;
      font-size: 12px;
      font-weight: 600;
      color: #333;
    }

    p {
      margin: 0;
      font-size: 12px;
      color: #666;
    }
  }
`;


const ProfileRow = styled.div`
  display: flex;
  align-items: center; /* 세로 높이를 중앙으로 정렬합니다 */
  gap: 8px;            /* 이름과 배지 사이의 간격을 줍니다 */
  margin-bottom: 6px;
`;

const NameRow = styled.div`
  display: flex; 
  align-items: center; 
  gap: 6px; 
  justify-content: space-between;
  .name { 
    font-size: 16px; 
    font-weight: bold;
    color: #0f172a; 
  }
`

const BadgeRow = styled.div`
  display: flex; gap: 6px; flex-wrap: wrap;
`

const Badge = styled.span<{ tone?: 'blue'|'yellow'|'green'|'red'|'gray' }>`
  font-size: 11px; font-weight: 800;
  border-radius: 10px; padding: 1px 8px; border: 1px solid transparent;
  ${({ tone }) => tone === 'blue' && css`color:#2563eb; background:#dbeafe; border-color:#bfdbfe;`}
  ${({ tone }) => tone === 'yellow' && css`color:#a16207; background:#fef3c7; border-color:#fde68a;`}
  ${({ tone }) => tone === 'green' && css`color:#0435f8ff; background:#627ff0ff; border-color:#3359f4ff;`}
  ${({ tone }) => tone === 'red' && css`color:#fd4141ff; background:#ffa3a3ff; border-color:#fa8686ff;`}
  ${({ tone }) => (!tone || tone==='gray') && css`color:#475569; background:#f1f5f9; border-color:#e2e8f0;`}
`

const SectionPanel = styled.div`
  width: 100%;
`
// 첫번째 패널 - 상태
const StatusPanel = styled.div`
  width: 100%;
  position: relative; /* 내부 img를 absolute로 배치할 기준 */
  background: #EBF1FF; /* 패널 배경 */

  div {
    height: 115px;
    background: #fff;
    padding: 18px 24px;
    border-radius: 12px;
    border: 3px solid #A1BBFF;
    margin: 28px 16px 0px 16px; /* 위쪽 여백을 크게 */
    
    p {
      text-align: center;
      font-size: 14px;
      margin: 12px 4px 4px 0;
    }

    strong {
      font-weight: 700;
      font-size: 18px;
      margin: 4px 0;
    }
  }
  
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
// 두번째 패널 - 지표 (신체 / 건강 / 사회)
const MetricsPanel = styled.div`
  width: 100%;
  position: relative; /* 내부 img를 absolute로 배치할 기준 */
  background: #EBF1FF; /* 패널 배경 */
  padding: 18px 16px 0px 16px;
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;
`

const MetricsItem = styled.div`
  width: 100%;
  height: 120px;
  text-align: center;
  background: #fff;
  border-radius: 12px;
  border: 3px solid #A1BBFF;

  h2 {
    font-size: 12px; 
    font-weight: 700; 
    color: #333;
  }
`;

// 세 번째 패널 - 요약
const SummaryPanel = styled.div`
  width: 100%;
  position: relative; /* 내부 img를 absolute로 배치할 기준 */
  background: #EBF1FF; /* 패널 배경 */
  padding: 18px 16px 0px 16px;

  div {
    width: 100%;
    height: 120px;
    text-align: center;
    background: #fff;
    border-radius: 12px;
    border: 3px solid #A1BBFF;
    padding: 4px 0;
  }
  
  h1 {
    font-size: 15px;
    font-weight: 700;
    margin: 0;
    padding: 6px 0 0 0;
    text-align: center;
  }
  ul {
    padding: 10px 40px;
    margin: 4px 2px 0 0;
    text-align: left;
  }
    
  li {
    padding: 0;
    margin: 2px 0 0 0;
    font-size: 12px;
    color: #555;
    line-height: 1.4;
    text-align: left;
  }
`

// 네 번째 패널 - 상담 내역
const ConsultListPanel = styled.div`
  width: 100%;
  position: relative; /* 내부 img를 absolute로 배치할 기준 */
  background: #EBF1FF; /* 패널 배경 */
  padding: 18px 16px 0px 16px;

  div {
    width: 100%;
    height: 120px;
    text-align: center;
    background: #fff;
    border-radius: 12px;
    border: 3px solid #A1BBFF;
    padding: 4px 0;
  }

  h1 {
    font-size: 15px;
    font-weight: 700;
    margin: 0;
    padding: 6px 0 0 0;
    text-align: center;
  }
`

// 다섯 번째 패널 - 액션 버튼
const ActionPanel = styled.div`
  width: 100%;
  position: relative; /* 내부 img를 absolute로 배치할 기준 */
  background: #EBF1FF; /* 패널 배경 */
  padding: 18px 16px 30px 16px;
  margin-bottom: 60px;
  button {
    width: 100%;
    height: 60px;
    text-align: center;
    color: #fff;
    font-size: 16px;
    font-weight: 700;
  
    background: #4575F5;
    border-radius: 12px;
    border: 3px solid #4575F5;
    padding: 4px 0;
  }
`

const Footer = styled.footer`
  position: sticky; bottom: 0; background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
  border-top: 2px solid #dcdee1ff;
  padding: 14px 16px 18px;
  display: grid; gap: 10px;
`


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


function toneFor(b: Senior['badges'][number]): 'blue'|'yellow'|'green'|'red'|'gray' {
  if (b === '은둔형') return 'yellow'
  if (b === '남성') return 'blue'
  if (b === '우울형') return 'green'
  if (b === '여성') return 'red'
  return 'gray'
}

export default function Senior_details() {

  const senior: Senior = {
      id: 's1',
      name: '김복자 님',
      time: '13:00',
      badges: ['여성','은둔형'],
      address: '가정방문 | 효가동 15-3 201호',
      note1: '인지 기능이 10% 감소했어요',
      note2: '대면 관계가 20% 향상되었어요'
    };
    const { pathname } = useLocation();

  return (
    <Page>
      <Header >
        <nav>
          <a href="/">❮</a>
        </nav>
        <h1>나의 대상자</h1>
      </Header>
      
      <div>
        <SeniorDetail >
          <img src="/senior_details_img/kim.png" alt="Senior Profile" />
          <div>
              <div className="details-item">
                <ProfileRow>
                  <NameRow>
                      <div className="name">{senior.name}</div>
                  </NameRow>
                  <BadgeRow>
                      {senior.badges.map((b, i) => (
                      <Badge key={i} tone={toneFor(b)}>{b}</Badge>
                      ))}
                  </BadgeRow>
                </ProfileRow>
              </div>
              <div className="details-item">
                <h2>주소</h2>
                <p> 대전시 서구 갈마로 160, 스마일 아파트 111-111</p>
              </div>
              <div className="details-item">
                <h2>연락처</h2>
                <p>010-1234-5678</p>
              </div>
              <div className="details-item">
                <h2>보호자</h2>
                <p>김철수 (010-5678-5678)</p>
              </div>
              <div className="details-item">
                <h2>최근 방문일</h2>
                <p>2023-03-15</p>
              </div>
          </div>
        </SeniorDetail>
      
        <SectionPanel>
          <StatusPanel>
            <img src="/senior_details_img/AI_profile.png" alt="Status Icon" />
            <div>
              <p>
                김복자 님은 지금
              </p>
              <p>
                <strong>대인관계가 향상되고 있어요!</strong>
              </p>
            </div>
          </StatusPanel>
          <MetricsPanel>
            <MetricsItem>
              <h2>신체 건강</h2>
              <CircleChart percent={48} size={70} />
            </MetricsItem>
            <MetricsItem>
              <h2>정신 심리</h2>
              <CircleChart percent={77} size={70} />
            </MetricsItem>
            <MetricsItem>
              <h2>사회 생활</h2>
              <CircleChart percent={60} size={70} />
            </MetricsItem>
          </MetricsPanel>
          <SummaryPanel>
            <div>
              <h1>
                최근 결과는 다음과 같아요!
              </h1>
              <ul>
                <li>인지 기능이 10% 감소했어요</li>
                <li>대면 관계가 20% 향상되었어요</li>
                <li>신체 건강이 5% 향상되었어요</li>
              </ul>
            </div>
          </SummaryPanel>
          <ConsultListPanel>
            <div>
              <h1>
                최근 상담 리스트
              </h1>
            </div>
          </ConsultListPanel>
          <ActionPanel>
            <button>
              상담 시작하기
            </button>
          </ActionPanel>
        </SectionPanel>

      

      </div>
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