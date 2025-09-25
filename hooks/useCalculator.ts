import { useState } from 'react';
import { useAuthContext } from '../contexts/AuthContext.tsx';

interface Calculation {
    expression: string;
    result: string;
    cost: number;
}

interface UseCalculatorProps {
    onCalculationComplete: (calculation: Calculation) => void;
    onUpgradeRequired: () => void;
    onInsufficientTokens: () => void;
}

export const useCalculator = ({ onCalculationComplete, onUpgradeRequired, onInsufficientTokens }: UseCalculatorProps) => {
    const [displayValue, setDisplayValue] = useState('0');
    const [firstOperand, setFirstOperand] = useState<number | null>(null);
    const [operator, setOperator] = useState<string | null>(null);
    const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);
    const { user, deductTokens } = useAuthContext();

    const calculateCost = (a: number, b: number): number => {
        // e.g. 1000 + 1000 = 2000. 2000 / 200 = 10 tokens.
        const magnitude = Math.abs(a) + Math.abs(b);
        return Math.ceil(magnitude / 200);
    };

    const performCalculation = (op: string, a: number, b: number): number => {
        switch (op) {
            case '+': return a + b;
            case '-': return a - b;
            case '*': return a * b;
            case '/': return a / b;
            case '^': return Math.pow(a, b);
            default: return b;
        }
    };

    const handleInput = (input: string) => {
        if (!user) {
            onUpgradeRequired(); // Redirect to login if not authenticated
            return;
        }

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
        } else if (['+', '-', '*', '/', '^'].includes(input)) { // Operator
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
            if (user.plan === 'Hobby') {
                onUpgradeRequired();
                return;
            }

            const currentValue = parseFloat(displayValue);
            if (operator && firstOperand !== null) {
                const cost = calculateCost(firstOperand, currentValue);
                if (user.tokens < cost) {
                    onInsufficientTokens();
                    return;
                }

                const result = performCalculation(operator, firstOperand, currentValue);
                const fullExpression = `${firstOperand} ${operator} ${currentValue}`;
                
                deductTokens(cost, `Calculation: ${fullExpression}`);
                onCalculationComplete({ expression: fullExpression, result: String(result), cost });

                setDisplayValue(String(result));
                setFirstOperand(null);
                setOperator(null);
                setWaitingForSecondOperand(false);
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
            setWaitingForSecondOperand(true);
        } else if (input === '√' || input === 'π') { // Unary operations - no token cost
            if(input === '√') setDisplayValue(String(Math.sqrt(parseFloat(displayValue))));
            if(input === 'π') setDisplayValue(String(Math.PI));
            setWaitingForSecondOperand(true);
        }
    };

    return { displayValue, handleInput, setDisplayValue };
};