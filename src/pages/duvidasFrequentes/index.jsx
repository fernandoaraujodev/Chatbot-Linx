import React, { useState, useEffect } from 'react';
import { db, storage } from '../../utils/firebaseConfig';

import { BsSearch, BsNewspaper } from 'react-icons/bs'
import './index.css'

import Chatbot from '../../components/chatbot/index';
import Kommunicate from '../../components/chatbot/kommunicate';
import jwt_decode from 'jwt-decode'

import Header from '../../components/header'
import Footer from '../../components/footer'
import { RiFilter2Fill } from 'react-icons/ri'
import { IoPersonCircleOutline } from 'react-icons/io5'
import { VscHubot } from 'react-icons/vsc'

import { RiArrowDownSLine } from "react-icons/ri";
import IconChatbot from '../../components/iconChatbot';

import { motion } from "framer-motion"

const DuvidasFrequentes = () => {

    const [duvidas, setDuvidas] = useState([]);

    useEffect(() => {
        listarDuvidas();
        loadDados();
    }, [])

    const loadDados = () =>{
        try{
          const cityRef = db.collection('Cadastros').doc(jwt_decode(localStorage.getItem('token')).user_id);
          const doc = cityRef.get()
            .then( result => {
                try {
                    localStorage.setItem('nome', result.data().Nome);
                } catch (error) {
                    console.log(error)
                    localStorage.setItem('nome', jwt_decode(localStorage.getItem('token')).name);
                }
              
    
            })
        } catch(error){
            console.log(error)
        }
    };

    const listarDuvidas = () => {
        try {
            db.collection('Duvidas')
                .orderBy('ordem', `desc`)
                .get()
                .then((result) => {
                    const data = result.docs.map(doc => {
                        return {
                            id: doc.id,
                            titulo: doc.data().titulo,
                            descricao: doc.data().descricao,
                            atendente: doc.data().atendente,
                            dataCriacao: doc.data().dataCriacao,

                        }
                    })
                    setDuvidas(data);
                })
        }
        catch (error) {
            console.error(error)
            setDuvidas('error');
        }
    }
    const openDescricao = (id) => {
        let acc = document.getElementById('openDescricao' + id);
        let butn = document.getElementById('buttonDuvidas' + id);
        if (acc.style.display == "flex") {
            acc.style.display = "none";
            butn.style.borderRadius = '10px'

        } else {
            acc.style.display = "flex";
            butn.style.marginBottom = '0'

            butn.style.borderBottomLeftRadius = '0px'
            butn.style.borderBottomRightRadius = '0px'

        }
    }

    const [formValueSearch, setFormValueSearch] = useState();

    const serchDuvidas = (event) => {
        event.preventDefault();

        try {
            console.log(formValueSearch)

            if (formValueSearch == null) {
                listarDuvidas();
            }

            const queryDuvidas = db.collection('Duvidas').where('titulo', '==', formValueSearch)
                .get()
                .then(result => {
                    const data = result.docs.map(doc => {
                        return doc.data()
                    })
                    setDuvidas(data);

                    return data;

                });

        } catch (error) {
            //   console.log(error)
        }
    }


    return (
        <motion.div 
            exit={{ opacity: 0 }}
            exit="exit"
        >
        <div>
            <Header />
            <IconChatbot />

            <div className='faq'>
                <div className='center'>

                    <h1>Dúvidas Frequentes</h1>
                    <div className='background'>
                        <div className='center'>
                            <div className='posicionamento '>
                                <div className='divPesquisa01'>
                                    <form className='divPesquisaFrequentes' onSubmit={serchDuvidas}>
                                        <input type="text" className='outlined' onChange={(e) => setFormValueSearch(e.target.value)} placeholder='Qual é sua dúvida?' />
                                        <button className='lupa' type="submit">
                                            <BsSearch style={{ fontSize: '40px' }} />

                                        </button>
                                    </form>
                                    <button className='filtro'>
                                        <RiFilter2Fill style={{ fontSize: '50px' }} />

                                    </button>
                                </div>
                                <div className='faqDuvidas'>
                                    {


                                        duvidas.map((item, index) => {
                                            if (duvidas != null) {
                                                return (
                                                    <div className='divInfoDuvidas'>

                                                        <button onClick={() => openDescricao(item.id)} className='buttonDuvidas' id={'buttonDuvidas' + item.id}>
                                                            <motion.div 
                                                            className='faqRow'
                                                            initial={{opacity: 0}}
                                                            animate={{opacity: 1}}
                                                            >

                                                                <IoPersonCircleOutline className='tamIconPerson' />

                                                                <div>
                                                                    <h5>{item.titulo}</h5>
                                                                    <p id='criacaoDuvidas'>Post Criado em {item.dataCriacao}</p>

                                                                </div>
                                                            </motion.div>
                                                            <RiArrowDownSLine className='tamIconArrow' />
                                                        </button>
                                                        <motion.div className='openDescricao' id={'openDescricao' + item.id} initial={{opacity: 0}} animate={{opacity: 1, y: 0,  transition: { delay: 0.5, duration: 2.0 }}}>
                                                            <p>{item.descricao} </p>

                                                        </motion.div>
                                                    </div>


                                                )
                                            } else if (duvidas.length === 0) {
                                                console.log(duvidas)
                                                return (
                                                    <div className='divInfoDuvidas'>

                                                        <h3>Para vizualizar os resultados, faça login.</h3>
                                                    </div>
                                                )

                                            }
                                            
                                            else {
                                                console.log(duvidas)
                                                return (
                                                    <div className='divInfoDuvidas'>

                                                        <h3>sem resultados</h3>
                                                    </div>
                                                )

                                            }
                                        })


                                    }



                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>


            <Footer />
        </div>
        </motion.div>
    )
}

export default DuvidasFrequentes;
