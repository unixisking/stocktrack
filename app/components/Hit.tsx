export default function Hit({ hit }) {
  console.log('hit', hit)
  return (
    <div>
      <p>{hit.ticker}</p>
      <h1>{hit.security}</h1>
    </div>
  )
}
