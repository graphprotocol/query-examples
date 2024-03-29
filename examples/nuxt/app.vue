<template>
  <div class="w-full h-full min-h-screen p-0 m-0 bg-white dark:bg-slate-900 text-gray-900 dark:text-white font-mono">
    <main class="h-full min-h-screen mx-auto max-w-7xl pt-10 flex flex-col gap-y-24">
      <h1 class="text-3xl">The Graph Query Examples | Nuxt</h1>
      <div>
        <div class="flow-root">
          <div class="overflow-x-auto">
            <div class="inline-block min-w-full py-2 align-middle">
              <table class="min-w-full divide-y divide-gray-300 dark:divide-gray-50">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-0"
                    >
                      Name
                    </th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-50">
                      Description
                    </th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-50">
                      Owner
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr v-for="s in subgraphs" :key="s.id">
                    <td
                      class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-0"
                    >
                      {{ s.metadata?.displayName || s.id }}
                    </td>
                    <td
                      class="whitespace-nowrap px-3 py-4 text-sm text-gray-800 dark:text-gray-100 min-w-fit max-w-md truncate"
                    >
                      {{ s.metadata?.description || '' }}
                    </td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-800 dark:text-gray-100">
                      {{ s.owner.id }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';

import { graphql } from './generated/gql';
import type { SubgraphsQuery, SubgraphsQueryVariables } from './generated/graphql';

const Subgraphs = graphql(`
  query Subgraphs($first: Int, $skip: Int, $where: Subgraph_filter) {
    subgraphs(first: $first, skip: $skip, where: $where) {
      id
      metadata {
        displayName
        image
        description
      }
      owner {
        id
      }
    }
  }
`);

const { data, suspense } = useQuery<{ data: SubgraphsQuery }>({
  queryKey: ['subgraphs'],
  async queryFn() {
    return await $fetch('/api/graphql', {
      method: 'POST',
      body: {
        query: Subgraphs,
        operationName: 'Subgraphs',
        variables: {
          first: 10,
          skip: 0,
          where: {
            metadata_not: null,
            metadata_: { description_not: null },
            owner_not: '0x0000000000000000000000000000000000000000',
          },
        } as const satisfies SubgraphsQueryVariables,
      },
    });
  },
});

const subgraphs = computed(() => data.value?.data?.subgraphs ?? []);

await suspense();
</script>
