import React, { Component } from 'react'
import firebase from '../../services/firebase';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import moment, { now } from 'moment';
import "./index.css"

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
            tabLista: true

            //buscaData: ''
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

        // if (this.state.buscaData !== null && this.state.buscaData !== "") {
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

    alteraTabs(event) {
        event.preventDefault();
        this.setState({ tabLista: !this.state.tabLista }) // "!" -> inverso do estado que está (IF melhorado)
    }

    excluirPorId(event) {
        event.preventDefault();

        if (window.confirm("Quer excluir mesmo?")) {
            firebase.firestore().collection("localizacoes")
                .doc(event.target.id)
                .delete()
                .then(function () {
                    alert("Localização removida!")
                }).catch(function (error) {
                    console.error("Erro ao remover: ", error);
                });
        }
    }

    excluirTodos(event) {
        event.preventDefault();

        if (window.confirm("Tem certeza disso?")) {
            this.state.listaLocalizacoes.map((localizacao) => {
                firebase.firestore().collection("localizacoes")
                    .doc(localizacao.id)
                    .delete()
            })
            alert("Todos foram removido!")
        }
    }

    render() {
        return (
            <div >
                <div className="topo-localizacoes">
                    <div className="topo-localizacoes__quebra"></div>
                    <h1 className="topo-localizacoes__h1">Localização(Pacientes)</h1>
                    <div className="topo-localizacoes__quebra topo-localizacoes__quebra--modificado"></div>
                </div>
                <div>
                    <aside>
                        <div className="menu-localizacoes">
                            <h3 className="menu-localizacoes__titulo">Administrador</h3>
                            {/* <img className="menu-localizacoes__imagem" src={require('../../assets/img/icon-login.png')} alt="" /> */}
                            <div className="links-localizacoes">
                                <nav>
                                    <ul>
                                        <li className="links-localizacoes__item"><a className="links-localizacoes__titulo" href="/prontuarios">Prontuários</a></li>
                                        <div className="links-localizacoes__quebra"></div>
                                        <li className="links-localizacoes__item"><a className="links-localizacoes__titulo links-localizacoes__titulo--selecionado"
                                            href="/consultas">Consultas</a></li>
                                        <div className="links-localizacoes__quebra"></div>
                                        <li className="links-localizacoes__item"><a className="links-localizacoes__titulo" href="/clinicas">Clínicas</a></li>
                                        <div className="links-localizacoes__quebra"></div>
                                        <li className="links-localizacoes__item"><a className="links-localizacoes__titulo" href="/medicos">Médicos</a></li>
                                        <div className="links-localizacoes__quebra"></div>
                                        <li className="links-localizacoes__item"><a className="links-localizacoes__titulo" href="/usuarios">Usuários</a></li>
                                        <div className="links-localizacoes__quebra"></div>
                                        <li className="links-localizacoes__item"><a className="links-localizacoes__titulo" href="/especialidades">Especialidades</a></li>
                                        <div className="links-localizacoes__quebra"></div>
                                    </ul>
                                </nav>
                            </div>
                            <a className="menu-localizacoes__link" href="/login">Sair</a>
                        </div>
                    </aside>
                </div>
                <main>
                    <input type="button" className="listas-localizacoes__button listas-localizacoes__button--lista tablink" value='Lista' onClick={this.alteraTabs.bind(this)} />

                    <input type="button" className="listas-localizacoes__button listas-localizacoes__button--cadastrar tablink" value='Cadastrar+' onClick={this.alteraTabs.bind(this)} />

                    <div id="Cadastrar" className="formulario-localizacoes tabcontent" style={{ display: (this.state.tabLista ? "none" : "flex") }} className="teste">
                        <form className="teste" onSubmit={this.salvarLocalizacao.bind(this)}>
                            <label className="teste"> Nome do Paciente
                        <input className="teste" type="text" name="nomePac" value={this.state.nomePac} onChange={this.atualizaEstado.bind(this)} />
                            </label>
                            <br />
                            <label className="teste"> Doença
                        <input className="teste" type="text" name="doenca" value={this.state.doenca} onChange={this.atualizaEstado.bind(this)} />
                            </label>
                            <br />
                            <label className="teste">Data de Nascimento
                        <input className="teste" type="date" name="data" value={this.state.data} onChange={this.atualizaEstado.bind(this)} />
                            </label>
                            <br />
                            <label className="teste">Idade
                        <input className="teste" type="int" name="idade" value={this.state.idade} onChange={this.atualizaEstado.bind(this)} />
                            </label>
                            <br />
                            <label className="teste"> Nome do Médico
                        <input className="teste" type="text" name="nomeMed" value={this.state.nomeMed} onChange={this.atualizaEstado.bind(this)} />
                            </label>
                            <br />
                            <label className="teste"> Especialidade
                        <input className="teste" type="text" name="especialidade" value={this.state.especialidade} onChange={this.atualizaEstado.bind(this)} />
                            </label>
                            <br />
                            <label className="teste"> Latitude
                        <input className="teste" type="text" name="latitude" value={this.state.latitude} onChange={this.atualizaEstado.bind(this)} />
                            </label>
                            <br />
                            <label className="teste"> Longitude
                        <input className="teste" type="text" name="longitude" value={this.state.longitude} onChange={this.atualizaEstado.bind(this)} />
                            </label>
                            <br />
                            <label className="teste"> Região
                    <select className="teste" name="regiao" required value={this.state.regiao} onChange={this.atualizaEstado.bind(this)}>
                                    <option value="" selected>Selecione</option>
                                    <option value="Centro">Centro</option>
                                    <option value="Norte">Norte</option>
                                    <option value="Sul">Sul</option>
                                    <option value="Leste">Leste</option>
                                    <option value="Oeste">Oeste</option>
                                </select> </label>
                            <br />
                            <button className="teste" type="submit">Enviar</button>
                        </form>
                    </div>

                    <div id="Lista" className="tabela-localizacoes tabcontent" style={{ display: (this.state.tabLista ? "flex" : "none") }}>
                        <form className="teste" onSubmit={this.buscarItem.bind(this)}>
                            <label className="teste"> Buscar
                        <input className="teste" type="text" name="busca" value={this.state.busca} onChange={this.atualizaEstado.bind(this)} />
                            </label>
                            {/* <label> Buscar Data
                        <input type="date" name="buscaData" value={this.state.buscaData} onChange={this.atualizaEstado.bind(this)} />
                    </label> */}
                        </form>

                        <ul className="teste">
                            {
                                this.state.listaLocalizacoesFiltrada.map((localizacoes) => {
                                    return (
                                        <div className="teste">

                                            <li className="teste" key={localizacoes.id}>{localizacoes.id} - {localizacoes.nomePac} -
                                        {localizacoes.doenca} - {localizacoes.data} -
                                        {localizacoes.idade} - {localizacoes.nomeMed} -
                                        {localizacoes.especialidade} - {localizacoes.latitude} -
                                        {localizacoes.longitude} - {localizacoes.regiao}
                                                <button id={localizacoes.id} onClick={this.excluirPorId.bind(this)}>Excluir</button>
                                            </li>
                                        </div>
                                    )
                                })
                            }
                        </ul>
                        <button className="teste" onClick={this.excluirTodos.bind(this)} type="submit">EXCLUIR TODOS</button>
                    <div className="map" >
                        <Map 
                        style={{ width: '20vw' }}
                            google={this.props.google}
                            zoom={12}
                            
                            initialCenter={{ lat: -23.5504533, lng: -46.6514207 }}
                        >
                            {this.displayMarkers()}
                        </Map>
                    </div>
                    </div>
                </main>
            </div>
        )
    }
}

export default GoogleApiWrapper({
    apiKey: ("AIzaSyCy91RwWbR36h9iZufN4Kw6oedlbCUzVXU")
})(LocalizacoesIndex)