<template>
  <div class="main-container" :class="{ option: option }">
    <SideBar
      @settings="params"
      @toOption="option = !option"
      @setPlanets="(value) => (planetsLen = value)"
      :start="start"
      @toStart="toStart"
      @finish="toFinish"
      @save="toSave"
    ></SideBar>
    <div style="width: 100vh; height: 100vh; background-color: black">
      <canvas
        :style="{
          position: 'relative',
          top: -40 - this.planets.length * 10 + 'px',
          width: '100wh',
          height: '100vh',
        }"
        ref="canvas"
        id="myCanvas"
      >
      </canvas>
    </div>
    <InfoPanel
      :vx="vx"
      :vy="isNaN(vy) ? 0 : vy"
      :timeCount="timeCount"
      :energy="energy"
    ></InfoPanel>
  </div>
  <div class="settings-container" v-show="option">
    <div class="close-icon" @click="option = !option">X</div>
    <div class="settings-line">
      <div style="margin-top: 1%;">Шаг по времени, с</div>
      <input
        class="writeInput"
        type="number"
        value="360000"
        style="margin-left: 5px;width:30%"
        @input="checkInput($event)"
        @change="T = +$event.target.value"
      />
    </div>
    <div class="settings-line">
      <div style="margin-top: 1%;">Время моделирования, с</div>
      <input
        class="writeInput"
        type="number"
        value="31536000"
        style="margin-left: 5px;width:30%"
        @input="checkInput($event)"
        @change="totalTime = +$event.target.value"
      />
    </div>
    
    <div style="display: flex">
      <div style="display: flex">
        <div
          style="
            min-width: 20px;
            height: 20px;
            margin: 5px;
            background: grey;
            border-radius: 10px;
            cursor: pointer;
          "
          :style="{ background: method === 0 ? 'red' : 'grey' }"
          @click="method = 0"
        ></div>
        <div style="margin-top: 5px">Метод Эйлера</div>
      </div>
      <div style="display: flex">
        <div
          style="
            min-width: 20px;
            height: 20px;
            margin: 5px;
            background: grey;
            border-radius: 10px;
            cursor: pointer;
          "
          :style="{ background: method === 1 ? 'red' : 'grey' }"
          @click="method = 1"
        ></div>
        <div style="margin-top: 5px">Метод Эйлера-Крамера</div>
      </div>
    </div>
    <div style="display: flex">
      <div style="display: flex">
        <div
          style="
            min-width: 20px;
            height: 20px;
            margin: 5px;
            background: grey;
            border-radius: 10px;
            cursor: pointer;
          "
          :style="{ background: method === 2 ? 'red' : 'grey' }"
          @click="method = 2"
        ></div>
        <div style="margin-top: 5px">Метод Верле</div>
      </div>
      <div style="display: flex">
        <div
          style="
            min-width: 20px;
            height: 20px;
            margin: 5px;
            background: grey;
            border-radius: 10px;
            cursor: pointer;
          "
          :style="{ background: method === 3 ? 'red' : 'grey' }"
          @click="method = 3"
        ></div>
        <div style="margin-top: 5px">Метод Бимана</div>
      </div>
      
    </div>
    <div class="settings-line">
      <div
        style="width: 20px; height: 30px; line-height: 30px; text-align: center"
      >
        {{ planetSize }}
      </div>
      <div class="settings-elem">X</div>
      <div class="settings-elem">Y</div>
      <div class="settings-elem">Vx</div>
      <div class="settings-elem">Vy</div>
      <div class="settings-elem">Масса</div>
    </div>
    <div
      class="settings-line"
      v-for="(item, index) in planetsStart"
      :key="index"
    >
      <div
        style="width: 20px; height: 30px; line-height: 30px; text-align: center"
      >
        {{ index }}
      </div>
      <div style="width: calc(100% - 20px); display: flex">
        <input
          class="writeInput"
          style="width: 20%; height: 10px"
          type="number"
          :value="item.X"
          @change="(e) => updateStartPlanets(index, 'X', +e.target.value)"
        />
        <input
          class="writeInput"
          style="width: 20%; height: 10px"
          type="number"
          :value="item.Y"
          @change="(e) => updateStartPlanets(index, 'Y', +e.target.value)"
        />
        <input
          class="writeInput"
          style="width: 20%; height: 10px"
          type="number"
          :value="item.vX"
          @change="(e) => updateStartPlanets(index, 'vX', +e.target.value)"
        />
        <input
          class="writeInput"
          style="width: 20%; height: 10px"
          type="number"
          :value="item.vY"
          @change="(e) => updateStartPlanets(index, 'vY', +e.target.value)"
        />
        <input
          class="writeInput"
          style="width: 20%; height: 10px"
          type="number"
          :value="item.M"
          @change="(e) => updateStartPlanets(index, 'M', +e.target.value)"
        />
      </div>
    </div>
    <div>
      <button class="enter-button" @click.prevent="option = !option">
        Ввести
      </button>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
//import TheExperience from "./components/TheExperience.vue";
import SideBar from "@/components/SideBar.vue";
import InfoPanel from "./components/InfoPanel.vue";
import { saveAs } from 'file-saver';
export default {
  name: "App",
  components: {
    SideBar,
    InfoPanel,
  },
  data() {
    return {
      ctx: null,
      refreshKey: 0,
      height: window.innerHeight,
      G: 6.67 * 10 ** -11,
      M: 1.2166 * 10 ** 30,
      sun: {
        X: 0,
        Y: 0,
        vX: 0,
        vY: 0,
        M: 1.2166 * 10 ** 30,
        E: 0,
      },
      planetsLen: 7,
      planets: Array(6)
        .fill()
        .map((item, index) => ({
          X: 149500000000 * (index + 1),
          Y: 0,
          vX: 0,
          vY: Math.sqrt(((this.G * this.M) / 149500000000) * (index + 1)),
          M: (index + 1) * 6.083 * 10 ** 24,
          E: 0,
        })),
      option: false,
      method: 0,
      start: false,
      timeCount: 0,
      intervals: [],
      onlyPlanets: null,
      T: 360000,
      totalTime: 31536000
    };
  },
  computed: {
    ...mapState({
      planetSize: (state) => state.settingsManager.planetSize,
    }),
    radius() {
      const radius = 140000000000;
      return radius;
    },
    planetsStart() {
      return Array(this.planetsLen)
        .fill()
        .map((item, index) => ({
          X: 149500000000 * index,
          Y: 0,
          vX: 0,
          vY: index ? Math.sqrt((this.G * this.M) / 149500000000 / index) : 0,
          M: index ? index * 6.083 * 10 ** 24 : this.M,
          E: 0,
        }));
    },
    // planets() {
    //   return Array(this.planetsLen ? this.planetsLen - 1 : 0)
    //     .fill()
    //     .map((item, index) => ({
    //       X: 149500000000 * (index + 1),
    //       Y: 0,
    //       vX: 0,
    //       vY: Math.sqrt(((this.G * this.M) / 149500000000) * (index + 1)),
    //       M: (index + 1) * 6.083 * 10 ** 24,
    //       E: 0,
    //     }));
    // },
    minM() {
      let m = this.planetsStart[0].M,
        i = 0;
      for (let j = 1; j < this.planetsStart.length; ++j)
        if (this.planetsStart[j].M < m && this.planetsStart[j].M > 0) {
          m = this.planetsStart[j].M;
          i = j;
        }
      return { m, i };
    },
    weightPlanets() {
      let k = this.minM.m / 2;
      let arr = [];
      arr.push(this.sun.M / k);
      for (let j = 0; j < this.planets.length; ++j)
        arr.push(this.planets[j].M / k);
      return arr;
    },
    vx() {
      let res = 0;
      let M = this.sun.M;
      this.planets.map((item) => {
        res += item.vX * item.M;
        M += item.M;
      });
      return res / M;
    },
    vy() {
      let res = 0;
      let M = this.sun.M;
      this.planets.map((item) => {
        res += item.vY * item.M;
        M += item.M;
      });
      return res / M;
    },
    energy() {
      let res = this.sun.E;
      this.planets.map((item) => {
        res += item.E;
      });
      return res;
    },
  },
  mounted() {
    this.onlyPlanets = this.planets;
  },
  watch:{
    planetsLen(){
        this.planets = Array(this.planetsLen ? this.planetsLen - 1 : 0)
        .fill()
        .map((item, index) => ({
          X: 149500000000 * (index + 1),
          Y: 0,
          vX: 0,
          vY: Math.sqrt(((this.G * this.M) / 149500000000) * (index + 1)),
          M: (index + 1) * 6.083 * 10 ** 24,
          E: 0,
        }));
    },
    timeCount(){
      if(this.timeCount >= this.totalTime) {
        this.toFinish()
      }
    }
  },
  methods: {
    params(value) {
      console.log("emited");
      this.planetSize = value;
    },
    toSave(){
      var canvas = document.getElementById("myCanvas");
    canvas.toBlob(function(blob) {
        saveAs(blob, "pretty image.png");
    });
    },
    checkInput(evt) {
      var reg = /^\d+$/;
      const value = evt.target.value;
      if (!value.match(reg)) {
        evt.preventDefault();
        evt.target.value = "";
      }
    },
    toStart(value) {
      this.start = value;
      const canvasEle = this.$refs.canvas;
      canvasEle.width = this.height;
      canvasEle.height = this.height;
      this.ctx = canvasEle.getContext("2d");
      //console.log(this.planetsStart);
      this.startSun();
      for (let i = 1; i <= this.planets.length; i++) {
        this.init(i);
      }

      //this.Draw();
    },
    updateStartPlanets(index, property, value) {
      this.planetsStart[index][property] = value;
      this.sun = this.planetsStart[0];
      let ps = JSON.parse(JSON.stringify(this.planetsStart));
      ps.splice(0, 1);
      this.planets = ps;
    },
    draw(info) {
      const { x, y, w, isSun } = info;
      const s = isSun ? "red" : "lightblue";
      this.ctx.beginPath();
      this.ctx.arc(x, y, w, 0, 2 * Math.PI, false);
      this.ctx.fillStyle = s;
      this.ctx.fill();
      this.ctx.lineWidth = 1;
      this.ctx.strokeStyle = s;
      this.ctx.stroke();
    },
    startSun() {
      let Psun = JSON.parse(JSON.stringify(this.planetsStart));
      console.log('sun', Psun);
      //console.log(this.sun);
      let X = Psun[0].X,
        Y = Psun[0].Y;
      let aX = 0,
        aY = 0,
        vX = Psun[0].vX,
        vY = Psun[0].vY;
      let arr = this.intervals;
      let aX1 = [0],
        aY1 = [0];
      let X1 = [X],
        Y1 = [Y];

      let flag = true;

      const inter = setInterval(() => {
        this.draw({
          x:
            this.height / 2 +
            (this.height * X) /
              this.planetsStart[this.planetsStart.length - 1].X /
              2,
          y:
            this.height / 2 +
            (this.height * Y) /
              this.planetsStart[this.planetsStart.length - 1].X /
              2,
          w: this.weightPlanets[0] < 40 ? this.weightPlanets[0] / 2 : 20,
          isSun: true,
        });

        let s = this.sun;
        this.sun.X = X;
        this.sun.Y = Y;
        
        Psun[0].X = X;
        Psun[0].Y = Y;

        this.sun.vX = vX;
        this.sun.vY = vY;

        let Ek = 0,
          Ep = 0;
        // let v2 = Math.sqrt(2 * G * M / 149500000000 / 9)
        //
        // Ek = s.M * v2 ** 2 / 2;
        let v2 = Math.sqrt(vX**2 + vY**2);
        Ek = (s.M * v2 ** 2) / 2;
        for (let i = 1; i < Psun.length; ++i) {
          let R = Math.sqrt((X - Psun[i].X) ** 2 + (Y - Psun[i].Y) ** 2);
          Ep -= (this.G * s.M * Psun[i].M) / R;
        }

        s.E = Ek + Ep;
        this.sun = s;

        if (this.method === 0 || (flag && this.method === 2)) {
          [aX, aY] = [0, 0];
          for (let i = 1; i < Psun.length; ++i) {
            let R = Math.sqrt((X - Psun[i].X) ** 2 + (Y - Psun[i].Y) ** 2);
            aX += (this.G * Psun[i].M * (Psun[i].X - X)) / R ** 3;
            aY += (this.G * Psun[i].M * (Psun[i].Y - Y)) / R ** 3;
          }
          [X, Y] = [X + this.T * vX, Y + this.T * vY];
          [vX, vY] = [vX + this.T * aX, vY + this.T * aY];
          X1.push(X);
          Y1.push(Y);
          flag = false;
        }
        if (this.method === 1) {
          [aX, aY] = [0, 0];
          for (let i = 1; i < Psun.length; ++i) {
            let R = Math.sqrt((X - Psun[i].X) ** 2 + (Y - Psun[i].Y) ** 2);
            aX += (this.G * Psun[i].M * (Psun[i].X - X)) / R ** 3;
            aY += (this.G * Psun[i].M * (Psun[i].Y - Y)) / R ** 3;
          }

          [vX, vY] = [vX + this.T * aX, vY + this.T * aY];
          [X, Y] = [X + this.T * vX, Y + this.T * vY];
        }
        if (this.method === 2 && !flag) {
          [aX, aY] = [0, 0];
          for (let i = 1; i < Psun.length; ++i) {
            let R = Math.sqrt((X - Psun[i].X) ** 2 + (Y - Psun[i].Y) ** 2);
            aX += (this.G * Psun[i].M * (Psun[i].X - X)) / R ** 3;
            aY += (this.G * Psun[i].M * (Psun[i].Y - Y)) / R ** 3;
          }

          [X, Y] = [
            2 * X1[X1.length - 1] - X1[X1.length - 2] + this.T ** 2 * aX,
            2 * Y1[Y1.length - 1] - Y1[Y1.length - 2] + this.T ** 2 * aY,
          ];
          [vX, vY] = [
            (X - X1[X1.length - 2]) / (2 * this.T),
            (Y - Y1[Y1.length - 2]) / (2 * this.T),
          ];
          X1.push(X);
          Y1.push(Y);
        }
        if (this.method === 3 && !flag) {
          [aX, aY] = [0, 0];
          for (let i = 1; i < Psun.length; ++i) {
            let R = Math.sqrt((X - Psun[i].X) ** 2 + (Y - Psun[i].Y) ** 2);
            aX += (this.G * Psun[i].M * (Psun[i].X - X)) / R ** 3;
            aY += (this.G * Psun[i].M * (Psun[i].Y - Y)) / R ** 3;
          }
          aX1.push(aX), aY1.push(aY);
          [X, Y] = [
            X +
              this.T * vX -
              (1 / 6) *
                (4 * aX1[aX1.length - 2] - aX1[aX1.length - 3]) *
                this.T ** 2,
            Y +
              this.T * vY -
              (1 / 6) *
                (4 * aY1[aY1.length - 2] - aY1[aY1.length - 3]) *
                this.T ** 2,
          ];
          [vX, vY] = [
            vX +
              (1 / 6) *
                (2 * aX + 5 * aX1[aX1.length - 1] - aX1[aX1.length - 2]) *
                this.T,
            vY +
              (1 / 6) *
                (2 * aY + 5 * aY1[aY1.length - 2] - aY1[aY1.length - 3]) *
                this.T,
          ];
        }
      }, 1);
      arr.push(inter);
      this.intervals = arr;
      // setIntervals(arr);
    },
    init(index) {
      let P = JSON.parse(JSON.stringify(this.planetsStart));
      console.log(index, P)
      this.timeCount = 0;

      let X = P[index].X,
        Y = P[index].Y;
      let aX = 0,
        aY = 0,
        vX = P[index].vX,
        vY = P[index].vY;
      let arr = this.intervals;

      let aX1 = [0],
        aY1 = [0];
      let X1 = [X],
        Y1 = [Y];

      let flag = true;

      const inter = setInterval(() => {
        this.draw({
          x:
            this.height / 2 +
            (this.height * X) /
              this.planetsStart[this.planetsStart.length - 1].X /
              2,
          y:
            this.height / 2 +
            (this.height * Y) /
              this.planetsStart[this.planetsStart.length - 1].X /
              2,
          w:
            this.weightPlanets[index] < 40 ? this.weightPlanets[index] / 2 : 20,
        });

        let p = this.planets;
        p[index - 1].X = X;
        p[index - 1].Y = Y;
        P[index].X = X;
        P[index].Y = Y;

        p[index - 1].vX = vX;
        p[index - 1].vY = vY;

        let Ek = 0,
          Ep = 0;
        // let v2 = Math.sqrt((2 * this.G * this.M) / 149500000000 / index);
        let v2 = Math.sqrt(vX**2 + vY**2);
        Ek = (P[index].M * v2 ** 2) / 2;

        for (let i = 0; i < P.length; ++i) {
          if (i !== index) {
            let R = Math.sqrt((X - P[i].X) ** 2 + (Y - P[i].Y) ** 2);

            if (R < this.radius) {
              console.log(index, i);

              P[index].vX =
                (P[index].vX * P[index].M + P[i].vX * P[i].M) /
                (P[i].M + P[index].M);
              P[index].vY =
                (P[index].vY * P[index].M + P[i].vY * P[i].M) /
                (P[i].M + P[index].M);
              p[index - 1].vX += P[index].vX;
              p[index - 1].vY += P[index].vY;

              P[index].aX =
                (P[index].aX * P[index].M + P[i].aX * P[i].M) /
                (P[i].M + P[index].M);
              P[index].aY =
                (P[index].aY * P[index].M + P[i].aY * P[i].M) /
                (P[i].M + P[index].M);
              p[index - 1].aX += P[index].aX;
              p[index - 1].aY += P[index].aY;

              P[index].M += P[i].M;
              p[index - 1].M += P[i].M;

              clearInterval(this.intervals[i]);
              p.splice(index - 1, 0);
              P.splice(index, 0);
            }

            Ep -= (this.G * P[index].M * P[i].M) / R;
          }
        }

        p[index - 1].E = Ek + Ep;
        this.planets = p;
        //setPlanets(p);

        if (
          this.method === 0 ||
          (flag && this.method === 2) ||
          (flag && this.method === 3)
        ) {
          [aX, aY] = [0, 0];
          for (let i = 0; i < P.length; ++i) {
            if (i !== index) {
              let R = Math.sqrt((X - P[i].X) ** 2 + (Y - P[i].Y) ** 2);
              aX += (this.G * P[i].M * (P[i].X - X)) / R ** 3;
              aY += (this.G * P[i].M * (P[i].Y - Y)) / R ** 3;
            }
          }
          [X, Y] = [X + this.T * vX, Y + this.T * vY];
          [vX, vY] = [vX + this.T * aX, vY + this.T * aY];
          X1.push(X);
          Y1.push(Y);
          aX1.push(aX);
          aY1.push(aY);
          flag = false;
        }
        if (this.method === 1) {
          [aX, aY] = [0, 0];
          for (let i = 0; i < P.length; ++i) {
            if (i !== index) {
              let R = Math.sqrt((P[i].X - X) ** 2 + (P[i].Y - Y) ** 2);
              aX += (this.G * P[i].M * (P[i].X - X)) / R ** 3;
              aY += (this.G * P[i].M * (P[i].Y - Y)) / R ** 3;
            }
          }
          [vX, vY] = [vX + this.T * aX, vY + this.T * aY];
          [X, Y] = [X + this.T * vX, Y + this.T * vY];
        }
        if (this.method === 2 && !flag) {
          [aX, aY] = [0, 0];
          for (let i = 0; i < P.length; ++i) {
            if (i !== index) {
              let R = Math.sqrt((X - P[i].X) ** 2 + (Y - P[i].Y) ** 2);
              aX += (this.G * P[i].M * (P[i].X - X)) / R ** 3;
              aY += (this.G * P[i].M * (P[i].Y - Y)) / R ** 3;
            }
          }
          [X, Y] = [
            2 * X1[X1.length - 1] - X1[X1.length - 2] + this.T ** 2 * aX,
            2 * Y1[Y1.length - 1] - Y1[Y1.length - 2] + this.T ** 2 * aY,
          ];
          [vX, vY] = [
            (X - X1[X1.length - 2]) / (2 * this.T),
            (Y - Y1[Y1.length - 2]) / (2 * this.T),
          ];
          X1.push(X);
          Y1.push(Y);
        }
        if (this.method === 3 && !flag) {
          [aX, aY] = [0, 0];
          for (let i = 0; i < P.length; ++i) {
            if (i !== index) {
              let R = Math.sqrt((X - P[i].X) ** 2 + (Y - P[i].Y) ** 2);
              aX += (this.G * P[i].M * (P[i].X - X)) / R ** 3;
              aY += (this.G * P[i].M * (P[i].Y - Y)) / R ** 3;
            }
          }
          aX1.push(aX), aY1.push(aY);
          [X, Y] = [
            X +
              this.T * vX -
              (1 / 6) *
                (4 * aX1[aX1.length - 2] - aX1[aX1.length - 3]) *
                this.T ** 2,
            Y +
              this.T * vY -
              (1 / 6) *
                (4 * aY1[aY1.length - 2] - aY1[aY1.length - 3]) *
                this.T ** 2,
          ];
          [vX, vY] = [
            vX +
              (1 / 6) *
                (2 * aX + 5 * aX1[aX1.length - 1] - aX1[aX1.length - 2]) *
                this.T,
            vY +
              (1 / 6) *
                (2 * aY + 5 * aY1[aY1.length - 2] - aY1[aY1.length - 3]) *
                this.T,
          ];
        }

        if (index === 1) this.timeCount = this.timeCount + this.T;
        // setTimeCount((t) => t + T);
      }, 1);
      arr.push(inter);
      this.intervals = arr;
      // setIntervals(arr);
    },
    toFinish() {
      for (let i = 0; i < this.intervals.length; ++i)
        clearInterval(this.intervals[i]);
      this.intervals = [];
      this.start = false;
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0;
  padding: 0;
  background-color: rgb(36, 55, 71);
}
body {
  margin: 0;
}

.main-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  overflow: hidden;
}
.main-container.option {
  background-color: rgba(0, 0, 0, 0.5);
}
.canvas-parent {
  margin: 0 auto;
  width: 960px;
  height: 560px;
}
.settings-container {
  position: absolute;
  height: 80%;
  width: 80%;
  background-color: white;
  border-radius: 20px;
  transform: translateX(-50%) translateY(-50%);
  top: 50%;
  left: 50%;
  overflow-x: hidden;
}
.settings-line {
  display: flex;
  margin: 5px;
  padding: 5px;
  border-radius: 10px;
}
.settings-elem {
  width: 18%;
  height: 30px;
  line-height: 30px;
  text-align: center;
}
.close-icon {
  position: absolute;
  right: 1%;
  top: 1%;
  cursor: pointer;
}
.close-icon:active,
.close-icon:hover {
  color: red;
}
input{
  display: block;
  width: 100%;
  height: calc(2.25rem + 2px);
  padding: 0.375rem 0.75rem;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #212529;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #bdbdbd;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}
.enter-button{
  background-color: #8a9df0; /* Green */
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  cursor: pointer;
}
</style>
