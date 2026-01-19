import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import QuizGenerator from '../utils/QuizGenerator';
import QuizStatsService from '../services/QuizStatsService';

const { width } = Dimensions.get('window');

const QuranQuizScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(true);
    const [question, setQuestion] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);
    const [streak, setStreak] = useState(0);

    const loadNewQuestion = useCallback(async () => {
        setLoading(true);
        setSelectedOption(null);
        setIsCorrect(null);
        try {
            const q = await QuizGenerator.generateQuestion();
            setQuestion(q);
        } catch (error) {
            console.error("Error generating quiz", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadNewQuestion();
    }, [loadNewQuestion]);

    const handleOptionSelect = async (option) => {
        if (selectedOption) return; // Prevent multiple clicks

        setSelectedOption(option);
        const correct = option.id === question.word.id;
        setIsCorrect(correct);

        // Update Stats
        await QuizStatsService.updateWordStat(question.word.id, correct);

        if (correct) {
            setStreak(s => s + 1);
            // Auto advance after short delay for correct answers
            setTimeout(loadNewQuestion, 1500);
        } else {
            setStreak(0);
            // For wrong answers, user must manually click next or we wait longer
            // Let's wait a bit longer so they can see the correct answer
            setTimeout(loadNewQuestion, 2500);
        }
    };

    if (loading && !question) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#2c5f2d" />
                <Text style={styles.loadingText}>Preparing next word...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header / Stats */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <View style={styles.streakContainer}>
                    <Ionicons name="flame" size={20} color="#FF5722" />
                    <Text style={styles.streakText}>{streak}</Text>
                </View>
            </View>

            {/* Question Card */}
            <View style={styles.card}>
                <Text style={styles.questionLabel}>What is the meaning of:</Text>
                <Text style={styles.arabicWord}>{question?.word?.arabic}</Text>
                <Text style={styles.transliteration}>({question?.word?.transliteration})</Text>
            </View>

            {/* Options */}
            <View style={styles.optionsContainer}>
                {question?.options.map((option) => {
                    const isSelected = selectedOption?.id === option.id;
                    const isTarget = option.id === question.word.id;

                    let buttonStyle = styles.optionButton;
                    let textStyle = styles.optionText;

                    if (selectedOption) {
                        if (isTarget) {
                            buttonStyle = [styles.optionButton, styles.correctButton];
                            textStyle = [styles.optionText, styles.whiteText];
                        } else if (isSelected && !isCorrect) {
                            buttonStyle = [styles.optionButton, styles.wrongButton];
                            textStyle = [styles.optionText, styles.whiteText];
                        } else {
                            buttonStyle = [styles.optionButton, styles.disabledButton];
                        }
                    }

                    return (
                        <TouchableOpacity
                            key={option.id}
                            style={buttonStyle}
                            onPress={() => handleOptionSelect(option)}
                            disabled={!!selectedOption}
                        >
                            <Text style={textStyle}>{option.english}</Text>
                            {selectedOption && isTarget && (
                                <Ionicons name="checkmark-circle" size={24} color="white" style={styles.iconRight} />
                            )}
                            {isSelected && !isCorrect && (
                                <Ionicons name="close-circle" size={24} color="white" style={styles.iconRight} />
                            )}
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* Status Message */}
            {selectedOption && (
                <View style={styles.feedbackContainer}>
                    <Text style={[
                        styles.feedbackText,
                        isCorrect ? styles.correctText : styles.wrongText
                    ]}>
                        {isCorrect ? 'Correct! MashaAllah' : 'Incorrect'}
                    </Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F9F6',
        padding: 20,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        color: '#666',
        fontFamily: 'System',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 30,
        marginTop: 20,
    },
    backButton: {
        padding: 8,
    },
    streakContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
    },
    streakText: {
        marginLeft: 6,
        fontWeight: 'bold',
        fontSize: 16,
        color: '#333',
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 30,
        alignItems: 'center',
        marginBottom: 30,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
    },
    questionLabel: {
        color: '#666',
        fontSize: 16,
        marginBottom: 10,
    },
    arabicWord: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#2c5f2d',
        marginBottom: 10,
        textAlign: 'center',
    },
    transliteration: {
        fontSize: 18,
        color: '#888',
        fontStyle: 'italic',
    },
    optionsContainer: {
        gap: 12,
    },
    optionButton: {
        backgroundColor: '#FFF',
        padding: 18,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    optionText: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    correctButton: {
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
    },
    wrongButton: {
        backgroundColor: '#F44336',
        borderColor: '#F44336',
    },
    disabledButton: {
        opacity: 0.6,
    },
    whiteText: {
        color: '#FFF',
    },
    iconRight: {
        position: 'absolute',
        right: 15,
    },
    feedbackContainer: {
        marginTop: 30,
        alignItems: 'center',
    },
    feedbackText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    correctText: {
        color: '#4CAF50',
    },
    wrongText: {
        color: '#F44336',
    },
});

export default QuranQuizScreen;
