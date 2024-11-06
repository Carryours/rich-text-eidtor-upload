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

  // quill.clipboard.addMatcher('img', (node, deltal) => {
  //   // 获取blob
  //   const src = node.src;

  //   // 使用 fetch 获取图像并将其转为 Blob
  //   async function getBlob(src) {
  //     const res = await fetch(src);
  //     const blob = res.blob();
  //     return blob;
  //   }

  //   async function upload(blob) {
  //     const file = new File([blob], 'converted_image.png', { type: blob.type });
  //     const formData = new FormData();
  //     formData.append('image', file);
  //     let { data } = await axios.post('/upload', formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data'
  //       }
  //     })
  //     deltal.ops[0].insert.image = `localhost:3000/${data.fileName}`
  //     return deltal;
  //   }

  //   const blob = getBlob(src);
  //   upload(blob);
  //   return deltal;
  //   // 替换src
  // })

  // 添加粘贴匹配器
  quill.clipboard.addMatcher('img', (node, delta) => {
    const src = node.src;

    // 需要在后续操作中处理异步上传
    setTimeout(() => {
      handleImageUpload(src, delta);
    }, 0); // 使用 setTimeout 以便后续处理

    return delta;  // 立即返回原始 delta
  });
  function handleImageUpload(src, delta) {
    fetchImageAsBlob(src).then(blob => {
      return uploadImage(blob);  // 上传并返回新的 URL
    }).then(newSrc => {
      // 更新 Delta 的图像源
      delta.ops[0].insert.image = newSrc;  // 使用新图像的 URL
      quill.setContents(delta);  // 更新 Quill 内容
    }).catch(err => {
      console.error('Error uploading image:', err);
    });
  }
  // 获取图像并转换为 Blob
  async function fetchImageAsBlob(src) {
    const response = await fetch(src);
    if (!response.ok) throw new Error('Could not fetch image.');
    return response.blob();  // 返回 Blob
  }

  // 上传 Blob 并获得新图像的 URL
  async function uploadImage(blob) {
    const file = new File([blob], 'image.png', { type: blob.type });
    const formData = new FormData();
    formData.append('image', file);  // 后端接收的字段名

    // 使用 Axios 上传文件
    const { data } = await axios.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return `http://localhost:3000/${data.fileName}`;  // 假设后端返回 fileName
  }

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