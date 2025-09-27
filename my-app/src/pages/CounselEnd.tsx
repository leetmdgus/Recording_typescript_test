// src/pages/CounselEnd.tsx
import React from 'react'
import styled from 'styled-components'
import { useNavigate, useLocation } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

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
const SectionHead = styled.div`
  margin: 12px 13px 30px;
  display: flex; justify-content: space-between; align-items: center;
  font-weight: 900;
  .left { font-size: 15px; }
  .right { font-size: 12px; color:#94a3b8; }
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
  position: sticky; bottom: 0; background: #fff; border-top: 1px solid #e5e7eb;
  padding: 12px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px;
`
const Btn = styled.button<{ intent?: 'primary'|'neutral' }>`
  padding: 12px; border-radius: 12px; font-weight: 800; font-size: 15px; cursor: pointer;
  border: none;
  ${({intent}) => intent==='primary'
    ? `background:#2563eb; color:#fff;`
    : `background:#f1f5f9; color:#0f172a;`}
  &:disabled { opacity:.6; cursor:not-allowed; }
`
const MarkdownBox = styled.div`
  width: min(860px, 92vw);
  margin: 0 auto;
  font-size: 14px;
  line-height: 1.7;
  color: #0f172a;

  h1,h2,h3 { font-weight: 900; margin: 18px 0 8px; }
  h1 { font-size: 22px; }
  h2 { font-size: 18px; }
  h3 { font-size: 16px; }
  p { margin: 10px 0; color: #1f2937; }
  ul, ol { padding-left: 20px; margin: 8px 0; }
  code { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; background:#f8fafc; padding: 2px 6px; border-radius: 6px; }
  pre { background:#0b1220; color:#e5e7eb; padding:14px; border-radius:12px; overflow:auto; }
  blockquote { border-left: 4px solid #e5e7eb; margin: 8px 0; padding: 6px 12px; color:#475569; background:#f8fafc; border-radius:8px; }
  table { border-collapse: collapse; width: 100%; margin: 10px 0; }
  th, td { border: 1px solid #e5e7eb; padding: 8px; text-align: left; }
  th { background: #f1f5f9; }
  a { color:#2563eb; text-decoration: underline; }
`

export default function CounselEnd() {
  const navigate = useNavigate()
  const location = useLocation()
  console.log('location.state:', location.state)

  // ✅ 최초 렌더에서만 안전하게 초기화
  const pageState = React.useMemo(() => {
    const s = (location.state as any) || null;
    if (s?.seniorName || s?.message) return s;
    const saved = sessionStorage.getItem('counselEndState');
    return saved ? JSON.parse(saved) : {};
  }, [location.state]);

  const seniorName: string = pageState?.seniorName ?? '';
  const markdown: string =
    typeof pageState?.message === 'string' && pageState.message.trim().length > 0
      ? pageState.message
      : '결과 텍스트가 없습니다. 이전 페이지에서 다시 시도해 주세요.';

  // (선택) 이 페이지를 벗어날 때 폴백 삭제
  React.useEffect(() => {
    return () => { sessionStorage.removeItem('counselEndState'); };
  }, []);

  return (
    <Page>
      <Top>
        <Title>{seniorName} 4회차 상담</Title>

        <InfoCard>
          <img src="/senior_details_img/AI_profile.png" alt="Status Icon" />
          <div className="cap">상담이 종료되었어요!</div>
          <div className="cap1">오늘도 수고하셨습니다.</div>
          <div className="cap2">
            <strong style={{color: 'black'}}>{seniorName}</strong>의 4회차 상담 결과를 정리했어요.
          </div>
        </InfoCard>
      </Top>

      <Card>
        <SectionHead>
          <div className="left">AI 상담 보고서</div>
          <div className="right" />
        </SectionHead>

        <MarkdownBox>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {markdown}
          </ReactMarkdown>
        </MarkdownBox>
      </Card>

      <Footer>
        <Btn intent="neutral" disabled>수정하기</Btn>
        <Btn intent="primary" onClick={() => navigate('/')}>상담종료</Btn>
      </Footer>
    </Page>
  )
}
