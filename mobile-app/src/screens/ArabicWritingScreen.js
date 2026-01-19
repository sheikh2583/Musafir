import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, PanResponder, TouchableOpacity, Dimensions, Modal, ActivityIndicator, Alert } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import ViewShot from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system/legacy';
import quranWords from '../data/quranWords.json';
import { scoreHandwriting } from '../services/AIScoringService';

const { width, height } = Dimensions.get('window');

const ArabicWritingScreen = ({ navigation }) => {
  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);
  const [currentWord, setCurrentWord] = useState(null);
  const [tool, setTool] = useState('pen'); // 'pen' | 'eraser'
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scoreResult, setScoreResult] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const viewShotRef = useRef();
  const currentPathRef = useRef([]);

  useEffect(() => {
    loadRandomWord();
  }, []);

  const loadRandomWord = () => {
    const random = quranWords[Math.floor(Math.random() * quranWords.length)];
    setCurrentWord(random);
    setPaths([]);
    setTool('pen');
    setShowResult(false);
    setScoreResult(null);
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,

    onPanResponderGrant: (evt, gestureState) => {
      const { locationX, locationY } = evt.nativeEvent;
      currentPathRef.current = [`M ${locationX} ${locationY}`];
      setCurrentPath(currentPathRef.current);
    },

    onPanResponderMove: (evt, gestureState) => {
      const { locationX, locationY } = evt.nativeEvent;
      const point = `L ${locationX} ${locationY}`;
      currentPathRef.current.push(point);
      setCurrentPath([...currentPathRef.current]);
    },

    onPanResponderRelease: () => {
      if (currentPathRef.current.length > 0) {
        const pathData = currentPathRef.current.join(' ');
        const newPath = {
          d: pathData,
          color: tool === 'eraser' ? '#F5F5F5' : '#000000',
          width: tool === 'eraser' ? 20 : 4
        };
        setPaths(prev => [...prev, newPath]);
        currentPathRef.current = [];
        setCurrentPath([]);
      }
    },
  });

  const clearCanvas = () => {
    setPaths([]);
    setCurrentPath([]);
  };

  const checkQuality = async () => {
    if (paths.length === 0) {
      Alert.alert("Empty Canvas", "Please write something first!");
      return;
    }

    try {
      setIsAnalyzing(true);
      // Capture the canvas to a file first
      const uri = await viewShotRef.current.capture();

      // Read the file as Base64 string explicitly using Expo FileSystem
      const base64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });

      const result = await scoreHandwriting(base64, currentWord);

      setScoreResult(result);
      setShowResult(true);

    } catch (error) {
      console.log("AI Analysis failed silently:", error.message);
      // Suppress UI error as requested
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Ionicons name="close" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Practice Writing</Text>
        <TouchableOpacity onPress={loadRandomWord} style={styles.iconButton}>
          <Text style={styles.nextText}>Next</Text>
          <Ionicons name="arrow-forward" size={24} color="#2E7D32" />
        </TouchableOpacity>
      </View>

      {/* Word Display Area */}
      <View style={styles.wordContainer}>
        <Text style={styles.arabicWord}>{currentWord?.arabic}</Text>
        <Text style={styles.englishWord}>{currentWord?.english}</Text>
        <Text style={styles.transliteration}>({currentWord?.transliteration})</Text>
      </View>

      {/* Whiteboard Canvas */}
      <ViewShot ref={viewShotRef} style={{ flex: 1 }} options={{ format: "jpg", quality: 0.8 }}>
        <View style={styles.canvasContainer} {...panResponder.panHandlers}>
          <Svg style={StyleSheet.absoluteFill}>
            {paths.map((path, index) => (
              <Path
                key={index}
                d={path.d}
                stroke={path.color}
                strokeWidth={path.width}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
            {currentPath.length > 0 && (
              <Path
                d={currentPath.join(' ')}
                stroke={tool === 'eraser' ? '#F5F5F5' : '#000000'}
                strokeWidth={tool === 'eraser' ? 20 : 4}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </Svg>

          {paths.length === 0 && currentPath.length === 0 && (
            <Text style={styles.placeholderText}>Trace the word or practice writing here...</Text>
          )}
        </View>
      </ViewShot>

      {/* Toolbar */}
      <View style={styles.toolbar}>
        <TouchableOpacity
          style={[styles.toolButton, tool === 'pen' && styles.activeTool]}
          onPress={() => setTool('pen')}
        >
          <Ionicons name="pencil" size={24} color={tool === 'pen' ? '#2E7D32' : '#666'} />
          <Text style={styles.toolText}>Pen</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toolButton, tool === 'eraser' && styles.activeTool]}
          onPress={() => setTool('eraser')}
        >
          <MaterialCommunityIcons name="eraser" size={24} color={tool === 'eraser' ? '#2E7D32' : '#666'} />
          <Text style={styles.toolText}>Eraser</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.toolButton} onPress={clearCanvas}>
          <Ionicons name="trash-outline" size={24} color="#F44336" />
          <Text style={[styles.toolText, { color: '#F44336' }]}>Clear</Text>
        </TouchableOpacity>

        {/* Check Button */}
        <TouchableOpacity style={styles.checkButton} onPress={checkQuality}>
          {isAnalyzing ? (
            <ActivityIndicator color="#FFF" size="small" />
          ) : (
            <>
              <Ionicons name="checkmark-done-circle" size={24} color="#FFF" />
              <Text style={styles.checkButtonText}>Check</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Result Modal */}
      <Modal transparent={true} visible={showResult} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Evaluation Result</Text>

            <View style={styles.scoreContainer}>
              <Text style={styles.scoreLabel}>Score</Text>
              <Text style={[styles.scoreValue, { color: scoreResult?.score > 70 ? '#4CAF50' : '#FF9800' }]}>
                {scoreResult?.score}/100
              </Text>
            </View>

            <Text style={styles.feedbackText}>"{scoreResult?.feedback}"</Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowResult(false)}
            >
              <Text style={styles.modalButtonText}>Keep Practicing</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  iconButton: {
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextText: {
    color: '#2E7D32',
    fontWeight: '600',
    marginRight: 4,
  },
  wordContainer: {
    backgroundColor: '#FFF',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 15,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    minHeight: 150,
  },
  arabicWord: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
    fontFamily: 'System',
  },
  englishWord: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  transliteration: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
  },
  canvasContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#DDD',
    elevation: 2,
    overflow: 'hidden',
  },
  placeholderText: {
    position: 'absolute',
    top: '40%',
    width: '100%',
    textAlign: 'center',
    color: '#CCC',
    fontSize: 18,
    pointerEvents: 'none',
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 15,
    paddingBottom: 30,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  toolButton: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  activeTool: {
    backgroundColor: '#E8F5E9',
  },
  toolText: {
    marginTop: 4,
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  checkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E7D32',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    gap: 8,
    elevation: 4,
  },
  checkButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    width: '80%',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  feedbackText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    fontStyle: 'italic',
    marginBottom: 25,
    lineHeight: 24,
  },
  modalButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  modalButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ArabicWritingScreen;
