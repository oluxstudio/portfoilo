<template lang="pug">
a.click-btn.btn-style5
  slot
</template>

<style lang="scss" scoped>
.btn-style5 {
  $btn-color: rgba(var(--color-secondary));
  $btn-hover-color: rgba(var(--color-tertiary));
  $offset: 0.3em;
  $padding: 14px 30px;

  border-color: $btn-color;
  color: $btn-color;
  box-shadow: $offset $offset 0 $btn-hover-color;
  padding: $padding;
  font-weight: bolder;
  &:hover {
    box-shadow: (-$offset) (-$offset) 0 $btn-color;
    background-color: $btn-hover-color;
    border-color: $btn-hover-color;
    color: #fff;
  }
}
</style>
