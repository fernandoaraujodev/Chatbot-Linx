import React from 'react'
import { BsWifi, BsCheckAll } from "react-icons/bs";
import './index.css';
//Components
import Header from '../../components/header'
import Footer from '../../components/footer'
import IconChatbot from '../../components/iconChatbot'

const Status = () => {
    return (
        <div>
            <Header />
            <IconChatbot />
            <div className='main paddingH1'>
                <h2 className='tituloStatus'>Status da Linx</h2>
                <BsWifi className='wifiIcon' style={{ fontSize: '40px', color: 'black' }} />
            </div>

            <div className='divMainStts'>

                <div className='posicionamento'>


                    <div className='fundoStatus'>

                        <div className='caixasStatus'>
                            <div className='status'>
                                <BsCheckAll className='check' style={{ fontSize: '35px', color: '#F69204' }} />
                                <h4>Todos os serviços estão funcionando normalmente </h4>
                            </div>

                            <div className='statusCards'>
                                <div className='normal'></div>
                                <h4>Suporte ao Cliente</h4>
                            </div>

                            <div className='statusCards'>
                                <div className='normal'></div>
                                <h4>Acessibilidade (Em libras)</h4>
                            </div>

                            <div className='statusCards'>
                                <div className='normal'></div>
                                <h4>Acessibilidade (Visual)</h4>
                            </div>
                        </div>



                        <div className='guiaStatus'>
                            <div className='itemStatus'>
                                <div className='normal'></div>
                                <h4>Funcionando Normalmente</h4>
                            </div>

                            <div className='itemStatus'>
                                <div className='limitado'></div>
                                <h4>Funcionamento Limitado</h4>
                            </div>

                            <div className='itemStatus'>
                                <div className='parado'></div>
                                <h4>Funcionamento Interrompido</h4>
                            </div>
                        </div>

                    </div>

                </div>

            </div>

            <Footer />
        </div>
    )
}
export default Status;