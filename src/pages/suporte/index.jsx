import React, { useState } from 'react'
import { Link } from "react-router-dom";
import { useFirebaseApp } from 'reactfire';
import { useHistory } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import jwtEncode from 'jwt-encode'
//icons
import { AiOutlineMail } from "react-icons/ai";
import { HiOutlineChatAlt2 } from "react-icons/hi";
import { FaMapMarkerAlt } from "react-icons/fa";
//components
import Header from '../../components/header'
import Footer from '../../components/footer'
import IconChatbotLogin from '../../components/iconChatbotLogin';
import './index.css';

import { motion } from "framer-motion"

const Suporte = () => {
    const firebase = useFirebaseApp();
    const history = useHistory();

    const { addToast } = useToasts();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const logar = (event) => {
        event.preventDefault();
        const secretToken = 'secretToken';

        firebase.auth().signInWithEmailAndPassword(email, senha)
            .then(result => {
                let userToken = {
                    user_id : result.user.uid,
                    name : result.user.name,
                    email : result.user.email,
                    role: "comum"
                }

                const jwt = jwtEncode(userToken, secretToken);
                localStorage.setItem('token', jwt)

                addToast('Seja bem-vindo', { appearance: 'success', autoDismiss: true });
                history.push('/faq');
            })
            .catch(error => {
                addToast('Email ou senha inválidos', { appearance: 'error', autoDismiss: true });
                // console.error(error);
            })
    }

    

    return (
        <div>
            <Header />
            <IconChatbotLogin />
            <div className='totalSuporte'>

                <div className=' posicionamento '>

                    <div className='margensSuporte'>
                        <div className='conteudoSuporte1'>
                            <div className='tituloAreaCliente'>
                                <h1 style={{ color: '#48185B', fontSize: '43px' }} >
                                    Área do cliente <br /> e suporte
                                </h1>
                                <img src="https://www.linx.com.br/app/themes/linx/webpack/dist/images/title/adornment-line.png"></img>
                            </div>

                            <div className='tamanhoPortal'>
                                <h1 style={{ color: '#6A3A7C', fontSize: '35px' }}>
                                    Portal do cliente e área restrita
                                </h1>

                                <p style={{ marginTop: '15px', marginBottom: '15px', fontSize: '18px' }}>
                                    Seja bem-vindo à área do cliente Linx. Nesse ambiente,
                                    você pode resolver assuntos financeiros,
                                    solicitar chave de acesso aos sistemas,
                                    efetuar downloads de documentos e muito mais.
                                </p>

                                {/* <a style={{ color: 'purple', fontSize: '18px' }} href="#">
                                    Ainda não possui acesso?
                                </a> */}
                            </div>

                            <div className='loginTotal'>
                                <form onSubmit={event => logar(event)}> 
                                    <div className='loginSuporte'>
                                        <label>E-mail</label>
                                        <input className='inputSuporte outlined' type="text" value={email} onChange={event => setEmail(event.target.value)} placeholder="Digite seu e-mail aqui" required /> <br />
                                    </div>

                                    <div className='loginSuporte' >
                                        <label>Senha</label>
                                        <input className='inputSuporte outlined' type="password" value={senha} onChange={event => setSenha(event.target.value)} placeholder="Digite sua senha aqui" required /> <br />
                                    </div>

                                    <button type="submit" className='butaoSuporte'  >
                                        <p >Entrar </p>
                                    </button>
                                </form>

                                <div style={{ color: 'purple', marginTop: '15px' }}>
                                    <p><a href="">Esqueceu sua senha?</a></p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='suporteAtendimento'>
                        <div className='margensAtendimento'>
                            <div className='titulosSuporte'>
                                <h1 style={{ color: '#6A3A7C' }}>
                                    Atendimento
                                </h1>

                                <h3>
                                    Selecione o  serviço de
                                    atendimente que melhor se
                                    encaixa no seu problema/dúvida:
                                </h3>
                            </div>

                            <div className='guiaSuporte'>
                                <div className='exemploChat'>
                                    <img src="/foto_chatbot.png"></img>
                                </div>

                                <div className='blocosSuporte1'>
                                    <div className='bloco1'>
                                        <div className='conteudo2Suporte'>
                                            <h2 style={{ color: '#6A3A7C', marginBottom: '13px' }}>
                                                Fale conosco
                                            </h2>
                                            <img src="/chatIcon.png"></img>
                                        </div>
                                        <p>Por este canal, você pode conversar com o nosso time de atendimento e fazer:</p>

                                        <ul style={{ marginLeft: '40px', marginBottom: '10px', marginTop: '10px' }}>
                                            <li>Sugestões</li>
                                            <li>Elogios</li>
                                            <li>Reclamações</li>
                                        </ul>
                                        <p>Envie sua mensagem para o nosso time</p>

                                        <Link to="https://www.linx.com.br/area-do-cliente-e-suporte/#contact-us-modal">
                                            <button className='botaoSuporte2'>
                                                Enviar
                                            </button>
                                        </Link>
                                    </div>

                                    <div className='bloco1'>
                                        <div className='conteudo2Suporte'>
                                            <h2 style={{ color: '#6A3A7C', marginBottom: '13px' }}>
                                                Suporte
                                            </h2>
                                            <img src="/atendimentoIcon.png"></img>
                                        </div>
                                        <p>Precisa de ajuda? Fale diretamente com a área do seu produto ou acesse o Portal do cliente.</p>

                                        <ul style={{ marginLeft: '40px', marginBottom: '10px', marginTop: '10px' }}>
                                            <li>Acesso ao Portal do Cliente</li>
                                            <li>Telefones e Suporte</li>
                                            <li>Abertura de chamados </li>
                                        </ul>
                                        <p>Para acessar essas áreas do cliente:</p>

                                        <Link to="https://www.linx.com.br/area-do-cliente-e-suporte/#modal-products-support">
                                            <button className='botaoSuporte2'>
                                                Selecione
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='margensConteudo3'>
                        <div className='titulosSuporte'>
                            <h1 style={{ color: '#6A3A7C' }}>
                                Dúvidas
                            </h1>

                            <h3>
                                Estamos aqui para te ajudar a ter
                                a melhor experiência. Escolha a
                                solução ideal e tire dúvidas sobre
                                produtos, serviços, navegação
                                no site e mais:
                            </h3>
                        </div>

                        <div className='duvidasconteudo3'>
                            <div className='guiaDuvidas'>
                                <div>
                                    
                                    <div className="guiaDuvidas-titulo">
                                        <FaMapMarkerAlt style={{ fontSize: '32px', color: '#6A3A7C', backgroundColor: '#fff' }} />
                                        <a style={{ color: 'purple', fontSize: '18px', marginLeft: '10px' }} href="https://www.linx.com.br/mapa-do-site/">
                                            Acesse o mapa do site
                                        </a>
                                    </div>

                                    <p>
                                        Veja a lista completa de todas as páginas
                                    </p>
                                </div>

                                <div>
                                    <div className="guiaDuvidas-titulo">
                                        <HiOutlineChatAlt2 style={{ fontSize: '35px', color: '#6A3A7C', backgroundColor: '#fff' }} />
                                        <a style={{ color: 'purple', fontSize: '18px', marginLeft: '10px' }} href="/chat">
                                            Chat online
                                        </a>
                                    </div>
                                    
                                    <p>
                                        Converse com nossos atendentes
                                    </p>
                                </div>

                                <div>
                                    <div className="guiaDuvidas-titulo">
                                        <AiOutlineMail style={{ fontSize: '35px', color: '#6A3A7C', backgroundColor: '#fff' }} />
                                        <a style={{ color: 'purple', fontSize: '18px', marginLeft: '10px' }} href="https://www.linx.com.br/area-do-cliente-e-suporte/#contact-us-modal">
                                            Fale conosco
                                        </a>
                                    </div>
                                    
                                    <p>
                                        Utilize esse canal para envio
                                        de sugestões, elogios e
                                        reclamações
                                    </p>
                                </div>
                            </div>

                            <div className='blocoDuvidas3'>
                                <h1 style={{ color: '#6A3A7C', height: '90px' }}>
                                    Status da Linx
                                </h1>
                                <p style={{ height: '80px' }}>
                                    Quer ver se nossos serviços
                                    estão funcionando normalmente?
                                </p>
                                <Link to="/status">
                                    <button className='botaoduvidas'>
                                        Acesse
                                    </button>
                                </Link>
                            </div>

                            <div className='blocoDuvidas3'>
                                <div className='blocofaq3'>
                                    <h1 style={{ color: '#6A3A7C', height: '90px' }}>
                                        Perguntas frequentes
                                    </h1>
                                    <img src="/duvidasIcon.png"></img>
                                </div>
                                <p style={{ height: '80px' }}>
                                    Tire suas dúvidas.
                                    Caso sua questão não esteja
                                    respondida nesse canal,
                                    Olhe nosso canal de perguntas já feitas
                                </p>
                                <Link to="/faq">
                                    <button className='botaoduvidas'>
                                        Confira
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <Footer />
        </div>
    )
}
export default Suporte;