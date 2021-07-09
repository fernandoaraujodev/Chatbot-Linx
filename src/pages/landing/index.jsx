import React from 'react';

import Chatbot from '../../components/chatbot/index';
import Kommunicate from '../../components/chatbot/kommunicate';

// import Header from '../../components/header'
// import Footer from '../../components/footer'


const Landing = () =>{
    return(
        <div>
            {/* <Header/> */}
                <div style={{}}>
                <Chatbot page="welcome" />
                {/* <Kommunicate /> */}
                </div>
            {/* <Footer/> */}
        </div>
    );
}

export default Landing;
