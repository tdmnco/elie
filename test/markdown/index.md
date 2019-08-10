---
filename: index
title: 'Test'
---

{{ template header }}

{{ paginate }}

{{ for each posts offset=1 limit=2 sort-by=date sort-order=desc }}

{{ content }}

[Link to post](posts/{{ slug }}.html)

{{ end for each }}

{{ if previous page }}

[Previous page](archive/{{ previous page number }})

{{ end if previous page }}

{{ if next page }}

[Next page](archive/{{ next page number }})

{{ end if next page }}

{{ end paginate }}

{{ template footer }}