<template>
    <div class="container">
     <div class="close-icon" @click="close">X</div>
     <label>
        Введите количество тел
        <input type="text" min="0" @input="checkInput($event)" :value="modelSize">
     </label>
     <button @click="close">Ввод</button>
    </div>
  </template>
  
  <script>
  import { mapMutations } from "vuex";
  export default {
    name: "NewSystem",
    data() {
      return {
        modelSize: 7,
      };
    },
    methods:{
        checkInput(evt){
            var reg = /^\d+$/;
            const value = evt.target.value;
            if(!value.match(reg)){
                evt.preventDefault();
                evt.target.value = ''
            }
            else{
                this.modelSize = value
                this.setPlanetSize(+value);
                this.$emit('setPlanetSize', +value)
            }
        },
        close(){
            this.modelSize = 2;
            this.$emit('close')
        },
        ...mapMutations({
          setPlanetSize: 'settingsManager/setPlanetSize'
        })
    }
  };
  </script>
  
  <style scoped>
    .container{
        display: flex;
        background-color: white;
        flex-direction: column;
        width: 200px;
        height: 100px;
        position:absolute;
        z-index: 2;
        border: 1px solid #989999;
        padding-top: 20px;
        
    }
    button{
        width: 100px;
        margin: 0 auto;
    }
    .close-icon{
        position: absolute;
        right: 3%;
        top: 3%;
    }
  </style>
  