import React from 'react'
import {SiFacebook, SiInstagram, SiYoutube, SiLinkedin} from'react-icons/si'
import "./index.css"
const Footer = () => {
    return (
        <div className='totalFooter ' >

            <div className='content posicionamento'>
                <div className='cardFooterImg'>
                    <a href="https://www.linx.com.br/">     <img src="https://media.discordapp.net/attachments/741084889947832403/841318399563792384/imagem_2021-05-10_111745-removebg-preview.png" alt="" />
                    </a>
                </div>
                <div className='cardFooterLinks'>
                    <a href="https://www.linx.com.br/area-do-cliente-e-suporte/#contact-us-modal">Fale Conosco</a>
                    <a href="https://www.linx.com.br/quem-somos/">Quem somos</a>
                    <a href="https://www.linx.com.br/trabalhe-conosco/">Trabalhe conosco</a>
                    <a href="/">Serviços</a>



                </div>
                <div className='cardFooterLinks'>
                    <a href="https://www.linx.com.br/acessibilidade/">Acessibilidade</a>
                    <a href="/status">Status da Linx</a>
                    <a href="/faq">Dúvidas Frequentes</a>



                </div>
                <div className='cardFooterLinks'>
                    <a href="https://www.linx.com.br/area-do-cliente-e-suporte/">Suporte</a>
                    <a href="https://www.linx.com.br/imprensa/">Imprensa</a>
                    <a href="https://www.linx.com.br/area-do-cliente-e-suporte/#contact-us-modal">Autoatendimento</a>
                </div>

                <div className='cardFooterLinks cardFooterContentLinks' >
                    <div className='redesSociaisFooter'>
                        <a href="https://pt-br.facebook.com/linxretail/"><SiFacebook/ ></a>
                        <a href="https://www.instagram.com/linxretail/?hl=en"><SiInstagram /></a>
                        <a href="https://www.linkedin.com/company/linxretail"><SiLinkedin/></a>
                        <a href="https://www.youtube.com/channel/UCgy4D2ESnXSGPUwvi16tt8A"><SiYoutube/></a>

                    </div>
                    
                    <a href="tel:3003-0400">3003-0400</a>
                    <a href="comercial@linx.com.br">comercial@linx.com.br</a>
                </div>

            </div>
        </div>
    );
}

export default Footer;
