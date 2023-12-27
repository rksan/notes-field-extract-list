<template>
  <div class="home"><PHomeVue></PHomeVue></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import PHomeVue from "@/components/pages/PHome"; // @ is an alias to /src

export default defineComponent({
  name: "HomeView",
  components: {
    PHomeVue,
  },
});
</script>
