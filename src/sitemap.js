import {
    SitemapAndIndexStream,
    SitemapStream,
    // lineSeparatedURLsToSitemapOptions,
  } from 'sitemap';
import { resolve } from 'path';
import { createWriteStream } from 'fs';
import { createGzip } from 'zlib' 

const hostname = 'https://suzi-ai.vercel.app';
const outputPath = './public';
const urls = [
  { url: '/', changefreq: 'daily', priority: 1 },
  // Add additional pages here
];

const sms = new SitemapAndIndexStream({
    limit: 10000, // defaults to 45k
    // SitemapAndIndexStream will call this user provided function every time
    // it needs to create a new sitemap file. You merely need to return a stream
    // for it to write the sitemap urls to and the expected url where that sitemap will be hosted
    getSitemapStream: (i) => {
      const sitemapStream = new SitemapStream({
        hostname,
      });
      const path = `${outputPath}/sitemap-${i}.xml`;
  
      const ws = createWriteStream(resolve(path + '.gz'));
      sitemapStream
        .pipe(createGzip()) // compress the output of the sitemap
        .pipe(ws); // write it to sitemap-NUMBER.xml
  
      return [
        new URL(path, hostname).toString(),
        sitemapStream,
        ws,
      ];
    },
  });
  
sms
  .pipe(createGzip())
  .pipe(createWriteStream(resolve(`${outputPath}/sitemap-index.xml.gz`)));

const arrayOfSitemapItems = [
  { url: '/', changefreq: 'daily' },
];
arrayOfSitemapItems.forEach((item) => sms.write(item));
sms.end();