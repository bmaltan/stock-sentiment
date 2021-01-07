import connection from './reddit-connection';
import { Observable, from } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import type { RedditPosts, RedditPost } from './posts.type';

function fetchTopFromSubreddit(subreddit: string): Observable<RedditPosts> {
    const getHot = connection.getSubreddit(subreddit).getHot({
        // after: the last post we checked?
        // todo: set limit
        limit: 10,
    });
    return from(getHot);
}

export function getHotPosts(): Observable<RedditPost> {
    return new Observable<RedditPost>((observer) => {
        from(subreddits.map((s) => fetchTopFromSubreddit(s)))
            .pipe(
                tap((results) => {
                    results.forEach((r) => r.forEach((o) => observer.next(o)));
                }),
                finalize(() => {
                    observer.complete();
                })
            )
            .subscribe();
    });
}

const subreddits = ['investing'];
