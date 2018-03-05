<template>
  <div class="hc-textedit">
    <span v-if="!isEditing" @click="toggleEdit" class="not-editing">
      {{ value }}
    </span>
    <div v-if="isEditing" class="is-editing">
      <div v-if="type === 'textarea'">
        <textarea v-model="modifiedText" name="currentText" cols="30" rows="10">{{ modifiedText }}</textarea>
      </div>
      <div v-if="type === 'input'">
        <input type="text" v-model="modifiedText" />
      </div>
      <span class="actions">
        <i @click="toggleEdit" class="fa fa-close"></i>
        <i @click="saveEdit" class="fa fa-check"></i>
      </span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'hc-textedit',
    props: {
      value: {
        required: true,
        type: String
      },
      type: {
        required: false,
        type: String
      }
    },
    data () {
      return {
        isEditing: false,
        modifiedText: '',
        currentText: ''
      }
    },
    watch: {
      modifiedText (val) {
        this.currentText = val
        this.$emit('change', val)
      }
    },
    methods: {
      toggleEdit (e, save = false) {
        // start edit
        if (this.isEditing === false) {
          this.isEditing = true
          this.modifiedText = this.value !== this.currentText ? this.currentText : this.value
        } else {
          // clicked cancel
          if (save === false) {
            this.currentText = this.value
            this.modifiedText = this.value
          } else {
            // clicked save
            this.currentText = this.modifiedText
          }

          this.isEditing = false
        }
      },
      saveEdit (e) {
        this.toggleEdit(e, true)
      }
    },
    mounted () {
      this.currentText = this.value
    }
  }
</script>

<style lang="scss">
  .hc-textedit {
    .fa {
      color: #aaa;
      border: 1px solid #aaa;
      padding: 5px;
      width: 30px;
      height: 30px;
      font-size: 18px;
      margin-right: 1px;
      &:hover {
        color: #888;
        border: 1px solid #888;
      }
    }
    .actions {
      text-align: center;
      cursor: pointer;
    }
  }
</style>
