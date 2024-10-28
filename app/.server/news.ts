export const fetchNews = async (section: string = 'home', limit = 15) => {
  const api = `https://${process.env.NYTIMES_API_URL}/${section}.json?api-key=${process.env.NYTIMES_API_KEY}`

  try {
    const response = await fetch(api, {
      headers: {
        Accept: 'application/json',
      },
    })
    const data = await response.json()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const news = data.results.slice(0, limit).map((result: any) => ({
      title: result.title,
      abstract: result.abstract,
      url: result.url,
      published_date: result.published_date,
      section: result.section,
      subsection: result.subsection,
      image: result.multimedia,
    }))

    return news
  } catch (error) {
    console.error('Error fetching news', error)
  }
}

export const getFeaturedArticles = (news) => {
  const featured = []
  for (const article of news) {
    if (article.image) {
      featured.push(article)
    }
    if (featured.length >= 3) {
      break
    }
  }

  return featured
}
