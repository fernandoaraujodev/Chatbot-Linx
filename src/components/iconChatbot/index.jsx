import React, { useState, useEffect } from 'react'
import { db, storage } from '../../utils/firebaseConfig';
import { IoPersonCircleOutline } from 'react-icons/io5'
import { RiArrowDownSLine } from "react-icons/ri";
import Chatbot from '../../components/chatbot/index';
import { VscHubot } from 'react-icons/vsc'
import { AiOutlineSend } from 'react-icons/ai'
import { BiArrowBack } from 'react-icons/bi'
import { GrClose } from 'react-icons/gr'

import './styles.css';
import Logo from '../../utils/img/logo.png'

import jwt_decode from 'jwt-decode'
import firebase from 'firebase/app';
import { useHistory } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"

const firestore = firebase.firestore();

const IconChatbot = () => {

    const history = useHistory();
    const uid = jwt_decode(localStorage.getItem('token')).user_id;
    const [atendimentos, setAtendimentos] = useState([])

    const [isHidden, setHidden] = useState(true)
    const [isHidden2, setHidden2] = useState(false)
    const [isHidden3, setHidden3] = useState(false)
    const [display, setDisplay] = useState('')

    useEffect(() => {
        historico();
        listarDuvidas();
    }, [])

    const historico = () => {
        const querySuporte = firestore.collection('Atendimentos').where('Cliente', '==', uid)
        .get()
              .then( result => {
                  const data = result.docs.map(doc => {
                      return doc.data()
                  })
                  setAtendimentos(data);
                  
                  return data;
    
              });
    }

    const seeHistory = (atend, event) => {
        event.preventDefault();
        // localStorage.setItem('chatuid', atend.uid);
    
        history.push('/chat/' + atend + '/replay')
    }

    const setComponent = (event) => {
        event.preventDefault();
        setHidden(!isHidden)
    }

    const setComponent2 = (event) => {
        event.preventDefault();
        setHidden2(!isHidden2)
    }
    const setComponent3 = (event) => {
        event.preventDefault();
        setHidden3(!isHidden3)
        setDisplay(
            {
                display: 'none',
            }
        )
    }

    const [duvidas, setDuvidas] = useState([]);

    const listarDuvidas = () => {
        try {
            db.collection('Duvidas')
                .orderBy("ordem", "desc").limit(2)
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

    function gotoFaq(e){
        e.preventDefault()
        history.push('/faq')
        history.go()
    }

    const containerVariants = {
        hidden : {
            opacity: 0,
        },
        visible : {
            opacity: 0,
            transition: { delay: 1.5, duration: 1.5 }
        },
        exit : {
            x: '-100vw',
            transition: { ease: 'easeInOut' }
        }
    }

    return (
        <AnimatePresence>
            <div className='chatbot' style={{
                display: 'block',
                zIndex: 999,
                position: 'fixed',
                transition: '0.5s',
                transformOrigin: 'right bottom',
                bottom: 32,
                top: 'initial',
                right: 32,
                left: 'initial',
            }}>
                {isHidden && 
                <motion.div 
                initial={{opacity: 0}}
                exit={{transition: { ease: 'easeInOut' }}}
                animate={{opacity: 1}}
                >
                    <button style={{
                        padding: 10,
                        borderRadius: 70,
                        width: 100,
                        height: 100,
                        backgroundColor: '#F37626',
                        alignItems: 'center',
                    }} onClick={(e) => setComponent(e)} >
                        <VscHubot style={{
                            width: 50,
                            height: 50,
                            color: 'white',
                        }} />
                    </button>
                </motion.div>
                }

                
                {!isHidden 
                && 
                <div>
                    
                    {!isHidden2 ? 
                    <motion.div 
                        className="firstBox"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        >
                        {/* <div className="firstBox"> */}
                            <div className="introductionBox">
                                <div className="logoClose">
                                    <img src={Logo} alt="" />
                                    <button onClick={(e) => setComponent(e)}><GrClose /></button>
                                </div>
                                <h2><strong>Oi, {localStorage.getItem('nome')}</strong></h2>
                                <h3>O nosso time de suporte atende das 8h às 22h. Só perguntar!</h3>
                            </div>
                            <div className="gotoChat" style={{background: '#6A3A7C', color: 'white'}}>
                                <h3>Iniciar uma conversa</h3>
                                <div className="gotoChatMain">
                                    <VscHubot style={{
                                        marginTop: 11,
                                        marginRight: 10,
                                        width: 40,
                                        height: 40,
                                        color: 'white',
                                    }} />
                                    <button className="gotoChatButton" onClick={(e) => setComponent2(e)}>Ir para o Chatbot</button>
                                </div>
                                <div className="gotoHistory">
                                    <button onClick={(e) => setComponent3(e)}> 
                                        <h3>Veja suas conversas</h3>
                                        <AiOutlineSend style={{
                                            width: 20,
                                            height: 20,
                                            marginTop: 11,
                                            marginLeft: 10,
                                        }}/>
                                    </button>
                                </div>
                                {isHidden3 &&
                                <div className="historicoItems">
                                    <div>
                                        {atendimentos && atendimentos.map(atnd => <button className="historicoItemChat" onClick={(e) => seeHistory(atnd.uid, e)}>
                                        <img src={atnd.atendentePfp} alt="Foto de perfil do(a) atendente"></img> 
                                        <h3>{atnd.NomeAtendente}</h3>
                                        </button>)
                                    }
                                    </div>
                                </div>
                                }
                            </div>
                            <div className="gotoChat" style={{background: '#F37626', color: 'white'}}>
                                <h3>Duvidas Frequentes</h3>


                                <div className='faqDuvidas'>
                                    {
                                        duvidas.map((item, index) => {

                                            return (
                                                <div className='divInfoDuvidas'>

                                                    <button onClick={() => openDescricao(item.id)} className='buttonDuvidas' id={'buttonDuvidas' + item.id}>
                                                        <div className='faqRow'>

                                                            <IoPersonCircleOutline className='tamIconPerson' />

                                                            <div>
                                                                <h5>{item.titulo}</h5>
                                                                <p id='criacaoDuvidas'>Post Criado em {item.dataCriacao}</p>

                                                            </div>
                                                        </div>
                                                        <RiArrowDownSLine className='tamIconArrow' />
                                                    </button>
                                                    <div className='openDescricao' id={'openDescricao' + item.id} style={{color: 'black'}} >
                                                        <p>{item.descricao} </p>

                                                    </div>
                                                </div>


                                            )
                                        })
                                    }


                                </div>

                                                
                                <button className="gotoChatButton" onClick={(e) => gotoFaq(e)}>Conferir mais duvidas</button>
                            </div>
                            
                        {/* </div> */}
                    </motion.div>
                    :
                    <Chatbot 
                    page="main" 
                    header={(
                            <div style={{
                                background: '#6A3A7C',
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: 10,
                                color: 'white',
                            }}>
                                <h2>Chatbot</h2>
                                <button onClick={(e) => setComponent2(e)} style={{
                                background: '#6A3A7C',
                                color: 'white',
                                fontSize: 'larger' 
                                }}>
                                    <BiArrowBack style={{
                                        width: 25,
                                        height: 25,
                                        color: 'white',
                                    }}/>
                                </button>
                            </div>
                        )}
                    />
                    
                    }
                    
                </div>
                }
            </div>    
        </AnimatePresence>
    )    
}

export default IconChatbot;