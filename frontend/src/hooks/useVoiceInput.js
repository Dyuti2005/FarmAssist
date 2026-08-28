import { useState, useRef, useCallback, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

export function useVoiceInput() {
    const { lang, t } = useLanguage();
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState(null);
    const recognitionRef = useRef(null);

    const getRecLang = () => {
        if (lang === 'kn') return 'kn-IN';
        if (lang === 'hi') return 'hi-IN';
        return 'en-IN'; // en-IN handles English better in Indian contexts usually
    };

    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        setIsListening(false);
    }, []);

    const startListening = useCallback((onResultCallback) => {
        setError(null);

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setError(t?.('err_no_support') || "Speech recognition is not supported in this browser.");
            return;
        }

        try {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }

            const rec = new SpeechRecognition();
            rec.lang = getRecLang();
            // Support continuous conversation without dropping out immediately after a pause
            rec.continuous = true;
            rec.interimResults = true;

            rec.onstart = () => setIsListening(true);

            rec.onresult = (event) => {
                let interimTranscript = '';
                let finalTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }

                // Pass both final and interim so components can show real-time feedback
                onResultCallback(finalTranscript, interimTranscript);
            };

            rec.onerror = (event) => {
                if (event.error === 'not-allowed') {
                    setError(t?.('err_mic_req') || "Microphone permission denied.");
                    setIsListening(false);
                } else if (event.error !== 'no-speech') {
                    setError(t?.('err_not_understood') || "Could not understand speech.");
                }
            };

            rec.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current = rec;
            rec.start();
        } catch (e) {
            setIsListening(false);
            setError(t?.('err_no_support') || "Speech recognition error.");
        }
    }, [lang, t]);

    // Ensure cleanup
    useEffect(() => {
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    return {
        isListening,
        error,
        startListening,
        stopListening
    };
}
