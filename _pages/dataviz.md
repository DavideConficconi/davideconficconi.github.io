---
layout: page
permalink: /dataviz/
title: datviz
nav: false
nav_order: 8
description: worldcloud page for dataviz test of my research
importance: 2
category: work
---

  <div class="row">
  {% include scripts/dataviz.liquid %}
  </div>

<h2>A P5JS Sketch for Wordcloud of some of my papers (WIP)</h2>

<!-- Canvas will appear here -->
<div id="p5-container"></div>

<!-- p5.js library -->
<script src="{{ '/assets/js/p5lib/p5.min.js' | relative_url }}"></script>
<script src="{{ '/assets/js/p5lib/p5.sound.min.js' | relative_url }}"></script>
<script src="{{ '/assets/js/sketch.js' | relative_url | bust_file_cache }}"></script> 