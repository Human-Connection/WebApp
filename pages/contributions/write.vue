<template>
    <div class="columns">
        <div class="card column is-8 is-offset-2">
            <section class="section">
                <h1 class="title">Make a contribution</h1>
                <form v-bind:disabled="loading">
                    <div class="tabs is-toggle is-fullwidth">
                        <ul>
                            <li v-for="postType in options.postTypes" v-bind:class="{ 'is-active': postType.active }">
                                <a v-bind:disabled="postType.disabled" class="button is-medium">
                                    <span class="icon">
                                        <i v-bind:class="'icon-tools-'+postType.value"></i>
                                    </span>
                                    <span>{{ postType.label }}</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div class="field">
                        <label class="label">Title</label>
                        <p class="control">
                            <input class="input" v-model="form.title" type="text" placeholder="How do you call that story?" v-bind:disabled="loading">
                        </p>
                    </div>
                    <div class="field">
                        <label class="label">Content</label>
                        <p class="control">
                            <textarea class="textarea" v-model="form.content" placeholder="What to write?" v-bind:disabled="loading"></textarea>
                        </p>
                    </div>
                    <div class="field">
                        <!--<el-input-->
                        <!--v-model="form.content"-->
                        <!--type="textarea"-->
                        <!--autosize-->
                        <!--:autosize="{ minRows: 5, maxRows: 30}">-->
                        <!--</el-input>-->
                    </div>
                    <div class="field">
                        <!--<el-select placeholder="Select language" v-model="form.language">-->
                        <!--<slot name="languageOptions">-->
                        <!--<el-option-->
                        <!--v-for="item in options.languages"-->
                        <!--:label="item.name"-->
                        <!--:value="item.regional">-->
                        <!--</el-option>-->
                        <!--</slot>-->
                        <!--</el-select>-->
                    </div>
                    <div class="field">
                        <!--<el-select placeholder="Who can see this post" v-model="form.visibility_type_id">-->
                        <!--<slot name="visibilityOptions">-->
                        <!--<el-option-->
                        <!--v-for="item in options.visibilities"-->
                        <!--:label="item.name"-->
                        <!--:value="item.id">-->
                        <!--</el-option>-->
                        <!--</slot>-->
                        <!--</el-select>-->
                    </div>
                    <div class="field">
                        <!--<el-select ref="topics"-->
                        <!--v-model="form.topics"-->
                        <!--filterable-->
                        <!--multiple-->
                        <!--placeholder="Choose some topics">-->
                        <!--<slot name="topicOptions">-->
                        <!--<el-option-->
                        <!--v-for="item in options.topics"-->
                        <!--:label="item.label"-->
                        <!--:value="item.value">-->
                        <!--</el-option>-->
                        <!--</slot>-->
                        <!--</el-select>-->
                    </div>
                    <div class="field">
                        <!--<el-select ref="tags"-->
                        <!--v-model="form.tags"-->
                        <!--allow-create-->
                        <!--filterable-->
                        <!--multiple-->
                        <!--placeholder="Enter some tags">-->
                        <!--<slot name="tagOptions">-->
                        <!--<el-option-->
                        <!--v-for="item in options.tags"-->
                        <!--:label="item.label"-->
                        <!--:value="item.value">-->
                        <!--</el-option>-->
                        <!--</slot>-->
                        <!--</el-select>-->
                    </div>
                    <div class="field">
                        <!--<el-upload-->
                        <!--ref="upload"-->
                        <!--class="upload"-->
                        <!--drag-->
                        <!--:auto-upload="true"-->
                        <!--action="http://hc.dev/de/contribution/upload"-->
                        <!--:file-list="form.attachments"-->
                        <!--:with-credentials="true"-->
                        <!--:data="uploadData"-->
                        <!--multiple>-->
                        <!--<i class="el-icon-upload"></i>-->
                        <!--<div class="el-upload__text">Drop file here or <em>click to upload</em></div>-->
                        <!--<div class="el-upload__tip" slot="tip">jpg/png/gif files with a size less than 2MB</div>-->
                        <!--</el-upload>-->
                    </div>
                    <div class="field has-text-right">
                        <button class="button is-success" v-bind:class="{ 'is-loading': loading }" v-bind:disabled="loading" @click.prevent="onSubmit">Publish</button>
                    </div>
                </form>
            </section>
        </div>
    </div>
</template>


<script>
  import NoSSR from 'vue-no-ssr'
  import feathers from '~plugins/feathers'

  export default {
    components: {
      'no-ssr': NoSSR
    },
    data () {
      return {
        loading: false,
        form: {
          type: 'post',
          title: '',
          content: '',
          language: 'de_DE',
          visibility: 'public',
          topics: [0, 1],
          tags: [],
          attachments: []
        },
        options: {
          languages: [],
          visibilities: [],
          topics: [],
          tags: [],
          postTypes: [
            {label: 'Post', value: 'post', active: true},
            {label: 'Pro / Con', value: 'procon', disabled: false},
            {label: 'Can Do', value: 'cando', disabled: false}
          ]
        }
      }
    },
    methods: {
      onSubmit () {
        this.loading = true
        console.log(this.form)
        feathers.service('contributions').create(this.form)
          .then((res) => {
            this.loading = false
            console.log(res)
            this.$toast.open({
              message: 'successfuly added your contribution',
              duration: 2000,
              type: 'is-success'
            })
            this.$router.push(`/contributions/${res.data.slug}`)
          })
          .catch((error) => {
            console.log(error)
            this.loading = false
            this.$toast.open({
              message: error.message,
              duration: 3000,
              type: 'is-danger'
            })
          })
      },
      onPicture (e) {
        alert('NEW IMAGE!')
      }
    }
  }
</script>

<style>

</style>
