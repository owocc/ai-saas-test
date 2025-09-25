
import { useState } from 'react';

interface UseCalculatorProps {
    onEquals: () => void;
}

export const useCalculator = ({ onEquals }: UseCalculatorProps) => {
    const [displayValue, setDisplayValue] = useState('0');
    const [firstOperand, setFirstOperand] = useState<number | null>(null);
    const [operator, setOperator] = useState<string | null>(null);
    const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);

    const performCalculation = (op: string, a: number, b: number): number => {
        switch (op) {
            case '+': return a + b;
            case '-': return a - b;
            case '*': return a * b;
            case '/': return a / b;
            default: return b;
        }
    };

    const handleInput = (input: string) => {
        if (/\d/.test(input)) { // Digit
            if (waitingForSecondOperand) {
                setDisplayValue(input);
                setWaitingForSecondOperand(false);
            } else {
                setDisplayValue(displayValue === '0' ? input : displayValue + input);
            }
        } else if (input === '.') { // Decimal
            if (!displayValue.includes('.')) {
                setDisplayValue(displayValue + '.');
            }
        } else if (['+', '-', '*', '/'].includes(input)) { // Operator
            const currentValue = parseFloat(displayValue);
            if (operator && !waitingForSecondOperand && firstOperand !== null) {
                const result = performCalculation(operator, firstOperand, currentValue);
                setDisplayValue(String(result));
                setFirstOperand(result);
            } else {
                setFirstOperand(currentValue);
            }
            setWaitingForSecondOperand(true);
            setOperator(input);
        } else if (input === '=') { // Equals
            const currentValue = parseFloat(displayValue);
            if (operator && firstOperand !== null) {
                const result = performCalculation(operator, firstOperand, currentValue);
                setDisplayValue(String(result));
                setFirstOperand(null);
                setOperator(null);
                setWaitingForSecondOperand(false);
                onEquals();
            }
        } else if (input === 'C') { // Clear
            setDisplayValue('0');
            setFirstOperand(null);
            setOperator(null);
            setWaitingForSecondOperand(false);
        } else if (input === '+/-') { // Toggle Sign
            setDisplayValue(String(parseFloat(displayValue) * -1));
        } else if (input === '%') { // Percentage
            setDisplayValue(String(parseFloat(displayValue) / 100));
        }
    };

    return { displayValue, handleInput };
};
