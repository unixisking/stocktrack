export function timeAgo(publishedDate: string) {
  console.log('hello data', publishedDate)
  const now = new Date()
  const published = new Date(publishedDate)
  const diff = +now - +published

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30) // Rough approximation
  const years = Math.floor(days / 365) // Rough approximation

  if (years > 0) {
    return years + (years === 1 ? ' year ago' : ' years ago')
  } else if (months > 0) {
    return months + (months === 1 ? ' month ago' : ' months ago')
  } else if (days > 0) {
    return days + (days === 1 ? ' day ago' : ' days ago')
  } else if (hours > 0) {
    return hours + (hours === 1 ? ' hour ago' : ' hours ago')
  } else if (minutes > 0) {
    return minutes + (minutes === 1 ? ' minute ago' : ' minutes ago')
  } else {
    return seconds + (seconds === 1 ? ' second ago' : ' seconds ago')
  }
}

export function truncateNumber(num: number, offset = 1) {
  if (num === null) return
  const numStr = num.toString()

  const decimalIndex = numStr.indexOf('.')

  if (decimalIndex === -1) {
    return num
  } else {
    for (let i = decimalIndex + 1; i < numStr.length; i++) {
      if (numStr[i] === '0') {
        continue
      }

      return parseFloat(numStr.slice(0, decimalIndex + i + offset))
    }
  }
}

export function formatDate(date: string) {
  const d = new Date(date)
  let month = '' + (d.getMonth() + 1)
  let day = '' + d.getDate()
  const year = '' + d.getFullYear()

  if (month.length < 2) {
    month = '0' + month
  }
  if (day.length < 2) {
    day = '0' + day
  }

  return [year, month, day].join('-')
}
