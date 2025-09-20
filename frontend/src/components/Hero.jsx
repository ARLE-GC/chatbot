import { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';


const Hero = () => {
  
  return (
     <section>
           <ReactPlayer 
           className='absolute top-2/4 left-2/4 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover blur-lg'
           src='./imagev/imv1.MP4' 
           playing={true}
           loop={true}
            pip={false}
            autoPlay
            playsInline
            muted
            preload="auto"
           />

           <div className='absolute min-w-screen min-h-screen bg-gradient-to-br from-sky-900 via-slate-950  flex flex-col items-center justify-center p-4 gap-8'>
            <h1 className='text-6xl sm:text-7xl  font-light bg-gradient-to-r from-emerald-100 via-sky-300 to-blue-500 bg-clip-text text-transparent text-center h-20'>CHATBOT</h1>

            <div className={`px-4 py-2 rounded-full text-sm ${aiReady ? "bg-green-500/20 text-green-300 border border-green-500/30" : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/20"}`}>
              {aiReady ? "🟢 Prêt pour le CHATBOT" : "🟡 En attente de du CHATBOT..."}
            </div>

            <div className=' w-full  max-w-2xl bg-gradient-to-r from-gray-800/90 to-gray-700/90 backdrop-blur-md  border border-gray-600 rounded-3xl p-6 shadow-2xl'>
              {
                messages.length === 0 && (
                  <div className='text-center text-gray-400 mt-20'>
                    👋 Démarrez la conversation en tapant un message ci-dessous.
                  </div>
                )
              }

            </div>

            <div className='flex flex-col sm:flew-row gap-3'>
              <input type="text" 
               placeholder='' 
               
              className='flex-1  px-4 py-3 bg-gray-700/80 border border-gray-600 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:shadow-xl focus:shadow-sky-400/80 focus:ring-sky-500 transition duration-400 disabled:opacity-50 disabled:cursor-not-allowed'
              />
              <button onClick={() => console.log('click')}
              disabled={false}
              className='px-6 py-3 bg-gradient-to-r from-sky-400 to-emerald-100 hover:opacity-80 text-white font-semibold rounded-2xl transition disabled:opacity-50 disabled:cursor-not-allowed' 
                ></button>
            </div>
           </div>

        </section>
   
  )
}

export default Hero;
