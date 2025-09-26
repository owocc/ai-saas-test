import { useState, useEffect } from 'react';
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

const calculateTokenCost = (a: number, b: number): number => {
    const magnitude = Math.max(Math.abs(a), Math.abs(b));
    if (magnitude >= 10000) return 20;
    if (magnitude >= 1000) return 10;
    if (magnitude >= 100) return 5;
    return 1;
};

export const useCalculator = ({ onCalculationComplete, onUpgradeRequired, onInsufficientTokens }: UseCalculatorProps) => {
    const [displayValue, setDisplayValue] = useState('0');
    const [firstOperand, setFirstOperand] = useState<number | null>(null);
    const [operator, setOperator] = useState<string | null>(null);
    const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);
    const [expressionPreview, setExpressionPreview] = useState('');
    const [potentialCost, setPotentialCost] = useState(0);
    const { user, deductTokens, addCalculationToHistory } = useAuthContext();

    useEffect(() => {
        if (operator && firstOperand !== null && !waitingForSecondOperand) {
            const currentVal = parseFloat(displayValue);
            setPotentialCost(calculateTokenCost(firstOperand, currentVal));
        } else {
            setPotentialCost(0);
        }
    }, [displayValue, operator, firstOperand, waitingForSecondOperand]);

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

    const resetState = () => {
        setDisplayValue('0');
        setFirstOperand(null);
        setOperator(null);
        setWaitingForSecondOperand(false);
        setExpressionPreview('');
        setPotentialCost(0);
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
                setExpressionPreview(`${result} ${input}`);
            } else {
                setFirstOperand(currentValue);
                setExpressionPreview(`${currentValue} ${input}`);
            }
            setWaitingForSecondOperand(true);
            setOperator(input);
        } else if (input === '=') { // Equals
            if (operator && firstOperand !== null) {
                const currentValue = parseFloat(displayValue);
                // Hobby plan check for large numbers
                if (user.plan === 'Hobby' && Math.max(Math.abs(firstOperand), Math.abs(currentValue)) >= 10000) {
                    onUpgradeRequired();
                    return;
                }

                const cost = calculateTokenCost(firstOperand, currentValue);

                // Token balance check
                if (user.tokens < cost) {
                    onInsufficientTokens();
                    return;
                }
                
                deductTokens(cost);
                
                const result = performCalculation(operator, firstOperand, currentValue);
                const fullExpression = `${firstOperand} ${operator} ${currentValue}`;
                
                const calculation = { expression: fullExpression, result: String(result), cost };
                addCalculationToHistory(calculation);
                onCalculationComplete(calculation);

                setDisplayValue(String(result));
                setFirstOperand(null);
                setOperator(null);
                setWaitingForSecondOperand(true); // Allows starting new calculation
                setExpressionPreview(fullExpression);
                setPotentialCost(0);
            }
        } else if (input === 'C') { // Clear
            resetState();
        } else if (input === '+/-') { // Toggle Sign
            setDisplayValue(String(parseFloat(displayValue) * -1));
        } else if (input === '%') { // Percentage
            const result = parseFloat(displayValue) / 100;
            setDisplayValue(String(result));
            setExpressionPreview(`${result}`);
            setWaitingForSecondOperand(true);
        } else if (input === '√' || input === 'π') { // Unary operations
            let result;
            if (input === '√') {
                result = Math.sqrt(parseFloat(displayValue));
                setExpressionPreview(`√(${displayValue})`);
            } else { // pi
                result = Math.PI;
                setExpressionPreview('π');
            }
            setDisplayValue(String(result));
            setWaitingForSecondOperand(true);
        }
    };

    return { displayValue, handleInput, setDisplayValue, expressionPreview, potentialCost };
};