import React, {useState} from 'react'
import './index.css'
import Header from '../../../components/header'
import Footer from '../../../components/footer'
import { Container, Form, Button } from 'react-bootstrap';
import ImagemLogin from '../../../utils/img/imagemLogin.svg'
import { useFirebaseApp } from 'reactfire';
import { useHistory } from 'react-router-dom';
import { db, storage } from '../../../utils/firebaseConfig';
import jwtEncode from 'jwt-encode'

import { useToasts } from 'react-toast-notifications';
const Login = () => {
    const firebase = useFirebaseApp();
    const history = useHistory();

    const {addToast} = useToasts();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const logar = (event) => {
        event.preventDefault();
        const secretToken = 'secretToken';

        firebase.auth().signInWithEmailAndPassword(email, senha)
            .then(result => {
                db.collection('Atendentes')
                    .doc(result.user.uid)
                    .get()
                    .then(doc => {
                    let url = '';
                    let userToken = {
                        user_id : result.user.uid,
                        name : doc.data().Nome,
                        email : result.user.email
                    }

                    if (doc.exists) {
                        userToken.role = "admin"
                    } else {
                        userToken.role = "comum"
                    }

                    const jwt = jwtEncode(userToken, secretToken);
                    localStorage.setItem('token', jwt)
                    })
                .catch(error => {
                    console.log(error)
                })
                // db.collection('usuarios').doc(result.user.uid).get().then(user => {console.log(user.data());} );
                // localStorage.setItem('token', result.user.za);                
                addToast('Seja bem-vindo', {appearance:'success', autoDismiss : true});
                setTimeout(function(){
                    history.push('/dashboard');
                    history.go()
  
                  }, 2000)
                
            })
            .catch(error => {
                addToast('Email ou senha inválidos', {appearance:'error', autoDismiss : true});
                console.error(error);
            })
    }
    return (
        <div className='login'>
            <Header />
            <div className='loginPosicao'>
                <div className='posicionamento loginPosicao ' >
                    <div id='logoLinx'>
                        <img src="https://www.linx.com.br/app/themes/linx/crystals/dist/assets/static/logo.png" alt="" />

                    </div>
                    <div className='containerLogin' >
                        <div id='imagemLogin'>
                            <img src={ImagemLogin} alt="" />
                        </div>
                        <div className='form01'>

                            <form className='form02' onSubmit={event => logar(event)} >
                                <h1>Login Atendente</h1>
                                <div className='labelInputForm'>
                                    <label >E-mail</label>
                                    <input className='inputLogin outlined' type="text" value={email} onChange={event => setEmail(event.target.value)} placeholder="Digite seu e-mail aqui"  required/> <br />
                                </div>
                                <div className='labelInputForm' >
                                    <label >Senha</label>
                                    <input className='inputLogin outlined' type="password" value={senha} onChange={event => setSenha(event.target.value)} placeholder="Digite sua senha aqui" required /> <br />
                                </div>
                                <button type="submit" className='botaoLogar' >
                                    <p >
                                        Entrar
                                    </p>
                                </button>

                            </form>
                            <div className='esqueceuSenha' >
                                <p><a href="">Esqueceu sua senha?</a> </p>

                            </div>
                        </div>


                    </div>
                </div>

            </div>
            <Footer />
        </div>
    )
}
export default Login;
