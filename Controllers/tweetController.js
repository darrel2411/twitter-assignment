class Controller {
    static allTweet(req, res) {
        // Get User Tweet timeline by user ID
        // https://developer.twitter.com/en/docs/twitter-api/tweets/timelines/quick-start

        const needle = require("needle");

        // this is the ID for @TwitterDev
        const userId = "44196397"; // elonmusk
        // const userId = "2244994945"; // twitterDev
        const url = `https://api.twitter.com/2/users/${userId}/tweets`;

        // The code below sets the bearer token from your environment variables
        // To set environment variables on macOS or Linux, run the export command below from the terminal:
        // export BEARER_TOKEN='YOUR-TOKEN'
        const bearerToken = process.env.BEARER_TOKEN;

        const getUserTweets = async () => {
            let userTweets = [];

            // we request the author_id expansion so that we can print out the user name later
            let params = {
                max_results: 100,
                "tweet.fields": "created_at",
                expansions: "author_id",
            };

            const options = {
                headers: {
                    "User-Agent": "v2UserTweetsJS",
                    authorization: `Bearer ${bearerToken}`,
                },
            };

            let hasNextPage = true;
            let nextToken = null;
            let userName;
            console.log("Retrieving Tweets...");

            while (hasNextPage) {
                let resp = await getPage(params, options, nextToken);
                if (resp && resp.meta && resp.meta.result_count && resp.meta.result_count > 0) {
                    userName = resp.includes.users[0].username;
                    if (resp.data) {
                        userTweets.push.apply(userTweets, resp.data);
                    }
                    if (resp.meta.next_token) {
                        nextToken = resp.meta.next_token;
                    } else {
                        hasNextPage = false;
                    }
                } else {
                    hasNextPage = false;
                }
            }

            // console.dir(userTweets, {
            //     depth: null,
            // });
            console.log(`Got ${userTweets.length} Tweets from ${userName} (user ID ${userId})!`);
            res.status(200).json(userTweets);
        };

        const getPage = async (params, options, nextToken) => {
            if (nextToken) {
                params.pagination_token = nextToken;
            }

            try {
                const resp = await needle("get", url, params, options);

                if (resp.statusCode != 200) {
                    console.log(`${resp.statusCode} ${resp.statusMessage}:\n${resp.body}`);
                    return;
                }
                return resp.body;
            } catch (err) {
                throw new Error(`Request failed: ${err}`);
            }
        };

        // console.log(getUserTweets());
        getUserTweets();
    }

    static getElon(req, res) {
        // Get User objects by username, using bearer token authentication
        // https://developer.twitter.com/en/docs/twitter-api/users/lookup/quick-start

        const needle = require("needle");

        // The code below sets the bearer token from your environment variables
        // To set environment variables on macOS or Linux, run the export command below from the terminal:
        // export BEARER_TOKEN='YOUR-TOKEN'
        const token = process.env.BEARER_TOKEN;

        const endpointURL = "https://api.twitter.com/2/users/by?usernames=";

        async function getRequest() {
            // These are the parameters for the API request
            // specify User names to fetch, and any additional fields that are required
            // by default, only the User ID, name and user name are returned
            const params = {
                usernames: "elonmusk", // Edit usernames to look up
                "user.fields": "created_at,description", // Edit optional query parameters here
                expansions: "pinned_tweet_id",
            };

            // this is the HTTP header that adds bearer token authentication
            const res = await needle("get", endpointURL, params, {
                headers: {
                    "User-Agent": "v2UserLookupJS",
                    authorization: `Bearer ${token}`,
                },
            });

            if (res.body) {
                return res.body;
            } else {
                throw new Error("Unsuccessful request");
            }
        }

        (async () => {
            try {
                // Make request
                const response = await getRequest();
                console.dir(response, {
                    depth: null,
                });
            } catch (e) {
                console.log(e);
                process.exit(-1);
            }
            process.exit();
        })();
    }
}

module.exports = Controller;
