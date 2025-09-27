// src/pages/MainPage.tsx
import React, { useMemo, useState } from 'react'
import styled, { css } from 'styled-components'
import { Link, useLocation, useNavigate } from 'react-router-dom';


type Senior = {
  id: string
  name: string
  time: string   // "13:00" 등
  badges: Array<'남성' | '여성' | '은둔형' | '우울형' | '일반'>
  address: string
  note1: string
  note2: string
}

// ───────────────── styled ─────────────────
const Page = styled.div`
  min-height: 100dvh;
  display: grid;
  grid-template-rows: auto 1fr auto;
  background: linear-gradient(180deg, #b2c8f2ff 0%, #f6f7f9ff 40%, #ffffff 100%);
  color: #0f172a;
`

const Header = styled.header`
  padding: 80px 16px 40px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  
`

const Mascot = styled.div`
  img {
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

const Greeting = styled.div`
  .hello { font-size: 17px; color: #000000ff; font-weight: bold; }
  .name  { font-size: 22px; font-weight: bold; }
  .name b { color: #2563eb;}
  display: flex; flex-direction: column; gap: 7px;
`

const DateBar = styled.div`
  margin: 0 7px 0;
  font-weight: bold;
  display: flex; justify-content: space-between; align-items: center;
  color: #0f172a;
  .count {
    color: #ddd9d9ff;
    font-size: 14px; font-weight: 800;
    padding: 4px 0; border-radius: 999px; color: #cdcdcdff;
  }
`

const List = styled.div`
  padding: 20px 20px 16px;
  display: grid; gap: 12px;
  border-radius: 15px 15px 0 0; 
  background: #ffffffff;
`

const Card = styled.button<{ selected?: boolean }>`
  width: 100%;
  text-align: left;
  border: 2px solid #e2e8f0;
  background: #f0efefff;
  border-radius: 16px;
  padding: 12px;
  display: grid;
  grid-template-columns: 64px 1fr auto;
  gap: 12px;
  align-items: stretch;
  cursor: pointer;
  box-shadow: 0 6px 16px rgba(2,6,23,0.04);
  transition: box-shadow .2s ease, border-color .2s ease, background .2s ease;

  &:active { transform: translateY(1px); }

  ${({ selected }) => selected && css`
    border: 2px solid #277af0ff;
    background: #d3d6deff;
    box-shadow: 0 10px 28px rgba(37,99,235,.12);
  `}
`

const TimeCol = styled.div<{ selected?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0px;

  border-right: 1px dashed #e2e8f0;
  display: grid; place-items: center;
  color: black;
  font-weight: 800;
  .hh { font-size: 15px; line-height: 1.1; }
  .ampm { margin-left:5px; font-size: 14px; font-weight: 700; color: #94a3b8;}
`

const Checkmark = styled.div<{ selected?: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 50%; /* 원형으로 만들기 */
  display: grid;
  place-items: center; /* 내부 아이템(체크 기호) 중앙 정렬 */
  font-size: 14px;
  font-weight: bold;
  transition: all .2s ease;

  /* 기본 상태 (선택되지 않았을 때) */
  background: #bcc3c9ff;
  border: 2px solid #bcc3c9ff;
  color: #ecededff;
  
  /* selected={true} 일 때 적용될 스타일 */
  ${({ selected }) => selected && css`
    background: #277af0;
    border-color: #277af0;
    color: #fff;
  `}
`

const ContentCol = styled.div`
  display: grid; gap: 6px;
`

const ProfileRow = styled.div`
  display: flex;
  align-items: center; /* 세로 높이를 중앙으로 정렬합니다 */
  gap: 8px;            /* 이름과 배지 사이의 간격을 줍니다 */
`;

const NameRow = styled.div`
  display: flex; align-items: center; gap: 6px; justify-content: space-between;
  .name { font-size: 16px; font-weight: 800; color: #0f172a; }
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

const Meta = styled.div`
  font-size: 12px; color: #475569; line-height: 1.35;
`

const ArrowCol = styled.div`
  display: grid; place-items: center;
  padding-left: 6px;
  button {
    width: 36px; height: 36px; border-radius: 10px;
    border: 1px solid #dbe1ea; background: #fff; cursor: pointer;
    display: grid; place-items: center; font-weight: 900; color:#2563eb;
    box-shadow: 0 6px 12px rgba(2,6,23,0.06);
  }
`

const Footer = styled.footer`
  position: sticky; bottom: 0; background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
  border-top: 2px solid #dcdee1ff;
  padding: 14px 16px 18px;
  display: grid; gap: 10px;
`

const StartButton = styled.button`
  width: 95%;
  border: none; border-radius: 14px;
  padding: 14px 16px;
  background: #2563eb; color: #fff;
  font-weight: 800; font-size: 16px;
  box-shadow: 0 10px 24px rgba(37,99,235,.25);
  cursor: pointer;
  margin: 20px; 0;
  margin-left:2.5%;
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
`;

// ───────────────── helpers ─────────────────
function formatTodayKorean(d: Date) {
  const yoil = ['일','월','화','수','목','금','토'][d.getDay()]
  return `${d.getFullYear()}년 ${d.getMonth()+1}월 ${d.getDate()}일 (${yoil})`
}

function toneFor(b: Senior['badges'][number]): 'blue'|'yellow'|'green'|'red'|'gray' {
  if (b === '은둔형') return 'yellow'
  if (b === '남성') return 'blue'
  if (b === '우울형') return 'green'
  if (b === '여성') return 'red'
  return 'gray'
}

// ───────────────── main ─────────────────
export default function MainPage() {
  const navigate = useNavigate()

  // 데모용 데이터 (실서비스에선 API로 대체)
  const seniors: Senior[] = useMemo(() => ([
    {
      id: 's1',
      name: '김복자 님',
      time: '13:00',
      badges: ['여성','은둔형'],
      address: '가정방문 | 효가동 15-3 201호',
      note1: '인지 기능이 10% 감소했어요',
      note2: '대면 관계가 20% 향상되었어요',
    },
    {
      id: 's2',
      name: '창복자 님',
      time: '14:00',
      badges: ['남성','우울형'],
      address: '가정방문 | 효가동 15-3 201호',
      note1: '인지 기능이 10% 감소했어요',
      note2: '대면 관계가 20% 향상되었어요',
    },
    {
      id: 's3',
      name: '미복자 님',
      time: '15:45',
      badges: ['여성','우울형'],
      address: '가정방문 | 효가동 15-3 201호',
      note1: '인지 기능이 10% 감소했어요',
      note2: '대면 관계가 20% 향상되었어요',
    },
  ]), [])

  const [selectedId, setSelectedId] = useState<string | null>(seniors[0]?.id ?? null)
  const todayText = useMemo(() => formatTodayKorean(new Date()), [])

  const goDetail = (s: Senior) => {
    navigate('/Senior_details', { state: { senior: s } })
  }

  const { pathname } = useLocation();

  return (
    <Page>
      <Header>
        <Mascot>
          <img src="/senior_details_img/AI_profile.png" alt="Status Icon" />
        </Mascot>
        
        <Greeting>
          <span className="hello">안녕하세요,</span>
          <span className="name"><b>홍길동</b> 생활복지사님! 👋🏻</span>
        </Greeting>
      </Header>

      <div>
        <List>
            <DateBar>
                <div>{todayText}</div>
                <div className="count">({seniors.length})</div>
            </DateBar>

          {seniors.map(s => {
            const selected = s.id === selectedId
            const [hh, mm] = s.time.split(':')
            const ampm = Number(hh) >= 12 ? 'PM' : 'AM'
            const hh12 = ((Number(hh)+11)%12)+1

            return (
              <Card
                key={s.id}
                selected={selected}
                onClick={() => setSelectedId(s.id)}
                aria-pressed={selected}
              >
                <TimeCol selected={selected}>
                  <Checkmark selected={selected}>✓</Checkmark>
                  <div>
                    <div className="hh">{hh12}:{mm}</div>
                    <div className="ampm">{ampm}</div>
                  </div>
                </TimeCol>

                <ContentCol>
                  <ProfileRow>
                    <NameRow>
                        <div className="name">{s.name}</div>
                    </NameRow>
                    <BadgeRow>
                        {s.badges.map((b, i) => (
                        <Badge key={i} tone={toneFor(b)}>{b}</Badge>
                        ))}
                    </BadgeRow>
                  </ProfileRow>
                  
                  <Meta>
                    {s.address}<br/>
                    {s.note1}<br/>
                    {s.note2}
                  </Meta>
                </ContentCol>

                <ArrowCol>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); goDetail(s) }}
                    aria-label={`${s.name} 상세로 이동`}
                    title="상세 보기"
                  >
                    ➔
                  </button>
                </ArrowCol>
              </Card>
            )
          })}

          <StartButton
            disabled={!selectedId}
            onClick={() => {
              const selectedSenior = seniors.find(s => s.id === selectedId);

              if (!selectedSenior) {
                alert('상담을 시작할 어르신을 선택해주세요.');
                return;
              }

              if (window.confirm(`${selectedSenior.name}님의 상담을 시작하겠습니까?`)) {
                navigate('/Counsel', {
                  state: {
                    seniorName: selectedSenior.name
                    // seniorId: selectedSenior.id 
                  }
                });
              }
            }}
          >
            상담 시작하기
          </StartButton>
        </List>
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
