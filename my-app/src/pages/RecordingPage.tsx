import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

type PermissionState = 'idle' | 'granted' | 'denied'

const Page = styled.div`
  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding: 16px;
`
const Card = styled.div`
  width: min(860px, 94vw);
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(8px);
  border: 1px solid var(--bd);
  border-radius: 24px;
  padding: clamp(16px, 3.5vw, 28px);
  box-shadow: 0 24px 60px rgba(15,23,42,0.1);
  text-align: center;
`
const H1 = styled.h1`
  margin: 0;
  font-size: clamp(22px, 3.5vw, 28px);
  font-weight: 800;
  letter-spacing: -0.4px;
`
const Desc = styled.p`
  margin-top: 6px;
  color: var(--txt-muted);
`
const Row = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 10px;

  @media (max-width: 640px) {
    & > * { width: 100%; }
  }
`
const Button = styled.button<{ intent?: 'primary' | 'danger' | 'neutral' }>`
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
  ${({ intent }) => intent === 'danger' && `
    color: #fff;
    border-color: transparent;
    background: linear-gradient(135deg, #ef4444 0%, #f97316 100%);
  `}
  ${({ intent }) => intent === 'neutral' && `
    background: #0ea5e91a;
  `}

  &:disabled {
    opacity: .6;
    cursor: not-allowed;
    filter: grayscale(.2);
  }
`
const Timer = styled.div`
  font-weight: 800;
  color: var(--txt-strong);
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  padding: 8px 12px;
  border-radius: 10px;
`
const Badge = styled.span<{ status: 'ok' | 'bad' | 'rec' | 'idle' }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
  border: 1px solid transparent;

  ${({ status }) => status === 'ok'   && `color:#16a34a; border-color:#16a34a22; background:rgba(16,185,129,.12);`}
  ${({ status }) => status === 'bad'  && `color:#dc2626; border-color:#dc262622; background:rgba(239,68,68,.12);`}
  ${({ status }) => status === 'rec'  && `color:#ef4444; border-color:#ef444422; background:rgba(239,68,68,.12);`}
  ${({ status }) => status === 'idle' && `color:#475569; border-color:#47556922; background:rgba(100,116,139,.12);`}
`
const Dot = styled.span<{ color: string; pulse?: boolean }>`
  width: 8px; height: 8px; border-radius: 99px; background: ${({ color }) => color};
  box-shadow: ${({ pulse }) => pulse ? '0 0 0 6px rgba(239,68,68,.15)' : 'none'};
`
const Notice = styled.div<{ type: 'info' | 'error' | 'success' }>`
  margin-top: 12px;
  padding: 10px 12px;
  border-radius: 12px;
  font-size: 14px;
  border: 1px solid;
  ${({ type }) => type === 'info'
    ? 'color:#0b5; background:#ecfdf5; border-color:#10b98133;'
    : type === 'success'
    ? 'color:#14532d; background:#ecfdf5; border-color:#10b98133;'
    : 'color:#b00; background:#fef2f2; border-color:#ef444433;'}
`
const Result = styled.div`
  margin-top: 20px;
  padding: 16px;
  border-radius: 16px;
  border: 1px solid var(--bd);
  background: #fafafa;

  audio { width: 100%; }
`

export default function RecordingPage() {
  const [permission, setPermission] = useState<PermissionState>('idle')
  const [recording, setRecording] = useState<boolean>(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)   // 🔹 전송용 원본 Blob 보관
  const [error, setError] = useState<string | null>(null)
  const [note, setNote] = useState<string>('')
  const [elapsed, setElapsed] = useState<number>(0)

  const [uploading, setUploading] = useState<boolean>(false)      // 🔹 업로드 진행 상태
  const [uploadMsg, setUploadMsg] = useState<string>('')          // 🔹 업로드 결과 메시지

  const timerRef = useRef<number | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<BlobPart[]>([])

  // 파일 목표(m4a 우선)
  const [targetExt, setTargetExt] = useState<'m4a' | 'webm' | 'ogg'>('m4a')
  const [targetMime, setTargetMime] = useState<string | undefined>('audio/mp4')

  // 지원 타입 선택
  function selectSupportedMime(): { mime?: string; ext: 'm4a' | 'webm' | 'ogg'; mp4: boolean } {
    const preferMp4 = ['audio/mp4;codecs=mp4a.40.2', 'audio/mp4']
    const fallbacks = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus']

    for (const t of preferMp4) {
      // ts-expect-error dom.d.ts에 isTypeSupported 정의되어 있음
      if (window.MediaRecorder && MediaRecorder.isTypeSupported?.(t)) {
        return { mime: t, ext: 'm4a', mp4: true }
      }
    }
    for (const t of fallbacks) {
      // ts-expect-error
      if (window.MediaRecorder && MediaRecorder.isTypeSupported?.(t)) {
        return { mime: t, ext: t.includes('webm') ? 'webm' : 'ogg', mp4: false }
      }
    }
    return { ext: 'webm', mp4: false } // 타입 미지정 시 브라우저가 선택
  }

  // 권한 요청
  async function requestPermission() {
    setError(null); setNote('')
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop())
        streamRef.current = null
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      setPermission('granted')

      const sel = selectSupportedMime()
      setTargetMime(sel.mime)
      setTargetExt(sel.ext)
      if (!sel.mp4) {
        setNote('이 브라우저는 audio/mp4(m4a)를 지원하지 않아, webm/ogg로 저장됩니다.')
      }
    } catch (e) {
      console.error(e)
      setPermission('denied')
      setError('마이크 권한을 허용해야 녹음할 수 있습니다.')
    }
  }

  // 타이머
  const startTimer = () => {
    if (timerRef.current) window.clearInterval(timerRef.current)
    setElapsed(0)
    timerRef.current = window.setInterval(() => setElapsed(prev => prev + 1), 1000)
  }
  const stopTimer = () => {
    if (timerRef.current) window.clearInterval(timerRef.current)
    timerRef.current = null
  }

  // 녹음 토글
  function toggleRecord() {
    if (!streamRef.current) {
      setError('먼저 "권한 요청"을 눌러 마이크 권한을 허용하세요.')
      return
    }
    if (!recording) {
      try {
        setError(null)
        setUploadMsg('')
        chunksRef.current = []
        const options = targetMime ? { mimeType: targetMime } : undefined
        const mr = new MediaRecorder(streamRef.current, options as any)

        mr.ondataavailable = (e: BlobEvent) => {
          if (e.data && e.data.size > 0) chunksRef.current.push(e.data)
        }
        mr.onstop = () => {
          const actualType = mr.mimeType || targetMime || 'audio/webm'
          const blob = new Blob(chunksRef.current, { type: actualType })
          const url = URL.createObjectURL(blob)
          setAudioUrl(url)
          setAudioBlob(blob) // 🔹 업로드용 Blob 저장

          const isMp4 = /audio\/mp4|mp4/i.test(actualType)
          setTargetExt(isMp4 ? 'm4a' : (actualType.includes('webm') ? 'webm' : 'ogg'))
        }

        mediaRecorderRef.current = mr
        mr.start()
        setRecording(true)
        startTimer()
      } catch (e) {
        console.error(e)
        setError('녹음을 시작하는 중 문제가 발생했습니다.')
      }
    } else {
      try {
        mediaRecorderRef.current?.stop()
        setRecording(false)
        stopTimer()
      } catch (e) {
        console.error(e)
        setError('녹음을 중지하는 중 문제가 발생했습니다.')
      }
    }
  }


  // 쿠키에서 csrftoken 읽기 유틸
  function getCookie(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()!.split(';').shift()!;
    return '';
  }


  // 🔹 Django 전송 함수
  async function sendToDjango() {
    if (!audioBlob) {
      setUploadMsg('')
      setError('전송할 오디오가 없습니다. 먼저 녹음 후 중지하세요.')
      return
    }
    setError(null)
    setUploadMsg('')
    setUploading(true)

    try {
      // 파일 이름은 확장자에 맞춰서 부여
      const filename = `recording.${targetExt}`
      const file = new File([audioBlob], filename, { type: audioBlob.type || 'application/octet-stream' })

      const form = new FormData()
      form.append('file', file)             // Django에서 request.FILES['file'] 로 접근
      form.append('meta', JSON.stringify({
        createdAt: new Date().toISOString(),
        mimeType: file.type,
        durationSec: elapsed,
      }))

      // 예시 엔드포인트: http://localhost:8000/upload/
      const BASE = import.meta.env.VITE_STATIC_IP;
      const csrftoken = getCookie('csrftoken');
      const res = await fetch(`${BASE}/download_file/`, {
        method: 'POST',
        body: form,            // ❗ Content-Type 헤더 직접 지정하지 마세요(FormData가 자동 지정)
        credentials: 'include', // 세션/쿠키 필요 시
        headers: { 'X-CSRFToken': csrftoken },
      })

      if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(`업로드 실패 (${res.status}) ${text}`)
      }

      const data = await res.json().catch(() => ({}))
      setUploadMsg(data?.message ? `전송 성공: ${data.message}` : '전송 성공')
    } catch (e: any) {
      console.error(e)
      setError(e?.message ?? '업로드 중 오류가 발생했습니다.')
    } finally {
      setUploading(false)
    }
  }

  // 리소스 정리
  useEffect(() => {
    return () => {
      try { if (mediaRecorderRef.current?.state === 'recording') mediaRecorderRef.current.stop() } catch {}
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop())
      if (audioUrl) URL.revokeObjectURL(audioUrl)
      stopTimer()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0')
  const ss = String(elapsed % 60).padStart(2, '0')

  return (
    <Page>
      <Card>
        <H1>🎙️ RecordingPage</H1>
        <Desc>권한 요청 → 녹음 시작/중지 → 결과 재생/다운로드(.m4a 우선) → Django 전송</Desc>

        <Row>
          <Button intent="neutral" onClick={requestPermission}>
            {permission === 'granted' ? '권한 재요청(스트림 재시작)' : '권한 요청'}
          </Button>

          <Button
            intent={recording ? 'danger' : 'primary'}
            onClick={toggleRecord}
            disabled={permission !== 'granted'}
            title={permission !== 'granted' ? '먼저 권한을 허용하세요' : undefined}
          >
            {recording ? '■ 녹음 중지' : '● 녹음 시작'}
          </Button>

          <Timer>⏱ {mm}:{ss}</Timer>
        </Row>

        <Row>
          <Badge status={permission === 'granted' ? 'ok' : permission === 'denied' ? 'bad' : 'idle'}>
            <Dot color={permission === 'granted' ? '#16a34a' : permission === 'denied' ? '#dc2626' : '#475569'} />
            권한: {permission}
          </Badge>
          <Badge status={recording ? 'rec' : 'idle'}>
            <Dot color={recording ? '#ef4444' : '#475569'} pulse={recording} />
            상태: {recording ? 'Recording' : 'Idle'}
          </Badge>
        </Row>

        {!!note && <Notice type="info">{note}</Notice>}
        {!!error && <Notice type="error">{error}</Notice>}
        {!!uploadMsg && <Notice type="success">{uploadMsg}</Notice>}

        {audioUrl && (
          <Result>
            <h3 style={{ margin: '0 0 10px 0', fontSize: 18, fontWeight: 800 }}>녹음 결과</h3>
            <audio controls src={audioUrl} />
            <Row style={{ marginTop: 10 }}>
              <a href={audioUrl} download={`recording.${targetExt}`}>
                <Button intent="neutral">⬇ 다운로드 (.{targetExt})</Button>
              </a>

              {/* 🔹 여기에 "Django 전송" 버튼 추가 */}
              <Button intent="primary" onClick={sendToDjango} disabled={uploading}>
                {uploading ? '전송중…' : 'Django 전송'}
              </Button>

              <Button
                onClick={() => {
                  if (audioUrl) URL.revokeObjectURL(audioUrl)
                  setAudioUrl(null)
                  setAudioBlob(null)
                  chunksRef.current = []
                  setElapsed(0)
                  setUploadMsg('')
                }}
              >
                ♻️ 결과 지우고 재녹음
              </Button>
            </Row>
          </Result>
        )}
      </Card>
    </Page>
  )
}
