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

const CrudBase = () => {
    const { addToast } = useToasts();

    const [id, setId] = useState(0);
    const [titulo, setTitulo] = useState('');
    const [tipo, setTipo] = useState('');
    const [dataCriacao, setDataCriacao] = useState('');

    const [descricao, setDescricao] = useState('');
    const [conhecimentos, setConhecimentos] = useState([]);
    function dataAtualFormatada() {
        var data = new Date(),
            hora = data.getHours().toString(),
            horaF = (hora.length == 1) ? '0' + hora : hora,
            minuto = data.getMinutes().toString(),
            minutoF = (minuto.length == 1) ? '0' + minuto : minuto,
            dia = data.getDate().toString(),
            diaF = (dia.length == 1) ? '0' + dia : dia,
            mes = (data.getMonth() + 1).toString(), //+1 pois no geMonth Janeiro começa com zero.
            mesF = (mes.length == 1) ? '0' + mes : mes,
            anoF = data.getFullYear();
        setDataCriacao(diaF + "/" + mesF + "/" + anoF + " - " + horaF + ":" + minutoF)
        listarConhecimentos()
        return dataCriacao;
    }
    useEffect(() => {
        listarConhecimentos();
        dataAtualFormatada();
    }, [])
    let time = firebase.firestore.Timestamp.now();

    const listarConhecimentos = () => {
        try {
            db.collection('Conhecimentos')
                .get()
                .then((result) => {
                    const data = result.docs.map(doc => {
                        return {
                            id: doc.id,
                            titulo: doc.data().titulo,
                            tipo: doc.data().tipo,
                            dataCriacao: doc.data().dataCriacao,
                            descricao: doc.data().descricao,
                        }
                    })
                    setConhecimentos(data);

                })

        }
        catch (error) {
            console.error(error)
        }

    }

    const salvar = (event) => {
        event.preventDefault();
        dataAtualFormatada();
        listarConhecimentos();

        if (Moderation(titulo + ' ' + descricao) == false) {
            addToast('Sua postagem contem palavras inapropriadas. Revise o seu texto.', { appearance: 'error', autoDismiss: true })
            return false;

        }

        const Conhecimento = {
            titulo: titulo,
            tipo: tipo,
            dataCriacao: dataAtualFormatada(),
            ordem: time,

            descricao: descricao,
        }
        if (id === 0) {
            db.collection('Conhecimentos')
                .add(Conhecimento)
                .then(() => {
                    addToast('Item Cadastrado', { appearance: 'success', autoDismiss: true });
                    listarConhecimentos();
                    limparCampos();
                })
                .catch(error => addToast(error, { appearance: 'error', autoDismiss: true })
                )
            listarConhecimentos();
            dataAtualFormatada()
        }
        else {
            db.collection('Conhecimentos')
                .doc(id)
                .set(Conhecimento)
                .then(() => {
                    addToast('Item Alterado', { appearance: 'success', autoDismiss: true });
                    listarConhecimentos();
                    limparCampos();
                })
                .catch(error => addToast(error, { appearance: 'error', autoDismiss: true })
                )
            listarConhecimentos();
            dataAtualFormatada()
        }
    }

    const remover = (event) => {
        event.preventDefault();

        db.collection('Conhecimentos')
            .doc(event.target.value)
            .delete()
            .then(() => {
                addToast('Item Removido', { appearance: 'success', autoDismiss: true });
                listarConhecimentos();
            })
    }

    const editar = (event) => {
        event.preventDefault();
        try {
            db.collection('Conhecimentos')
                .doc(event.target.value)
                .get()
                .then(doc => {
                    setId(doc.id);
                    setTitulo(doc.data().titulo);
                    setDescricao(doc.data().descricao);
                    setTipo(doc.data().tipo);
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
        setTipo('');

    }
    return (
        <div>
            <Header />
            <h2 className='tituloBase'>Base de Conhecimento</h2>
            <div className='main'>
                <div className='caixaCrud'>
                    <form className='formBase' onSubmit={salvar}>
                        <label>
                            Título<input maxLength='50' className='inputCRUD outlined' value={titulo} onChange={event => setTitulo(event.target.value)} type="text" placeholder='Título da sua dúvida' required />
                        </label>

                        <label>
                            Descrição<textarea maxLength='512' style={{ minWidth: '200px', padding: '20px', width: '400px', maxHeight: '400px', minHeight: '100px', maxWidth: '700px' }} required className='inputCRUD' value={descricao} onChange={event => setDescricao(event.target.value)} type="text" placeholder='Qual é a sua dúvida?' />
                        </label>

                        <label>Tipo
                                <select className='inputCRUD' value={tipo} onChange={event => setTipo(event.target.value)} required >
                                <option value="" disabled selected>Selecione uma opção</option>
                                <option value="duvida">Dúvida</option>
                                <option value="solucao">Soluções</option>
                                <option value="artigo">Artigos</option>
                            </select>
                        </label>


                        <div className='botoes'>
                            <input className='submit1 outlined' type='submit' value='Publicar'></input>

                            <Link to="/baseconhecimento">
                                <button className='submit1'>
                                    Visualizar base de conhecimento
                                    </button>
                            </Link>
                        </div>
                    </form>

                </div>
            </div>
            <Footer />
        </div>
    )
}
export default CrudBase;