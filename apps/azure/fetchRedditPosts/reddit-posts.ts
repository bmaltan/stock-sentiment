import connection from './reddit-connection';
import type { RedditPosts, RedditPost } from './types/posts.type';

function fetchTopFromSubreddit(subreddit: string): Promise<RedditPosts> {
    return connection.getSubreddit(subreddit).getHot({
        // after: the last post we checked?
        // todo: set limit
        limit: 1,
    });
}

export async function getHotPosts(subreddits: string[]): Promise<RedditPost[]> {
    const postsss = await Promise.all(
        subreddits.map((s) => fetchTopFromSubreddit(s))
    );
    return postsss.flatMap((post) => post);
}
