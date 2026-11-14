import { Fragment } from 'react'

// Memecah teks per kata supaya bisa diisi bertahap mengikuti scroll (class .sw).
export default function ScrubText({ text }: { text: string }) {
  return (
    <>
      {text.split(' ').map((w, i) => (
        <Fragment key={i}>
          <span className="sw inline-block">{w}</span>{' '}
        </Fragment>
      ))}
    </>
  )
}
