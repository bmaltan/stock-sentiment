import { DiscussionLink, ApiDiscussionLink } from './discussion-link.type';

export interface ApiPlatformData {
    platform: string;
    ticker: string;
    day: string;
    open?: any;
    close?: any;
    num_of_posts: number;
    bull_mention: number;
    bear_mention: number;
    neutral_mention: number;
    links: ApiDiscussionLink[];
}

export interface PlatformData {
    platform: string;
    ticker: string;
    day: string;
    open?: any;
    close?: any;
    numOfPosts: number;
    bullMention: number;
    bearMention: number;
    neutralMention: number;
    links: DiscussionLink[];
}
