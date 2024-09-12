class RecintosZoo {
    constructor() {
        // Definição dos recintos disponíveis
        this.recintos = [
            { numero: 1, bioma: "savana", tamanho: 10, animais: [{ especie: "MACACO", quantidade: 3 }] },
            { numero: 2, bioma: "floresta", tamanho: 5, animais: [] },
            { numero: 3, bioma: "savana e rio", tamanho: 7, animais: [{ especie: "GAZELA", quantidade: 1 }] },
            { numero: 4, bioma: "rio", tamanho: 8, animais: [] },
            { numero: 5, bioma: "savana", tamanho: 9, animais: [{ especie: "LEAO", quantidade: 1 }] }
        ];

        // Definição das espécies e suas características
        this.animaisPermitidos = {
            "LEAO": { tamanho: 3, bioma: ["savana"], carnivoro: true },
            "LEOPARDO": { tamanho: 2, bioma: ["savana"], carnivoro: true },
            "CROCODILO": { tamanho: 3, bioma: ["rio"], carnivoro: true },
            "MACACO": { tamanho: 1, bioma: ["savana", "floresta"], carnivoro: false },
            "GAZELA": { tamanho: 2, bioma: ["savana"], carnivoro: false },
            "HIPOPOTAMO": { tamanho: 4, bioma: ["savana", "rio"], carnivoro: false }
        };
    }

    analisaRecintos(animal, quantidade) {
        // Validação de entrada
        if (!this.animaisPermitidos[animal]) {
            return { erro: "Animal inválido" };
        }
        if (typeof quantidade !== 'number' || quantidade <= 0) {
            return { erro: "Quantidade inválida" };
        }

        const especieInfo = this.animaisPermitidos[animal];
        let recintosViaveis = [];

        for (const recinto of this.recintos) {
            const espacoRestante = this.calculaEspacoRestante(recinto, especieInfo, quantidade);
            if (espacoRestante !== null) {
                recintosViaveis.push(`Recinto ${recinto.numero} (espaço livre: ${espacoRestante} total: ${recinto.tamanho})`);
            }
        }

        if (recintosViaveis.length === 0) {
            return { erro: "Não há recinto viável" };
        }

        return { recintosViaveis };
    }

    calculaEspacoRestante(recinto, especieInfo, quantidade) {
        // Verifica se o bioma é adequado
        if (!especieInfo.bioma.includes(recinto.bioma) && recinto.bioma !== "savana e rio") {
            return null;
        }

        // Calcula o espaço necessário
        let espacoOcupado = recinto.animais.reduce((total, animal) => {
            const animalInfo = this.animaisPermitidos[animal.especie];
            if (animalInfo) {
                return total + animalInfo.tamanho * animal.quantidade;
            }
            return total;
        }, 0);

        // Verifica se o novo animal pode coexistir
        if (this.existeIncompatibilidade(recinto, especieInfo)) {
            return null;
        }

        // Se há uma espécie diferente, adicione um espaço extra
        const existeOutraEspecie = recinto.animais.some(animal => animal.especie !== especieInfo.especie);
        if (existeOutraEspecie) {
            espacoOcupado += 1; // Adiciona 1 espaço extra
        }

        const espacoNecessario = especieInfo.tamanho * quantidade;
        const espacoRestante = recinto.tamanho - espacoOcupado - espacoNecessario;

        return espacoRestante >= 0 ? espacoRestante : null;
    }

    existeIncompatibilidade(recinto, especieInfo) {
        for (const animal of recinto.animais) {
            const animalInfo = this.animaisPermitidos[animal.especie];

            // Verifica se há incompatibilidade de carnívoros ou restrições específicas
            if ((animalInfo.carnivoro || especieInfo.carnivoro) && animal.especie !== especieInfo.especie) {
                return true;
            }
            if (especieInfo.especie === "HIPOPOTAMO" && recinto.bioma !== "savana e rio" && recinto.animais.length > 0) {
                return true;
            }
        }
        return false;
    }
}

export { RecintosZoo as RecintosZoo };
