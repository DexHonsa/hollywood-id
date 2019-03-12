<template>
  <div>
    <div
      class="net"
      :style="'background-image:url('+require('../../img/hollywood_blue_blur.jpg')+')'"
    ></div>
    <div class="container">
      <div
        class="search-panel animated-med fadeInUp"
        style="background:transparent; white-space:pre-wrap; padding-top:120px; color:#000;"
      >
        <div style="display:flex;justify-content:center; margin-bottom:100px;">
          <div style="width:500px; position:relative">
            <img style="width:100%; height:auto" src="../../img/logo_black.png" alt>
          </div>
        </div>
        <br>
        <h1>Welcome to the Hollywood Insider Directory</h1>An affordable, accurate database with verified essential Hollywood information, including phone numbers and credits of decision makers in every major studio and network. Whether you’re a rookie striving to position yourself behind the velvet rope for the first time or a seasoned veteran needing vital information to push your career or project forward, Hollywood Insider Directory is your resource for finding writer network deals, production company contact information, and first look deals at studios.
        <br>Hollywood Insider Directory was built by Karen Kaufman Wilson, Graham Kaye, and Elliot Smith, a team with vast entertainment expertise who have experienced all facets of the business including agent deals, film funding, producing, and developing projects. Though they each bring something unique to Hollywood Insider Directory, they each arrived in Los Angeles with creative aspirations, yet, lacked the benefit of a large contact base or nepotism to ensure their entry into the business. The Hollywood Insider Directory team understands the importance of “inside information” which was the foundation for building an affordable, accurate database for the entertainment industry because “knowledge is power”.
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "about_us",
  data() {
    return {};
  },
  mounted() {
    window.scrollTo(0, 0);
  },
  methods: {}
};
</script>