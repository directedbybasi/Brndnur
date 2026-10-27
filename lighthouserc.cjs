module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
      url: [
        '/',
        '/trademark-registration/',
        '/services/',
        '/packages/',
        '/faqs/',
        '/contact/',
      ],
      numberOfRuns: 1,
      settings: {
        chromeFlags: '--no-sandbox --headless',
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: './.lighthouseci',
      reportFilenamePattern: '%%PATHNAME%%-%%DATETIME%%.report.%%EXTENSION%%',
    },
  },
};
