import React, { useRef, useState, useEffect } from 'react';
import { useFirebaseApp } from 'reactfire';
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import { useToasts } from 'react-toast-notifications';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';

import Moderation from '../../utils/contentModerator'
import jwt_decode from 'jwt-decode'

// inatividade
import { useIdleTimer } from 'react-idle-timer'

import StarRatingComponent from 'react-star-rating-component';

import { VscSearch } from 'react-icons/vsc'

import './styles.css';

import Header from '../../components/header'
import Footer from '../../components/footer'

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

const auth = firebase.auth();
const firestore = firebase.firestore();

// main atendimento
function Atendimento() {

  return (
    <div className="App">

      <section>
        <ChatRoom />
      </section>

    </div>
  );
}

function ChatRoom() {
  const dummy = useRef();
  const history = useHistory();
  const match = useRouteMatch();
  const currentPath = match.url.split("/")[2]
  const replayUrl = match.url.split("/")

  const messagesRef = firestore.collection('Mensagens');
  const suporteRef = firestore.collection('Atendimentos');
  const atedentesRef = firestore.collection('Atendentes');

  const uid = jwt_decode(localStorage.getItem('token')).user_id;
  const [atendimentos, setAtendimentos] = useState([])
  const [NomeAtendente, setNomeAtendente] = useState()
  const [NomeCliente, setNomeCliente] = useState()
  const { addToast } = useToasts();

  const [replay, setReplay] = useState(false)
  const [rate, setRate] = useState(false)
  const [rating, setRating] = useState(false)

  const [admin, setAdmin] = useState(false)
  const [started, setStarted] = useState(false)
  const [UidVerify, setUidVerify] = useState()

  useEffect(() => {
    loadDados();
    historico();
  }, [])

  // metodo 2 ---> solucao
  // filtra o atendimento nas mensagens e ordena pela data
  const query = messagesRef.where('atendimento', '==', currentPath).orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(
    query,
    { idField: 'id' }
  );

  const historico = () => {
    const querySuporte = suporteRef.where('Cliente', '==', uid)
      .get()
      .then(result => {
        const data = result.docs.map(doc => {
          return doc.data()
        })
        setAtendimentos(data);

        return data;

      });
  }

  // atendimento especifico que esta acontecento
  // const queryAtendimento = suporteRef.where('uid', '==', currentPath).limit(1);

  // const [atendimentoDummy] = useCollectionData(
  //   queryAtendimento
  // );

  const loadDados = async () => {

    try {
      const cityRef = suporteRef.doc(currentPath);
      const docc = cityRef.get()
        .then(result => {
          // console.log(result.data())
          setNomeAtendente(result.data().NomeAtendente)
          setNomeCliente(result.data().NomeCliente)
          setStarted(result.data().inProgress)

          if (result.data().concluido == true) {
            setReplay(true)
          }

          return [result.data().Atendente, result.data().Cliente, result.data().inProgress];
        })


      const doc = await docc;
      // caso seja atendente --> admin 
      if (doc[0] === uid) {

        setUidVerify(true)
        setAdmin(true)

        // inicia o atendimento já que o atendente está na sala
        setStarted(true)
        await suporteRef.doc(currentPath).update({
          inProgress: true,
        })

        // verifica o estado do atendimento (caso o cliente esteja inativo etc...)
        async function verifyState() {
          var i = 0;
          localStorage.removeItem('stop');

          while (i < 100) {

            setTimeout(
              async function () {
                const docc = cityRef.get()
                  .then(result => {
                    return result.data()
                  })
                const doc = await docc;

                if (doc.inactiveUser == true) {
                  // if (atendimentoDummy[0].inactiveUser == true) {
                  localStorage.setItem('stop', true)
                  document.getElementById("state").innerHTML = "O cliente está inativo ou saiu da sala.";

                  i = 100;
                  setStarted(true)

                  return 'a';
                }
                else {
                  document.getElementById("state").innerHTML = "O atendimento está ocorrendo...";
                  console.log('normal')
                }

              }, 7000 * i);
            i++;
          }
        };

        verifyState();

        return true
      }

      // caso seja cliente
      else if (doc[1] === uid) {
        setUidVerify(true)

        // verifica se o atendente ja esta na sala
        async function search() {
          var i = 0;
          localStorage.removeItem('stop');

          while (i < 10) {

            setTimeout(
              async function () {
                // verifica se o atendimento foi parado e deixa de rodar a busca
                if (localStorage.getItem('stop') === "true") {
                  localStorage.removeItem('stop');
                  return;
                }

                const docc = cityRef.get()
                  .then(result => {
                    return result.data()
                  })
                const doc = await docc;

                if (doc.inProgress == true) {
                  localStorage.setItem('stop', true)
                  i = 100;
                  setStarted(true)

                  return 'a';
                }
                else {
                  // console.log('O atendimento não foi iniciado...')
                }

              }, 7000 * i);
            i++;
          }
        };

        search();

        return true
      }

      setUidVerify(false)
      return false;

    } catch (error) {
      console.log(error)
    }
  };

  const [formValue, setFormValue] = useState('');
  const [numberIn, setNumberIn] = useState(0);

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;
    // console.log(auth.currentUser.za)
    // console.log(uid, photoURL, email)

    // moderação de conteudo
    var moderated = false
    if (Moderation(formValue) == false) {

      setNumberIn(numberIn + 1)
      moderated = true

      setFormValue('*****')

      if (numberIn == 3) {
        addToast('Pela sua conduta inapropriada com um de nossos atendentes, você será redirecionado para a Home em instantes. Por favor, aguarde.', { appearance: 'warning', autoDismiss: true });
        setTimeout(function () {
          history.push('/')
        }, 3000)

        localStorage.removeItem('chatuid');
        return false;
      }

    }

    // uso correto - gera erro
    // let time = firebase.firestore.FieldValue.serverTimestamp();

    // uso para a collection Atendimentos apenas
    let time = firebase.firestore.Timestamp.now();

    let data = {
      text: formValue,
      createdAt: time,
      uid,
      photoURL,
      atendimento: currentPath,
      sender: localStorage.getItem('nome'),
      containInappropriate: moderated
    }

    // adiciona a mensagem no documento do atendimento
    await suporteRef.doc(currentPath).update({
      Mensagens: firebase.firestore.FieldValue.arrayUnion(data),
    })

    // adiciona a mensagem na colecao Mensagens
    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
      atendimento: currentPath,
      sender: localStorage.getItem('nome'),
      containInappropriate: moderated
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });

    if (admin == true) {
      await atedentesRef.doc(uid).update({
        msgTotal: firebase.firestore.FieldValue.increment(1),
      })
    }

    //getMessages();
  }

  const [formValueSearch, setFormValueSearch] = useState('');

  const serchAtendimentos = (event) => {
    event.preventDefault();

    try {
      const querySuporte = suporteRef.where('Cliente', '==', uid).where('NomeAtendente', '==', formValueSearch)
        .get()
        .then(result => {
          const data = result.docs.map(doc => {
            return doc.data()
          })
          setAtendimentos(data);

          return data;

        });

    } catch (error) {
      console.log(error)
    }


  }
  const seeHistory = (atend, event) => {
    event.preventDefault();
    // localStorage.setItem('chatuid', atend.uid);

    history.push('/chat/' + atend + '/replay')
  }

  const fecharAtendimento = async (event) => {
    event.preventDefault();

    if (event.target.value !== "back") {
      await atedentesRef.doc(uid).update({
        emAtendimento: false,
      })
      await suporteRef.doc(currentPath).update({
        inProgress: false,
        concluido: true,
      })
    }

    history.push('/dashboard')
    history.go()
  }

  const sairAtendimento = async (event) => {
    firestore.collection('Atendimentos').doc(currentPath).update({
      inactiveUser: true,
      avaliacao: rating,
    })
    event.preventDefault();

    history.push('/faq')
  }

  const verify = UidVerify;
  // console.log(admin)


  // verificação de inatividade
  const handleOnIdle = async () => {
    console.log('user is idle')

    await suporteRef.doc(currentPath).update({
      inactiveUser: true,
    })
    addToast('Você será redirecionado para o início por sua inatividade.', { appearance: 'info', autoDismiss: true });

    if (admin != true) {
      history.push('/faq')
      history.go();
    }
    else {
      history.push('/dashboard')
      history.go();
    }

  }

  // verifica atividade
  const handleOnActive = async () => {
    console.log('user is active')

    await suporteRef.doc(currentPath).update({
      inactiveUser: false,
    })
  }

  var time;
  if (admin != true) {
    time = 1000 * 60 * 1;
  }
  else if (replay == true) {
    time = 1000 * 60 * 30;
  }
  else {
    time = 1000 * 60 * 15;
  }

  const { getLastActiveTime } = useIdleTimer({
    timeout: time,
    onIdle: handleOnIdle,
    onActive: handleOnActive,
    debounce: 500
  })

  // verifica e redireciona para a /replay
  if (replay == true && replayUrl[3] === "") {
    history.push('/chat/' + currentPath + '/replay')
    history.go();
  }


  return (
    <div>
      <Header />
      {verify ?
        <div className="all posicionamento">
          {started ?
            <div className="all2">
              <div className="painelHistorico">
                <div className="clienteProfile">
                  <h2> {NomeCliente} </h2>
                  <p>Cliente</p>
                </div>
                <hr className='hr' />
                <div className="atendimentoFormDiv">
                  {admin !== true &&
                    <div className='divComumAtendimento'>
                      <h3>Historico de Atendimentos</h3>

                      <form className="atendimentoForm" onSubmit={serchAtendimentos}>

                        <input className='outlined' style={{ color: 'black' }} onChange={(e) => setFormValueSearch(e.target.value)} placeholder="Procure" />
                        <button type="submit" disabled={!formValueSearch} > <VscSearch /> </button>

                      </form>

                      {atendimentos.length == 0 ?
                        <div className="noAtendimentos">
                          <h3>Nenhum atendimento foi encontrado</h3>
                        </div>
                        :
                        <div className="histor">
                          {atendimentos && atendimentos.map((atnd, index) => <button key={index} className="historicoItem" onClick={(e) => seeHistory(atnd.uid, e)}>
                            <img src={atnd.atendentePfp} alt="Foto de perfil do(a) atendente"></img>
                            <h3>{atnd.NomeAtendente}</h3>
                          </button>)}
                        </div>
                      }

                      {/* avaliaçao apos atendimento --> caso seja replay remove a avaliacao */}
                      {replay ?
                        <button className="buttonBack" style={{ backgroundColor: '#22a6b3' }} onClick={(e) => sairAtendimento(e)}>Voltar para o Início</button>
                        :
                        <div>
                          {rate ?
                            <div className='columnAvalia'>
                              <h2 className='white'>Antes de sair, por favor avalie o atendimento, sua opinião é muito importante pra nós.</h2>
                              <StarRatingComponent
                                name="rate1"
                                starCount={5}
                                value={rating}
                                onStarClick={(e) => setRating(e)}
                              />
                              <button className="buttonBack" style={{ backgroundColor: '#22a6b3' }} onClick={(e) => sairAtendimento(e)}>Enviar</button>

                            </div>
                            :
                            <button className="buttonBack" style={{ backgroundColor: '#22a6b3' }} onClick={function () { setRate(true) }}>Voltar para o Início</button>
                          }
                        </div>
                      }

                    </div>
                  }


                  {admin == true &&
                    <div className='adminEstado'>
                      <h2>Estado do Atendimento</h2>
                      <h3 id="state"></h3>
                      {replay != true &&
                        <div className="buttons">
                          <button className="buttonBack" style={{ background: "red" }} onClick={(e) => fecharAtendimento(e)}>Fechar Atendimento</button>
                        </div>
                      }
                      <button className="buttonBack" value="back" style={{ background: "#63C3D0" }} onClick={(e) => fecharAtendimento(e)}>Voltar para a Dashboard</button>

                    </div>
                  }

                </div>

              </div>

              <div>
                <div className="atendenteProfile">
                  <div>
                    <h2> {NomeAtendente} </h2>
                    <p>Atendente</p>
                  </div>

                  {replay == true &&
                    <div className='finalizada'><h3>Essa conversa ja foi finalizada.</h3></div>
                  }
                </div>

                <div className="mainForm">
                  <main>
                    {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

                    <span ref={dummy}></span>

                  </main>
                  {replay == false &&
                    <div className='apoioChatMsg'>
                      <form className="form" onSubmit={sendMessage}>

                        <input className='outlined' value={formValue} style={{ color: 'black' }} onChange={(e) => setFormValue(e.target.value)} placeholder="Digite sua mensagem" />

                        <button type="submit" disabled={!formValue && replay}>🕊️</button>
                      </form>


                    </div>

                  }

                </div>
              </div>
            </div>
            :
            <div className="wait">
              <div>
                <h1>O atendimento irá começar em instantes, por favor aguarde...</h1>
                <h1>Caso o início demore, recarregue a página ou inicie um novo atendimento.</h1>
              </div>
              <div className="spinner"></div>
            </div>
          }
        </div> :

        <div className="wait">
          <h1>O chat que você está procurando não existe ou você não está logado...</h1>
          <div className="spinner"></div>
        </div>
      }

      {/* <Footer /> */}
    </div>
  )
}

function ChatMessage(props) {
  const { text, uid, photoURL, sender, createdAt, containInappropriate } = props.message;
  // console.log(uid)

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  // const time = createdAt.toDate().toString().split(" ");

  if (containInappropriate == true) {
    return (<>
      <div className={`message ${messageClass}`}>

        <p><strong>Essa mensagem contem palavras inapropriadas.</strong></p>
      </div>
    </>)
  }

  // <img src={'https://avatars.githubusercontent.com/u/61596627?v=4'} />
  return (<>
    <div className={`message ${messageClass}`}>

      <p>{text}</p>

    </div>
  </>)
}


export default Atendimento;
