---
filename: index
title: 'Kasper Tidemann'
---

{{ for each posts offset=1 limit=5 sort-by=date sort-order=desc }}

  <p>{{ date }}</p>

  <p>{{ description }}</p>
  
  <a href="{{ link to html }}">{{ title }}</a>

  <a href="{{ link to folder }}">{{ title }}</a>

  Inner title: {{ title }}

  Inner title: {{ title }}

{{ end }}

Title outside: {{ title }}