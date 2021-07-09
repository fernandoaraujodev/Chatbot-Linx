import React from 'react';
import './index.css';
// import VLibras from '@djpfs/react-vlibras'

import 'firebase/auth';

import jwt_decode from 'jwt-decode';

//pages
import NaoEncontrada from './pages/naoEncontrada'
import DuvidasFrequentes from './pages/duvidasFrequentes/'
import BaseConhecimento from './pages/basedeconhecimento'
import Login from './pages/atendente/login'
import Atendimento from './pages/atendimento/index'
import CrudBase from './pages/crudBase'
import CrudDuvidas from './pages/crudDuvidas'
import Dashboard from './pages/dashboard'
import Status from './pages/status'
import Suporte from './pages/suporte'

import { Redirect, Route, Switch, useLocation } from 'react-router-dom';
import { AnimatePresence } from "framer-motion"

// verifica se está no mobile pela resolução
const isMobile: boolean = (window.innerWidth <= 768);

const RotaPrivadaAdmin = ({component : Component, ...rest}) => (
  <Route
    {...rest}
    render = {
      props => 
      localStorage.getItem('token') !== null && jwt_decode(localStorage.getItem('token')).role === "admin" && isMobile === false ?
        <Component {...props} /> :
        <Redirect to={{pathname : '/atendente/login', state :{from : props.location}}} /> 
    }
  />
);

const RoutePrivada = ({component : Component, ...rest}) => (
  <Route
    {...rest}
    render = {
      props => 
      localStorage.getItem('token') !== null ?
        <Component {...props} /> :
        <Redirect to={{pathname : '/', state :{from : props.location}}} /> 
    }
  />
);

// paginas visiveis apenas no web
const RouteWeb = ({component : Component, ...rest}) => (
  <Route
    {...rest}
    render = {
      props => 
      isMobile === false ?
        <Component {...props} /> :
        <Redirect to={{pathname : '/404', state :{from : props.location}}} /> 
    }
  />
);

const Rotas = () => {
    const location = useLocation();

    return (
        <AnimatePresence>
            <Switch location={location} key={location.key}>
                <Route path='/' exact component={Suporte} />
                <RoutePrivada path='/faq' component={DuvidasFrequentes} />
                <RotaPrivadaAdmin path='/baseconhecimento'  component={BaseConhecimento} />
                <RouteWeb path='/atendente/login'  component={Login} />
                <RoutePrivada path="/chat/:id"  component={Atendimento} />
                <RotaPrivadaAdmin path='/crudBase'  component={CrudBase} />
                <RotaPrivadaAdmin path='/crudDuvidas'  component={CrudDuvidas} />
                <RotaPrivadaAdmin path='/dashboard' component={Dashboard} />
                <RoutePrivada path='/status'  component={Status} />
                <Route path='/suporte'  component={Suporte} />
                <Route component={NaoEncontrada} />
            </Switch>
        </AnimatePresence>
    )
}

export default Rotas
