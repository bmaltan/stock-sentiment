import { getHotPosts } from './reddit-posts';
import { finalize, map, mergeMap, tap, withLatestFrom } from 'rxjs/operators';
import tickers = require('./tickers.json');
import { RedditPost } from './types/posts.type';
import { Ticker, TickerData } from './types/ticker.type';
import { Listing, Comment } from 'snoowrap';
import { FirebaseDatabase } from './firebase';
import { Platform } from './types/platform.enum';
import * as https from 'https';
import { getStockData } from './stocks';

interface IngestedData {
    [subreddit: string]: Record<string, TickerData>;
}

const subreddits = ['investing']; // 'pennystocks', 'stocks', 'wallstreetbets' ];

export async function ingestRedditPosts() {
    const posts = await getHotPosts(subreddits);
    const date = new Date();

    const reducedPosts = await Promise.all(
        posts.map(async (post) => {
            const comments = await post.comments.fetchAll({ amount: 1000 });

            const subreddit = post.subreddit_name_prefixed.replace('r/', '');
            const wordsInPost = [
                ...splitToWords(post.title),
                ...splitToWords(post.selftext),
            ];
            const allWords = [...wordsInPost, ...getAllComments(comments)];

            const tickersInPost = tickers
                .filter((ticker) => wordsInPost.includes(ticker.symbol))
                .map((t) => t.symbol);

            const allTickersMentioned = allWords.filter((w) =>
                tickers.some((t) => t.symbol === w)
            );
            const mentions = count(allTickersMentioned);

            return {
                subreddit,
                url: post.url,
                title: post.title,
                rockets: post.title.split('').filter((ch) => ch === '🚀'),
                tickersInPost,
                allTickersMentioned,
                mentions,
                score: post.score,
            };
        })
    );

    const allTickers = reducedPosts.flatMap((r) => r.allTickersMentioned);
    const stockData = await getStockData(allTickers, date);

    const data: IngestedData = {};

    for (let sub of subreddits) {
        for (let { symbol: ticker } of tickers) {
            const mentionedAnywhereInPosts = reducedPosts.filter(
                (post) =>
                    post.subreddit === sub &&
                    post.allTickersMentioned.includes(ticker)
            );
            const mentionedInHeadPosts = reducedPosts.filter(
                (post) =>
                    post.subreddit === sub &&
                    post.tickersInPost.includes(ticker)
            );

            if (
                mentionedAnywhereInPosts.length ||
                mentionedInHeadPosts.length
            ) {
                if (!data[sub]) {
                    data[sub] = {};
                }

                const tickerData = new TickerData(ticker);
                tickerData.numOfPosts = mentionedInHeadPosts.length;
                tickerData.links = mentionedAnywhereInPosts.map((post) => ({
                    title: post.title,
                    url: post.url,
                    score: post.score,
                }));
                tickerData.numOfMentions = mentionedAnywhereInPosts.reduce(
                    (acc, post) => post.mentions[ticker] + acc,
                    0
                );
                tickerData.openingPrice =
                    stockData.result_data[ticker]?.[0].open;
                tickerData.closingPrice =
                    stockData.result_data[ticker]?.[0].close;

                data[sub][ticker] = tickerData;
            }
        }
    }

    for (let sub of Object.keys(data)) {
        console.log(date);
        const firebase = new FirebaseDatabase(sub, Platform.Reddit, date);
        firebase.addAllData(data[sub]);
        await firebase.saveData();
    }
}

interface Counter {
    [key: string]: number;
}

function count(arr: string[]): Counter {
    const counter: Counter = {};
    for (let s of arr) {
        counter[s] = 1 + (counter[s] ?? 0);
    }
    return counter;
}

function splitToWords(s: string): string[] {
    return s
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
        .replace(/\s{2,}/g, ' ')
        .split(' ');
}

function getAllComments(comments: Listing<Comment>): string[] {
    return comments.reduce(
        (acc, comm) => [
            ...acc,
            ...splitToWords(comm.body),
            ...getAllComments(comm.replies),
        ],
        []
    );
}
