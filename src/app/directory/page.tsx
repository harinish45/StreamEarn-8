"use client";

import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type SpeechRecognitionLike = {
  continuous: boolean;
  lang: string;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
};
type SpeechRecognitionCtor = new () => SpeechRecognitionLike;
type SpeechWindow = Window & typeof globalThis & { SpeechRecognition?: SpeechRecognitionCtor; webkitSpeechRecognition?: SpeechRecognitionCtor };

export default function DirectoryPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

    useEffect(() => {
        const speechWindow = window as SpeechWindow;
        const SpeechRecognition = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
        if (!SpeechRecognition) return;
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.onresult = (event: any) => {
            const transcript = event?.results?.[0]?.[0]?.transcript;
            if (typeof transcript === 'string') setSearchTerm(transcript);
            setIsListening(false);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        recognitionRef.current = recognition;
        return () => { try { recognition.stop(); } catch {} recognitionRef.current = null; };
    }, []);

    return <main className="p-6"><Card><CardContent><div className="mb-4 flex gap-2"><input aria-label="Search directory" value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} className="h-10 flex-1 rounded-lg border px-3" /><button type="button" onClick={()=>{try{if(isListening){recognitionRef.current?.stop();setIsListening(false)}else{recognitionRef.current?.start();setIsListening(true)}}catch{setIsListening(false)}}} disabled={!recognitionRef.current} className="rounded-lg border px-4">{isListening?'Stop':'Voice'}</button></div><Table><TableHeader><TableRow><TableHead>Directory</TableHead></TableRow></TableHeader><TableBody><TableRow><TableCell>No directory results loaded.</TableCell></TableRow></TableBody></Table></CardContent></Card></main>;
}
