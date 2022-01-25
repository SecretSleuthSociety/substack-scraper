import express from "express";
import requestPromise from "request-promise";
import cheerio from "cheerio";

const port = process.env.NODE_ENV === "development" ? 4000 : 80;
const app = express();

app.use(express.json());

/**
 * 1. Load all substack blog index pages.
 * 2. Grab all blog posts from each index page.
 * 4. Return JSON sorted by timestamp:
 *  {
 *      author: string,
 *      title: string,
 *      thumbnail: string,
 *      description: string,
 *      timestamp: string,
 *      like_count: number,
 *      comment_count: number,
 *      href: string,
 *  }
 *
 * @param {string[]} usernames
 */
app.post("/", async (req, res) => {
  const arr = [];
  const usernames = req.body.usernames;
  for (const username of usernames) {
    try {
      const url = `https://${username}.substack.com/`;
      const html = await requestPromise(url);
      const $ = cheerio.load(html);
      $(".post-preview.portable-archive-post").each((i, post) => {
        const thumbnail = $(post)
          .find(".post-preview-image")
          .css("background-image")
          .split('"')[1];
        const title = $(post).find(".post-preview-title").text();
        const description = $(post).find(".post-preview-description").text();
        const author = $(post).find(".post-meta-item.author a").text();
        const timestamp = $(post)
          .find(".post-meta-item.post-date")
          .attr("title");
        const like_count = parseInt($(post).find(".like-count").text()) || 0;
        const comment_count =
          parseInt($(post).find(".comment-count").text()) || 0;
        const href = $(post).find(".post-preview-title").attr("href");
        const object = {
          thumbnail,
          title,
          description,
          author,
          timestamp,
          like_count,
          comment_count,
          href,
        };
        arr.push(object);
      });
    } catch (e) {
      console.error(e);
    }
  }

  // Sort latest
  arr.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));

  // Take first 80
  arr = arr.slice(0, 80);

  // Return arr
  res.send(arr);
});

app.listen(port, () => {
  console.log(`Substack web scraper listening at http://localhost:${port}`);
});
