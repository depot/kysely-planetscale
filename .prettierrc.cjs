module.exports = {
  printWidth: 120,
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
  bracketSpacing: false,
  plugins: [require('prettier-plugin-organize-imports'), require('prettier-plugin-pkg')],
}
