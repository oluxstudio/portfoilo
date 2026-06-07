<template>
    <button 
      ref="buttonEl"
      class="button"
      @mousemove="handleMouseMove"
    >
        button
    </button>
</template>
  
<script setup lang="ts">    
    // Option 1: Using ref + @mousemove (recommended)
    const buttonEl = ref<HTMLElement | null>(null)
    
    // const handleMouseMove = (e: MouseEvent) => {
    //     if (!buttonEl.value) return
        
    //     const x = e.offsetX
    //     const y = e.offsetY
        
    //     buttonEl.value.style.setProperty('--mouse-x', `${x}px`)
    //     buttonEl.value.style.setProperty('--mouse-y', `${y}px`)
    // }
</script>

<style scoped lang="scss">
    .button {
        padding: 16px 42px;
        border-radius: 3px;
        box-shadow: 0px 0px 12px -2px rgba(0,0,0,0.5);
        line-height: 1.25;
        background: #FC6E51;
        text-decoration: none;
        user-select: none;
        color: white;
        font-size: 16px;
        letter-spacing: .08em;
        text-transform: uppercase;
        position: relative;
        transition: background-color .6s ease;
        overflow: hidden;
        &:after {
            content: "";
            position: absolute;
            width: 0;
            height: 0;
            top: 50%;
            left: 50%;
            top: var(--mouse-y);
            left: var(--mouse-x);
            transform-style: flat;
            transform: translate3d(-50%,-50%,0);
            // background: rgba(white,.1);
            border-radius: 100%;
            transition: width .3s ease, height .3s ease;
        }
        &:focus,
        &:hover {
            background: darken(#FC6E51,7%);
        }
        &:active {
            &:after {
            width: 300px;
            height: 300px;
            }
        }
    }
</style>