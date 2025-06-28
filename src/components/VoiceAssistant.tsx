import { useRef, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';
import { RetellWebClient } from 'retell-client-js-sdk';

export default function VoiceAssistant() {
  const [listening, setListening] = useState(false);
  const retellWebClient = useRef<RetellWebClient | null>(null);

  useEffect(() => {
    const client = new RetellWebClient();
    retellWebClient.current = client;

    // Event listeners
    client.on('call_started', () => {
      console.log('✅ Call started');
      setListening(true);
    });

    client.on('call_ended', () => {
      console.log('🔚 Call ended');
      setListening(false);
    });

    client.on('agent_start_talking', () => {
      console.log('🗣️ Agent started talking');
    });

    client.on('agent_stop_talking', () => {
      console.log('🤫 Agent stopped talking');
    });

    client.on('error', (error) => {
      console.error('❌ Retell error:', error);
      client.stopCall();
      setListening(false);
    });

    return () => {
      client.stopCall();
    };
  }, []);

  const toggleListening = async () => {
    if (!retellWebClient.current) return;

    if (!listening) {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/create-web-call`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            agent_id: 'oBeDLoLOeuAbiuaMFXRtDOLriTJ5tSxD',
            agent_version: 4,
          }),
        });

        const data = await res.json();

        if (!data?.access_token) {
          throw new Error('No access token returned');
        }

        console.log('🎬 Creating call with ID:', data.call_id);

        await retellWebClient.current.startCall({
          accessToken: data.access_token,
          sampleRate: 24000,
        });

      } catch (err) {
        console.error('Error starting call:', err);
      }
    } else {
      console.log('🛑 Stopping call...');
      await retellWebClient.current.stopCall();
      setListening(false);
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-black">
      {/* Orb */}
      <img
        src="/orb.png"
        alt="Voice orb"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
        className={`rounded-full ${listening ? 'pulse' : ''}`}
        style={{
          width: '192px',
          height: '192px',
          objectFit: 'cover',
          marginBottom: '40px',
        }}
      />

      {/* Button */}
      {listening ? (
        <button
          onClick={toggleListening}
          style={{
            backgroundColor: '#dc2626', // red-600
            color: 'white',
            fontWeight: 'bold',
            fontSize: '14px',
            padding: '16px 32px',
            minWidth: '200px',
            borderRadius: '12px',
            transition: 'transform 0.2s ease-in-out',
            boxShadow: '0 4px 10px rgba(0,0,0,0.4)',
            border: 'none',
            cursor: 'pointer',
          }}
          onMouseOver={(e) => {
            (e.currentTarget.style.transform = 'scale(1.05)');
          }}
          onMouseOut={(e) => {
            (e.currentTarget.style.transform = 'scale(1)');
          }}
        >
          End Conversation
        </button>
      ) : (
        <button
          onClick={toggleListening}
          className="bg-neutral-800 rounded-full shadow-2xl flex items-center justify-center hover:scale-105 transition"
          style={{
            width: '64px',
            height: '64px',
            border: 'none',
            padding: '16px',
            cursor: 'pointer',
          }}
        >
          <FontAwesomeIcon
            icon={faMicrophone}
            className="text-white"
            style={{ width: '24px', height: '24px' }}
          />
        </button>
      )}
    </div>
  );
}
