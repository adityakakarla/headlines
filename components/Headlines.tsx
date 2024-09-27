import { useState, useEffect } from "react";
import { Button } from "./ui/button";

interface HeadlinesProps {
    headlines: string[],
    setHeadlines: (headlines: string[]) => void
}

export default function Headlines({ headlines, setHeadlines }: HeadlinesProps) {
    const [currentRound, setCurrentRound] = useState(headlines);
    const [currentPairIndex, setCurrentPairIndex] = useState(0);

    const handleVote = (winner: string) => {
        const nextRound = [...currentRound];
        if (winner === nextRound[currentPairIndex]) {
            nextRound.splice(currentPairIndex + 1, 1);
        } else {
            nextRound.splice(currentPairIndex, 1);
        }
        setCurrentRound(nextRound);

        if (currentPairIndex < nextRound.length - 1) {
            setCurrentPairIndex(currentPairIndex + 1);
        } else if (nextRound.length > 1) {
            setCurrentPairIndex(0);
        }
    };

    const currentPair = [currentRound[currentPairIndex], currentRound[currentPairIndex + 1]];

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === 'ArrowUp' && currentRound.length > 1) {
                handleVote(currentPair[0]);
            } else if (e.key === 'ArrowDown' && currentRound.length > 1) {
                handleVote(currentPair[1]);
            }
        };

        window.addEventListener('keydown', handleKeyPress);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [currentPair, currentRound.length, handleVote]);

    return (
        <div className="flex flex-col items-center space-y-8">
            {currentRound.length === 1 ? <div className="text-2xl text-center">
                <h2>The winning headline is:</h2>
                <h2 className="font-bold mt-4">{currentRound[0]}</h2></div>
            : <>
            <h2 className="text-2xl">Pick the best headline</h2>
            <p className="text-lg">Hint: use arrow keys</p>
                <div className="flex flex-col justify-around space-y-4 items-center">
                    <Button onClick={() => handleVote(currentPair[0])} className="text-lg">
                        {currentPair[0]}
                    </Button>
                    <span>vs</span>
                    <Button onClick={() => handleVote(currentPair[1])} className="text-lg">
                        {currentPair[1]}
                    </Button>
                </div>
                </>}
            <div className="flex flex-row space-x-4">
                <Button onClick={() => setHeadlines([])}>Start new round</Button>
                <Button onClick={() => setCurrentRound(headlines)}>Reset round</Button>
            </div>
        </div>
    );
}
