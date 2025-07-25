module.exports = {
  stories: [
    'packages/**/components/**/*.stories.@(js|jsx|ts|tsx)'
  ],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-controls',
    '@storybook/addon-actions',
    '@storybook/addon-backgrounds',
    '@storybook/addon-viewport'
  ],
  framework: {
    name: '@storybook/vue3-vite',
    options: {}
  }
}; 