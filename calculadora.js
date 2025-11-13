function clearDisplay() {
    document.getElementById('display').value = '';
}

function appendToDisplay(value) {
    document.getElementById('display').value += value;
}

function calculateResult() {
    try {
        let result = eval(document.getElementById('display').value);
        document.getElementById('display').value = result;
    } catch (e) {
        document.getElementById('display').value = 'Erro';
    }
}

function setMode(mode) {
    const padrao = document.getElementById('padrao');
    const cientifica = document.getElementById('cientifica');

    if (mode === 'padrao') {
        padrao.style.display = 'block';
        cientifica.style.display = 'none';
    } else {
        padrao.style.display = 'none';
        cientifica.style.display = 'block';
    }
}
