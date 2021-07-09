import React, { useState, useEffect } from 'react';

import Header from '../../components/header'
import Footer from '../../components/footer'
import { BsSearch, BsNewspaper } from 'react-icons/bs'
import { IoBulbOutline } from 'react-icons/io5'
import { BiQuestionMark } from "react-icons/bi";
import { RiArrowDownSLine } from "react-icons/ri";
import { db, storage } from '../../utils/firebaseConfig';
import { Form, Button } from 'react-bootstrap';

import './index.css'

import { useFirebaseApp } from 'reactfire';

import { motion } from "framer-motion"

const BaseConhecimento = () => {
    const [conhecimentos, setConhecimentos] = useState([]);
    const [filtro, setFiltrado] = useState([]);
    const [texto, setTexto] = useState('');

    useEffect(() => {
        listarDuvidas();
    }, [])

    const listarFiltrado = (event, texto) => {
        event.preventDefault();

        db.collection('Conhecimentos')
            .orderBy('ordem', 'desc')
            .startAt(texto)
            .endAt(texto + '\uf8ff')
            .then((result) => {
                const data = result.docs.map(doc => {
                    return {
                        id: doc.id,
                        titulo: doc.data().titulo,
                        descricao: doc.data().descricao,
                        tipo: doc.data().tipo,
                        dataCriacao: doc.data().dataCriacao,

                    }
                })
                setConhecimentos(data);

            })


    }

    // Filtra dentro do array conhecimentos a quantidade de objetos com os respectivos valores
    let duvidaLength = 0
    let solucaoLength = 0
    let artigoLength = 0
    conhecimentos.map((item, index) => {
        if (item.tipo === 'duvida') {
            duvidaLength++

        } else if (item.tipo === 'solucao') {
            solucaoLength++
        } else if (item.tipo === 'artigo') {
            artigoLength++
        }
    })


    const listarDuvidas = () => {
        try {
            db.collection('Conhecimentos')
                .orderBy('ordem', `desc`)
                .get()
                .then((result) => {
                    const data = result.docs.map(doc => {
                        return {
                            id: doc.id,
                            titulo: doc.data().titulo,
                            descricao: doc.data().descricao,
                            tipo: doc.data().tipo,
                            dataCriacao: doc.data().dataCriacao,

                        }
                    })
                    setConhecimentos(data);

                })
        }
        catch (error) {
            console.error(error)
        }
    }
    const openDescricao = (id) => {
        let acc = document.getElementById('openDescricao' + id);
        let butn = document.getElementById('buttonDuvidas' + id);
        if (acc.style.display == "flex") {
            acc.style.display = "none";
            butn.style.borderRadius = '10px'
            butn.style.width = '100%';
            butn.style.marginBottom = '20px'




        } else {
            acc.style.display = "flex";
            butn.style.borderBottomLeftRadius = '0px'
            butn.style.borderBottomRightRadius = '0px'
            butn.style.width = '100%'
            butn.style.marginTop = '0'
            butn.style.marginBottom = '0'

        }

    }
    return (
        <div>
            <Header />
            <div className='main' >
                <div style={{ backgroundColor: 'white' }} className='posicionamento ' >
                    <div className='bannerBase '>
                        <div className='opacity'>
                            <div className='bannerBaseAux'>
                                <h2>Aqui a sua experiência tem valor!</h2>
                            </div>

                            {/* <form style={{ marginTop: '20px' }} onSubmit={event => listarFiltrado(event, texto)} className='divPesquisa'>
                                <div>
                                    <input type="text" value={texto} onChange={event => setTexto(event.target.value)} placeholder='Qual solução você procura?' />


                                </div>

                                <Button className={'marginMobile'} style={{ backgroundColor: 'white', border: 'none' }} type="submit" >
                                    <p className='buttonPrincipal' >
                                        <BsSearch style={{ fontSize: '40px' }} />

                                    </p>
                                </Button>
                            </form> */}
                            <form style={{ marginTop: '20px' }} className='divPesquisa' action="">
                                <button className='lupa'>
                                    <BsSearch style={{ fontSize: '40px' }} />

                                </button>

                                <input type="text" placeholder='Qual solução você procura?' />
                            </form>
                        </div>


                    </div>
                    <div className='cardsBase'>
                        <a href='#artigos' className='cardBase'>
                            <BsNewspaper style={{ fontSize: '90px', color: 'white' }} />
                            <div>
                                <h4>{artigoLength}</h4>

                                <h5>artigos</h5>
                            </div>
                        </a>
                        <a href='#solucoes' className='cardBase roxo'>
                            <IoBulbOutline style={{ fontSize: '90px', color: 'white' }} />
                            <div>
                                <h4>{solucaoLength}</h4>
                                <h5>soluções</h5>
                            </div>
                        </a>
                        <a href='#duvidas' className='cardBase'>
                            <BiQuestionMark style={{ fontSize: '90px', color: 'white' }} />
                            <div>
                                <h4>{duvidaLength}</h4>
                                <h5>dúvidas</h5>
                            </div>
                        </a>
                    </div>
                    <div>

                    </div>
                    <div style={{ marginBottom: '50px' }}>

                        <div id='solucoes' className='solucoes'>
                            <h2>soluções</h2>
                            {
                                conhecimentos.map((item, index) => {
                                    if (item.tipo == 'solucao') {
                                        return (

                                            <div className='divCards'>

                                                <button onClick={() => openDescricao(item.id)} className='buttonDuvidas' id={'buttonDuvidas' + item.id}>
                                                    <h6>{item.titulo}</h6>
                                                    <div>
                                                        <RiArrowDownSLine style={{ color: 'black', fontSize: '50px' }} />

                                                    </div>
                                                </button>
                                                <div className='openDescricaoConhecimentos' id={'openDescricao' + item.id} >
                                                    <p>{item.descricao} </p>
                                                    <p id='criacao'>Post Criado em {item.dataCriacao}</p>
                                                </div>
                                            </div>


                                        )
                                    } else {
                                        return (
                                            <div style={{ display: 'none' }}>

                                            </div>
                                        )
                                    }
                                })

                            }
                        </div>
                        <div id='artigos' className='artigos'>
                            <h2>artigos</h2>
                            {
                                conhecimentos.map((item, index) => {
                                    if (item.tipo == 'artigo') {
                                        return (

                                            <div className='divCards'>
                                                <button onClick={() => openDescricao(item.id)} className='buttonDuvidas' id={'buttonDuvidas' + item.id}>
                                                    <h6>{item.titulo}</h6>
                                                    <div>
                                                        <RiArrowDownSLine style={{ color: 'black', fontSize: '50px' }} />

                                                    </div>    </button>
                                                <div className='openDescricaoConhecimentos' id={'openDescricao' + item.id} >
                                                    <p>{item.descricao} </p>
                                                    <p id='criacao'>Post Criado em {item.dataCriacao}</p>

                                                </div>
                                            </div>


                                        )
                                    } else {
                                        return (
                                            <div style={{ display: 'none' }}>

                                            </div>
                                        )
                                    }
                                })

                            }
                        </div>
                        <div id='duvidas' className='duvidas'>
                            <h2>dúvidas</h2>
                            {
                                conhecimentos.map((item, index) => {
                                    if (item.tipo == 'duvida') {
                                        return (

                                            <div className='divCards'>
                                                <button onClick={() => openDescricao(item.id)} className='buttonDuvidas' id={'buttonDuvidas' + item.id}>
                                                    <h6>{item.titulo}</h6>
                                                    <div>
                                                        <RiArrowDownSLine style={{ color: 'black', fontSize: '50px' }} />

                                                    </div>
                                                </button>
                                                <div className='openDescricaoConhecimentos' id={'openDescricao' + item.id} >
                                                    <p>{item.descricao} </p>

                                                </div>
                                            </div>


                                        )
                                    } else {
                                        return (
                                            <div style={{ display: 'none' }}>

                                            </div>
                                        )
                                    }
                                })

                            }

                        </div>
                    </div>

                </div>
            </div>
            <Footer />
        </div>
    )
}
export default BaseConhecimento