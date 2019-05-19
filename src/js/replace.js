// Exports:
module.exports = function replace(html, data) {
  for (let key in data) {
    html = html.replace('{{ ' + key + ' }}', data[key])
  }

  return html
}