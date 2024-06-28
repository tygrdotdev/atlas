![](/assets/banner.png)

## What is Atlas?
Atlas is an open-source, multi-purpose Discord bot.  

## Why is Atlas?

Many public Discord music bots commonly sourced their content from YouTube, which is a breach of their [ToS](https://www.youtube.com/t/terms), leading to the shutdown of many popular bots such as [Rythm](https://www.theverge.com/2021/9/12/22669502/youtube-discord-rythm-music-bot-closure) and [Groovy](https://www.theverge.com/2021/8/24/22640024/youtube-discord-groovy-music-bot-closure).

The lack of public music bots and my desire to listen to music with friends on Discord led me to create Atlas, an open-source, self-hostable alternative.

## Self Hosting
To use Atlas, you will need to host your own instance.  

I wrote a guide on how to achieve this, which is available on [my website](https://tygr.dev/blog/hosting-atlas) or on the [repo wiki](https://github.com/tygrxqt/atlas/wiki/Hosting-with-Docker-Compose).

## Tech Stack

- API: [DiscordJS](https://discord.js.org/)
- Audio Node: [Lavalink](https://github.com/lavalink-devs/Lavalink)
- Lavalink Wrapper: [Shoukaku](https://github.com/shipgirlproject/Shoukaku)
- Shoukaku Wrapper: [Kazagumo](https://github.com/Takiyo0/Kazagumo)

## Local Development
Atlas uses a public Lavalink instance during development, however in production, you will need to provide your own instance.

```bash
git clone https://github.com/tygrxqt/atlas -b canary
cd atlas
pnpm install
pnpm dev
```