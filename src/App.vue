<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script type="text/javascript">
export default {};
</script>

<style lang="scss">
@import "/src/app.scss";
html,
body {
  overflow: hidden;
}

@media all and (max-width: 500px) {
  html,
  body {
    overflow: auto !important;
  }
}
</style>
