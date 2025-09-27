// src/pages/Counsel.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import { useNavigate, useLocation } from 'react-router-dom'

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

/* ← 뒤로가기 */
const TopBar = styled.div`
  position: absolute; left: 12px; top: 12px;
`
const BackBtn = styled.button`
  display: inline-flex; align-items: center; gap: 6px;
  border: none; background: transparent; cursor: pointer;
  font-weight: 800; color: #0f172a; font-size: 16px; padding: 6px 8px;
  border-radius: 10px;
  &:hover { background: rgba(15,23,42,0.06); }
  svg { width: 16px; height: 16px; }
`

const RecBadge = styled.div<{ recording?: boolean }>`
  display: inline-flex; align-items: center; gap: 8px;
  padding: 6px 16px; border-radius: 10px;
  font-weight: 800; font-size: 13px;
  transition: background .2s ease, color .2s ease;

  /* 기본: 녹음 중 */
  background: #0f172a; color: #fff;

  .dot { width: 8px; height: 8px; border-radius: 50%; background: #ef4444;
         box-shadow: 0 0 0 6px rgba(239,68,68,.18); }

  .timer { opacity:.85; font-variant-numeric: tabular-nums; }

  /* 녹음 완료 */
  ${({ recording }) => !recording && css`
    background: #e2e8f0; color: #475569;
    .dot { display: none; }
  `}
`

const Title = styled.div`
  font-size: 22px; font-weight: 900;
  margin: 5px 0;
  color: #3375d8ff;
`

const InfoCard = styled.div`
  width: min(680px, 90vw);
  height: 16vh;
  background: #fff; border: 2px solid #8fb4ecff; border-radius: 14px;
  padding: 14px 16px; box-shadow: 0 10px 28px rgba(2,6,23,.06);
  display: grid; gap: 8px; text-align: left;
  margin-bottom: 20px;
  .cap { font-weight: 800; color:#334155; font-size:14px; text-align: center;}
  ul { margin: 0; padding-left: 16px; color:#475569; }
  li { line-height: 1.4; font-size: 12px; color: #969191ff;}
`

const SectionHead = styled.div`
  margin: 12px auto 30px;
  display: flex; justify-content: space-between; align-items: center;
  font-weight: 900;
  .left { font-size: 15px; }
  .right { font-size: 12px; color:#94a3b8; }
`

// const Card = styled.div`
//   width: 100%;
//   height: 80vh;
//   border-radius: 22px 22px 0 0;
//   margin: 0;
//   box-sizing: border-box;
//   background: #fff;
//   border: 1px solid #e5e7eb;
//   padding: 10px 12px;
//   box-shadow: 0 8px 24px rgba(2,6,23,.06);
// `

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

const Q = styled.div`
  margin: 10px 0 6px; font-weight: 800; font-size: 14px;
`

const Opt = styled.label<{ disabled?: boolean }>`
  display: flex; align-items: center; gap: 8px;
  padding: 6px 6px; border-radius: 10px;
  font-size: 13px; cursor: pointer;
  ${({disabled}) => disabled && css`opacity:.7; cursor: not-allowed;`}
  input { accent-color: #2563eb; }
`

const QuestionBlock = styled.div`
  padding-bottom: 16px;
  margin-bottom: 16px;
  border-bottom: 1px solid #f1f5f9;
  &:last-of-type { border-bottom: none; margin-bottom: 0; }
`;

const OptionsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`;

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

/* ------------------------ data ------------------------ */
type Step = {
  area: '사회영역' | '신체영역' | '정신영역';
  questions: { id: string; text: string; options: string[]; }[];
};

const STEPS: Step[] = [
  {
    area: '사회영역',
    questions: [
      { id: 's1', text: '가족 구성원으로부터 부양(지원) 받고 있나요?', options: ['동거 (일반)', '동거 (허약)', '독거'] },
      { id: 's2', text: '가족 또는 친지와 연락하고 있나요?', options: ['주 1~2회 이상', '월 1~2회 이상', '분기 1~2회 이상', '연 1~2회 이상', '없음'] },
      { id: 's3', text: '이웃 또는 친구와 왕래하고 있나요?', options: ['주 1~2회 이상', '월 1~2회 이상', '분기 1~2회 이상', '연 1~2회 이상', '없음'] },
      { id: 's4', text: '특정 장소 (ex: 경로당)을 정기적으로 다니고 있나요?', options: ['주 1~2회 이상', '주 3~4회 이상', '월 1~2회 이상', '없음'] },
      { id: 's5', text: '수입을 목적으로 일을 하고 있나요?', options: ['주 1~2회 이상', '월 1~2회 이상', '분기 1~2회 이상', '연 1~2회 이상', '없음'] },
      { id: 's6', text: '스스로 식사를 준비하나요?', options: ['하고있다', '도움을 받는다', '하지 않는다'] },
      { id: 's7', text: '거주하는 환경이 해롭거나 불편한가요?', options: ['매우 그렇다', '그렇다', '그렇지 않다'] },
      { id: 's8', text: '경제적 어려움으로 충분히 먹지 못하고 있나요?', options: ['매우 그렇다', '그렇다', '그렇지 않다'] },
      { id: 's9', text: '경제적으로 어려움을 겪는 사항이 있나요?', options: ['식사', '공과금 납부', '냉/난방', '병원 이용', '없다'] },
    ],
  },
  {
    area: '신체영역',
    questions: [
      { id: 's1', text: '스스로 목욕하기, 머리감기를 하고 있나요?', options: ['자립(0)', '부분도움(2)', '완전도움(4)'] },
      { id: 's2', text: '식사하기가 가능한가요?', options: ['자립(0)', '부분도움(2)', '완전도움(4)'] },
      { id: 's3', text: '소변 대변조절이 가능할까요?', options: ['자립(0)', '부분도움(2)', '완전도움(4)'] },
      { id: 's4', text: '계단 오르기를 스스로 할 수 있나요?', options: ['자립(0)', '부분도움(2)', '완전도움(4)'] },
      { id: 's5', text: '청소,세탁 등 집안일을 스스로 할 수 있나요?', options: ['주1~2회 이상', '월1~2회 이상', '분기1~2회 이상'] },
      { id: 's6', text: '근거리외출, 물건구입, 금전관리 등이 가능한가요?', options: ['자립(0)', '부분도움(2)', '완전도움(4)'] },
      { id: 's7', text: '최근 한달간 다음과 같은 질병으로 치료를 받은 적이 있나요?', options: ['없음', '암(2)', '중품(뇌혈관질환(2))', '투석(2)', '당뇨병(1)', '혈압(1)',  '심장질환(1)','골절, 관절염(1)', '전립선염(1)', '이석증(1)', '안질환(1)', '산소요법(1)', '위장병,소화기능 장애(1)', '기타(1)'] },
    ],
  },
  {
    area: '정신영역',
    questions: [
      { id: 's1', text: '슬프고 기분이 쳐져 있을며 때로 울기도 하나요?', options: ['아니오(0)', '예_경미(2)', '예_심각(4)'] },
      { id: 's2', text: '가스불이나 담백불, 연탄불과 같은 화기를 관리할 수 있나요?', options: ['아니오(0)', '예_경미(2)', '예_심각(4)'] },
      { id: 's3', text: '들었던 이야기와 일을 잊거나, 의사소통과 전달에 장애가 있나요?', options: ['주 1~2회 이상', '월 1~2회 이상', '분기 1~2회 이상', '연 1~2회 이상', '없음'] },
      { id: 's4', text: '간단한 계산을 하지 못하나요?', options: ['아니오(0)', '예_경미(2)', '예_심각(4)'] },
      { id: 's5', text: '지난 1년 간, 자살 생각을 하거나 시도를 해봤나요?', options: ['아니오(0)', '예_경미(2)', '예_심각(4)'] },
      { id: 's6', text: '수면제, 항정신적 약물, 알코올 등을 복용하고 있나요?', options: ['아니오(0)', '예_가끔(2)', '예_자주 또는 매일(4)'] },
      { id: 's7', text: '지난 1년간, 다음의 사건과 관련된 경험 또는 걱정을 할 일이 있나요?', options: ['없음(0)', '배우자 및 자녀의 사망(2)', '친척 및 친구 사망(1)', '법과 관련되는 일(1)','가족과 친구에게 소외(1)', '본인의 건강 악화(1)', '병원비나 약값 부족', '기타(1)'] },
    ],
  },
];

type Answer = string;

/* ------------------------ recording helpers ------------------------ */
function pickSupportedMime() {
  const prefers = ['audio/mp4;codecs=mp4a.40.2', 'audio/mp4']
  const fallbacks = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus']
  // ts-expect-error TS dom typing
  const sup = (t: string) => typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported?.(t)
  for (const t of prefers) if (sup(t)) return { mime: t, ext: 'm4a' as const }
  for (const t of fallbacks) if (sup(t)) return { mime: t, ext: t.includes('webm') ? 'webm' as const : 'ogg' as const }
  return { mime: undefined, ext: 'webm' as const }
}

/* ------------------------ utils ------------------------ */
const areaLabel = (a: Step['area']) => (a === '사회영역' ? '사회' : a === '신체영역' ? '신체' : '정신')
const qKey = (area: Step['area'], id: string) => `${area}:${id}` // 고유키(영역+문항id)
const pad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`)

/* ------------------------ component ------------------------ */
export default function Counsel() {
  const navigate = useNavigate()
  const location = useLocation();
  const seniorName = (location.state as any)?.seniorName

  const [stepIdx, setStepIdx] = useState(0)
  const step = STEPS[stepIdx]
  const totalSteps = STEPS.length

  const [answers, setAnswers] = useState<Record<string, Answer | undefined>>({})

  // recording states
  const [recording, setRecording] = useState(false)
  const chunksRef = useRef<BlobPart[]>([])
  const mediaRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [ext, setExt] = useState<'m4a' | 'webm' | 'ogg'>('m4a')
  const [err, setErr] = useState<string>('')

  // timer
  const [elapsedSec, setElapsedSec] = useState(0)
  const tickRef = useRef<number | null>(null)
  const startTsRef = useRef<number | null>(null)

  // 업로드 엔드포인트 (환경변수 없으면 기본 경로)
  const API_ENDPOINT = (import.meta as any).env?.VITE_COUNSEL_UPLOAD_URL ?? '/api/counsel/upload'

  // 페이지 입장 시 자동 녹음
  useEffect(() => {
    (async () => {
      try {
        setErr('')
        const { mime, ext } = pickSupportedMime()
        setExt(ext)
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        streamRef.current = stream
        const mr = new MediaRecorder(stream, mime ? ({ mimeType: mime } as any) : undefined)
        chunksRef.current = []
        mr.ondataavailable = (e: BlobEvent) => { if (e.data && e.data.size > 0) chunksRef.current.push(e.data) }
        mr.start()
        mediaRef.current = mr
        setRecording(true)

        // timer start
        startTsRef.current = Date.now()
        if (tickRef.current) clearInterval(tickRef.current)
        tickRef.current = window.setInterval(() => {
          if (startTsRef.current) {
            const sec = Math.floor((Date.now() - startTsRef.current) / 1000)
            setElapsedSec(sec)
          }
        }, 1000)

      } catch (e) {
        console.error(e)
        setErr('마이크 권한이 필요합니다. 브라우저 설정을 확인해 주세요.')
      }
    })()
    return () => {
      // 언마운트 시 안전 정지
      try { if (mediaRef.current?.state === 'recording') mediaRef.current.stop() } catch {}
      streamRef.current?.getTracks().forEach(t => t.stop())
      if (tickRef.current) clearInterval(tickRef.current)
    }
  }, [])

  // 현재 스텝의 모든 문항 선택 여부 (영역+id 고유키로 체크)
  const currentStepDone = useMemo(
    () => step.questions.every(q => !!answers[qKey(step.area, q.id)]),
    [step, answers]
  )

  // 전체 완료 여부
  const allDone = useMemo(
    () => STEPS.every(s => s.questions.every(q => !!answers[qKey(s.area, q.id)])),
    [answers]
  )

  function setAnswer(area: Step['area'], id: string, value: Answer) {
    setAnswers(prev => ({ ...prev, [qKey(area, id)]: value }))
  }

  function toPrev() { if (stepIdx > 0) setStepIdx(stepIdx - 1) }
  function toNext() { if (stepIdx < totalSteps - 1) setStepIdx(stepIdx + 1) }

  // ← 뒤로가기: 녹음 안전 정지 후 이전 페이지
  function goBack() {
    try { if (mediaRef.current?.state === 'recording') mediaRef.current.stop() } catch {}
    setRecording(false)
    streamRef.current?.getTracks().forEach(t => t.stop())
    if (tickRef.current) clearInterval(tickRef.current)
    navigate(-1)
  }

  // 마지막 chunk까지 보장 수집
  function stopAndGetBlob(): Promise<Blob> {
    return new Promise((resolve) => {
      const mr = mediaRef.current
      const make = () => {
        const type = mr?.mimeType || 'audio/webm'
        resolve(new Blob(chunksRef.current, { type }))
      }
      if (mr && mr.state !== 'inactive') {
        mr.addEventListener('stop', () => { make() }, { once: true })
        try { mr.stop() } catch {}
      } else {
        make()
      }
    })
  }

  // 체크리스트 JSON (요청형태: { '사회': {...}, '신체': {...}, '정신': {...} })
  function buildChecklistJSON() {
    const result: Record<'사회'|'신체'|'정신', Record<string, string>> = {
      사회: {}, 신체: {}, 정신: {}
    }
    for (const s of STEPS) {
      const key = areaLabel(s.area) as '사회'|'신체'|'정신'
      for (const q of s.questions) {
        const v = answers[qKey(s.area, q.id)]
        if (v) result[key][q.text] = v
      }
    }
    return result
  }

  // 녹음 종료 + Django 업로드
  async function stopAndSubmit() {
    try {
      setRecording(false)
      if (tickRef.current) clearInterval(tickRef.current)

      const blob = await stopAndGetBlob()

      const filename = `counsel_recording.${ext}`
      const file = new File([blob], filename, { type: blob.type })

      const checklist = buildChecklistJSON()

      const form = new FormData()
      form.append('audio', file)
      form.append('checklist', JSON.stringify(checklist))
      if (seniorName) form.append('seniorName', String(seniorName))
      
      const BASE = import.meta.env.VITE_STATIC_IP;
      const res = await fetch(`${BASE}/download_file/`, {
        method: 'POST',
        body: form,
      })

      if (!res.ok) {
        const txt = await res.text().catch(()=>'')
        throw new Error(`업로드 실패(${res.status}): ${txt || '서버 오류'}`)
      }

      alert('업로드 완료되었습니다.')
      // 필요 시 업로드 후 이동
      // navigate('/counsel/list')
    } catch (e:any) {
      console.error(e)
      setErr(e?.message ?? '업로드 중 오류가 발생했습니다.')
    } finally {
      // 마이크 자원 정리
      streamRef.current?.getTracks().forEach(t => t.stop())
    }
  }

  const mm = Math.floor(elapsedSec / 60)
  const ss = elapsedSec % 60

  return (
    <Page>
      <Top>
        <TopBar>
          <BackBtn onClick={goBack} aria-label="이전 페이지">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M15 18l-6-6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            뒤로
          </BackBtn>
        </TopBar>

        <RecBadge recording={recording}>
          {recording && <span className="dot" />}
          {recording ? '녹음 중' : '녹음 완료'}
          <span className="timer">{` ${pad2(mm)}:${pad2(ss)}`}</span>
        </RecBadge>

        <Title>{seniorName} 4회차 상담</Title>

        <InfoCard>
          <div className="cap">[ {step.area} ] 상담에 도움이 될 만한 정보예요.</div>
          <ul>
            <li>새로 사귄 이웃이 있어요.</li>
            <li>가족과 정기적으로 통화한 경험이 있어요.</li>
            <li>최근 취미 생활로 수입이 있으셨어요.</li>
          </ul>
        </InfoCard>
      </Top>

      <Card>
        <SectionHead>
          <div className="left">체크리스트 - {step.area}</div>
          <div className="right">{stepIdx + 1} / {totalSteps}</div>
        </SectionHead>

        {step.questions.map((q) => (
          <QuestionBlock key={`${step.area}-${q.id}`}>
            <Q>Q. {q.text}</Q>
            <OptionsGrid>
              {q.options.map((option, index) => (
                <Opt key={index}>
                  <input
                    type="radio"
                    name={qKey(step.area, q.id)}
                    value={option}
                    checked={answers[qKey(step.area, q.id)] === option}
                    onChange={() => setAnswer(step.area, q.id, option)}
                  />
                  {option}
                </Opt>
              ))}
            </OptionsGrid>
          </QuestionBlock>
        ))}

        {!!err && (
          <div style={{
            marginTop: 12, fontSize: 12, color: '#b91c1c',
            background:'#fef2f2', border:'1px solid #fecaca', padding:8, borderRadius:8
          }}>{err}</div>
        )}
      </Card>

      <Footer>
        <Btn intent="neutral" disabled={stepIdx===0} onClick={toPrev}>이전</Btn>
        {stepIdx===totalSteps-1 && allDone ? (
          <Btn intent="primary" onClick={stopAndSubmit}>녹음 종료</Btn>
        ) : (
          <Btn intent="primary" disabled={!currentStepDone} onClick={toNext}>다음으로</Btn>
        )}
      </Footer>
    </Page>
  )
}
