'use client'

export default function Error({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div>
      {title}
      {description}
    </div>
  )
}
