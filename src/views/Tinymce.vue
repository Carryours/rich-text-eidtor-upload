<script setup>
import Editor from '@tinymce/tinymce-vue'
import axios from 'axios'
import { onMounted, ref } from 'vue';
onMounted(() => {

})
let content = null;

let imgList = [];

let editor = null;
let isView = ref(false);
const handlePaste = async function (plugin, args) {
  imgList = args.content || args.node ? getImagesFromNode(args.node) : [];
}

const getImagesFromNode = function (node) {
  const images = [];
  const imageNodes = node.getElementsByTagName('img');
  for (let img of imageNodes) {
    images.push(img.src);
  }
  return images;
}
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
  return `http://localhost:3000/${data.fileName}`
}
const handleClick = async function () {
  // console.log(imgList);
  Promise.all(imgList.map(async src => {
    const blob = await getBlob(src);
    return upload(blob);
  })).then(destList => {
    let currentContent = editor.getContent().replaceAll("amp;", "");
    // let currentContent = editor.getContent();
    destList.forEach((item, index) => {
      currentContent = currentContent.replace(imgList[index], item);
    })
    editor.setContent(currentContent);
    console.log(currentContent);

    content = currentContent
  })

}
const onInit = function (event) {
  editor = event.target;
  console.log(editor)
}
const testView = function () {
  isView.value = !isView.value;
}
</script>
<template>
  <div>
    <div style="width: 50vw;" v-if="!isView">
      <Editor v-model="content" api-key="no-api-key" tinymceScriptSrc="/tinymce/tinymce.min.js" @init="onInit" :init="{
        branding: false,
        plugins: 'lists link image table code help wordcount',
        paste_data_images: true,
        paste_postprocess: handlePaste
      }" />
      <button @click="handleClick">Test</button>
      <button @click="testView">预览</button>
      <div>
        <!-- <img style="width: 400px; height: 100%" id="testImg"
          src="https://p3-sign.toutiaoimg.com/tos-cn-i-tjoges91tu/aa2d73aaa8c5addc555dc33866b380bd~noop.image?_iz=58558&from=article.pc_detail&lk3s=953192f4&x-expires=1731902845&x-signature=gQCTJeWIhceA8bWZp0il%2BBMm0gk%3D" /> -->
      </div>
    </div>
  
    <div v-if="isView" style="height: 100%">
      <div v-html="content"></div>
      <button @click="testView">返回</button>
    </div>
  </div>

</template>