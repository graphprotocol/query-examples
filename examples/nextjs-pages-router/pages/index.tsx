import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { InferGetServerSidePropsType } from 'next';
import Head from 'next/head';

import { SubgraphsTable } from '@/Components/Subgraphs';
import { client } from '@/graphql/ssr.client';
import { querySubgraphs } from '@/services/subgraphs';

export async function getServerSideProps() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['subgraphs'],
    async queryFn() {
      return await querySubgraphs({ client });
    },
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}
export type HomePageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function HomePage(props: HomePageProps) {
  return (
    <div>
      <Head>
        <title>The Graph | NextJS Pages Router Subgraph Querying Example</title>
        <meta
          name="description"
          content="Demos how to query the Graph Network Arbitrum Subgraph published to The Graph Network using an API Key obtained on The Graph Studio in a NextJS application using the nextjs pages router"
        />
      </Head>
      <HydrationBoundary state={props.dehydratedState}>
        <SubgraphsTable />
      </HydrationBoundary>
    </div>
  );
}
