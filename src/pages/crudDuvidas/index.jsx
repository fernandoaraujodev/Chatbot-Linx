
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import firebase from 'firebase/app';

import './index.css';
import { db, storage } from '../../utils/firebaseConfig';
import { useToasts } from 'react-toast-notifications';

import Moderation from '../../utils/contentModerator'

//Components
import Header from '../../components/header'
import Footer from '../../components/footer'

const CrudDuvidas = () => {

    const { addToast } = useToasts();

    const [id, setId] = useState(0);
    const [titulo, setTitulo] = useState('');
    const [dataCriacao, setDataCriacao] = useState('');

    const [descricao, setDescricao] = useState('');
    const [duvidas, setDuvidas] = useState([]);

    function dataAtualFormatada() {
        var data = new Date(),
            hora = data.getHours().toString(),
            horaF = (hora.length == 1) ? '0' + hora : hora,
            minuto = data.getMinutes().toString(),
            minutoF = (minuto.length == 1) ? '0' + minuto : minuto,
            dia = data.getDate().toString(),
            diaF = (dia.length == 1) ? '0' + dia : dia,
            mes = (data.getMonth() + 1).toString(), //+1 pois no getMonth Janeiro começa com zero.
            mesF = (mes.length == 1) ? '0' + mes : mes,
            anoF = data.getFullYear();
        setDataCriacao(diaF + "/" + mesF + "/" + anoF  + " - " + horaF + ":" + minutoF  )
        return dataCriacao;
    }
    useEffect(() => {
        listarDuvidas();
        dataAtualFormatada();
    }, [])

    const listarDuvidas = () => {
        try {
            db.collection('Duvidas')
            .orderBy('ordem',`desc`)
    
            .get()
                .then((result) => {
                    const data = result.docs.map(doc => {
                        return {
                            id: doc.id,
                            titulo: doc.data().titulo,
                            descricao: doc.data().descricao,
                            dataCriacao: doc.data().dataCriacao,

                        }
                    })
                    setDuvidas(data);
                })
        }
        catch (error) {
            console.error(error)
        }
    }
    let time = firebase.firestore.Timestamp.now();

    const salvar = (event) => {
        event.preventDefault();

        if (Moderation(titulo + ' ' + descricao) == false) {
            addToast('Sua postagem contem palavras inapropriadas. Revise o seu texto.', { appearance: 'error', autoDismiss: true })
            return false;

        }

        const duvida = {
            titulo: titulo,
            descricao: descricao,
            dataCriacao: dataAtualFormatada(),
            ordem: time,

        }
        if (id === 0) {
            db.collection('Duvidas')
                .add(duvida)
                .then(() => {
                    addToast('Dúvida Cadastrada', { appearance: 'success', autoDismiss: true });
                    listarDuvidas();
                    limparCampos();
                })
                .catch(error => addToast(error, { appearance: 'error', autoDismiss: true })
                )

        }
        else {
            db.collection('Duvidas')
                .doc(id)
                .set(duvida)
                .then(() => {
                    addToast('Dúvida Alterada', { appearance: 'success', autoDismiss: true });
                    listarDuvidas();
                    limparCampos();
                })
                .catch(error => addToast(error, { appearance: 'error', autoDismiss: true })
                )

        }
    }

    const remover = (event) => {
        event.preventDefault();

        db.collection('Duvidas')
            .doc(event.target.value)
            .delete()
            .then(() => {
                addToast('Dúvida Removida', { appearance: 'success', autoDismiss: true });
                listarDuvidas();
            })
    }

    const editar = (event) => {
        event.preventDefault();
        try {
            db.collection('Duvidas')
                .doc(event.target.value)
                .get()
                .then(doc => {
                    setId(doc.id);
                    setTitulo(doc.data().titulo);
                    setDescricao(doc.data().descricao);
                    setDataCriacao(doc.data().dataCriacao)
                })
        }
        catch (error) {
            console.error(error)
            addToast(error, { appearance: 'error', autoDismiss: true });

        }
    }
    const limparCampos = () => {
        setId(0);
        setTitulo('');
        setDescricao('');
    }

    return (
        <div>
            <Header />
            <h2 className='tituloBase'>Dúvidas Frequentes</h2>

            <div className='main column'>
                <div className='caixaCrud posicionamento'>
                    <form className='formBase' onSubmit={event => salvar(event)}>
                        <label>
                            Título<input maxLength='50' className='inputCRUD outlined' value={titulo} onChange={event => setTitulo(event.target.value)} type="text" placeholder='Título da dúvida frequente' required />
                        </label>

                        <label className='inputTextCrud' >
                            Descrição<textarea maxLength='512'  required className='inputCRUD outlined' value={descricao} onChange={event => setDescricao(event.target.value)} type="text" placeholder='Qual é a solução da dúvida frequente?' />
                        </label>


                        <div className='botoes'>
                            <input className='submit1 outlined' type='submit' value='Publicar'></input>

                            <Link to="/faq">
                                <button className='submit1'>
                                    Visualizar as Dúvidas Frequentes
                                    </button>
                            </Link>
                        </div>
                    </form>

                </div>
                <div className='caixaCrud posicionamento'>
                    {
                        duvidas.map((item, index) => {
                            return (
                                <div className='cardCrudDuvidas'>
                                    <h6>{item.titulo}</h6>
                                    <p>{item.descricao}</p>
                                    <p className=''>Post Criado em {item.dataCriacao}</p>

                                    <button value={item.id} onClick={event => editar(event)} >Editar</button>
                                    <button style={{backgroundColor:'red', color:'white'}} value={item.id} onClick={event => remover(event)} >Remover</button>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <Footer />
        </div>
    )
}
export default CrudDuvidas;