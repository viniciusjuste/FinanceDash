import { TIME_SERIES_DAILY, TIME_SERIES_WEEKLY, TIME_SERIES_MONTHLY } from "../api/financeAPI.js";

// Função para buscar dados e renderizar gráfico semanal
// Função para buscar dados e renderizar gráfico semanal
export async function fetchAndRenderWeeklyChart(symbol, type) {
    showSpinner(); // Mostra o spinner ao iniciar a requisição
    try {
        const stockData = await TIME_SERIES_WEEKLY(symbol);
        console.log('Dados semanais:', stockData);

        const timeSeries = stockData["Weekly Time Series"];
        if (!timeSeries) {
            console.error("Dados de séries temporais semanais não encontrados.");
            return;
        }

        // Extrair dados para o gráfico
        const labels = Object.keys(timeSeries).reverse(); // Semanas
        const closingPrices = labels.map(date => parseFloat(timeSeries[date]["4. close"])).reverse(); // Preços de fechamento
        console.log('Labels:', labels);
        console.log('Closing Prices:', closingPrices);

        // Verificar se o canvas existe
        const ctx = document.getElementById('weeklyChart');
        if (!ctx) {
            console.error("Elemento com ID 'weeklyChart' não encontrado.");
            return;
        }

        const chartContext = ctx.getContext('2d');
        if (!chartContext) {
            console.error("Não foi possível obter o contexto do gráfico.");
            return;
        }

        // Definir tamanho do canvas manualmente, se necessário
        ctx.style.height = '400px';  // Definir uma altura fixa para o gráfico

        // Destruir gráfico anterior se ele já existir
        if (window.myWeeklyChart instanceof Chart) {
            window.myWeeklyChart.destroy();
        }

        // Configuração do gráfico
        window.myWeeklyChart = new Chart(chartContext, {
            type: type,
            data: {
                labels: labels,
                datasets: [{
                    label: 'Preço de Fechamento Semanal',
                    data: closingPrices,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: false
                    }
                },
                responsive: true, // Tornar o gráfico responsivo
                maintainAspectRatio: false, // Permitir que o gráfico se ajuste ao tamanho do contêiner
            }
        });

        // Remover a classe 'ocultar' para mostrar o gráfico
        ctx.classList.remove('ocultar');
    } catch (error) {
        console.error("Erro ao renderizar o gráfico semanal:", error);
    } finally {
        hideSpinner(); // Esconde o spinner após a requisição
    }
}

// Função para buscar dados e renderizar gráfico mensal
export async function fetchAndRenderMonthlyChart(symbol, type) {
    showSpinner(); // Mostra o spinner ao iniciar a requisição
    try {
        const stockData = await TIME_SERIES_MONTHLY(symbol);
        const timeSeries = stockData["Monthly Time Series"];
        console.log('Dados mensais:', stockData);

        if (!timeSeries) {
            console.error("Dados de séries temporais mensais não encontrados.");
            return;
        }

        // Extrair dados para o gráfico
        const labels = Object.keys(timeSeries).slice(0, 12).reverse(); // Últimos 12 meses
        const closingPrices = labels.map(date => parseFloat(timeSeries[date]["4. close"])).reverse(); // Preços de fechamento
        console.log('Labels:', labels);
        console.log('Closing Prices:', closingPrices);

        // Verificar se o canvas existe
        const ctx = document.getElementById('monthlyChart');
        if (!ctx) {
            console.error("Elemento com ID 'monthlyChart' não encontrado.");
            return;
        }

        const chartContext = ctx.getContext('2d');
        if (!chartContext) {
            console.error("Não foi possível obter o contexto do gráfico.");
            return;
        }

        // Definir tamanho do canvas manualmente, se necessário
        ctx.style.height = '400px';  // Definir uma altura fixa para o gráfico

        // Destruir gráfico anterior se ele já existir
        if (window.myMonthlyChart instanceof Chart) {
            window.myMonthlyChart.destroy();
        }

        // Configuração do gráfico
        window.myMonthlyChart = new Chart(chartContext, {
            type: type,
            data: {
                labels: labels,
                datasets: [{
                    label: 'Preço de Fechamento Mensal',
                    data: closingPrices,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: false
                    }
                },
                responsive: true, // Tornar o gráfico responsivo
                maintainAspectRatio: false, // Permitir que o gráfico se ajuste ao tamanho do contêiner
            }
        });

        // Remover a classe 'ocultar' para mostrar o gráfico
        ctx.classList.remove('ocultar');
    } catch (error) {
        console.error("Erro ao renderizar o gráfico mensal:", error);
    } finally {
        hideSpinner(); // Esconde o spinner após a requisição
    }
}

export function showSpinner() {
    const spinner = document.getElementById('spinner');
    if (spinner) {
        spinner.style.display = 'block'; // Mostra o spinner
    }
}

export function hideSpinner() {
    const spinner = document.getElementById('spinner');
    if (spinner) {
        spinner.style.display = 'none'; // Esconde o spinner
    }
}

