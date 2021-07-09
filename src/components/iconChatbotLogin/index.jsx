import React, { useState } from 'react'
import Chatbot from '../../components/chatbot/index';
import { VscHubot } from 'react-icons/vsc'

const IconChatbotLogin = () => {

    const [isHidden, setHidden] = useState(true)
    const setComponent = (event) => {
        event.preventDefault();

        if (isHidden == true) {
            setHidden(false)
        }
        else {
            setHidden(true)
        }

    }
    return (
        
            <div className='chatbot' style={{
                display: 'block',
                zIndex: 999,
                position: 'fixed',
                transition: '0.5s',
                transformOrigin: 'right bottom',
                bottom: 32,
                top: 'initial',
                right: 32,
                left: 'initial',
            }}>
                {isHidden && <button style={{
                    padding: 10,
                    borderRadius: 70,
                    width: 100,
                    height: 100,
                    backgroundColor: '#F37626',
                    alignItems: 'center',
                }} onClick={(e) => setComponent(e)} >
                    <VscHubot style={{
                        width: 50,
                        height: 50,
                        color: 'white',
                    }} />
                </button>}

                {!isHidden && <Chatbot page="welcome" header=
                    {(
                        <div style={{
                            background: '#6A3A7C',
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: 10,
                            color: 'white',
                        }}>
                            <h2>Chatbot</h2>
                            <button onClick={(e) => setComponent(e)} style={{
                               background: '#6A3A7C',
                               color: 'white',
                               fontSize: 'larger' 
                            }}>X</button>
                        </div>
                    )}
                />}

            </div>    
        
    )    
}

export default IconChatbotLogin;