import { ApolloClient, InMemoryCache } from '@apollo/client';
import {IS_PRODUCTION} from '@config/constants'

const client = new ApolloClient({
  uri: IS_PRODUCTION ? '' : 'https://gateway.testnet.thegraph.com/api/bdecdd696b13138f33f4a91558331c83/subgraphs/id/0x15441e298a22ba6d4e95b77a3f511e76dbade87f-0',
  cache: new InMemoryCache()
});

export default client