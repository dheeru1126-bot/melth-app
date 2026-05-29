import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { JitsiMeeting } from '@jitsi/react-sdk';
import { PhoneOff } from 'lucide-react';
import api from '../../services/api';

const VideoRoom = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Get appointment details from router state
    const appt = location.state?.appt || {};
    const role = location.state?.role || 'user';
    
    const [isLoading, setIsLoading] = useState(true);
    const [roomActive, setRoomActive] = useState(role === 'counselor'); // Counselor doesn't wait
    const [waitingMessage, setWaitingMessage] = useState('Establishing secure HIPAA-compliant connection...');

    // Fallback names if missing
    const myName = role === 'counselor' 
        ? (appt.counselor_name || 'Counselor')
        : (appt.patient_name || 'Patient');

    const roomName = appt.id ? `MelthSecureConsultationRoom_${appt.id}` : `MelthSecureConsultationRoom_Test`;

    // Polling logic for Patient to wait for Counselor
    useEffect(() => {
        let interval;
        let isMounted = true;
        
        const checkStatus = async () => {
            try {
                const res = await api.get(`/video/room/${roomName}/status`);
                if (res.data.active && isMounted) {
                    setRoomActive(true);
                    clearInterval(interval);
                } else if (isMounted) {
                    setWaitingMessage('Waiting for your counselor to join...');
                }
            } catch (err) {
                console.error("Failed to check room status", err);
            }
        };

        const startRoom = async () => {
            try {
                await api.post(`/video/room/${roomName}/start`);
                if (isMounted) setRoomActive(true);
            } catch (err) {
                console.error("Failed to start room", err);
            }
        };

        if (role === 'user' && !roomActive) {
            checkStatus(); // Check immediately
            interval = setInterval(checkStatus, 3000); // Poll every 3 seconds
        } else if (role === 'counselor') {
            startRoom();
        }

        return () => {
            isMounted = false;
            if (interval) clearInterval(interval);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [role, roomName]); // Removed roomActive from dependency array to avoid re-triggering

    const handleLeave = async () => {
        if (role === 'counselor') {
            try {
                await api.post(`/video/room/${roomName}/end`);
            } catch (err) {
                console.error("Error ending room", err);
            }
            navigate('/counselor-dashboard', { replace: true });
        } else {
            navigate('/dashboard', { replace: true });
        }
    };

    return (
        <div className="h-[85vh] w-full bg-[#0B1120] flex flex-col relative overflow-hidden rounded-xl border border-slate-800 shadow-2xl">
            
            {/* Waiting/Loading Overlay */}
            {(!roomActive || isLoading) && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#0B1120]">
                    <div className="relative">
                        <div className="absolute inset-0 rounded-full border-4 border-blue-500/20 animate-ping opacity-75 duration-1000"></div>
                        <div className="w-16 h-16 rounded-full border-4 border-t-blue-500 border-slate-700 animate-spin"></div>
                    </div>
                    <p className="mt-6 text-blue-400 font-medium tracking-wide animate-pulse">{waitingMessage}</p>
                </div>
            )}

            {/* Jitsi Video Call Integration */}
            {roomActive && (
                <div className={`absolute inset-0 w-full h-full z-10 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                    <JitsiMeeting
                        domain="jitsi.riot.im"
                        roomName={roomName}
                        configOverwrite={{
                            startWithAudioMuted: false,
                            startWithVideoMuted: false,
                            disableModeratorIndicator: true,
                            prejoinPageEnabled: false, // Skip prejoin page to jump right in
                            disableDeepLinking: true, // Prevent prompting to download Jitsi app on mobile
                            requireDisplayName: false, // No login prompt on this open domain
                        }}
                        interfaceConfigOverwrite={{
                            DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
                            SHOW_CHROME_EXTENSION_BANNER: false,
                        }}
                        userInfo={{
                            displayName: myName,
                        }}
                        onApiReady={(externalApi) => {
                            // Give Jitsi a moment to render the iframe contents
                            setTimeout(() => setIsLoading(false), 800);
                            externalApi.addListener('videoConferenceLeft', handleLeave);
                        }}
                        getIFrameRef={(iframeRef) => { 
                            iframeRef.style.height = '100%'; 
                            iframeRef.style.width = '100%'; 
                            iframeRef.style.border = 'none';
                        }}
                    />
                </div>
            )}

            {/* Failsafe Backup Leave Button */}
            <div className="absolute top-4 left-4 z-50">
                <button 
                    onClick={handleLeave}
                    className="px-4 py-2 bg-red-500/90 hover:bg-red-600 text-white rounded-lg font-bold flex items-center gap-2 transition-all shadow-lg backdrop-blur-md text-sm"
                >
                    <PhoneOff className="w-4 h-4" /> Force Exit
                </button>
            </div>
            
        </div>
    );
};

export default VideoRoom;
