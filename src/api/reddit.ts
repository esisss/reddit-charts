const fetchSubredditPosts = async (subreddit: string, sort: string) => {
  const res = await fetch(`https://www.reddit.com/r/${subreddit}/${sort}.json`);
  return res.json();
};

export { fetchSubredditPosts };
