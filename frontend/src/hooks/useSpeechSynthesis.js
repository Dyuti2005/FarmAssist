import { useState, useCallback, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';

export function useSpeechSynthesis() {
    const { t } = useLanguage();
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [activeMessageId, setActiveMessageId] = useState(null);
    const [error, setError] = useState(null);
    const synthRef = useRef(window.speechSynthesis);
    const [voices, setVoices] = useState([]);

    useEffect(() => {
        if (!synthRef.current) return;
        const loadVoices = () => {
            setVoices(synthRef.current.getVoices());
        };
        loadVoices();
        if (synthRef.current.onvoiceschanged !== undefined) {
            synthRef.current.onvoiceschanged = loadVoices;
        }
    }, []);

    const stopSpeech = useCallback(() => {
        if (synthRef.current) {
            synthRef.current.cancel();
        }
        setIsSpeaking(false);
        setActiveMessageId(null);
    }, []);

    const getVoiceForLanguage = (languageCode) => {
        if (!voices.length) return null;
        let targetPrefix = 'en-';
        if (languageCode === 'kn') targetPrefix = 'kn';
        if (languageCode === 'hi') targetPrefix = 'hi';

        const match = voices.find(v => v.lang.startsWith(targetPrefix));
        // Fallback to English if explicitly missing (some browsers fall back natively, but better to enforce here)
        return match || voices.find(v => v.lang.startsWith('en')) || voices[0];
    };

    const isVoiceAvailable = (languageCode) => {
        if (!voices.length) return false;
        let targetPrefix = 'en-';
        if (languageCode === 'kn') targetPrefix = 'kn';
        if (languageCode === 'hi') targetPrefix = 'hi';
        return !!voices.find(v => v.lang.startsWith(targetPrefix));
    };

    const speak = useCallback((text, languageCode, messageId) => {
        setError(null);
        if (!synthRef.current) {
            setError(t('err_no_speech_synth') || "Your browser does not support text-to-speech engine.");
            return;
        }

        // Always stop existing speech first securely preventing overlap
        stopSpeech();

        if (!isVoiceAvailable(languageCode)) {
            setError(t('err_voice_unavailable') || "The voice package for this language is currently unavailable on your device.");
            // We can optionally proceed with fallback voice, but user's requirement: "If browser does not provide requested language voice, show a clear fallback message."
            // Letting it fallback technically sounds bad (English trying to read Kannada), so returning here securely prevents gibberish.
            return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        const voice = getVoiceForLanguage(languageCode);

        if (voice) utterance.voice = voice;
        utterance.lang = languageCode === 'kn' ? 'kn-IN' : (languageCode === 'hi' ? 'hi-IN' : 'en-IN');

        utterance.onstart = () => {
            setIsSpeaking(true);
            setActiveMessageId(messageId);
        };
        utterance.onend = () => {
            setIsSpeaking(false);
            setActiveMessageId(null);
        };
        utterance.onerror = (e) => {
            console.error("Speech Synthesis Error:", e);
            setIsSpeaking(false);
            setActiveMessageId(null);
            if (e.error !== 'interrupted') {
                setError(t('err_speech_failed') || "Failed to generate speech. An error occurred.");
            }
        };

        synthRef.current.speak(utterance);
    }, [voices, stopSpeech, t]);

    // Ensure speech cleanly drops unmounting bounds
    useEffect(() => {
        return () => {
            if (synthRef.current) synthRef.current.cancel();
        };
    }, []);

    return {
        isSpeaking,
        activeMessageId,
        error,
        speak,
        stopSpeech,
        clearError: () => setError(null)
    };
}
