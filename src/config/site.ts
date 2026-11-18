export const siteConfig = {
  name: 'LearningHub',
  description: '以 Markdown 累積、整理並分享學習成果。',
  defaultAuthor: 'LearningHub',
  repositoryUrl: process.env.GITHUB_REPOSITORY_URL ?? '',
  giscusEnabled: process.env.GISCUS_ENABLED === 'true',
  giscusRepo: process.env.PUBLIC_GISCUS_REPO ?? '',
  giscusCategory: process.env.PUBLIC_GISCUS_CATEGORY ?? '',
  giscusCategoryId: process.env.PUBLIC_GISCUS_CATEGORY_ID ?? '',
  siteId: process.env.SITE_ID ?? 'learning-hub',
};
