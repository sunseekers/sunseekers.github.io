---
layout: post
title: 上传组件
categories: [功能实现]
description: 在项目中使用的一些上传组件
keywords: 在项目中使用的一些上传组件
---

# 本地上传

不借助第三方组件，本地上传文件，本地显示文件

## 实现原理

借助 `input` 的 `type='file'` 和 `accept` 属性，实现不上传指定类型。借助 `FileReader` 对象实现本地展示静态展示数据，不需要服务器。

文件数据在计算机内部都是以二进制的形式存在，在 `js` 我们可以使用 `FileReader` 对象去读取文件类型，转换为 `base64` 位，然后展示在页面上

## 实现代码

[代码 demo](https://github.com/sunseekers/vue-compontent/blob/master/src/components/FileUpload.vue)

[参考 Blob](http://sunseekers.cn/2020/02/24/Blob-API/)

```
<template>
  <div class="file-upload">
    <div class="toolBar">
      <span v-for="item in file"
            :key="item.fileType"
            @click="chooseFile($event,item)">{{item.name}}</span>
    </div>
    <input ref="elChooseFile"
           type="file"
           :accept="fileExt"
           class="editor-choose-file"
           @change="changeChooseFile" />
    <!-- 图片 -->
    <div v-show='showImg'>
      <img>
    </div>
    <!-- 音频 -->
    <div class="audio-container"
         v-show="showAudio">
      <a href="javascript:;"
         class="audio-main"
         @click="play">
        <i :class="['audio-icon-play iconfont', { playing: status === 'PLAY' }]"></i>
        <span class="audio-time">
          <span class="audio-update-time">{{ currentTime }}</span>
          /{{ formatTime(audioTime) }}
        </span>
      </a>
      <audio ref="elxhbAudio"></audio>
    </div>
    <!-- 视频 -->
    <div v-show="showVideo">
      <video class="video-js vjs-big-play-centered"
             preload
             controls>
        <source type="video/mp4">
      </video>
    </div>

  </div>
</template>
<script>
import 'video.js/dist/video-js.min.css'
export default {
  data () {
    return {
      file: [{
        name: '音频',
        fileType: 'audio'
      }, {
        name: '视频',
        fileType: 'video'
      }, {
        name: '图片',
        fileType: 'image'
      }, {
        name: '文档',
        fileType: 'document'
      }],
      fileExt: '*',
      fileType: '',
      showImg: false,
      showVideo: false,
      showAudio: false,
      audioTime: '00:00',
      audioEl: '',
      status: '',
      currentTime: '00:00'
    }
  },
  methods: {
    // 选择文件
    chooseFile (event, item) {
      console.log('要打开文件了', event, item)

      event.stopPropagation()
      let fileExt = this.fileExt
      switch (item.fileType) {
        case 'image':
          fileExt = 'image/*'
          break
        case 'document':
          fileExt = '.xls,.xlsx,.doc,.docx,.ppt,.pptx,.pdf'
          break
        case 'video':
          fileExt = 'video/*'
          break
        case 'audio':
          fileExt = '.ogg,.mp3,.wav,.amr,.m4a,.wmv'
          break
      }

      event.returnValue = true
      this.fileType = item.fileType
      this.fileExt = fileExt
      window.setTimeout(() => {
        this.$refs.elChooseFile.click()
      }, 100)
    },
    changeChooseFile (event) {
      console.log(event, '选择的文件')

      const fileData = event.target.files
      this.uploadFile(event, fileData)
      this.$refs.elChooseFile.value = []
    },
    uploadFile (event, fileData) {
      console.log(event, fileData, '上传到指定服务器')

      this.handleFile(fileData)
    },
    // 处理上传的文件，前端页面展示
    handleFile (e) {
      const file = e[0] // 获取上传 File 对象 的信息
      const fileReader = new FileReader() // FileReader 对象允许Web应用程序异步读取存储在用户计算机上的文件（或原始数据缓冲区）的内容，使用 File 或 Blob 对象指定要读取的文件或数据
      const { element = '', source = '' } = this.getFileType()
      fileReader.onload = e => {
        element.src = e.target.result
        source ? (source.src = e.target.result):''
        this.fileType === 'audio'? this.playAudioDom(e.target.result):''

      } // 读取操作完成触发
      fileReader.readAsDataURL(file) // 读取指定的 Blob 或 File 对象
    },
    // 上传的类型
    getFileType () {
      let element = ''
      let source = ''
      if (this.fileType === 'image') {
        element = document.getElementsByTagName('img')[0]
        this.showImg = true
      } else if (this.fileType === 'video') {
        this.showVideo = true
        element = document.getElementsByTagName('video')[0]
        source = document.getElementsByTagName('source')[0]
      } else if (this.fileType === 'audio') {
        this.showAudio = true
        element = document.getElementsByTagName('audio')[0]
      }
      return { element, source }
    },
    // 音频播放
    playAudioDom (src) {
      let audioDom = new Audio(src)
      audioDom.addEventListener('loadedmetadata', () => {
        this.audioTime = Math.round(audioDom.duration)
                this.initAudio()
      })
    },
    play () {
      const element = document.getElementsByTagName('audio')[0]
      if (this.status === 'PLAY') return element.pause()
      element.play()
    },
    // 格式化时间
    formatTime (secs) {
      secs = Math.round(secs)
      const minutes = Math.floor(secs / 60) || 0
      const seconds = secs - minutes * 60 || 0

      return `${minutes
        .toString()
        .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    },
    initAudio (src) {
      if (this.audioEl) return this.audioEl.play()

      this.playSrc = src
      this.$nextTick(() => {
        let audioEl = this.$refs.elxhbAudio

        audioEl.onplaying = event => {
          this.status = 'PLAY'
          this.updatePlaytime()
          this.$emit('play', event, audioEl)
        }

        audioEl.onpause = () => {
          window.cancelAnimationFrame(this.updatePlaytime)

          audioEl.currentTime = 0
          this.status = 'PAUSE'
          this.$emit('playEnded')
        }

        audioEl.onended = () => {
          audioEl.currentTime = 0
          this.status = 'PAUSE'
          this.$emit('playEnded')
        }

        audioEl.onerror = () => {
          if (!this.playSrc) {
            return
          }
          this.audioEl = null
          this.playSrc = ''
          this.$message.error('资源加载失败， 请稍后重试')
        }

        audioEl.autoplay = true
      })
    },
    updatePlaytime () {
      let audioEl = this.$refs.elxhbAudio
      const currentTime = this.formatTime(audioEl.currentTime)
      this.currentTime = currentTime
      window.requestAnimationFrame(this.updatePlaytime)
    }
  }
}
</script>
<style lang="scss" scoped>
.toolBar {
  display: flex;
  justify-content: space-between;
  line-height: 60px;
  span {
    width: 100%;
  }
}
.editor-choose-file {
  display: none;
}
.video-js {
  // background-color: $dark;
  height: 300px;
  width: 100%;
}
.audio-container {
  .audio-main {
    border: 1px solid red;
    border-radius: 4px;
    display: inline-block;
    padding: 5px 10px;

    .audio-icon-play {
      font-size: 23px;
      vertical-align: middle;

      &:before {
        content: "\e636";
      }
    }

    .audio-time {
      font-size: 14px;
      margin-left: 30px;

      .audio-update-time {
        display: inline-block;
        width: 38px;
      }
    }
  }

  .audio-download {
    margin-left: 5px;

    .iconfont {
      color: red;
      font-size: 20px;
      vertical-align: middle;
    }
  }

  .playing {
    &:before {
      animation: audioPlay 0.8s linear infinite;
    }
  }

  audio {
    display: none;
  }
}

@keyframes audioPlay {
  from {
    content: "\e645";
  }

  50% {
    content: "\e638";
  }

  to {
    content: "\e636";
  }
}
</style>

```
