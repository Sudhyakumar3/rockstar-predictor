Hit the Charts
## Inspiration  
With the advent of short-form media and other new ways to share music, many new artists have gotten the chance to be in the spotlight. We were curious—are there patterns in trending songs, and can budding musicians leverage these patterns to become the next superstar?  

---

## What it does  
**Hit the Charts!** lets musicians input their song lyrics and provides an analysis of their themes, sentiment, and similarity to past Billboard chart-toppers. It estimates the song’s potential popularity and highlights the most thematically similar hit songs, helping users get insights into what makes a hit.  

We also provide **AI-driven recommendations** on how to improve song lyrics to boost their potential popularity. Additionally, users can explore the **Songs Collection** page, where they can filter charting songs by month and year and discover how songs cluster together based on themes and sentiment trends. On the **Playground** page, users can experiment with different themes, keywords, and sentiment to see how they impact predicted popularity.  

---

## How we built it  
* **Database Creation:** We collected data on Billboard charting songs from the past three years, including chart history and Spotify’s popularity scores.  
* **Theme Analysis:** Using OpenAI’s Llama LLM, we extracted high-level themes (e.g., love, heartbreak, regret) and performed sentiment analysis using VADER.  
* **Lyric Matching:** We encoded user-submitted lyrics and compared them to our song database using feature similarity. This allowed us to predict popularity and recommend the most thematically similar charting songs.  
* **Interactive Features:** We built filtering and visualization tools to explore trends in song themes and sentiment, along with a playground for testing custom lyrics and combinations of themes.  

---

## Challenges we ran into  
* **Data Collection:** Aggregating reliable and comprehensive data on charting songs was time-consuming and required filtering incomplete or inconsistent information.  
* **Theme Extraction:** Fine-tuning OpenAI’s LLM to generate meaningful and consistent themes was a challenge, especially for abstract or metaphorical lyrics.  
* **Interactive Visualizations:** Creating dynamic filters and real-time popularity predictions on the playground page while ensuring the interface remained intuitive was complex.  

---

## Accomplishments that we're proud of  
* Building a robust database of charting songs and integrating multiple analysis tools (LLMs, VADER, and Spotify data).  
* Successfully creating an intuitive and accurate similarity-matching system for song lyrics.  
* Designing an interactive playground where users can tweak their lyrics and see the impact on predicted popularity.  
* Providing valuable insights to musicians about what makes their song comparable to existing hits.  

---

## What we learned  
* The power of combining multiple NLP tools for a comprehensive analysis of text data.  
* How to build scalable song-matching algorithms using feature similarity and embeddings.  
* The importance of high-quality data in generating meaningful predictions and insights.  
* Designing interactive experiences that make complex AI tools user-friendly and fun.  

---

## What's next for Hit the Charts!  
* Expanding our dataset and releasing it publicly so others can benefit and perform their own analysis.  
* Improving our AI recommendations to give even more personalized feedback to musicians.  
* Enhancing the playground with more customization options and real-time theme visualization to help users craft the perfect song.  





This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
