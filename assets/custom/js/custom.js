let lastTime;
let chart;
let tempGauge;
let humGauge;
const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const timeOffSet = new Date().getTimezoneOffset()

$(document).ready(function() {
	/* Grafico de temperatura y humedad */
	$.getJSON("sensor", function(json) {
		console.log(json);
		for (let i = 0; i < json.temperatura.length; i++) {
			json.temperatura[i][0] = getTimestamp(json.temperatura[i][0]);
			json.humedad[i][0] = getTimestamp(json.humedad[i][0]);
		}

		chartOptions.series[0].data = json.temperatura;
		chartOptions.series[1].data = json.humedad;
		setLastTime(json.temperatura[json.temperatura.length - 1][0]);
		chart = new Highcharts.Chart("temperature-chart", chartOptions);
	});

	/* Temperature gauge -> temp_gauge*/
	tempGauge = new Highcharts.Chart("temp-gauge", gaugeOptions);
	tempGauge.series[0].name = "Temperatura";
	updateGauge(tempGauge, 1);

	/* Humidity gauge ->gum-gauge */
	humGauge = Highcharts.chart("hum-gauge", gaugeOptions);
	humGauge.series[0].name = "Humedad";
	updateGauge(humGauge, 2);
});

const requestSensoresData = () => {
	setInterval(() => {
		$.get("sensor/last", resp => {
			data = JSON.parse(resp);
			data.temperatura[0] = getTimestamp(data.temperatura[0]);
			data.humedad[0] = getTimestamp(data.humedad[0]);

			if (data.temperatura[0] > getLastTime()) {
				chart.series[0].addPoint(data.temperatura, true, true, true);
				chart.series[1].addPoint(data.humedad, true, true, true);
				setLastTime(data.temperatura[0]);
			}
		});
	}, 1000);
};

const updateGauge = (gauge, sensor) => {
	setInterval(() => {
		let point = gauge.series[0].points[0];

		$.getJSON("sensor/last", json => {
			console.log(json.temperatura[1]);
			let nwepoint;
			if (sensor == 1) {
				nwepoint = json.temperatura[1];
			} else {
				if (sensor == 2) {
					nwepoint = json.humedad[1];
				}
			}

			point.update(nwepoint);
		});
	}, 1000);
};

let chartOptions = {
	chart: {
		type: "spline",
		animation: Highcharts.svg, // don't animate in old IE
		marginRight: 10,
		events: {
			load: requestSensoresData
		}
	},

	time: {
		useUTC: false
	},

	title: {
		text: "Estado de la temperatura y humedad actual"
	},

	subtitle: {
		text: "Datos recogidos por arduino"
	},

	xAxis: {
		type: "datetime",
		dateTimeLabelFormats: {
			month: "%e. %b",
			year: "%b"
		},
		title: {
			text: "Hora"
		}
	},

	yAxis: {
		title: {
			text: "Sensores"
		},
		labels: {
			formatter: function() {
				return this.value + "°";
			}
		}
	},

	tooltip: {
		headerFormat: "<b>{series.name}</b><br/>",
		pointFormat: "{point.x:%Y-%m-%d %H:%M:%S}<br/>{point.y:.2f}"
	},

	legend: {
		enabled: false
	},

	exporting: {
		enabled: false
	},

	series: [
		{
			name: "Temperatura",
			data: []
		},
		{
			name: "Humedad",
			data: []
		}
	]
};

let gaugeOptions = {
	chart: {
		type: "gauge",
		plotBackgroundColor: null,
		plotBackgroundImage: null,
		plotBorderWidth: 0,
		plotShadow: false
	},

	title: {
		text: "Valor actual"
	},

	pane: {
		startAngle: -150,
		endAngle: 150,
		background: [
			{
				backgroundColor: {
					linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
					stops: [
						[0, "#FFF"],
						[1, "#333"]
					]
				},
				borderWidth: 0,
				outerRadius: "109%"
			},
			{
				backgroundColor: {
					linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
					stops: [
						[0, "#333"],
						[1, "#FFF"]
					]
				},
				borderWidth: 1,
				outerRadius: "107%"
			},
			{
				// default background
			},
			{
				backgroundColor: "#DDD",
				borderWidth: 0,
				outerRadius: "105%",
				innerRadius: "103%"
			}
		]
	},

	// the value axis
	yAxis: {
		min: 0,
		max: 50,

		minorTickInterval: "auto",
		minorTickWidth: 1,
		minorTickLength: 10,
		minorTickPosition: "inside",
		minorTickColor: "#666",

		tickPixelInterval: 30,
		tickWidth: 2,
		tickPosition: "inside",
		tickLength: 10,
		tickColor: "#666",
		labels: {
			step: 2,
			rotation: "auto"
		},

		plotBands: [
			{
				from: 0,
				to: 25,
				color: "#55BF3B" // green
			},
			{
				from: 25,
				to: 40,
				color: "#DDDF0D" // yellow
			},
			{
				from: 40,
				to: 50,
				color: "#DF5353" // red
			}
		]
	},

	series: [
		{
			data: [0],
			tooltip: {
				valueSuffix: "°"
			}
		}
	]
};
const setLastTime = time => {
	lastTime = time;
};

const getLastTime = () => {
	return lastTime;
};

const getTimestamp = cadena => {
	auxdate = cadena.split(" ");
	auxD = auxdate[0].split("-");
	auxH = auxdate[1].split(":");

	timesstamp = Date.UTC(auxD[0], auxD[1], auxD[2], auxH[0], auxH[1], auxH[2]);

	return timesstamp;
};
