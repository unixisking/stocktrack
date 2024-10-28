// import { useLoaderData } from '@remix-run/react'
import { fetchNews, getFeaturedArticles } from '@/.server/news'
import db from '@/.server/redis'
import PortfolioChart from '@/components/PortfolioChart'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { timeAgo, truncateNumber } from '@/utils'
import { StarFilledIcon } from '@radix-ui/react-icons'
import { useLoaderData } from '@remix-run/react'
import { ClockIcon, NewspaperIcon, TrendingUp } from 'lucide-react'

// import { timeAgo } from '@/utils'
//   title: string
//   abstract: string
//   image: Record<string, string>[]
//   url: string
//   published_date: string
//   section: string
//   subsection: string
// }

// type DayStockData = {
//   date: string
//   close: number
//   high: number
//   low: number
//   open: number
// }

// type Stock = {
//   ticker: string
//   data: DayStockData[]
//   base: number
// }

export const loader = async () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const news = await db.json.get('news:home')
  const featured = await db.json.get('news:home:featured')
  const iex = await db.scan(30, { MATCH: 'iex:*', COUNT: 10 })
  const stocks = []
  console.log(iex)

  for (const key of iex.keys) {
    try {
      const stock = (await db.json.get(key)) as []
      console.log('stock fetched', stock)
      const stockData = {
        ticker: key.split(':')[1],
        data: stock.data
          .slice(stock.length - 30, stock.length)
          .sort((a, b) => new Date(a.date) - new Date(b.date)),
      }
      const base = stockData.data.reduce((acc, day) => acc + day.close, 0)

      stocks.push({ ...stockData, base: base / stockData.data.length })
    } catch (error) {
      console.error('Error fetching stocks from DB', error)
    }
  }

  if (news && featured) {
    return { news, featured, stocks }
  }
  try {
    const freshNews = await fetchNews()
    const freshFeatured = getFeaturedArticles(freshNews)
    await db.json.set('news:home', '$', freshNews)
    await db.json.set('news:home:featured', '$', freshFeatured)
    await db.expire('news:home', 3600)
    await db.expire('news:home:featured', 3600)
    return { news: freshNews, featured: freshFeatured, iex }
  } catch (error) {
    throw new Response('Unable to fetch news')
  }
}

type NewsItem = {
  title: string
  description: string
  url: string
  published_date: string
  subsection: string
  source: {
    name: string
  }
}

type StockData = {
  ticker: string
  data: {
    date: string
    close: number
  }[]
  base: number
}

type LoaderData = {
  stocks: StockData[]
  news: NewsItem[]
  featured: NewsItem[]
}

export default function Homepage() {
  const { news, featured, stocks } = useLoaderData<LoaderData>()
  console.log('news', featured)
  return (
    <div className="flex flex-1 flex-col gap-4 px-4 mt-6 pt-0">
      <div className="grid auto-rows-min gap-8 md:grid-cols-3">
        {/* <div className="aspect-video rounded-xl bg-yellow-500/50" />
        <div className="aspect-video rounded-xl bg-blue-500/50" />
        <div className="aspect-video rounded-xl bg-green-500/50" /> */}
        <Card className="md:col-span-2 h-fit">
          <CardContent>
            <Tabs defaultValue="account" className="">
              <TabsList className="mt-6 mb-4">
                <TabsTrigger value="account">Value</TabsTrigger>
                <TabsTrigger value="password">Performance</TabsTrigger>
              </TabsList>
              <TabsContent value="account">
                <div className="mb-4">
                  <CardTitle>Total value in the past year</CardTitle>
                  <CardDescription>
                    Showing total visitors for the last 6 months
                  </CardDescription>
                </div>
                <div className="space-y-4">
                  <PortfolioChart variant="performance" />
                </div>
              </TabsContent>
              <TabsContent value="password">
                <div className="mb-4">
                  <CardTitle>Total performance in the past year</CardTitle>
                  <CardDescription>
                    Showing total visitors for the last 6 months
                  </CardDescription>
                </div>
                <div className="space-y-4">
                  <PortfolioChart variant="value" />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <div className="flex w-full items-start gap-2 text-sm">
              <div className="grid gap-2">
                <div className="flex items-center gap-2 font-medium leading-none">
                  Trending up by 5.2% this month{' '}
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-2 leading-none text-muted-foreground">
                  January - June 2024
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
        <div className="flex flex-col gap-4">
          <Card className="h-fit">
            <CardHeader>
              <div className="flex items-center gap-2">
                <StarFilledIcon className="h-5 w-5 text-yellow-400" />
                <CardTitle>Watch List</CardTitle>
              </div>
              <CardDescription className="mt-2">
                Track your favorite stocks and their performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-none ">
                {stocks.map((stock) => (
                  <li key={stock.ticker} className="flex justify-between">
                    <span>{stock.ticker}</span>
                    <span>{truncateNumber(stock.base)}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="h-fit">
            <CardHeader>
              <div className="flex items-center gap-2">
                <NewspaperIcon className="h-5 w-5 text-primary" />
                <CardTitle>Latest Updates</CardTitle>
              </div>
              <CardDescription className="mt-2">
                Stay informed with the latest market news and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-none divide-y">
                {news.slice(0, 10).map((article) => (
                  <li
                    key={article.title}
                    className="py-4 hover:bg-muted/50 transition-colors rounded-lg px-3"
                  >
                    <a href={article.url} className="block">
                      <div className="flex items-start gap-2">
                        <div className="flex-1">
                          <h4 className="font-medium line-clamp-2 mb-2 text-foreground/90 hover:text-foreground">
                            {article.title}
                          </h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <ClockIcon className="h-3.5 w-3.5" />
                              <span className="text-zinc-600">
                                {timeAgo(article.published_date)}
                              </span>
                            </div>
                            {article.subsection && (
                              <div className="flex items-center">
                                <Badge>{article.subsection}</Badge>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
        {/* <StratChart /> */}
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </div>
  )
  // <Container maxWidth={'100vw'} p={2} float={'left'}>
  //   <Flex gap={32} justifyContent={'space-between'}>
  //     <div>
  //       <Heading mb={6} as={'h1'} fontSize={32}>
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
  //                 titleProps={{ size: { base: 'md' } }}
  //                 timeline={timeAgo(article.published_date)}
  //               />
  //             </GridItem>
  //           ))}
  //         </Grid>
  //         {/* <Divider borderColor={'gray.400'} orientation="vertical" /> */}
  //         <Grid templateColumns="repeat(2, 1fr)" gap={1}>
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

  //     <Stack>
  //       <div
  //         borderWidth={0.5}
  //         borderColor={'gray.400'}
  //         h={'fit-content'}
  //         p={2}
  //         maxW={'fit-content'}
  //       >
  //         <Heading mb={6} as={'h3'} fontSize={18}>
  //           Markets
  //         </Heading>
  //         <div maxW={'fit-content'} paddingRight={8}>
  //           <Flex direction={'column'} gap={2}>
  //             {stocks.map((stock) => (
  //               <Flex key={stock.ticker} gap={6}>
  //                 <img
  //                   width={25}
  //                   src={`https://assets.parqet.com/logos/symbol/${stock.ticker}`}
  //                   alt=""
  //                 />
  //                 <div>
  //                   <Text>{stock.ticker}</Text>
  //                 </div>
  //                 <SmallChart
  //                   // data={initialData}
  //                   data={stock.data.map((day) => ({
  //                     time: (new Date(day.date).getTime() /
  //                       1000) as UTCTimestamp,
  //                     value: day.close,
  //                   }))}
  //                   base={stock.base}
  //                 />
  //                 <div>
  //                   <Text>{stock.data[stock.data.length - 1].close}</Text>
  //                 </div>
  //               </Flex>
  //             ))}
  //           </Flex>
  //         </div>
  //       </div>

  //       <div
  //         borderWidth={0.5}
  //         borderColor={'gray.400'}
  //         h={'fit-content'}
  //         p={2}
  //         w={300}
  //       >
  //         <Heading mb={6} as={'h3'} fontSize={18}>
  //           Foreign exchange market
  //         </Heading>
  //         <div maxW={'fit-content'}>
  //           <Flex direction={'column'} gap={2}>
  //             {/* {[...fx.entries()].map((currency) => (
  //               <Flex key={currency[0]} gap={6}>
  //                 <div>
  //                   <Text>{currency[1]['last'].ticker.toUpperCase()}</Text>
  //                 </div>
  //                 <ChartComponent data={currency[1].history} />
  //                 <div>
  //                   <Text>
  //                     {truncateNumber(currency[1]['last'].value, 4)}
  //                   </Text>
  //                 </div>
  //               </Flex>
  //             ))} */}
  //           </Flex>
  //         </div>
  //       </div>
  //     </Stack>
  //   </Flex>
  // </Container>
}
