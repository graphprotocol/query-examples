<script lang="ts">
	import type { SubgraphsQuery } from '../generated/graphql';

	/** @type {import('./$types').PageData} */
	export let data: SubgraphsQuery;
</script>

<main class="h-full min-h-screen mx-auto max-w-7xl mt-10 flex flex-col gap-y-24">
	<h1 class="text-3xl">The Graph Query Examples | SvelteKit</h1>
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
							{#each data.subgraphs as subgraph}
								<tr>
									<td
										class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-0"
									>
										{subgraph.metadata?.displayName || subgraph.id}
									</td>
									<td
										class="whitespace-nowrap px-3 py-4 text-sm text-gray-800 dark:text-gray-100 min-w-fit max-w-md truncate"
									>
										{subgraph.metadata?.description || ''}
									</td>
									<td class="whitespace-nowrap px-3 py-4 text-sm text-gray-800 dark:text-gray-100">
										{subgraph.owner.id}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</main>
