<template>
    <div>
        <div class="tex" @scroll="textyasy">
            <div class="hsahg"></div>
        </div>
    </div>
</template>

<script>
export default {
methods: {
    textyasy() {
        console.log(111)
    }
}
}
</script>

<style>
.tex{
    height: 300px;
    overflow: auto;
    border: 1px solid red;
}
.hsahg{
    width: 500px;
    border: 1px solid #000;
}
</style>