export function toggleTheme() {
    const body = document.body;
    const themeStyle = document.getElementById('themeStyle');

    // Verifica se o tema atual é 'light-theme' ou 'dark-theme'
    const currentTheme = body.classList.contains('light-theme') ? 'light-theme' : 'dark-theme';

    if (currentTheme === 'light-theme') {
        // Alterna para tema escuro
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
        themeStyle.setAttribute('href', '../css/dark-theme.css');
        // Altera o arquivo CSS para o tema escuro
        const themeImg = document.getElementById('themeImg');

        // Define a imagem e texto do botão
        themeImg.setAttribute('src', '../img/dark_mode.svg');
        themeImg.setAttribute('alt', 'dark-theme');

        // Salva o tema no localStorage
        localStorage.setItem('theme', 'dark-theme');
    } else {
        // Alterna para tema claro
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
        // Altera o arquivo CSS para o tema claro
        themeStyle.setAttribute('href', '../css/light-theme.css');

        const themeBtn = document.getElementById('themeBtn');
        const themeImg = document.getElementById('themeImg');

        // Define a imagem e texto do botão
        themeImg.setAttribute('src', '../img/light_mode.svg'); // Troque para a imagem do tema claro
        themeImg.setAttribute('alt', 'light-theme');

        // Salva o tema no localStorage
        localStorage.setItem('theme', 'light-theme');
    }
}
