"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable */
// This file had minor additions
// for testing that were converted to typescript
// thus eslint was disabled for Sprint 1. 
const nconf_1 = __importDefault(require("nconf"));
const querystring_1 = __importDefault(require("querystring"));
const database_1 = __importDefault(require("../database"));
const user_1 = __importDefault(require("../user"));
const meta_1 = __importDefault(require("../meta"));
const topics_1 = __importDefault(require("../topics"));
const categories_1 = __importDefault(require("../categories"));
const posts_1 = __importDefault(require("../posts"));
const privileges_1 = __importDefault(require("../privileges"));
const helpers_1 = __importDefault(require("./helpers"));
const pagination_1 = __importDefault(require("../pagination"));
const utils_1 = __importDefault(require("../utils"));
const analytics_1 = __importDefault(require("../analytics"));
const topicsController = module.exports;
const url = nconf_1.default.get('url');
const relative_path = nconf_1.default.get('relative_path');
const upload_url = nconf_1.default.get('upload_url');
topicsController.get = function getTopic(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const tid = req.params.topic_id;
        if ((req.params.post_index && !utils_1.default.isNumber(req.params.post_index) && req.params.post_index !== 'unread') ||
            !utils_1.default.isNumber(tid)) {
            return next();
        }
        let postIndex = parseInt(req.params.post_index, 10) || 1;
        const [userPrivileges, settings, topicData, rssToken,] = yield Promise.all([
            privileges_1.default.topics.get(tid, req.uid),
            user_1.default.getSettings(req.uid),
            topics_1.default.getTopicData(tid),
            user_1.default.auth.getFeedToken(req.uid),
        ]);
        let currentPage = parseInt(req.query.page, 10) || 1;
        const pageCount = Math.max(1, Math.ceil((topicData && topicData.postcount) / settings.postsPerPage));
        const invalidPagination = (settings.usePagination && (currentPage < 1 || currentPage > pageCount));
        if (!topicData ||
            userPrivileges.disabled ||
            invalidPagination ||
            (topicData.scheduled && !userPrivileges.view_scheduled)) {
            return next();
        }
        if (!userPrivileges['topics:read'] || (!topicData.scheduled && topicData.deleted && !userPrivileges.view_deleted)) {
            return helpers_1.default.notAllowed(req, res);
        }
        if (req.params.post_index === 'unread') {
            postIndex = yield topics_1.default.getUserBookmark(tid, req.uid);
        }
        if (!res.locals.isAPI && (!req.params.slug || topicData.slug !== `${tid}/${req.params.slug}`) && (topicData.slug && topicData.slug !== `${tid}/`)) {
            return helpers_1.default.redirect(res, `/topic/${topicData.slug}${postIndex ? `/${postIndex}` : ''}${generateQueryString(req.query)}`, true);
        }
        if (utils_1.default.isNumber(postIndex) && topicData.postcount > 0 && (postIndex < 1 || postIndex > topicData.postcount)) {
            return helpers_1.default.redirect(res, `/topic/${tid}/${req.params.slug}${postIndex > topicData.postcount ? `/${topicData.postcount}` : ''}${generateQueryString(req.query)}`);
        }
        postIndex = Math.max(1, postIndex);
        const sort = req.query.sort || settings.topicPostSort;
        const set = sort === 'most_votes' ? `tid:${tid}:posts:votes` : `tid:${tid}:posts`;
        const reverse = sort === 'newest_to_oldest' || sort === 'most_votes';
        if (settings.usePagination && !req.query.page) {
            currentPage = calculatePageFromIndex(postIndex, settings);
        }
        const { start, stop } = calculateStartStop(currentPage, postIndex, settings);
        yield topics_1.default.getTopicWithPosts(topicData, set, req.uid, start, stop, reverse);
        topics_1.default.modifyPostsByPrivilege(topicData, userPrivileges);
        topicData.tagWhitelist = categories_1.default.filterTagWhitelist(topicData.tagWhitelist, userPrivileges.isAdminOrMod);
        topicData.privileges = userPrivileges;
        topicData.topicStaleDays = meta_1.default.config.topicStaleDays;
        topicData['reputation:disabled'] = meta_1.default.config['reputation:disabled'];
        topicData['downvote:disabled'] = meta_1.default.config['downvote:disabled'];
        topicData['feeds:disableRSS'] = meta_1.default.config['feeds:disableRSS'] || 0;
        topicData['signatures:hideDuplicates'] = meta_1.default.config['signatures:hideDuplicates'];
        topicData.bookmarkThreshold = meta_1.default.config.bookmarkThreshold;
        topicData.necroThreshold = meta_1.default.config.necroThreshold;
        topicData.postEditDuration = meta_1.default.config.postEditDuration;
        topicData.postDeleteDuration = meta_1.default.config.postDeleteDuration;
        topicData.scrollToMyPost = settings.scrollToMyPost;
        topicData.updateUrlWithPostIndex = settings.updateUrlWithPostIndex;
        topicData.allowMultipleBadges = meta_1.default.config.allowMultipleBadges === 1;
        topicData.privateUploads = meta_1.default.config.privateUploads === 1;
        topicData.showPostPreviewsOnHover = meta_1.default.config.showPostPreviewsOnHover === 1;
        topicData.rssFeedUrl = `${relative_path}/topic/${topicData.tid}.rss`;
        if (req.loggedIn) {
            topicData.rssFeedUrl += `?uid=${req.uid}&token=${rssToken}`;
        }
        topicData.postIndex = postIndex;
        yield Promise.all([
            buildBreadcrumbs(topicData),
            addOldCategory(topicData, userPrivileges),
            addTags(topicData, req, res),
            incrementViewCount(req, tid),
            markAsRead(req, tid),
            analytics_1.default.increment([`pageviews:byCid:${topicData.category.cid}`]),
        ]);
        topicData.pagination = pagination_1.default.create(currentPage, pageCount, req.query);
        topicData.pagination.rel.forEach((rel) => {
            rel.href = `${url}/topic/${topicData.slug}${rel.href}`;
            res.locals.linkTags.push(rel);
        });
        res.render('topic', topicData);
    });
};
topicsController.getIsPrivate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tid = req.params.topic_id;
        if (!utils_1.default.isNumber(tid)) {
            return next();
        }
        const topicData = yield topics_1.default.getTopicData(tid);
        if (!topicData) {
            return res.status(404).send({ message: 'Topic not found' });
        }
        res.status(200).send({ isPrivate: topicData.isPrivate });
    }
    catch (error) {
        res.status(500).send({ message: error.message });
    }
});
topicsController.updateIsPrivate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tid = req.params.topic_id;
        if (!utils_1.default.isNumber(tid)) {
            return next();
        }
        // Ensures the parsing of the isPrivate value from req.body
        const isPrivate = req.body.isPrivate;
        // This is for testing
        console.log(isPrivate);
        let isPrivateStr;
        // This method only ensures for a 1-time change
        if (isPrivate === 'true') {
            isPrivateStr = 'false';
        }
        else if (isPrivate === 'false') {
            isPrivateStr = 'true';
        }
        // This is for testing
        console.log(isPrivateStr);
        // Correct arguments passed to the db setObjectField method, namely through topic id
        // and the boolean isPrivate
        //
        yield database_1.default.setObjectField('topic:' + tid, 'isPrivate', isPrivateStr);
        res.status(200).send({ message: 'IsPrivate attribute updated successfully' });
    }
    catch (error) {
        res.status(500).send({ message: error.message });
    }
});
function generateQueryString(query) {
    const qString = querystring_1.default.stringify(query);
    return qString.length ? `?${qString}` : '';
}
function calculatePageFromIndex(postIndex, settings) {
    return 1 + Math.floor((postIndex - 1) / settings.postsPerPage);
}
function calculateStartStop(page, postIndex, settings) {
    let startSkip = 0;
    if (!settings.usePagination) {
        if (postIndex > 1) {
            page = 1;
        }
        startSkip = Math.max(0, postIndex - Math.ceil(settings.postsPerPage / 2));
    }
    const start = ((page - 1) * settings.postsPerPage) + startSkip;
    const stop = start + settings.postsPerPage - 1;
    return { start: Math.max(0, start), stop: Math.max(0, stop) };
}
function incrementViewCount(req, tid) {
    return __awaiter(this, void 0, void 0, function* () {
        const allow = req.uid > 0 || (meta_1.default.config.guestsIncrementTopicViews && req.uid === 0);
        if (allow) {
            req.session.tids_viewed = req.session.tids_viewed || {};
            const now = Date.now();
            const interval = meta_1.default.config.incrementTopicViewsInterval * 60000;
            if (!req.session.tids_viewed[tid] || req.session.tids_viewed[tid] < now - interval) {
                yield topics_1.default.increaseViewCount(tid);
                req.session.tids_viewed[tid] = now;
            }
        }
    });
}
function markAsRead(req, tid) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.loggedIn) {
            const markedRead = yield topics_1.default.markAsRead([tid], req.uid);
            const promises = [topics_1.default.markTopicNotificationsRead([tid], req.uid)];
            if (markedRead) {
                promises.push(topics_1.default.pushUnreadCount(req.uid));
            }
            yield Promise.all(promises);
        }
    });
}
function buildBreadcrumbs(topicData) {
    return __awaiter(this, void 0, void 0, function* () {
        const breadcrumbs = [
            {
                text: topicData.category.name,
                url: `${relative_path}/category/${topicData.category.slug}`,
                cid: topicData.category.cid,
            },
            {
                text: topicData.title,
            },
        ];
        const parentCrumbs = yield helpers_1.default.buildCategoryBreadcrumbs(topicData.category.parentCid);
        topicData.breadcrumbs = parentCrumbs.concat(breadcrumbs);
    });
}
function addOldCategory(topicData, userPrivileges) {
    return __awaiter(this, void 0, void 0, function* () {
        if (userPrivileges.isAdminOrMod && topicData.oldCid) {
            topicData.oldCategory = yield categories_1.default.getCategoryFields(topicData.oldCid, ['cid', 'name', 'icon', 'bgColor', 'color', 'slug']);
        }
    });
}
function addTags(topicData, req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const postIndex = parseInt(req.params.post_index, 10) || 0;
        const postAtIndex = topicData.posts.find((p) => parseInt(p.index, 10) === Math.max(0, postIndex - 1));
        let description = '';
        if (postAtIndex && postAtIndex.content) {
            description = utils_1.default.stripHTMLTags(utils_1.default.decodeHTMLEntities(postAtIndex.content));
        }
        if (description.length > 255) {
            description = `${description.slice(0, 255)}...`;
        }
        description = description.replace(/\n/g, ' ');
        res.locals.metaTags = [
            {
                name: 'title',
                content: topicData.titleRaw,
            },
            {
                name: 'description',
                content: description,
            },
            {
                property: 'og:title',
                content: topicData.titleRaw,
            },
            {
                property: 'og:description',
                content: description,
            },
            {
                property: 'og:type',
                content: 'article',
            },
            {
                property: 'article:published_time',
                content: utils_1.default.toISOString(topicData.timestamp),
            },
            {
                property: 'article:modified_time',
                content: utils_1.default.toISOString(topicData.lastposttime),
            },
            {
                property: 'article:section',
                content: topicData.category ? topicData.category.name : '',
            },
        ];
        yield addOGImageTags(res, topicData, postAtIndex);
        res.locals.linkTags = [
            {
                rel: 'canonical',
                href: `${url}/topic/${topicData.slug}`,
            },
        ];
        if (!topicData['feeds:disableRSS']) {
            res.locals.linkTags.push({
                rel: 'alternate',
                type: 'application/rss+xml',
                href: topicData.rssFeedUrl,
            });
        }
        if (topicData.category) {
            res.locals.linkTags.push({
                rel: 'up',
                href: `${url}/category/${topicData.category.slug}`,
            });
        }
    });
}
function addOGImageTags(res, topicData, postAtIndex) {
    return __awaiter(this, void 0, void 0, function* () {
        const uploads = postAtIndex ? yield posts_1.default.uploads.listWithSizes(postAtIndex.pid) : [];
        const images = uploads.map((upload) => {
            upload.name = `${url + upload_url}/${upload.name}`;
            return upload;
        });
        if (topicData.thumbs) {
            const path = require('path');
            const thumbs = topicData.thumbs.filter(t => t && images.every(img => path.normalize(img.name) !== path.normalize(url + t.url)));
            images.push(...thumbs.map(thumbObj => ({ name: url + thumbObj.url })));
        }
        if (topicData.category.backgroundImage && (!postAtIndex || !postAtIndex.index)) {
            images.push(topicData.category.backgroundImage);
        }
        if (postAtIndex && postAtIndex.user && postAtIndex.user.picture) {
            images.push(postAtIndex.user.picture);
        }
        images.forEach(path => addOGImageTag(res, path));
    });
}
function addOGImageTag(res, image) {
    let imageUrl;
    if (typeof image === 'string' && !image.startsWith('http')) {
        imageUrl = url + image.replace(new RegExp(`^${relative_path}`), '');
    }
    else if (typeof image === 'object') {
        imageUrl = image.name;
    }
    else {
        imageUrl = image;
    }
    res.locals.metaTags.push({
        property: 'og:image',
        content: imageUrl,
        noEscape: true,
    }, {
        property: 'og:image:url',
        content: imageUrl,
        noEscape: true,
    });
    if (typeof image === 'object' && image.width && image.height) {
        res.locals.metaTags.push({
            property: 'og:image:width',
            content: String(image.width),
        }, {
            property: 'og:image:height',
            content: String(image.height),
        });
    }
}
topicsController.teaser = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const tid = req.params.topic_id;
        if (!utils_1.default.isNumber(tid)) {
            return next();
        }
        const canRead = yield privileges_1.default.topics.can('topics:read', tid, req.uid);
        if (!canRead) {
            return res.status(403).json('[[error:no-privileges]]');
        }
        const pid = yield topics_1.default.getLatestUndeletedPid(tid);
        if (!pid) {
            return res.status(404).json('not-found');
        }
        const postData = yield posts_1.default.getPostSummaryByPids([pid], req.uid, { stripTags: false });
        if (!postData.length) {
            return res.status(404).json('not-found');
        }
        res.json(postData[0]);
    });
};
topicsController.pagination = function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const tid = req.params.topic_id;
        const currentPage = parseInt(req.query.page, 10) || 1;
        if (!utils_1.default.isNumber(tid)) {
            return next();
        }
        const [userPrivileges, settings, topic] = yield Promise.all([
            privileges_1.default.topics.get(tid, req.uid),
            user_1.default.getSettings(req.uid),
            topics_1.default.getTopicData(tid),
        ]);
        if (!topic) {
            return next();
        }
        if (!userPrivileges.read || !privileges_1.default.topics.canViewDeletedScheduled(topic, userPrivileges)) {
            return helpers_1.default.notAllowed(req, res);
        }
        const postCount = topic.postcount;
        const pageCount = Math.max(1, Math.ceil(postCount / settings.postsPerPage));
        const paginationData = pagination_1.default.create(currentPage, pageCount);
        paginationData.rel.forEach((rel) => {
            rel.href = `${url}/topic/${topic.slug}${rel.href}`;
        });
        res.json({ pagination: paginationData });
    });
};
topicsController.setTopicAsResolved = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Set the topic as urgent first
        // console.log(res);
        // console.log(req);
        const tid = req.params.topic_id;
        // Now, retrieve the topic details
        yield database_1.default.setObjectField(`topic:${tid}`, 'isResolved', true);
        const topicData = yield topicsController.get(req, req.params);
        helpers_1.default.formatApiResponse(200, res, topicData);
    }
    catch (error) {
        // Handle error appropriately
        helpers_1.default.formatApiResponse(500, res, { error: 'An error occurred while setting the topic as resolved.' });
    }
});
