import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

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


export default function Senior_details() {
  return (
    <Page>
      <Card>
        <H1>🎙️ Senior_details Page test</H1>
      </Card>
    </Page>
  )
}
