import React from 'react'
import './index.css'
import { IoPersonCircleOutline } from "react-icons/io5";
import { RiArrowDownSLine } from "react-icons/ri";
import { IoMenuOutline } from 'react-icons/io5';
import { Nav } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'

import { motion } from "framer-motion"

const Header = () => {
    const history = useHistory();

    const deslogar = (event) => {
        event.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('nome');

        history.push('/');
        history.go();
      }
    const renderHeader = () => {
        const token = localStorage.getItem('token')
        if (token === null) {
            return (
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start' }} >
                    <a href="/atendente/login">
                        Login
                    </a>

                </div>
            )
        } else {
            return (
                <div className='buttonHeader' style={{ marginBottom: '10px' }}>
                    <button style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                        <IoPersonCircleOutline style={{ color: 'white', fontSize: '40px' }} />
                        <b><RiArrowDownSLine style={{ color: 'white', fontSize: '40px' }} /></b>

                    </button>
                    <div class="dropdownConteudo">
                        <a href="#">Meus dados</a>
                        <a href="/fac">Perguntas Frequentes</a>
                        <a href="/status">Status</a>
                        <a onClick={event => deslogar(event)}>Sair da conta</a>

                    </div>
                </div>
            )

        }
    }
    const openNavDropDown = () => {
        let navdd = document.getElementById('idDivMenu');
        if (navdd.style.display == "flex") {
            navdd.style.display = "none";

        } else {
            navdd.style.display = "flex";

        }

    }
    const closeNavDropDown = () => {
        let navdd = document.getElementById('idDivMenu');
        navdd.style.display = "none";
    }
    return (

        <div className='header01'>
            <div className='header02'>

                <div className='posicionamento'>
                    <div className='headerImgLinks'>
                        <div className='logoLinxHeader' >
                            <a href="https://www.linx.com.br/">           <img src="https://media.discordapp.net/attachments/564238411280416773/840297621431910451/linx.png?width=201&height=133" alt="Logo linx" />
                            </a>
                        </div>
                        <div className='linksHeader'>
                            <div className='dropdown' >
                                <a href="https://www.linx.com.br/area-do-cliente-e-suporte/#menu1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>segmentos <b><RiArrowDownSLine style={{ color: 'white', fontSize: '20px' }} /></b> </a>
                                <motion.div class="dropdownConteudo" initial={{opacity: 0}} animate={{opacity: 1}}>
                                        <a href="https://www.linx.com.br/meios-de-pagamento/">Meios de pagamento</a>
                                        <a href="https://www.linx.com.br/mercadapp/">Infraestrutura/TI</a>
                                        <a href="https://www.linx.com.br/linx-commerce/">Analytics</a>
                                        <a href="https://www.linx.com.br/linx-commerce/">ERP e PDV</a>
                                        <a href="https://www.linx.com.br/linx-digital/">Linx digital</a>
                                        <a href="https://www.linx.com.br/linx-impulse/">Linx Conecta</a>
                                </motion.div>
                            </div>
                            <div className='dropdown'>
                                <a href="https://www.linx.com.br/area-do-cliente-e-suporte/#menu2" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>institucional <b><RiArrowDownSLine style={{ color: 'white', fontSize: '20px' }} /></b> </a>
                                <div class="dropdownConteudo">
                                    <a href="https://www.linx.com.br/quem-somos/">Quem somos</a>
                                    <a href="https://www.linx.com.br/imprensa/">Imprensa</a>
                                    <a href="https://www.linx.com.br/area-do-cliente-e-suporte/#canal-de-etica">Canal de ética</a>
                                    <a href="http://localhost:3000/crudDuvidas">Eventos Linx</a>
                                    <a href="https://www.linx.com.br/linx-service-partners/">Service partners</a>
                                    <a href="https://www.linx.com.br/clientes/">Clientes</a>
                                </div>
                            </div>
                            <div className='dropdown'>
                                <a href="https://www.linx.com.br/area-do-cliente-e-suporte/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>atendimento <b><RiArrowDownSLine style={{ color: 'white', fontSize: '20px' }} /></b> </a>
                                <div class="dropdownConteudo">
                                    <a href="/dashboard">Dashboard</a>
                                    <a href="/crudDuvidas">Adicionar FAQ</a>
                                    <a href="/crudBase">Adicionar Base</a>
                                    <a href="/faq">Perguntas frequentes</a>
                                    <a href="/baseconhecimento">Base de conhecimento</a>
                                </div>
                            </div>
                            <a href="/suporte">Suporte</a>
                            <div className='dropdown'>
                                {renderHeader()}

                            </div>                        </div>
                        <div id="openMenu">
                            <button className='botaoStyle' onClick={openNavDropDown}>
                                <IoMenuOutline className='tamIcon' style={{ color: 'white' }} />
                            </button>
                        </div>
                    </div>

                </div>
                <div id="idDivMenu">
                    <div className='navMobile'>
                        <Nav className='coluna'>
                            <div className='linksHeaderMobile'>
                                <div className='dropdown'>
                                    <a href="https://www.linx.com.br/">
                                        {renderHeader()}
                                    </a>
                                    <div class="dropdownConteudo">
                                        <a href="#">Meus dados</a>
                                        <a href="/fac">Perguntas Frequentes</a>
                                        <a href="/status">Status</a>
                                    </div>
                                </div>
                                <div className='dropdown'>
                                    <a href="https://www.linx.com.br/area-do-cliente-e-suporte/#menu2" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>segmentos <b><RiArrowDownSLine style={{ color: 'white', fontSize: '20px' }} /></b> </a>
                                    <div class="dropdownConteudo">
                                        <a href="https://www.linx.com.br/meios-de-pagamento/">Meios de pagamento</a>
                                        <a href="https://www.linx.com.br/mercadapp/">Infraestrutura/TI</a>
                                        <a href="https://www.linx.com.br/linx-commerce/">Analytics</a>
                                        <a href="https://www.linx.com.br/linx-commerce/">ERP e PDV</a>
                                        <a href="https://www.linx.com.br/linx-digital/">Linx digital</a>
                                        <a href="https://www.linx.com.br/linx-impulse/">Linx Conecta</a>
                                    </div>
                                </div>
                                <div className='dropdown'>
                                    <a href="" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>institucional <b><RiArrowDownSLine style={{ color: 'white', fontSize: '20px' }} /></b> </a>
                                    <div class="dropdownConteudo">
                                        <a href="https://www.linx.com.br/quem-somos/">Quem somos</a>
                                        <a href="https://www.linx.com.br/imprensa/">Imprensa</a>
                                        <a href="https://www.linx.com.br/area-do-cliente-e-suporte/#canal-de-etica">Canal de ética</a>
                                        <a href="/crudDuvidas">Adicionar Duvidas</a>
                                        <a href="https://www.linx.com.br/linx-service-partners/">Service partners</a>
                                        <a href="https://www.linx.com.br/clientes/">Clientes</a>
                                    </div>
                                </div>
                                <div className='dropdown'>
                                    <a href="" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>atendimento <b><RiArrowDownSLine style={{ color: 'white', fontSize: '20px' }} /></b> </a>
                                    <div class="dropdownConteudo">
                                        <a href="https://www.linx.com.br/area-do-cliente-e-suporte/#modal-products-financial">Financeiro</a>
                                        <a href="https://www.linx.com.br/area-do-cliente-e-suporte/#modal-products-support">Suporte</a>
                                        <a href="https://www.linx.com.br/area-do-cliente-e-suporte/#contact-us-modal">Fale conosco</a>
                                        <a href="/faq">Duvidas Frequentes</a>
                                    </div>
                                </div>
                                <a href="">blog</a>
                            </div>

                        </Nav>

                    </div>
                </div>

            </div>
        </div>
    )
}
export default Header;
