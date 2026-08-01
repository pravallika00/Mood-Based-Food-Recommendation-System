import React, { useState, useRef, useCallback } from 'react';
import { FiMic, FiSquare, FiPlay, FiPause } from 'react-icons/fi';

interface AudioRecorderProps {
  onRecordingComplete: (file: File) => void;
  disabled?: boolean;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onRecordingComplete,
  disabled = false,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = useCallback(() => {
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setRecordedBlob(blob);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      startTimer();
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check permissions.');
    }
  }, [startTimer]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    setIsRecording(false);
    stopTimer();
  }, [stopTimer]);

  const playRecording = useCallback(() => {
    if (recordedBlob && audioRef.current) {
      const audioUrl = URL.createObjectURL(recordedBlob);
      audioRef.current.src = audioUrl;
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [recordedBlob]);

  const pauseRecording = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const useRecording = useCallback(() => {
    if (recordedBlob) {
      const file = new File([recordedBlob], 'recorded-audio.wav', {
        type: 'audio/wav',
      });
      onRecordingComplete(file);
      setRecordedBlob(null);
      setRecordingTime(0);
    }
  }, [recordedBlob, onRecordingComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full space-y-4">
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex flex-col items-center space-y-4">
          {isRecording ? (
            <div className="flex flex-col items-center space-y-2">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                <FiMic className="w-8 h-8 text-white" />
              </div>
              <span className="text-lg font-mono text-red-500">
                {formatTime(recordingTime)}
              </span>
              <button
                onClick={stopRecording}
                className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-colors"
              >
                <FiSquare className="w-6 h-6" />
              </button>
            </div>
          ) : recordedBlob ? (
            <div className="flex flex-col items-center space-y-4">
              <audio
                ref={audioRef}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              />
              <div className="text-center">
                <p className="text-gray-600 mb-2">
                  Recording ready ({formatTime(recordingTime)})
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={isPlaying ? pauseRecording : playRecording}
                    className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
                  >
                    {isPlaying ? <FiPause className="w-4 h-4" /> : <FiPlay className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={useRecording}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Use Recording
                </button>
                <button
                  onClick={startRecording}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Record Again
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={startRecording}
              disabled={disabled}
              className="w-16 h-16 bg-primary-500 text-white rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiMic className="w-8 h-8" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AudioRecorder;