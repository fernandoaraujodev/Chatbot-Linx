import React, { useState, useEffect } from 'react'
import { BsChatDots, BsQuestionCircle, BsTools } from "react-icons/bs";
import { AiOutlinePhone, AiTwotoneCustomerService } from "react-icons/ai";
import { VscLoading } from "react-icons/vsc"

import { db } from '../../utils/firebaseConfig'
import { useHistory } from "react-router-dom";
import jwt_decode from 'jwt-decode'
import { useToasts } from 'react-toast-notifications';

import './index.css';
import { motion } from "framer-motion"

//Components
import Header from '../../components/header'
import Footer from '../../components/footer'

import firebase from 'firebase/app';
const auth = firebase.auth();

const Dashboard = () => {
    const history = useHistory();

    const uid = jwt_decode(localStorage.getItem('token')).user_id;
    const [nome, setNome] = useState('')

    const [chamadasTotais, setChamadas] = useState('')
    const [mensagens, setMensagens] = useState('')
    const [atendimentos, setAtendimentos] = useState('')
    const [duvidas, setDuvidas] = useState('')
    const [experiencias, setExperiencias] = useState([])

    const [atendimentoEspera, setAtendimentoEspera] = useState('')
    const {addToast} = useToasts();

    useEffect(() => {
        loadDados();
        getAtendimentos();
        // getMessages();
    }, [])

    const loadDados = () => {
        try {
            const cityRef = db.collection('Atendentes').doc(jwt_decode(localStorage.getItem('token')).user_id);
            const doc = cityRef.get()
                .then(result => {

                    setNome(result.data().Nome)
                    setChamadas(result.data().chamadas)
                    setMensagens(result.data().msgTotal)
                    setAtendimentos(result.data().atendimentosTotais)
                    setDuvidas(result.data().duvidasCadastradas)
                    setExperiencias(result.data().Experiencias)

                })
        } catch (error) {
            console.log(error)
        }
    };

    const getAtendimentos = () => {
        try {
            return db.collection('Atendimentos').where('concluido', '==', false).where('Atendente', '==', uid).limit(5)
                .get()
                .then(result => {
                    const data = result.docs.map(doc => {
                        // setUid(doc.id)
                        return {
                            uid: doc.id,
                            urgencia: doc.data().Urgencia,
                            assunto: doc.data().assunto,
                        }
                    })

                    // console.log(data[0])
                    setAtendimentoEspera(data[0]);

                    return data;
                });
        } catch (error) {
            console.log(error)
        }
    }

    const iniciarAtendimento = () => {
        // event.preventDefault()

        // sempre remove o item ao inicio
        localStorage.removeItem('stop');

        db.collection('Atendentes').doc(uid).update({
            Ativo: true,
        })

        async function search() {
            var i = 0;

            while (i < 10) {

                setTimeout(
                    async function () {

                        // verifica se o atendimento foi parado e deixa de rodar a busca
                        if (localStorage.getItem('stop') === "true") {
                            return;
                        }

                        const a = await getAtendimentos().then(a => {
                            // console.log(a)
                            // return [a.length, a[0]]; para classificar o primeiro atendimento

                            let result = a.sort(compare); // classifica por urgencia
                            return [a.length, result];
                        }
                        )

                        // sort por urgencia --> retorna a array ordenada
                        function compare(a, b) {
                            if (a.urgencia < b.urgencia) {
                                return 1;
                            }
                            if (a.urgencia > b.urgencia) {
                                return -1;
                            }
                            return 0;
                        }

                        console.log(a)
                        if (a[0] > 0) {
                            db.collection('Atendentes').doc(uid).update({
                                emAtendimento: true,
                            })

                            await db.collection('Mensagens').add({
                                text: "Bem-vindo ao suporte da Linx!",
                                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                                uid,
                                atendimento: a[1][0].uid,
                                sender: localStorage.getItem('nome'),
                            })

                            await db.collection('Mensagens').add({
                                text: "Seu número de protocolo é " + a[1][0].uid,
                                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                                uid,
                                atendimento: a[1][0].uid,
                                sender: localStorage.getItem('nome'),
                            })

                            // verifica se há assunto no atendimento
                            if(a[1][0].assunto !== 1 || !a[1][0].assunto || a[1][0].assunto == undefined){
                                await db.collection('Mensagens').add({
                                    text: "Sua dúvida é: " + a[1][0].assunto,
                                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                                    uid,
                                    atendimento: a[1][0].uid,
                                    sender: localStorage.getItem('nome'),
                                })
                            }
                            

                            // console.log('funciono')
                            addToast('Um atendimento foi solicitado! Você será redirecionado em instantes...', {appearance:'info', autoDismiss : true});

                            setTimeout(function () {
                                history.push('/chat/' + a[1][0].uid)
                                history.go();

                            }, 2000)

                            i = 100;

                            return 'a';
                        }
                        else {
                            console.log('Nenhum atendimento foi encontrado...')
                        }

                    }, 5000 * i);
                i++;
            }
        };

        search();

    };

    const fecharAtendimento = () => {
        setComponent()
        localStorage.setItem('stop', "true")

        db.collection('Atendentes').doc(uid).update({
            Ativo: false,
        })

    }

    const [isHidden, setHidden] = useState(true)
    const [confirmedSuporte, setConfirmedSuporte] = useState(true)

    const setComponent = () => {
        if (isHidden == true) {
            setHidden(false)
        }
        else {
            setHidden(true)
        }

    }

    function handleButtonOpen() {
        setComponent();
        iniciarAtendimento();
    }
    function handleButtonClose() {
        setComponent();
        fecharAtendimento();
    }

    return (
        <div>
            <Header />

                    <div className='dashAtendente'>
                        <div className='tituloDash'>
                            <h2 style={{ fontWeight: '500', fontSize: '35px' }}>Visão Geral do Atendente</h2>
                            <h4 style={{ fontWeight: '500', fontSize: '25px' }}>{nome}</h4>
                        </div>

                        <form>
                            <div className='buttonDash'>
                                {isHidden && <motion.button animate={{opacity: 1}} initial={{opacity: 0}} className="btn">
                                    <h6>atendimento fechado</h6>
                                </motion.button>}
                                {!isHidden && <motion.button animate={{opacity: 1}} initial={{opacity: 0}} className="btn" style={{ background: 'green' }}>
                                    <h6>atendimento aberto</h6>
                                </motion.button>}
                            </div>
                        </form>
                    </div>

                    <div className='main'>
                        <div className='cardsDashboard'>
                            <div className='dupla1'>
                                <div className='CardDash'>
                                    <button className='buttonCard'>
                                        <AiOutlinePhone style={{ fontSize: '82px', color: 'white' }} />
                                        <div>
                                            <h4>{chamadasTotais}</h4>
                                            <h5>Chamadas efetuadas</h5>
                                        </div>
                                    </button>
                                </div>

                                <div className='CardDash'>
                                    <a href="/baseconhecimento" action="">
                                        <button className='buttonCard'>
                                            <BsChatDots style={{ fontSize: '82px', color: 'white' }} />
                                            <div>
                                                <h4>{mensagens}</h4>
                                                <h5>Mensagens enviadas</h5>
                                            </div>
                                        </button>
                                    </a>
                                </div>
                            </div>

                            <div className='dupla2'>
                                <div className='CardDash'>
                                    <button className='buttonCard'>
                                        <AiTwotoneCustomerService style={{ fontSize: '82px', color: 'white' }} />
                                        <div>
                                            <h4>{atendimentos}</h4>
                                            <h5>Atendimentos efetuados</h5>
                                        </div>
                                    </button>
                                </div>

                                <div className='CardDash'>
                                    <a href="/baseconhecimento" action="">
                                        <button className='buttonCard'>
                                            <BsQuestionCircle style={{ fontSize: '82px', color: 'white' }} />
                                            <div>
                                                <h4 animate={{opacity: 1}} initial={{opacity: 0}}>{duvidas}</h4>
                                                <h5>Dúvidas cadastradas</h5>
                                            </div>
                                        </button>
                                    </a>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className='classdabolinha'>
                        <div className='bolinha'></div>
                    </div>

                    <div className='conteudo1'>
                        <div className='suporteBoard'>
                            {isHidden &&
                                <div className='iniciarSuporte'>
                                    <div className='tools'>
                                        <motion.div animate={{opacity: 1}} initial={{opacity: 0}} className='ferramenta'>
                                            <h4 style={{ fontSize: '40px', fontWeight: '500' }}>
                                                Comece o suporte!
                                            </h4>
                                            <BsTools style={{ fontSize: '30px', margin: '30px' }} />
                                        </motion.div>

                                        <h5 style={{ fontSize: '24px', fontWeight: '500', height: '40%' }}>
                                            Entre em espera para novos atendimento
                                        </h5>

                                        <button className='buttonIniciar' onClick={handleButtonOpen}>
                                            Iniciar
                                        </button>
                                    </div>
                                </div>}

                            {!isHidden &&
                                <div className='iniciarSuporte'>
                                    <motion.div animate={{opacity: 1}} initial={{opacity: 0}} className='tools'>
                                        <div className='ferramenta'>
                                            <h4 style={{ fontSize: '40px', fontWeight: '500' }}>Em espera...</h4>
                                            <VscLoading style={{ fontSize: '30px', margin: '30px' }} />

                                        </div>
                                        <h5 style={{ fontSize: '24px', fontWeight: '500', height: '40%' }}>Assim que uma novo atendimento for iniciado, você será redirecionado.</h5>

                                        {confirmedSuporte &&
                                            <button className='buttonIniciar' onClick={handleButtonClose}>{/* tirar o nome botaoiniciar */}
                                                Fechar Atendimento
                                            </button>
                                        }
                                    </motion.div>
                                </div>}
                        </div>


                        <div className='expeBoard'>
                            <h4 style={{ fontSize: '35px', fontWeight: '500', marginTop: '30px' }}>
                                Suas experiências são em:
                            </h4>

                            <div className='experiencias'>
                                <div className='expeCard'>
                                    <a href="https://www.linx.com.br/mercadapp/">
                                        <button className='buttonConteudo1'>
                                            {experiencias[0]}
                                        </button>
                                    </a>

                                    <a href="https://www.linx.com.br/linx-bridge/">
                                        <button className='buttonConteudo1'>
                                            {experiencias[1]}
                                        </button>
                                    </a>
                                </div>

                                <div className='expeCard'>
                                    <a href="https://www.linx.com.br/e-commerce/">
                                        <button className='buttonConteudo1'>
                                            {experiencias[2]}
                                        </button>
                                    </a>

                                    <a href="https://www.linx.com.br/linx-digital/">
                                        <button className='buttonConteudo1'>
                                            {experiencias[3]}
                                        </button>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='conteudo2'>
                        <div className='boardBase'>
                            <div className='margens2'>
                                <h4 style={{ fontSize: '40px', fontWeight: '500' }}>
                                    Base de Conhecimento
                                </h4>
                                <h5 style={{ fontSize: '20px', fontWeight: '500' }}>
                                    Aprimore seus conhecimentos
                                    e experiências para
                                    novos <br />atendimentos
                                </h5>

                                <a href="/baseconhecimento">
                                    <button className='buttonConteudo2'>
                                        Acessar Base de conhecimento
                                    </button>
                                </a>
                            </div>
                        </div>

                        <div className='boardDuvidas'>
                            <div className='margens2'>
                                <h4 style={{ fontSize: '40px', fontWeight: '500' }}>
                                    Dúvidas Frequentes
                                </h4>
                                <h5 style={{ fontSize: '20px', fontWeight: '500' }}>
                                    Adicione e altere os problemas
                                    mais ocorrentes e  <br />suas soluções
                                </h5>

                                <a href="/duvidasfrequentes">
                                    <button className='buttonConteudo2'>
                                        Acessar as Perguntas Frequentes
                                    </button>
                                </a>
                            </div>
                        </div>
                    </div>
            <Footer />
        </div>
    )
}
export default Dashboard;
