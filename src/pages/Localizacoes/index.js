import React, { Component } from 'react'
import firebase from '../../services/firebase';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import moment, { now } from 'moment';

class LocalizacoesIndex extends Component {

    constructor() {
        super();

        this.state = {
            listaLocalizacoes: [],
            listaLocalizacoesFiltrada: [],
            nomePac: '',
            doenca: '',
            data: '',
            idade: '',
            nomeMed: '',
            especialidade: '',
            latitude: '',
            longitude: '',
            regiao: '',
            busca: '',

            //idLocalizacao: 0
        }
    }

    listarLocalizacoes() {
        firebase.firestore().collection("localizacoes")
            //.where("ativo", "==", true)
            .onSnapshot((localizacoes) => {
                let localizacoesArray = [];
                localizacoes.forEach((localizacao) => {
                    localizacoesArray.push({
                        id: localizacao.id,
                        nomePac: localizacao.data().nomePac,
                        doenca: localizacao.data().doenca,
                        //data: firebase.firestore.Timestamp.fromDate(new Date(this.state.data)),
                        data: localizacao.data().data.toDate().toLocaleString("pt-br"),
                        //data: localizacao.data().data,
                        idade: localizacao.data().idade,
                        nomeMed: localizacao.data().nomeMed,
                        especialidade: localizacao.data().especialidade,
                        latitude: localizacao.data().latitude,
                        longitude: localizacao.data().longitude,
                        regiao: localizacao.data().regiao
                    })
                })

                this.setState({ listaLocalizacoes: localizacoesArray, listaLocalizacoesFiltrada: localizacoesArray }, () => {
                    console.log(this.state.listaLocalizacoes);
                })
            })
    }

    componentDidMount() {
        this.listarLocalizacoes();
    }

    atualizaEstado(event) {
        //this.setState({ [event.target.name]: event.target.value })  TESTE

        this.setState({ [event.target.name]: event.target.value }, () => {
            this.buscarItem();
        });
    }

    salvarLocalizacao(event) {
        event.preventDefault();

        //if (this.state.idLocalizacao === 0) {
        firebase.firestore().collection("localizacoes")
            .add({
                //data: firebase.firestore.Timestamp.fromDate(new Date(this.state.data)),
                nomePac: this.state.nomePac,
                doenca: this.state.doenca,
                data: firebase.firestore.Timestamp.fromDate(new Date(this.state.data + "T00:00:00")),
                // data: Date(this.state.data),
                // data: firebase.firestore.Timestamp.fromDate(new Date(this.state.data)),
                idade: this.state.idade,
                nomeMed: this.state.nomeMed,
                especialidade: this.state.especialidade,
                latitude: this.state.latitude,
                longitude: this.state.longitude,
                regiao: this.state.regiao,
            }).then(() => {
                alert("Localização cadastrada!")
                this.limparFormulario();
            }).catch((erro) => {
                alert('erro', erro);
            })
    }

    limparFormulario() {
        this.setState({
            nomePac: '',
            doenca: '',
            data: '',
            idade: '',
            nomeMed: '',
            especialidade: '',
            latitude: '',
            longitude: '',
            regiao: '',
            //idLocalizacao: 0
        })
    }

    displayMarkers = () => {
        return this.state.listaLocalizacoes.map((localizacoes) => {
            return <Marker key={localizacoes.id} position={{
                lat: localizacoes.latitude,
                lng: localizacoes.longitude
            }}
                onClick={() => console.log("You clicked me!")} />
        })
    }

    buscarItem() {

        let listaFiltrada = this.state.listaLocalizacoes;

        // if (this.state.busca !== null && this.state.busca !== "") {
        //     var data = moment(this.state.data).format("DD/MM/YYYY" + "T00:00:00");
        //     listaFiltrada = listaFiltrada.filter(x => x.data.includes(data));
        //   }

        if (this.state.busca !== null && this.state.busca !== "") {
            listaFiltrada = listaFiltrada.filter(x =>
                x.especialidade.includes(this.state.busca) || //busca por especialidade e nome do paciente no mesmo input
                x.nomePac.includes(this.state.busca)
            );
        }

        this.setState({ listaLocalizacoesFiltrada: listaFiltrada });

    }

    // excluirPorId(event) {
    //     event.preventDefault();

    //     if (window.confirm("Quer excluir mesmo?")) {
    //         firebase.firestore().collection("eventos")
    //             .doc(event.target.id)
    //             .delete()
    //             .then(function () {
    //                 alert("Evento removido!")
    //             }).catch(function (error) {
    //                 console.error("Erro ao remover: ", error);
    //             });
    //     }
    // }


    excluirTodos(event) {
        event.preventDefault();

        if (window.confirm("Tem certeza disso?")) {
            this.state.listaLocalizacoes.map((localizacao) => {
                firebase.firestore().collection("localizacoes")
                    .doc(localizacao.id)
                    .delete()
            })
            alert("Todos foi removido!")
        }
    }

    render() {
        return (
            <div>
                <h2>Localizações - Cadastro</h2>
                <form onSubmit={this.salvarLocalizacao.bind(this)}>
                    <label> Nome do Paciente
                        <input type="text" name="nomePac" value={this.state.nomePac} onChange={this.atualizaEstado.bind(this)} />
                    </label>
                    <br />
                    <label> Doença
                        <input type="text" name="doenca" value={this.state.doenca} onChange={this.atualizaEstado.bind(this)} />
                    </label>
                    <br />
                    <label>Data de Nascimento
                        <input type="date" name="data" value={this.state.data} onChange={this.atualizaEstado.bind(this)} />
                    </label>
                    <br />
                    <label>Idade
                        <input type="int" name="idade" value={this.state.idade} onChange={this.atualizaEstado.bind(this)} />
                    </label>
                    <br />
                    <label> Nome do Médico
                        <input type="text" name="nomeMed" value={this.state.nomeMed} onChange={this.atualizaEstado.bind(this)} />
                    </label>
                    <br />
                    <label> Especialidade
                        <input type="text" name="especialidade" value={this.state.especialidade} onChange={this.atualizaEstado.bind(this)} />
                    </label>
                    <br />
                    <label> Latitude
                        <input type="text" name="latitude" value={this.state.latitude} onChange={this.atualizaEstado.bind(this)} />
                    </label>
                    <br />
                    <label> Longitude
                        <input type="text" name="longitude" value={this.state.longitude} onChange={this.atualizaEstado.bind(this)} />
                    </label>
                    <br />
                    <label> Região
                    <select name="regiao" required value={this.state.regiao} onChange={this.atualizaEstado.bind(this)}>
                            <option selected>Selecione</option>
                            <option value="Centro">Centro</option>
                            <option value="Norte">Norte</option>
                            <option value="Sul">Sul</option>
                            <option value="Leste">Leste</option>
                            <option value="Oeste">Oeste</option>
                        </select> </label>
                    <br />
                    <button type="submit">Enviar</button>
                </form>
                <h2>Localizações - Lista </h2>


                <form onSubmit={this.buscarItem.bind(this)}>
                    <label> Buscar
                        <input type="text" name="busca" value={this.state.busca} onChange={this.atualizaEstado.bind(this)} />
                    </label>
                </form>


                <ul>
                    {
                        this.state.listaLocalizacoesFiltrada.map((localizacoes) => {
                            return (
                                <div>

                                    <li key={localizacoes.id}>{localizacoes.id} - {localizacoes.nomePac} -
                                        {localizacoes.doenca} - {localizacoes.data} -
                                        {localizacoes.idade} - {localizacoes.nomeMed} -
                                        {localizacoes.especialidade} - {localizacoes.latitude} -
                                        {localizacoes.longitude} - {localizacoes.regiao}
                                    </li>
                                </div>
                            )
                        })
                    }
                </ul>
                <button onClick={this.excluirTodos.bind(this)} type="submit">EXCLUIR TODOS</button>


                <Map
                    google={this.props.google}
                    zoom={8}
                    initialCenter={{ lat: -23.5504533, lng: -46.6514207 }}
                >
                    {this.displayMarkers()}
                </Map>
            </div>

        )
    }
}

export default GoogleApiWrapper({
    apiKey: ("AIzaSyCy91RwWbR36h9iZufN4Kw6oedlbCUzVXU")
})(LocalizacoesIndex)