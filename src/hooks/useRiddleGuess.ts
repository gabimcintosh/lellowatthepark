import { useState, ChangeEvent, FormEvent } from "react";
import { fuzzy } from "fast-fuzzy";
import { RiddleT } from "../types";
import { useProgramData } from "./useProgramData";

type UseRiddleGuessArgs = {
    riddle: RiddleT;
    decodedAnswer: string;
    onSolve: () => void;
    shake: () => void;
    clearShake: () => void;
};

function useRiddleGuess({ riddle, decodedAnswer, onSolve, shake, clearShake }: UseRiddleGuessArgs) {
    const { program, setProgram } = useProgramData();
    const [guess, setGuess] = useState("");
    const [response, setResponse] = useState("");
    const [isCorrectGuess, setIsCorrectGuess] = useState(true);

    function changeHandler(event: ChangeEvent<HTMLInputElement>) {
        setGuess(event.target.value);
    }

    function submitHandler(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const scoreResult = fuzzy(guess.trim(), decodedAnswer);
        if (scoreResult > 0.875) {
            setResponse("Access Granted.");
            setIsCorrectGuess(true);
            clearShake();
            if (!program) return;
            setProgram({
                ...program,
                riddles: program.riddles.map(r =>
                    r.id === riddle.id ? { ...r, unlocked: true } : r
                ),
            });
            onSolve();
        } else {
            setResponse("Access Denied.");
            setIsCorrectGuess(false);
            shake();
        }
    }

    return { guess, response, isCorrectGuess, changeHandler, submitHandler };
}

export default useRiddleGuess;
