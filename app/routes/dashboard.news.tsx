// import { useLoaderData } from '@remix-run/react'
import { fetchNews, getFeaturedArticles } from '@/.server/news'
import RedisClient from '@/.server/redis'
// import NewsCard from '@/components/NewsCard'
// import { timeAgo } from '@/utils'
export interface INewsProps {
  title: string
  abstract: string
  image: Record<string, string>[]
  url: string
  published_date: string
  section: string
  subsection: string
}
export const loader = async () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const news = await RedisClient.json.get('news:home')
  const featured = await RedisClient.json.get('news:home:featured')
  if (news && featured) {
    return { news, featured }
  }
  try {
    const freshNews = await fetchNews()
    const freshFeatured = getFeaturedArticles(freshNews)
    await RedisClient.json.set('news:home', '$', freshNews)
    await RedisClient.json.set('news:home:featured', '$', freshFeatured)
    await RedisClient.expire('news:home', 3600)
    await RedisClient.expire('news:home:featured', 3600)
    return { news: freshNews, featured: freshFeatured }
  } catch (error) {
    throw new Response('Unable to fetch news')
  }
}

export default function NewsPage() {
  // const { news, featured } = useLoaderData<{
  //   news: INewsProps[]
  //   featured: INewsProps[]
  // }>()
  return (
    <div>Dashboard.news</div>
    // <Container maxWidth={'7xl'} p={2} float={'left'}>
    //   <SimpleGrid column={2}>
    //     <div>
    //       <Heading as={'h1'} my={6}>
    //         Latest News
    //       </Heading>
    //       <Grid templateRows="1fr" templateColumns="1fr auto 1fr" gap={6}>
    //         <Grid
    //           templateRows="repeat(2, 1fr)"
    //           templateColumns="repeat(2, 1fr)"
    //           gap={4}
    //         >
    //           {featured.map((article, index) => (
    //             <GridItem
    //               key={article.title}
    //               rowSpan={index === 0 ? 1 : 1}
    //               colSpan={index === 0 ? 2 : 1}
    //             >
    //               <NewsCard
    //                 title={article.title}
    //                 imageUrl={article.image[0].url}
    //                 abstract={article.abstract}
    //                 href={article.url}
    //                 titleProps={{ size: { base: 'md', md: 'lg' } }}
    //                 timeline={timeAgo(article.published_date)}
    //               />
    //             </GridItem>
    //           ))}
    //         </Grid>
    //         {/* <Divider borderColor={'gray.400'} orientation="vertical" /> */}
    //         <Grid templateColumns="repeat(2, 1fr)">
    //           {news.map((article) => (
    //             <NewsCard
    //               key={article.title}
    //               title={article.title}
    //               href={article.url}
    //               titleProps={{ size: { base: 'sm', md: 'sm' } }}
    //               timeline={timeAgo(article.published_date)}
    //             />
    //           ))}
    //         </Grid>
    //       </Grid>
    //     </div>

    //     <div>
    //       <Heading as={'h2'}>Markets</Heading>
    //       <div></div>
    //     </div>
    //   </SimpleGrid>
    // </Container>
  )
}
