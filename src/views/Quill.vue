<script setup>
import Quill from 'quill';
import "quill/dist/quill.snow.css";
import { onMounted, useTemplateRef } from 'vue';
import axios from 'axios';
let quill = null;
onMounted(() => {
  quill = new Quill('#editor', {
    theme: 'snow'
  });

  quill.clipboard.addMatcher(Node.ELEMENT_NODE, (node, deltal) => {
    // 获取blob
    const src = node.src;
    var imgs = node.getElementsByTagName('img');
    if (imgs.length > 0) {
      for (let i = 0; i < imgs.length; i++) {

        getBlob(src).then(blob => {
          upload(blob).then(destSrc => {
            imgs[i].setAttribute('src', destSrc);
            console.log(imgs[i])
          });
        });
      }
    }
    // 使用 fetch 获取图像并将其转为 Blob
    async function getBlob(src) {
      const res = await fetch(src);
      const blob = res.blob();
      return blob;
    }

    async function upload(blob) {
      const file = new File([blob], 'converted_image.png', { type: blob.type });
      const formData = new FormData();
      formData.append('image', file);
      let { data } = await axios.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return `localhost:3000/${data.fileName}`
    }

    return deltal;
    // 替换src
  })

  // // 添加粘贴匹配器
  // quill.clipboard.addMatcher(Node.ELEMENT_NODE, function (node, delta) {
  //   var imgs = node.getElementsByTagName('img');
  //   if (imgs.length > 0) {
  //     for (var i = 0; i < imgs.length; i++) {
  //       // Replace each image src with the uploaded image URL
  //       handleImageUpload(imgs[i].getAttribute('src')).then(newUrl => {
  //         imgs[i].setAttribute('src', newUrl);
  //       }).catch((error) => {
  //         console.error('Image upload failed: ', error);
  //       });
  //     }
  //   }
  //   return delta;
  // });

})
const handleClick = () => {
  console.log(quill)
  const delta = quill.getContents();
  axios.post('/upload').then(data => {
    console.log(data);
  })
  console.log(delta);
}


</script>
<template>
  <div id="editor"> </div>
  <button @click="handleClick">testt</button>
</template>
<style lang="css"></style>