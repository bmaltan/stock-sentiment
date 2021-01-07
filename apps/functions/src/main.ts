import * as functions from 'firebase-functions';
import { ingestRedditPosts } from './reddit/ingest-reddit-posts';

// export const scheduledFunction = functions.pubsub
//     .schedule('0 0 * * *')
//     .onRun((context) => {
//         return null;
//     });

exports.test = functions.https.onRequest((req, res) => {
    ingestRedditPosts();
    res.send('Hello');
});
