// Filename: index.js
// Combined code from all files

import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, SafeAreaView, View, TouchableOpacity, Text, Button, Alert } from 'react-native';

const CELL_SIZE = 20;
const BOARD_SIZE = 300;

const directions = {
    UP: { x: 0, y: -1 },
    DOWN: { x: 0, y: 1 },
    LEFT: { x: -1, y: 0 },
    RIGHT: { x: 1, y: 0 }
};

const SnakeGame = () => {
    const [snake, setSnake] = useState([{ x: 0, y: 0 }]);
    const [food, setFood] = useState({ x: 0, y: 0 });
    const [direction, setDirection] = useState(directions.RIGHT);
    const [isGameOver, setIsGameOver] = useState(false);
    
    const gameInterval = useRef(null);
    
    useEffect(() => {
        resetGame();
    }, []);

    const resetGame = () => {
        setSnake([{ x: 0, y: 0 }]);
        setDirection(directions.RIGHT);
        setFoodPosition();
        setIsGameOver(false);
        if (gameInterval.current) clearInterval(gameInterval.current);
        gameInterval.current = setInterval(moveSnake, 200);
    };
    
    const setFoodPosition = () => {
        const x = Math.floor(Math.random() * BOARD_SIZE / CELL_SIZE);
        const y = Math.floor(Math.random() * BOARD_SIZE / CELL_SIZE);
        setFood({ x, y });
    };

    const moveSnake = () => {
        if (isGameOver) return;

        let newSnake = [...snake];
        const head = newSnake[0];
        const newHead = { x: head.x + direction.x, y: head.y + direction.y };

        if (newHead.x < 0 || newHead.x >= BOARD_SIZE / CELL_SIZE || newHead.y < 0 || newHead.y >= BOARD_SIZE / CELL_SIZE || 
            snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
            setIsGameOver(true);
            Alert.alert("Game Over", "You lost!", [{ text: "Restart", onPress: resetGame }]);
            return;
        }

        newSnake.unshift(newHead);

        if (newHead.x === food.x && newHead.y === food.y) {
            setFoodPosition();
        } else {
            newSnake.pop();
        }

        setSnake(newSnake);
    };

    const changeDirection = (newDirection) => {
        if ((newDirection.x + direction.x === 0) && (newDirection.y + direction.y === 0)) return;
        setDirection(newDirection);
    };

    return (
        <View style={stylesSnakeGame.container}>
            <View style={stylesSnakeGame.board}>
                {snake.map((segment, index) => (
                    <View key={index} style={{ ...stylesSnakeGame.cell, left: segment.x * CELL_SIZE, top: segment.y * CELL_SIZE, backgroundColor: index === 0 ? 'green' : 'black' }} />
                ))}
                <View style={{ ...stylesSnakeGame.cell, left: food.x * CELL_SIZE, top: food.y * CELL_SIZE, backgroundColor: 'red' }} />
            </View>
            <View style={stylesSnakeGame.controls}>
                <View style={stylesSnakeGame.row}>
                    <Button title="Up" onPress={() => changeDirection(directions.UP)} />
                </View>
                <View style={stylesSnakeGame.row}>
                    <Button title="Left" onPress={() => changeDirection(directions.LEFT)} />
                    <Button title="Down" onPress={() => changeDirection(directions.DOWN)} />
                    <Button title="Right" onPress={() => changeDirection(directions.RIGHT)} />
                </View>
            </View>
        </View>
    );
};

const stylesSnakeGame = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    board: {
        width: BOARD_SIZE,
        height: BOARD_SIZE,
        backgroundColor: '#ddd',
        flexDirection: 'row',
        flexWrap: 'wrap',
        position: 'relative',
    },
    cell: {
        width: CELL_SIZE,
        height: CELL_SIZE,
        position: 'absolute',
    },
    controls: {
        marginTop: 20,
    },
    row: {
        flexDirection: 'row',
        marginVertical: 5,
    },
});

export default function App() {
    return (
        <SafeAreaView style={stylesApp.container}>
            <Text style={stylesApp.title}>Snake Game</Text>
            <SnakeGame />
        </SafeAreaView>
    );
}

const stylesApp = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
        backgroundColor: '#FAFAFA',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
    },
});