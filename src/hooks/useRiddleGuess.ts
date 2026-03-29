import { useState, ChangeEvent, SubmitEvent } from "react";
import { fuzzy } from "fast-fuzzy";
import { RiddleT } from "../types";
import { useProgramData } from "./useProgramData";

const FUZZY_MATCH_THRESHOLD = 0.875;

type UseRiddleGuessArgs = {
    riddle: RiddleT;
    decodedAnswer: string;
    shake: () => void;
    clearShake: () => void;
};

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

        const scoreResult = fuzzy(guess.trim(), decodedAnswer);

        if (scoreResult > FUZZY_MATCH_THRESHOLD) {
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
