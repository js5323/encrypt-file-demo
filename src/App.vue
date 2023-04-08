<template>
  <div class="wrapper">
    <CryptoJSDemo />
  </div>
</template>

<script>
import CryptoJSDemo from "./components/CryptoJSDemo.vue";
export default {
  components: { CryptoJSDemo },
};
</script>

<style scoped lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;

  input,
  select {
    margin-bottom: 16px;
  }
}
</style>
