<script setup lang="ts">
const route = useRoute()
await navigateTo({ path: '/controls', query: route.query }, { redirectCode: 301 })
</script>
