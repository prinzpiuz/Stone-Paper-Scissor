<template>
  <div class="container">
    <div>
      <h3>sorry</h3>
      <h1>404, page not found.</h1>
      <router-link :to="{ name: 'register' }">Go Back</router-link>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
