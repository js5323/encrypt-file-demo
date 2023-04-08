<template>
  <div class="wrapper">
    <CryptoJSDemo />

    <NodeForge />
  </div>
</template>

<script>
import CryptoJSDemo from "./components/CryptoJSDemo.vue";
import NodeForge from "./components/NodeForge.vue";
export default {
  components: { CryptoJSDemo, NodeForge },
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
