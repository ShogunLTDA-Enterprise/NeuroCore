from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    cores = [
        {'nome': 'Verde', 'Valor': '#1D9E75'},
        {'nome': 'Roxo', 'Valor': '#7F77DD'},
        {'nome': 'Rosa', 'Valor': '#D4537E'},
        {'nome': 'Azul', 'Valor': '#378ADD'},
        {'nome': 'Amarelo', 'Valor': "#FDFF83"},
    ]
    return render_template ('Criacao_Projeto.html', cores=cores)
if __name__ == '__main__':
    app.run(debug=True)