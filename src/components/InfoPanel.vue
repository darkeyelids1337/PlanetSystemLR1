<template>
  <div class="panel-container">
    <div class="panel">Общая энергия: {{ energy }} ДЖ</div>
    <div class="panel">Текущее время: {{timeCount}} с</div>
    <div class="panel">Центр масс Vx: {{ vx }} </div>
    <div class="panel">Центр масс Vy: {{ vy }} </div>
  </div>
</template>

<script>
export default {
  name: "InfoPanel",
  props: {
    vx:{
      default: 0
    },
    vy:{
      default: 0
    },
    energy:{
      default: 0
    },
    timeCount: {
      default: 0
    }
  }
};
</script>

<style scoped>
.panel {
  width: calc(100vw - 100vh - 90px);
  margin-top: 5%;
  margin-left: 3%;
  font-weight: 800;
  font-size: 22px;
  padding: 25;
  margin: 25;
  background-color: lightblue;
  border-radius: 20;
  line-height: 20px;
  height: 5%;
  text-align: center;
  padding: 25px;
}
.panel-container{
    height: 100%;
    display: flex;
    flex-direction: column;
    gap:20px;
    justify-items: center;
}
</style>
