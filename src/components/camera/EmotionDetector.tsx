"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import { RotateCw } from 'lucide-react';

export default function EmotionDetector() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const lastSpokenEmotionRef = useRef<string | null>(null);
  const emotionHistoryRef = useRef<string[]>([]);
  
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = '/models';
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        ]);
        setIsModelLoaded(true);
      } catch (err) {
        console.error("Error loading face-api models", err);
      }
    };
    loadModels();
  }, []);

  useEffect(() => {
    if (!isModelLoaded) return;

    let stream: MediaStream | null = null;

    const startVideo = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera", err);
      }
    };

    startVideo();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isModelLoaded]);

  const handleVideoPlay = () => {
    const interval = setInterval(async () => {
      if (!videoRef.current) return;
      
      try {
        const detections = await faceapi.detectSingleFace(
          videoRef.current, 
          new faceapi.TinyFaceDetectorOptions()
        ).withFaceExpressions();

        if (detections) {
          const expressions = detections.expressions;
          let maxEmotion = '';
          let maxValue = 0;
          for (const [emotion, value] of Object.entries(expressions)) {
            const numValue = value as number;
            if (numValue > maxValue) {
              maxValue = numValue;
              maxEmotion = emotion;
            }
          }

          if (maxEmotion) {
            handleDetectedEmotion(maxEmotion);
          }
        }
      } catch (e) {
        console.error("Detection error:", e);
      }
    }, 1500); // Check every 1.5 seconds

    return () => clearInterval(interval);
  };

  const handleDetectedEmotion = (emotion: string) => {
    const history = emotionHistoryRef.current;
    history.push(emotion);
    
    // Keep last 3 readings (4.5 seconds)
    if (history.length > 3) {
      history.shift();
    }

    // Check if the same emotion has been detected consistently
    const isConsistent = history.length === 3 && history.every(e => e === history[0]);

    if (isConsistent) {
      const consistentEmotion = history[0];
      setCurrentEmotion(consistentEmotion);
      
      if (lastSpokenEmotionRef.current !== consistentEmotion) {
        speakSolution(consistentEmotion);
        lastSpokenEmotionRef.current = consistentEmotion;
      }
    }
  };

  const speakSolution = (emotion: string) => {
    let message = "";
    
    switch(emotion) {
      case "happy":
        message = "You look happy! Keep up the good mood!";
        break;
      case "angry":
        message = "Take a deep breath. It's going to be okay. Would you like a short break?";
        break;
      case "sad":
        message = "You seem a bit tired or sad. Maybe it's time for a coffee break or some music.";
        break;
      case "neutral":
        // Reset state so that we can trigger same emotion again later if needed
        lastSpokenEmotionRef.current = null;
        break;
      default:
        break;
    }

    if (message && 'speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(message);
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleRotation = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRotation(prev => (prev + 90) % 360);
  };

  return (
    <div className="fixed top-20 right-6 z-40 rounded-xl overflow-hidden shadow-lg border-2 border-slate-200 bg-white group w-24 h-24 sm:w-32 sm:h-32 hover:w-64 hover:h-48 transition-all duration-300 flex flex-col cursor-pointer">
      {!isModelLoaded ? (
        <div className="flex flex-1 items-center justify-center w-full h-full text-xs text-slate-500 font-medium">
          Loading AI...
        </div>
      ) : (
        <div className="relative w-full h-full">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            onPlay={handleVideoPlay}
            className="w-full h-full object-cover transition-transform duration-300"
            style={{ transform: `rotate(${rotation}deg)` }}
          />
          
          <button 
            onClick={toggleRotation}
            className="absolute top-2 right-2 p-1.5 bg-black/40 hover:bg-black/60 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
            title="Rotate Camera"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <div className="absolute inset-0 bg-black/50 text-white p-2 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <span className="text-xs font-semibold">Emotion AI</span>
            <span className="text-sm font-bold capitalize text-[#00A3E0]">
              {currentEmotion || 'Scanning...'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
