import { ingestRedditPosts } from './ingest-reddit-posts';
import { AzureFunction, Context, HttpRequest } from '@azure/functions';

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<any> {};