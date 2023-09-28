<template>
  <div class="container">
    <div>
      <button type="button" @click.prevent="toFile">Файл</button>
      <div v-show="isFile" class="dropdown">
        <button @click.prevent="toNewSystem">Новая система</button>
        <button @click.prevent="this.$emit('save')">Сохранить</button>
        <!-- <button>Открыть</button> -->
      </div>
    </div>
    <button type="button" @click="toOption">Параметры</button>
    <button type="button" @click="run">Запуск модели</button>
    <button type="button" @click="finish">Остановить</button>
  </div>
  <NewSystem v-show="newSystem" @close="toNewSystem" @setPlanetSize = 'setPlanetSize'></NewSystem>
</template>

<script>
import NewSystem from './NewSystem.vue';
export default {
  name: "SideBar",
  props:{
    start:{
      type: Boolean
    }
  },
  components:{
    NewSystem,
  },
  data() {
    return {
      isFile: false,
      newSystem: false,
    };
  },
  methods:{
    toNewSystem(){
        if(this.isFile){
            this.newSystem = true;
            this.isFile = false;
        }
        else this.newSystem = false;
    },
    toFile(){
        this.isFile = !this.isFile;
        this.newSystem = false;
    },
    toOption(){
      this.$emit('toOption')
    },
    setPlanetSize(value){
      this.$emit('setPlanets', value)
    },
    run(){
      this.$emit('toStart', !this.start)
    },
    finish(){
      this.$emit('finish')
    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
  gap: 5px;
  position: absolute;
  z-index: 5;
  
}
.dropdown{
    position: absolute;
    z-index: 1;
    display: flex;
    flex-direction: column;
    width: 120px;
    background-color: white;
}
.dropdown button{
    border-width: 0;
}
button{
    line-height: 20px;
}
</style>
