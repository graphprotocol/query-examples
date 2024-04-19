#! /usr/bin/env bun

import chalk from 'chalk';
import { Command, InvalidArgumentError } from 'commander';
import { GraphQLClient } from 'graphql-request';
import { z } from 'zod';

const subgraphClient = new GraphQLClient(
  // replace this with your Subgraph
  'https://gateway-arbitrum.network.thegraph.com/api/subgraphs/id/DZz4kDTdmzWLWsV373w2bSmoar3umKKH9y82SUKr5qmp'
);

const ApiKey = z.coerce.string().min(32).max(32);
const GraphqlQuery = z.coerce.string().min(1);
const GraphqlReqVariables = z.record(z.any());

const program = new Command();

program
  .name('subgraph-query')
  .description('CLI that takes an API Key and query and queries a Subgraph published on The Graph Network')
  .version('0.1.0');

program
  .command('query')
  .description('Query the Subgraph on the The Graph Network')
  .argument('<api-key>', 'API Key obtained on Subgraph Studio', (apiKey) => {
    const apiKeyOptParseResult = ApiKey.safeParse(apiKey);
    if (!apiKeyOptParseResult.success) {
      throw new InvalidArgumentError('Invalid API Key options');
    }
    return apiKeyOptParseResult.data;
  })
  .argument('<query>', 'GraphQL Query to run on the Subgraph', (query) => {
    const queryOptParseResult = GraphqlQuery.safeParse(query);
    if (!queryOptParseResult.success) {
      throw new InvalidArgumentError('Invalid GraphQL Query option');
    }
    return queryOptParseResult.data;
  })
  .option(
    '-v, --variables <object>',
    '[Optional] GraphQL Variables to pass to the Subgraph query',
    (vars) => {
      if (vars != null) {
        const variablesParseResult = GraphqlReqVariables.safeParse(typeof vars === 'string' ? JSON.parse(vars) : vars);
        if (variablesParseResult.success) {
          return variablesParseResult.data;
        }
        return undefined;
      }
    },
    undefined
  )
  .action(async function (apiKey, query, opts) {
    const _apiKey = ApiKey.parse(apiKey);
    const _query = GraphqlQuery.parse(query);
    let _vars: Record<string, any> | undefined = undefined;
    if (opts?.variables) {
      const optsOptionalParseResult = GraphqlReqVariables.safeParse(opts.variables);
      _vars = optsOptionalParseResult.success ? optsOptionalParseResult.data : undefined;
    }

    try {
      const result = await subgraphClient.request(_query, _vars, {
        Authorization: `Bearer ${_apiKey}`,
      });

      console.log(chalk.blue('Query results retrieved from the Subgraph'));
      console.log(result);
    } catch (err) {
      console.error(chalk.red(err));
    }
  });

program.parseAsync();
