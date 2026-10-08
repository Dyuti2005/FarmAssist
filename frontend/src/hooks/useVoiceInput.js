import { useState, useRef, useCallback, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

export function useVoiceInput() {
    const { lang, t } = useLanguage();
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState(null);
    const recognitionRef = useRef(null);

    // Store transcripts so onend logic can access the finalized state
    const transcriptRef = useRef({ final: '', interim: '' });

    const getRecLang = (overrideLang = null) => {
        const targetLang = overrideLang || lang;
        if (targetLang === 'kn') return 'kn-IN';
        if (targetLang === 'hi') return 'hi-IN';
        return 'en-IN'; // en-IN handles English better in Indian contexts usually
    };

    const silenceTimerRef = useRef(null);

    const resetSilenceTimer = (ms = 4000) => {
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = setTimeout(() => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        }, ms);
    };

    const stopListening = useCallback(() => {
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    }, []);

    const startListening = useCallback((onResultCallback, overrideLang = null, onEndCallback = null) => {
        setError(null);
        transcriptRef.current = { final: '', interim: '' };

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
            rec.lang = getRecLang(overrideLang);
            // Support continuous conversation without dropping out immediately after a pause
            rec.continuous = true;
            rec.interimResults = true;

            rec.onstart = () => {
                setIsListening(true);
                resetSilenceTimer(7000); // 7s timeout if no one starts speaking
            };

            rec.onresult = (event) => {
                // Generous pause allowance to handle pauses properly
                resetSilenceTimer(4000);

                let interimTranscript = '';
                let newFinalTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        newFinalTranscript += event.results[i][0].transcript;
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }

                if (newFinalTranscript) {
                    if (transcriptRef.current.final && !transcriptRef.current.final.endsWith(' ') && !newFinalTranscript.startsWith(' ')) {
                        transcriptRef.current.final += ' ';
                    }
                    transcriptRef.current.final += newFinalTranscript;
                }

                transcriptRef.current.interim = interimTranscript;

                // Pass both final and interim so components can show real-time feedback visually
                if (onResultCallback) {
                    onResultCallback(transcriptRef.current.final, transcriptRef.current.interim);
                }
            };

            rec.onerror = (event) => {
                if (event.error === 'not-allowed') {
                    setError(t?.('err_mic_req') || "Microphone permission denied.");
                } else if (event.error !== 'no-speech') {
                    setError(t?.('err_not_understood') || "Could not understand speech. Please try again.");
                }
            };

            rec.onend = () => {
                setIsListening(false);
                if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

                // Wait until speech recognition ends, then process the complete transcript
                if (onEndCallback) {
                    const completeTranscript = (transcriptRef.current.final + ' ' + transcriptRef.current.interim).trim();
                    onEndCallback(completeTranscript);
                }
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
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
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
