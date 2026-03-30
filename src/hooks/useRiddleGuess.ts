import { useState, ChangeEvent, SubmitEvent } from "react";
import { RiddleT } from "../types";
import { useProgramData } from "./useProgramData";
import leven from "leven";

const GUESS_ACCURACY_THRESHOLD = 0.875;

type UseRiddleGuessArgs = {
    riddle: RiddleT;
    decodedAnswer: string;
    shake: () => void;
    clearShake: () => void;
};


function isGuessCloseEnough(guess: string, answer: string): boolean {
    const normalizedGuess = guess.trim().toLowerCase();
    const normalizedAnswer = answer.trim().toLowerCase();

    const distance = leven(normalizedGuess, normalizedAnswer);
    const longerLength = Math.max(normalizedGuess.length, normalizedAnswer.length);
    const similarity = 1 - distance / longerLength;

    return similarity >= GUESS_ACCURACY_THRESHOLD
}

function useRiddleGuess({ riddle, decodedAnswer, shake, clearShake }: UseRiddleGuessArgs) {
    const { activeProgram, updateActiveProgram } = useProgramData();

    const [guess, setGuess] = useState("");
    const [response, setResponse] = useState("");
    const [isCorrectGuess, setIsCorrectGuess] = useState(true);

    function changeHandler(event: ChangeEvent<HTMLInputElement>) {
        setGuess(event.target.value);
    }

    function submitHandler(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        if (isGuessCloseEnough(guess, decodedAnswer)) {
            setResponse("Access Granted.");
            setIsCorrectGuess(true);
            clearShake();

            if (!activeProgram) return;

            updateActiveProgram({
                ...activeProgram,
                riddles: activeProgram.riddles.map(r =>
                    r.id === riddle.id ? { ...r, unlocked: true } : r
                ),
            });

        } else {
            setResponse("Access Denied.");
            setIsCorrectGuess(false);
            shake();
        }
    }

    return { guess, response, isCorrectGuess, changeHandler, submitHandler };
}

export default useRiddleGuess;
