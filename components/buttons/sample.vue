<template lang="pug">
div.container
    div.category
        div
            h1 Shadow
        div.buttons-wrapper
            div: ButtonsShadow1
            div: ButtonsShadow2
            div: ButtonsShadow3
            div: ButtonsShadow4
            div: ButtonsShadow5

    div.category
        div
            h1 Background
        div.buttons-wrapper
            div: ButtonsBg500
            div: ButtonsBg501
            div: ButtonsBg502
            div: ButtonsBg503
            div: ButtonsBg504
            div: ButtonsBg505
            div: ButtonsBg506
            div: ButtonsBg507
            div: ButtonsBg508
            div: ButtonsBg509
            div: ButtonsBg510
            div: ButtonsBg511

    div.category
        div
            h1 Border
        div.buttons-wrapper
            div: ButtonsBorder700
            div: ButtonsBorder701
            div: ButtonsBorder702
            div: ButtonsBorder703

    div.category
        div
            h1 Other
        div.buttons-wrapper
            div: ButtonsOther900
            div: ButtonsOther901
            div: ButtonsOther902
            div: ButtonsOther903
            div: ButtonsOther904
            div: ButtonsOther905
            div: ButtonsOther906

    div.category
        div
            h1 External
        div.buttons-wrapper
            div: ButtonsGlow
            div
                a.rounded-hover(href="#") Hover me
            div: ButtonsSvgEffect
            ButtonsFlip(front="Hover me" back="Hover me")
            ButtonsFlip(front="Hello" back="World!")
            a(href="#"): ButtonsFlip(front="Sign Up" back="→ Go!")
        div
            ButtonsSwipeRight
</template>

<style lang="scss">
</style>
