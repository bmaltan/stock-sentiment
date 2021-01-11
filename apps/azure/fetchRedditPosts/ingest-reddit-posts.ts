import { getHotPosts } from './reddit-posts';
import { map } from 'rxjs/operators';

export function ingestRedditPosts() {
    getHotPosts()
        .pipe(
            map((post) => {
                console.log(post);
            })
        )
        .subscribe();
}
