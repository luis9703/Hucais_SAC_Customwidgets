var getScriptPromisify = (src) => {
    return new Promise(resolve => {
      $.getScript(src, resolve);
    });
  };
  
  (function () {
    const prepared = document.createElement('template')
    prepared.innerHTML = `
        <style>
        </style>
        <div id="root" style="width: 100%; height: 100%;">
        </div>
      `;
    class SamplePrepared extends HTMLElement {
      constructor () {
        super();
  
        this._shadowRoot = this.attachShadow({ mode: 'open' });
        this._shadowRoot.appendChild(prepared.content.cloneNode(true));
  
        this._root = this._shadowRoot.getElementById('root');
  
        this._props = {};
  
        this.render();
      }
  
      onCustomWidgetResize (width, height) {
        this.render();
      }

      set myDataSource(dataBinding) {
        this._myDataSource = dataBinding;
        this.render();
      }
  
      async render () {
        await getScriptPromisify(
          'https://cdn.bootcdn.net/ajax/libs/echarts/5.0.0/echarts.min.js'
        );

        if (!this._myDataSource || this._myDataSource.state !== "success") {
          return;
        }

        const dimension = this._myDataSource.metadata.feeds.dimensions.values[0];
        const measure = this._myDataSource.metadata.feeds.measures.values[0];
        const data = this._myDataSource.data.map((data) => {
          return {
            name: data[dimension].label,
            value: data[measure].raw,
          };
        });

        const chart = echarts.init(this._root);
        const option = {
          title: {
            text: '云印营销漏斗',
            color: '#fff'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c}',
          },
          toolbox: {
            feature: {
              dataView: { readOnly: false },
              restore: {},
              saveAsImage: {},
            },
          },
          legend: {
            data: ['Show', 'Click', 'Visit', 'Inquiry', 'Order'],
          },
          series: [
            {
              name: 'Expected',
              type: 'funnel',
              sort: 'descending', // 设置为降序排序
              minSize: '1%', // 设置漏斗图的最小宽度
              maxSize: '100%', // 设置漏斗图的最大宽度
              left: '10%',
              width: '80%',
              label: {
                formatter: '{b}: {c}',
                color: '#fff'
              },
              labelLine: {
                show: false,
              },
              itemStyle: {
                opacity: 0.7,
              },
              emphasis: {
                label: {
                  position: 'inside',
                  formatter: '{b}Expected: {c}',
                },
              },
              data,
//             },
//             {
//               name: 'Actual',
//               type: 'funnel',
//               sort: 'descending', // 设置为降序排序
//               minSize: '1%', // 设置漏斗图的最小宽度
//               maxSize: '100%', // 设置漏斗图的最大宽度
//               left: '10%',
//               width: '80%',
//               maxSize: '80%',
//               label: {
//                 position: 'inside',
//                 formatter: '{c}',
//                 color: '#fff',
//               },
//               itemStyle: {
//                 opacity: 0.5,
//                 borderColor: '#fff',
//                 borderWidth: 2,
//               },
//               emphasis: {
//                 label: {
//                   position: 'inside',
//                   formatter: '{b}Actual: {c}',
//                 },
//               },
//               data,
            },
          ],
        };
        chart.setOption(option);
      }
    }
  
    customElements.define('com-sap-sample-echarts-prepared', SamplePrepared);
  })();
