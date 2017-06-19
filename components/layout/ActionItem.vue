<template>
    <div class="action-item">
        <button class="action-button">+</button>
        <div class="action-text"><slot /></div>
    </div>
</template>

<style lang="scss">
.action-item {
    display: flex;
    .action-button {
        background-color: black;
        color: white;
        width: 20px;
        height: 20px;
        border-radius: 20px;
        border: 0;
        font-weight: bold;
    }
    .action-button-done {
        background-color: #99CC33;
        color: white;
        width: 20px;
        height: 20px;
        border-radius: 20px;
        border: 0;
        font-weight: bold;
    }
    .action-text {
        padding-left: 10px;
    }
}
</style>
