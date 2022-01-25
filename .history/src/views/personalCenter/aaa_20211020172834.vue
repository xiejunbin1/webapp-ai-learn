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
}
.hsahg{
    width: 500px;
}
</style>