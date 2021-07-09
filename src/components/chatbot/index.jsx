import React, { useState, useEffect, Component } from 'react';
//import PropTypes from 'prop-types';
import ChatBot from 'react-simple-chatbot';
import validator from 'validator';

import Kommunicate from '../../components/chatbot/kommunicate';

import { useHistory } from "react-router-dom";

import firebase from 'firebase/app';
import 'firebase/firestore';
import {useFirebaseApp} from 'reactfire';
import { db } from '../../utils/firebaseConfig'
import jwt_decode from 'jwt-decode'
import jwtEncode from 'jwt-encode'

import { FaBroadcastTower } from "react-icons/fa";

// const auth = firebase.auth()

// componente chatbot pede page para definir as mensagens
const Chatbot = ({page, header}) => {

  class Post extends Component {
    constructor(props) {
      super(props);
      const { steps } = this.props;
      const { email, senha } = steps;

      this.state =  { email, senha }; 
    }

    async componentDidMount() {
      let senha = this.state.senha.value;
      let email = this.state.email.value;

      const secretToken = 'secretToken';

      await firebase.auth().signInWithEmailAndPassword(email, senha)
        .then((result) => {
          console.log('sucesso')

            db.collection('Atendentes')
              .doc(result.user.uid)
              .get()
              .then(doc => {
                let url = '';
                let userToken = {
                  user_id : result.user.uid,
                  name : result.user.name,
                  email : result.user.email
                }

                if (doc.exists) {
                  userToken.role = "admin"
                } else {
                  userToken.role = "comum"
                }

                const jwt = jwtEncode(userToken, secretToken);
                localStorage.setItem('token', jwt)

                redirect();

              })
              .catch(error => {
                console.log(error)
              })
        })
        .catch((error) => {
            //var errorCode = error.code;
            //var errorMessage = error.message;
            console.log(error)
            console.log('falhou')

            return false
        })
    }

    render() {
      return (
        <div>Ótimo. Agora vamos processar os seus dados.</div>
        );
      }
  };

  const redirect = () => {
    // const history = useHistory();
  
    setTimeout(function(){
      loadDados();
      history.push('/faq');
      history.go()
  
    }, 2000)
  }

  // chat steps ===> mensagens que são enviadas
  // function separa as mensagens dependendo da page
  function steps(page){

    // welcome ---> landing para login
    if(page === "welcome"){
      return [
        {
          // id --> nome do step
          id: 'introduction',
          message: 'Olá, eu sou a Laís e estou aqui para te ajudar.',
          hideInput: true,
          // trigger -- > chama o proximo step ou uma funcao
          trigger: '1',
        },
        {
          id: '1',
          message: 'Vamos começar com seu login. Digite o seu e-mail:',
          trigger: 'email',
        },
        {
          id: 'email',
          placeholder: 'Digite o seu e-mail',
          // user --> espera um input do usuario
          user: true,
          //valida o email
          validator: (value) => {
              if (validator.isEmail(value) === false) {
                return 'Digite um e-mail válido';
              }

              return true;
          },
          trigger: 'confirmation',
        },
        {
          id: 'retry',
          message: 'Digite o seu e-mail:',
          trigger: 'email',
        },
        {
          id: 'confirmation',
          message: 'Seu e-mail é {previousValue}, correto?',
          trigger: 'options',
        },
        {
          id: 'options',
          options: [
            { value: 1, label: 'Sim', trigger: '3' },
            { value: 2, label: 'Não', trigger: 'retry' },
          ],
        },
        {
          id: '3',
          message: 'E agora digite a sua senha:',
          trigger: 'senha',
        },
        {
          id: 'senha',
          user: true,
          validator: (value) => {
            if (value.lenght < 5) {
              return 'A senha deve ter mais que 5 caracteres!';
            }

            return true;
        },
          metadata: {
            success: false,
          },
          trigger: 'finish',
        },
        {
          id: 'finish',
          component: <Post />,
          asMessage: true,
          trigger: 'verify',
        },
        {
          id: 'verify',
          message: '...',
          trigger: "fail",
        },
        {
          id: 'success',
          component: (
            <div id="success"> O Login foi realizado com sucesso! Por favor aguarde... </div>
          ),
          asMessage: true,
          end: true,
        },
        {
          id: 'fail',
          delay: 5000,
          message: 'O Login falhou :(. Verifique seu email e senha e tente novamente.',
          trigger: 'retry',
        },
        {
          id: 'dummy',
          message: 'dummy step',
          trigger: 'retry',
        },
      ]
    };

    // main ---> triagem para o suporte
    if(page === 'main'){
      return [
        //Saudações iniciais = 1º contato
        {
          id: '1',
          message: 'Bem vindo ao suporte, ' + localStorage.getItem('nome'),
          trigger: 'duvidas',
        },

        //Redireciona o usuario para a pagina de instabilidades, evitando problemas ja respondidos
        {
          id: 'duvidas',
          message: 'Você já visitou a página de Instabilidades?',
          trigger: 'optionsVisitaPagStatus',
        },
        {
          id: 'optionsVisitaPagStatus',
          options: [
            { value: 1, label: 'Sim', trigger: '2' },
            { value: 2, label: 'Não', trigger: 'push' },
          ],
        },
        {
          id: 'push',
          message: 'Você será redirecionado em instantes.',
          trigger: () => {push()},
        },
        //
        {
          id: '2',
          message: 'Selecione o segmento do serviço que você necessita de suporte: ',
          trigger: 'optionsSegmento',
        },

        {
          id: 'optionsSegmento',
          options: [
            { value: 'Analytics e Dashboard', label: 'Analytics e Dashboard', trigger: 'optionsServico1' },
            { value: 'App e Mobile', label: 'App e Mobile', trigger: 'optionsServico2' },
            { value: 'Promoção e Fidelização', label: 'Promoção e Fidelização', trigger: 'optionsServico3' },
            { value: 'ERP e PDV', label: 'ERP e PDV', trigger: 'optionsServico4' },
            { value: 'Fiscal e Tributário', label: 'Fiscal e Tributário', trigger: 'optionsServico5' },
            { value: 'Infraestrutura/TI', label: 'Infraestrutura/TI', trigger: 'optionsServico6' },
            { value: 'Meios de pagamento', label: 'Meios de pagamento', trigger: 'optionsServico7' },
            //{ value: 'Financeiro', label: 'Financeiro', trigger: 'optionsServico8' },
            { value: 'Outros', label: 'Outros', trigger: 'optionsServico9' },
          ],
        },

        //Serviços
        {
          id: 'optionsServico1',
          message: 'Agora selecione o serviço:',
          trigger: 'AnalyticsDashboard',
        },
        {
          id: 'AnalyticsDashboard',
          options: [
            //value: ['servico', nivel de urgencia(de 1 a 3)]
            { value: ['Linx dms dashboard', 1], label: 'Linx dms dashboard', trigger: '4' },
            { value: [ 'Linx analytics' ,1], label: 'Linx analytics', trigger: '4' },
          ],
        },

        {
          id: 'optionsServico2',
          message: 'Agora selecione o serviço:',
          trigger: 'AppMobile',
        },
        {
          id: 'AppMobile',
          options: [
            { value: [ 'Linx dms mobile' ,1], label: 'Linx dms mobile', trigger: '4' },
            { value: [ 'Linx dms bravos mobile' ,1], label: 'Linx dms bravos mobile', trigger: '4' },
            { value: [ 'Linx mobile' ,1], label: 'Linx mobile', trigger: '4' },
            { value: [ 'Linx degust mobile' ,1], label: 'Linx degust mobile', trigger: '4' },
            { value: [ 'Linx degust app' ,1], label: 'Linx degust app', trigger: '4' },
            { value: [ 'delivery app' ,1], label: 'delivery app', trigger: '4' },
          ],
        },

        {
          id: 'optionsServico3',
          message: 'Agora selecione o serviço:',
          trigger: 'PromocaoFidelizacao',
        },
        {
          id: 'PromocaoFidelizacao',
          options: [
            { value: [ 'Linx dms crm' ,1], label: 'Linx dms crm', trigger: '4' },
            { value: [ 'Linx reshop' ,1], label: 'Linx reshop', trigger: '4' },
          ],
        },

        {
          id: 'optionsServico4',
          message: 'Agora selecione o serviço:',
          trigger: 'ERP e PDV',
        },
        {
          id: 'ERP e PDV',
          options: [
            { value: [ 'Linx dms' ,1], label: 'Linx dms', trigger: '4' },
            { value: [ 'Linx erp' ,1], label: 'Linx erp', trigger: '4' },
            { value: [ 'Linx storex' ,1], label: 'Linx storex', trigger: '4' },
            { value: [ 'Linx degust' ,1], label: 'Linx degust', trigger: '4' },
            { value: [ 'Linx emsys' ,1], label: 'Linx emsys', trigger: '4' },
            { value: [ 'Linx autosystem' ,1], label: 'Linx autosystem', trigger: '4' },
            { value: [ 'Linx softpharma' ,1], label: 'Linx softpharma', trigger: '4' },
            { value: [ 'Linx reshop' ,1], label: 'Linx reshop', trigger: '4' },
          ],
        },

        {
          id: 'optionsServico5',
          message: 'Agora selecione o serviço:',
          trigger: 'FiscalTributario',
        },
        {
          id: 'FiscalTributario',
          options: [
            { value: [ 'mid-e' ,1], label: 'mid-e', trigger: '4' },
            { value: [ 'silo digital' ,1], label: 'silo digital', trigger: '4' },
          ],
        },

        {
          id: 'optionsServico6',
          message: 'Agora selecione o serviço:',
          trigger: 'Infraestrtura/TI',
        },
        {
          id: 'Infraestrtura/TI',
          options: [
            { value: [ 'linx conectividade' ,1], label: 'linx conectividade', trigger: '4' },
            { value: [ 'linx developer' ,1], label: 'linx developer', trigger: '4' },
          ],
        },

        {
          id: 'optionsServico7',
          message: 'Agora selecione o serviço:',
          trigger: 'MeioPagamento',
        },
        {
          id: 'MeioPagamento',
          options: [
            { value: [ 'linx pay' ,3], label: 'linx pay', trigger: '4' },
            { value: [ 'linx tef' ,3], label: 'linx tef', trigger: '4' },
            { value: [ 'linx conciliador' ,3], label: 'linx conciliador', trigger: '4' },
            { value: [ 'shopbit' ,3], label: 'shopbit', trigger: '4' },
          ],
        },

        {
          id: 'optionsServico9',
          message: 'Agora selecione o serviço:',
          trigger: 'Outros',
        },
        {
          id: 'Outros',
          options: [
            { value: [ 'linx plus' ,1], label: 'linx plus', trigger: '4' },
            { value: [ 'linx postos' ,1], label: 'linx postos', trigger: '4' },
            { value: [ 'linx lavanderia' ,1], label: 'linx lavanderia', trigger: '4' },
          ],
        },

        {
          id: '4',
          message: 'Selecione o seu problema, ou caso ele não esteja listado, selecione Outros.',
          trigger: 'optionsProb',
        },
        {
          id: 'optionsProb',
          options: [
            { value: 1, label: 'Conexão', trigger: 'probConexaoeFuncionamento' },
            { value: 3, label: 'Pagamentos e faturas', trigger: 'probSetFinancas' },
            { value: 1, label: 'Mal-funcionamento', trigger: 'probConexaoeFuncionamento' },
            { value: 'Outros', label: 'Outros', trigger: 'probOutros' },
          ],
        },

        {
          id: 'iniciarAtendimentoQuery',
          message: 'Deseja inciar um atendimento com um dos membros do nosso suporte?',
          trigger: 'inputAtendimento',
        },
        {
          id: 'inputAtendimento',
          options: [
            { value: 1, label: 'Sim', trigger: 'procurarAtendente' },
            { value: 2, label: 'Não', trigger: 'fecharSuporte' },
          ],
        },
        {
          id: 'fecharSuporte',
          message: 'Agradecemos o seu contato!',
          end: true,
        },
        {
          id: 'probSetFinancas',
          message: 'Para questões envolvendo o setor financeiro, é necessário falar diretamente com um atendente.',
          trigger: 'iniciarAtendimentoQuery',
        },
        {
          id: 'probConexaoeFuncionamento',
          message: 'Geralmente problemas como esse que você relatou são comuns na FAQ.',
          trigger: 'iniciarAtendimentoQuery'
        },
        {
          id: 'probOutros',
          message: 'Escreva com poucas palavras o problema que está enfrentando.',
          trigger: 'input',
        },
        {
          id: 'input',
          user: true,
          trigger: 'probInput',
        },
        //
        {
          id: 'probInput',
          message: 'Hmmm, consegui entender o seu problema.',
          trigger: 'iniciarAtendimentoQuery'
        },

        {
          id: 'procurarAtendente',
          message: 'Vamos processar sua situação e te redirecionar para o melhor atendente. Por favor, aguarde.',
          hideInput: true,
          trigger: 'enda',
        },
        {
          id: 'enda',
          //trigger: handleEndSuporte(),
          component: (
            <div style={{color: "green"}}>
              <h3 id="p1">Procurando... <FaBroadcastTower/></h3>
            </div>
          ),
          delay: 1500,
          end: true,
        }
      ]
    };
  };

  const [uid, setUid] = useState('');
  const [pfp, setPfp] = useState('');
  const [repeat, setRepeat] = useState('');
  const [nome, setNome] = useState('');
  const [atendentes, setAtendentes] = useState([]);

  const firebase = useFirebaseApp();
  const history = useHistory();


  useEffect(() => {
    getAtendentes();
  }, [])

  // carrega os dados do usuario apos o login
  const loadDados = () =>{
    try{
      const cityRef = db.collection('Cadastros').doc(jwt_decode(localStorage.getItem('token')).user_id);
      const doc = cityRef.get()
        .then( result => {
          console.log(result.data())
          localStorage.setItem('nome', result.data().Nome);
          setPfp(result.data().profilePicture);

        })
    } catch(error){
        console.log(error)
    }
  };

  //redireciona apos resposta do usuario que nao visitou a pag de instabilidades
  function push(){
    history.push('/status');
  }

  //redireciona apos resposta do usuario que nao visitou a pag de duvidas frequentes
  function push1(){
    history.push1('/faq');
  }

  // gera o uid do chat
  function generateUID() {
    var firstPart = (Math.random() * 46656) | 0;
    var secondPart = (Math.random() * 46656) | 0;
    firstPart = ("000" + firstPart.toString(36)).slice(-3);
    secondPart = ("000" + secondPart.toString(36)).slice(-3);
    return firstPart + secondPart;
  }

  // obtem todos os atendentes ativos no sistema
  const getAtendentes = () => {
    try{
      return db.collection('Atendentes').where('Ativo', '==', true).where('emAtendimento', '==', false)
          .get()
          .then( result => {
              const data = result.docs.map(doc => {
                  return{
                      uid : doc.id,
                      pfp: doc.data().profilePicture,
                      Nome : doc.data().Nome,
                      Experiencias : doc.data().Experiencias,
                  }
              })

              setAtendentes(data);

              return data;

          });
    } catch(error){
        console.log(error)
    }
  }

  // redirecionamento do atendimento
  const handleEndSuporte = async ({ steps, values }) => {
    // valores digitados pelo usuario
    console.log(values)
    // [0] ---> Produto
    // [1] ----> Dúvida (ou outro)
    // [2] -----> Dúvida específica

    // não realiza a pesquisa
    if(values[4] === 2){
      return true;
    }

    // const suporteRef = db.collection('Atendimentos');

    // faz a pesquisa de atendentes de acordo com o problema
    async function search() {
      var i = 0;
      while (i < 10) {
          setTimeout(
            async function() {
              const a = await getAtendentes().then(a =>
                  {
                    // console.log(atendentes)

                    // console.log(atendente)

                    return [a.length, a];
                  }
              )

              let urgency = values[2][1] + values[3];
              // console.log(urgency)

              var atendente;
              try {
                atendente = a[1].find( value => value.Experiencias.find(value => value === values[1]))
                console.log(atendente)

              } catch (error) {
                console.log(error)
                console.log(atendente)

              }

              let assunto = values[4];

              if (atendente != undefined){
                document.getElementById("p1").innerHTML = "Um atendente foi encontrado! Você será redirecionado em instantes... <br> Não compartilhe esse link com ninguém!";

                let chatuid = generateUID();

                await db.collection('Atendimentos').doc(chatuid).set({
                  uid: chatuid,
                  // createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                  Cliente: jwt_decode(localStorage.getItem('token')).user_id,
                  NomeCliente: localStorage.getItem('nome'),
                  NomeAtendente: atendente.Nome,
                  Atendente: atendente.uid,
                  atendentePfp: atendente.pfp,
                  assunto: assunto,
                  Mensagens: [],
                  Urgencia: urgency,
                  avaliacao: 0,
                  inProgress: false,
                  inactiveUser: false,
                  concluido: false,
                })

                // await db.collection('Atendentes').doc(atendente.uid).update({
                //   atendimentosTotais: firebase.firestore.FieldValue.increment(1),
                // })

                i = 10;

                setTimeout(function(){
                  history.push('/chat/' + chatuid)
                  history.go();
                  
                }, 3000)

              }
              else{
                  console.log('Nenhum atendimento foi encontrado...')

              }

          }, 5000 * i);
          i = i + 1
      }
    };

    search();

    return true;
  }

  return (
    <div>
      <div id="chatbotDiv">
        <ChatBot
            headerTitle = "Chatbot"
            headerComponent = {header}
            recognitionEnable={true}
            recognitionLang='pt'
            // deprecated
            // speechSynthesis={{ enable: true, lang: 'en' }}
            // funcao chamada no final das mensagens
            handleEnd = {handleEndSuporte}
            steps={steps(page)}
        />
      </div>
      {/* <div style={kommunicateBot}>
        <Kommunicate />
      </div> */}
    </div>
  )
}

export default Chatbot;
