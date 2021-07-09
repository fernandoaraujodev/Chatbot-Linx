import React from 'react'
import Header from '../../components/header'
import Footer from '../../components/footer'
import './index.css'

const NaoEncontrada = () => {
    return (
        <div className='backgroundC' >
            <Header />
            <div className=' centerNotFound'>
                <div className='posicionamento center'>

                    <div className="container container-404">
                        <div className="container-divs">
                            <img className='container-img' src="https://cdn.iconscout.com/icon/free/png-512/404-page-not-found-456876.png " alt="" />
                        </div>
                        <div className="container-divs">
                            <p className="texto">Página Não Encontrada</p>
                            <a href="/" className="texto">Por Favor, Volte à nossa página inicial</a>
                        </div>
                    </div>
                </div>
            </div>

            <div className='footer'>
                <Footer />

            </div>

        </div>
    )
}

export default NaoEncontrada;