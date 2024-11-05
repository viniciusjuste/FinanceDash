import { getStockPrice, TIME_SERIES_DAILY, TIME_SERIES_MONTHLY, TIME_SERIES_WEEKLY } from "../api/financeAPI.js";
import { toggleTheme } from "../components/theme.js";
import { fetchAndRenderMonthlyChart, fetchAndRenderWeeklyChart, showSpinner, hideSpinner } from "../components/chart.js";

const companyInput = document.getElementById('companyInput');
const searchBtn = document.getElementById('searchBtn');

const stockName = document.getElementById('stock-name');
const currentPrice = document.getElementById('current-price');
const change = document.getElementById('change');
const previousClose = document.getElementById('previous-close');
const high = document.getElementById('high');
const low = document.getElementById('low');
const volume = document.getElementById('volume');
const latestDay = document.getElementById('latest-day');
const openPrice = document.getElementById('open-price');
const changePercent = document.getElementById('change-percent');
const p_current_price = document.getElementById('p_current_price');
const p_change = document.getElementById('p_change');
const p_previous_close = document.getElementById('p_previous_close');
const p_latest_day = document.getElementById('p_latest_day');
const timeRange = document.getElementById('timeRange');
const stockInfo = document.getElementById('stock-info');
const typeChart = document.getElementById('typeChart');

window.onload = () => {
    const body = document.body;
    const themeStyle = document.getElementById('themeStyle');
    const savedTheme = localStorage.getItem('theme');
    const themeImg = document.getElementById('themeImg');

    if (savedTheme) {
        body.classList.add(savedTheme);
        themeStyle.setAttribute('href', savedTheme === 'dark-theme' ? '../css/dark-theme.css' : '../css/light-theme.css');
        themeImg.setAttribute('src', savedTheme === 'dark-theme' ? '../img/dark_mode.svg' : '../img/light_mode.svg');
        themeImg.setAttribute('alt', savedTheme === 'dark-theme' ? 'dark-theme' : 'light-theme');
    } else {
        body.classList.add('light-theme');
        themeStyle.setAttribute('href', '../css/light-theme.css');
        themeImg.setAttribute('src', '../img/light_mode.svg');
        themeImg.setAttribute('alt', 'light-theme');
    }
};

async function fetchStockData(symbol) {
    try {
        const stockData = await getStockPrice(symbol);
        console.log(stockData);

        if (stockData && stockData['Global Quote'] && stockData['Global Quote']['01. symbol']) {
            stockName.innerHTML = `${stockData['Global Quote']['01. symbol']}`;
        } else {
            console.error("Os dados do símbolo não estão disponíveis.");
            stockName.innerHTML = "Símbolo não disponível";
        }

        currentPrice.innerHTML = `$${parseFloat(stockData['Global Quote']['05. price']).toFixed(2)}`;
        change.innerHTML = `$${parseFloat(stockData['Global Quote']['09. change']).toFixed(2)}`;
        changePercent.innerHTML = `${stockData['Global Quote']['10. change percent']}`;
        previousClose.innerHTML = `$${parseFloat(stockData['Global Quote']['08. previous close']).toFixed(2)}`;
        openPrice.innerHTML = `$${parseFloat(stockData['Global Quote']['02. open']).toFixed(2)}`;
        high.innerHTML = `$${parseFloat(stockData['Global Quote']['03. high']).toFixed(2)}`;
        low.innerHTML = `$${parseFloat(stockData['Global Quote']['04. low']).toFixed(2)}`;
        volume.innerHTML = `${Number(stockData['Global Quote']['06. volume']).toLocaleString()}`;
        latestDay.innerHTML = stockData['Global Quote']['07. latest trading day'];

        return stockData;
    } catch (error) {
        console.error(error);
        alert('Erro ao buscar dados da empresa. Verifique o símbolo e tente novamente.');
    }
}

async function fetchStockDataDaily(symbol) {
    try {
        const stockData = await TIME_SERIES_DAILY(symbol);
        console.log(stockData);

        if (stockData) {
            stockName.innerHTML = `${stockData['Meta Data']['2. Symbol']}`;
        } else {
            stockName.innerHTML = 'Erro ao buscar dados da empresa. Verifique o símbolo e tente novamente.';
        }

        const timeSeries = stockData["Time Series (Daily)"];
        const latestDate = Object.keys(timeSeries)[0];

        openPrice.innerHTML = `$${parseFloat(timeSeries[latestDate]["1. open"]).toFixed(2)}`;
        high.innerHTML = `$${parseFloat(timeSeries[latestDate]["2. high"]).toFixed(2)}`;
        low.innerHTML = `$${parseFloat(timeSeries[latestDate]["3. low"]).toFixed(2)}`;
        volume.innerHTML = `${Number(timeSeries[latestDate]["5. volume"]).toLocaleString()}`;
        p_change.innerHTML = '';
        p_current_price.innerHTML = '';
        p_latest_day.innerHTML = '';
        p_previous_close.innerHTML = '';

        return stockData;
    } catch (error) {
        console.error(error);
        alert('Erro ao buscar dados da empresa. Verifique o símbolo e tente novamente.');
    }
}

function hideChart(chartId) {
    const chartElement = document.getElementById(chartId);
    if (chartElement) {
        chartElement.classList.add('ocultar');
    }
}

function showChart(chartId) {
    const chartElement = document.getElementById(chartId);
    if (chartElement) {
        chartElement.classList.remove('ocultar');
    }
}


searchBtn.addEventListener('click', async (event) => {
    event.preventDefault();
    const symbol = companyInput.value.trim().toUpperCase();
    let type = '';

    if (!symbol) {
        alert('Por favor, digite o símbolo da empresa');
        return;
    }

    // Mostrar o spinner enquanto busca os dados
    showSpinner();

    // Esconder os gráficos enquanto carrega
    hideChart('weeklyChart');
    hideChart('monthlyChart');
    stockInfo.classList.add('ocultar');

    // Lógica para exibir os dados de acordo com o intervalo selecionado
    if (timeRange.value === '0d') {
        await fetchStockData(symbol);
        stockInfo.classList.remove('ocultar');
    } else if (timeRange.value === '1d') {
        await fetchStockDataDaily(symbol);
        stockInfo.classList.remove('ocultar');
    } else if (timeRange.value === '7d') {
        type = typeChart.value;
        if (type) {
            await fetchAndRenderWeeklyChart(symbol, type);
            showChart('weeklyChart');
        }
    } else if (timeRange.value === '30d') {
        type = typeChart.value;
        if (type) {
            await fetchAndRenderMonthlyChart(symbol, type);
            showChart('monthlyChart');
        }
    }

    // Esconder o spinner quando os dados estiverem carregados
    hideSpinner();

    // Verificações finais para garantir seleção correta
    if (timeRange.value === '' || typeChart.value === '') {
        if (timeRange.value !== '0d' && timeRange.value !== '1d') {
            alert('Por favor, selecione o intervalo e o tipo de gráfico');
        }
    }

    // Limpar os campos após a pesquisa
    companyInput.value = '';
    timeRange.value = '';
    typeChart.value = '';
});


const themeBtn = document.getElementById('themeBtn');
themeBtn.addEventListener('click', () => {
    toggleTheme();
});

function toggleChartSelect() {
    if (timeRange.value === '0d' || timeRange.value === '1d') {
        typeChart.setAttribute('disabled', true);
        typeChart.style.cursor = 'not-allowed';
    } else {
        typeChart.removeAttribute('disabled');
        typeChart.style.cursor = 'default';
    }
}

timeRange.addEventListener('change', toggleChartSelect);
