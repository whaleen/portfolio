# CF (Code Furntiture)

- @codefurniture on Twitter.
- codefurniture@gmail.com

This code is free to use for you own purposes. It is not well documented at this time. In brief, what you have here in this repository is:

A Jekyll site making use of the planet.rb plugin which imports posts via RSS. Planet.rb configuration is located in the _data/planet.yml file. This file is where you set all the feeds you wish to import and the details about each feed such as it's name, optional image, categories, tags, etc...

Follow installation instruction from the planet.rb documentation. Note the following however in our approach to using the plugin:

1. The planet.yml file is not in the default root directory but instead in the _data directory.

`cd _data`
`planet generate`

2. The configuration, in planet.yml sets the posts directory as one other that _posts.

`posts_directory: "../_posts_planet_import/"`

The planet.yml has been placed in the _data directory in order to take advantage the way Jekyll offers access to data files. See Jekyll's documentation on the subject.

Posts that have been imported via `planet generate` will need to be manulally moved the the _posts directory or wherever you intend to use them at. Further, you can set the planet.yml configuration to import them wherever you want.


### RSS feeds

Feeds are to be added to the _data/planet.yml file.

Some feeds do not import but I've found that using feedburner makes most feeds importable.

It's all about feeds.

Getting categories and tags for each feed item is only possible when the author supplies these. Most do not. My impression is that RSS has become such a second class citizen that CMS developers do not provide publishing workflows that encourage the usage of all available attributes an RSS feed can deliver.


### Collections

We use Jekyll's collections functionality for books.

This makes it possible for forestry.io to provide a UI for manage of these - treating them as a 'post type' different from a post.


#### Books

A list I've been sourcing from. Could possibly be a way to promote croudsourcing curation of book listed on  https://www.goodreads.com/genres/alternative-right
