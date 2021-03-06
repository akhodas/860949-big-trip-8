import AbstractComponentRender from './abstract-component-render';
import {Icons} from './icons';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const MILLISECOND_IN_HOUR = 60 * 60 * 1000;

export default class Statistic extends AbstractComponentRender {

  constructor(list) {
    super();
    this.list = list;
    this.moneyChart = null;
    this.transportChart = null;
    this.timeSpendChart = null;
    this._onTableClick = this._onTableClick.bind(this);
    this._onStatsClick = this._onStatsClick.bind(this);
    this._statMoneyChart = {
      labels: [],
      data: []
    };
    this._statTransportChart = {
      labels: [],
      data: []
    };
    this._statTimeSpendChart = {
      labels: [],
      data: []
    };
    this.elementTripControlMenu = document.querySelectorAll(`.trip-controls__menus a`);
  }


  get template() {
    return `
        <div class="statistic__item statistic__item--money">
          <canvas class="statistic__money" width="900"></canvas>
        </div>
      
        <div class="statistic__item statistic__item--transport">
          <canvas class="statistic__transport" width="900"></canvas>
        </div>
      
        <div class="statistic__item statistic__item--time-spend">
          <canvas class="statistic__time-spend" width="900"></canvas>
        </div>
    `;
  }


  _createDiagram() {
    this._getStatMoneyChart();
    this._getStatTransportChart();
    this._getStatTimeSpendChart();

    const moneyCtx = document.querySelector(`.statistic__money`);
    const transportCtx = document.querySelector(`.statistic__transport`);
    const timeSpendCtx = document.querySelector(`.statistic__time-spend`);

    const BAR_HEIGHT = 55;
    moneyCtx.height = BAR_HEIGHT * this._statMoneyChart.labels.length;
    transportCtx.height = BAR_HEIGHT * this._statTransportChart.labels.length;
    timeSpendCtx.height = BAR_HEIGHT * this._statTimeSpendChart.labels.length;

    this.moneyChart = new Chart(moneyCtx, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: this._statMoneyChart.labels.map((type) => (`${type} ${Icons[type]}`)),
        datasets: [{
          data: this._statMoneyChart.data,
          backgroundColor: `#ffffff`,
          hoverBackgroundColor: `#ffffff`,
          anchor: `start`
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 13
            },
            color: `#000000`,
            anchor: `end`,
            align: `start`,
            formatter: (val) => `€ ${val}`
          }
        },
        title: {
          display: true,
          text: `MONEY`,
          fontColor: `#000000`,
          fontSize: 23,
          position: `left`
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: `#000000`,
              padding: 5,
              fontSize: 13,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            barThickness: 44,
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            minBarLength: 50
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false,
        }
      }
    });

    this.transportChart = new Chart(transportCtx, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: this._statTransportChart.labels.map((type) => (`${type} ${Icons[type]}`)),
        datasets: [{
          data: this._statTransportChart.data,
          backgroundColor: `#ffffff`,
          hoverBackgroundColor: `#ffffff`,
          anchor: `start`
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 13
            },
            color: `#000000`,
            anchor: `end`,
            align: `start`,
            formatter: (val) => `${val}x`
          }
        },
        title: {
          display: true,
          text: `TRANSPORT`,
          fontColor: `#000000`,
          fontSize: 23,
          position: `left`
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: `#000000`,
              padding: 5,
              fontSize: 13,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            barThickness: 44,
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            minBarLength: 50
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false,
        }
      }
    });

    this.timeSpendChart = new Chart(timeSpendCtx, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: this._statTimeSpendChart.labels.map((type) => (`${type} ${Icons[type]}`)),
        datasets: [{
          data: this._statTimeSpendChart.data,
          backgroundColor: `#ffffff`,
          hoverBackgroundColor: `#ffffff`,
          anchor: `start`
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 13
            },
            color: `#000000`,
            anchor: `end`,
            align: `start`,
            formatter: (val) => `${val}hours`
          }
        },
        title: {
          display: true,
          text: `TIME SPENT`,
          fontColor: `#000000`,
          fontSize: 23,
          position: `left`
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: `#000000`,
              padding: 5,
              fontSize: 13,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            barThickness: 44,
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            minBarLength: 50
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false,
        }
      }
    });

    // if (transportChart === moneyChart) {
    //   transportChart = timeSpendChart;
    //   moneyChart = `ЭТО НУЖНО ЧТОБЫ ESLINT НЕ РУГАЛСЯ НА ЭЛЕМЕНТЫ,
    //    КОТОРЫЕ НЕ ИСПОЛЬЗУЮТСЯ
    //    transportChart, moneyChart, timeSpendChart`;
    // }
  }

  _getStatMoneyChart() {
    this._statMoneyChart = {
      labels: [],
      data: []
    };
    let index;
    this.list.filter((item) => !item.isDeleted).forEach((element) => {
      index = this._statMoneyChart.labels.indexOf(element.typeParameters.type);
      if (index > -1) {
        this._statMoneyChart.data[index] += +element.price;
      } else {
        this._statMoneyChart.labels.push(element.typeParameters.type);
        this._statMoneyChart.data.push(+element.price);
      }
    });
  }

  _getStatTimeSpendChart() {
    this._statTimeSpendChart = {
      labels: [],
      data: []
    };
    let index;
    this.list.filter((item) => !item.isDeleted).forEach((element) => {
      index = this._statTimeSpendChart.labels.indexOf(element.typeParameters.type);
      if (index > -1) {
        this._statTimeSpendChart
          .data[index] += Math.round(element.duration / MILLISECOND_IN_HOUR);
      } else {
        this._statTimeSpendChart.labels.push(element.typeParameters.type);
        this._statTimeSpendChart.data
          .push(Math.ceil(element.duration / MILLISECOND_IN_HOUR));
      }
    });
  }

  _getStatTransportChart() {
    this._statTransportChart = {
      labels: [],
      data: []
    };
    let index;
    this.list.filter((item) => !item.isDeleted).forEach((element) => {
      index = this._statTransportChart.labels.indexOf(element.typeParameters.type);
      if (index > -1) {
        this._statTransportChart.data[index] += 1;
      } else {
        this._statTransportChart.labels.push(element.typeParameters.type);
        this._statTransportChart.data.push(1);
      }
    });
  }

  _onTableClick() {
    this.elementTripControlMenu[0].classList.add(`view-switch__item--active`);
    this.elementTripControlMenu[1].classList.remove(`view-switch__item--active`);
    document.querySelector(`.statistic`).classList.add(`visually-hidden`);
    document.querySelector(`.main`).classList.remove(`visually-hidden`);
    document.querySelector(`.trip-filter`).classList.remove(`visually-hidden`);
    document.querySelector(`.trip-controls__new-event`).classList.remove(`visually-hidden`);

    if (this.moneyChart) {
      this.moneyChart.destroy();
      this.transportChart.destroy();
      this.timeSpendChart.destroy();
    }
  }

  _onStatsClick() {
    this.elementTripControlMenu[1].classList.add(`view-switch__item--active`);
    this.elementTripControlMenu[0].classList.remove(`view-switch__item--active`);
    document.querySelector(`.main`).classList.add(`visually-hidden`);
    document.querySelector(`.statistic`).classList.remove(`visually-hidden`);
    document.querySelector(`.trip-filter`).classList.add(`visually-hidden`);
    document.querySelector(`.trip-controls__new-event`).classList.add(`visually-hidden`);

    this._partialUpdate();
  }

  _partialUpdate() {
    this._element.innerHTML = this.template;
    this._createDiagram();
  }


  createListeners() {
    this.elementTripControlMenu[0]
      .addEventListener(`click`, this._onTableClick);
    this.elementTripControlMenu[1]
      .addEventListener(`click`, this._onStatsClick);
  }

  removeListeners() {
    this.elementTripControlMenu[0]
      .removeEventListener(`click`, this._onTableClick);
    this.elementTripControlMenu[1]
      .removeEventListener(`click`, this._onStatsClick);
  }

}
