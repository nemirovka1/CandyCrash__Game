import React, { useEffect, useState } from 'react'
import './index.css'
import blueCandy from './images/blue-candy.png'
import greenCandy from './images/green-candy.png'
import orangeCandy from './images/orange-candy.png'
import purpleCandy from './images/purple-candy.png'
import redCandy from './images/red-candy.png'
import yellowCandy from './images/yellow-candy.png'
import blank from './images/blank.png'

const width = 8

const candyColors = [
    blueCandy,
    orangeCandy,
    purpleCandy,
    redCandy,
    yellowCandy,
    greenCandy
]

const App = () => {
    const [ seconds, setSeconds ] = useState(120);
    const [ timerActive, setTimerActive ] = useState(false)
    const [showModal , setShowModal] = useState(true)
    const [currentColorArrangement, setCurrentColorArrangement] = useState([])
    const [squareBeingDragged, setSquareBeingDragged] = useState(null)
    const [squareBeingReplaced, setSquareBeingReplaced] = useState(null)
    const [scoreDisplay, setScoreDisplay] = useState(0)

    useEffect(() => {
        if (seconds > 0 && timerActive) {
            setTimeout(setSeconds, 1000, seconds - 1);
        } else {
            setTimerActive(false);
        }
    }, [ seconds, timerActive ]);

    // React.useEffect(() => {
    //     if (seconds > 0 && timerActive) {
    //         setTimeout(setSeconds, 100, seconds - 1);
    //     } else {
    //         setTimerActive(false);
    //     }
    // }, [ seconds, timerActive ]);
    //
    // if (!sessionStorage.getItem('startTime')) {
    //     sessionStorage.setItem('startTime', Date.now());
    // }
    //
    // const enterTime = sessionStorage.getItem('startTime')
    //
    // const showPopup = () => {
    //     let currentTime = Date.now()
    //     let spentTime = (currentTime - enterTime) / 1000
    //     if (spentTime >= 60) {
    //         clearInterval(timer)
    //         alert(Вы провели на сайте минут: ${Math.floor(spentTime / 60)}, секунд: ${Math.floor(spentTime % 60)})
    //     }
    // }
    //
    // const timer = setInterval(showPopup, 10000)

    const showModalWindow = () => {
        const closeModal = () => {
            setShowModal(false)
            setTimerActive(!timerActive)
        }
        const restart = () => {
            setShowModal(false)
            setSeconds(120)
            setTimerActive(!timerActive)
            setScoreDisplay(0)
        }
        return (
            <>
                {seconds !== 0 ?
                    <div className='modal'>
                        <div className="containerModal">
                            <h1 className="modalTitle"> WELCOME </h1>
                            <h2 className="modalAsk"> Can you start play ?</h2>
                            <button onClick={closeModal} className="startBtn">START</button>
                        </div>
                    </div>
                    :
                    <div className='finish'>
                        <div className="containerModal">
                            <h1 className="modalTitle"> GAME OVER </h1>
                            <h2 className="modalAsk"> RESULT {scoreDisplay}</h2>
                            <button onClick={restart} className="startBtn">START</button>
                        </div>
                    </div>
                }
            </>
        )
    }

    const checkForColumnOfFour = () => {
        for (let i = 0; i <= 39; i++) {
            const columnOfFour = [i, i + width, i + width * 2, i + width * 3]
            const decidedColor = currentColorArrangement[i]
            const isBlank = currentColorArrangement[i] === blank

            if (columnOfFour.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
                setScoreDisplay((score) => score + 4)
                columnOfFour.forEach(square => currentColorArrangement[square] = blank)
                return true
            }
        }
    }

    const checkForRowOfFour = () => {
        for (let i = 0; i < 64; i++) {
            const rowOfFour = [i, i + 1, i + 2, i + 3]
            const decidedColor = currentColorArrangement[i]
            const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55, 62, 63, 64]
            const isBlank = currentColorArrangement[i] === blank

            if (notValid.includes(i)) continue

            if (rowOfFour.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
                setScoreDisplay((score) => score + 4)
                rowOfFour.forEach(square => currentColorArrangement[square] = blank)
                return true
            }
        }
    }

    const checkForColumnOfThree = () => {
        for (let i = 0; i <= 47; i++) {
            const columnOfThree = [i, i + width, i + width * 2]
            const decidedColor = currentColorArrangement[i]
            const isBlank = currentColorArrangement[i] === blank

            if (columnOfThree.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
                setScoreDisplay((score) => score + 3)
                columnOfThree.forEach(square => currentColorArrangement[square] = blank)
                return true
            }
        }
    }

    const checkForRowOfThree = () => {
        for (let i = 0; i < 64; i++) {
            const rowOfThree = [i, i + 1, i + 2]
            const decidedColor = currentColorArrangement[i]
            const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64]
            const isBlank = currentColorArrangement[i] === blank

            if (notValid.includes(i)) continue

            if (rowOfThree.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
                setScoreDisplay((score) => score + 3)
                rowOfThree.forEach(square => currentColorArrangement[square] = blank)
                return true
            }
        }
    }

    const moveIntoSquareBelow = () => {
        for (let i = 0; i <= 55; i++) {
            const firstRow = [0, 1, 2, 3, 4, 5, 6, 7]
            const isFirstRow = firstRow.includes(i)

            if (isFirstRow && currentColorArrangement[i] === blank) {
                let randomNumber = Math.floor(Math.random() * candyColors.length)
                currentColorArrangement[i] = candyColors[randomNumber]
            }

            if ((currentColorArrangement[i + width]) === blank) {
                currentColorArrangement[i + width] = currentColorArrangement[i]
                currentColorArrangement[i] = blank
            }
        }
    }

    const dragStart = (e) => {
        setSquareBeingDragged(e.target)
    }
    const dragDrop = (e) => {
        setSquareBeingReplaced(e.target)
    }
    const dragEnd = () => {
        const squareBeingDraggedId = parseInt(squareBeingDragged.getAttribute('data-id'))
        const squareBeingReplacedId = parseInt(squareBeingReplaced.getAttribute('data-id'))

        currentColorArrangement[squareBeingReplacedId] = squareBeingDragged.getAttribute('src')
        currentColorArrangement[squareBeingDraggedId] = squareBeingReplaced.getAttribute('src')

        const validMoves = [
            squareBeingDraggedId - 1,
            squareBeingDraggedId - width,
            squareBeingDraggedId + 1,
            squareBeingDraggedId + width
        ]

        const validMove = validMoves.includes(squareBeingReplacedId)

        const isAColumnOfFour = checkForColumnOfFour()
        const isARowOfFour = checkForRowOfFour()
        const isAColumnOfThree = checkForColumnOfThree()
        const isARowOfThree = checkForRowOfThree()

        if (squareBeingReplacedId &&
            validMove &&
            (isARowOfThree || isARowOfFour || isAColumnOfFour || isAColumnOfThree)) {
            setSquareBeingDragged(null)
            setSquareBeingReplaced(null)
        } else {
            currentColorArrangement[squareBeingReplacedId] = squareBeingReplaced.getAttribute('src')
            currentColorArrangement[squareBeingDraggedId] = squareBeingDragged.getAttribute('src')
            setCurrentColorArrangement([...currentColorArrangement])
        }
    }

    const createBoard = () => {
        const randomColorArrangement = []
        for (let i = 0; i < width * width; i++) {
            const randomColor = candyColors[Math.floor(Math.random() * candyColors.length)]
            randomColorArrangement.push(randomColor)
        }
        setCurrentColorArrangement(randomColorArrangement)
    }

    useEffect(() => {
        createBoard()
    }, [])

    useEffect(() => {
        const timer = setInterval(() => {
            checkForColumnOfFour()
            checkForRowOfFour()
            checkForColumnOfThree()
            checkForRowOfThree()
            moveIntoSquareBelow()
            setCurrentColorArrangement([...currentColorArrangement])
        }, 50)
        return () => clearInterval(timer)
    }, [checkForColumnOfFour, checkForRowOfFour, checkForColumnOfThree, checkForRowOfThree, moveIntoSquareBelow, currentColorArrangement])

    return (
        <>

            {showModal || seconds === 0 ? showModalWindow()
                :
                <>
                    <h1 className='title'>CANDY CRUSH</h1>
                    <div className="app">
                        <div className="game">
                            {currentColorArrangement.map((candyColor, index) => (
                                <img
                                    key={index}
                                    src={candyColor}
                                    alt={candyColor}
                                    data-id={index}
                                    draggable={true}
                                    onDragStart={dragStart}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDragEnter={(e) => e.preventDefault()}
                                    onDragLeave={(e) => e.preventDefault()}
                                    onDrop={dragDrop}
                                    onDragEnd={dragEnd}
                                />
                            ))}
                        </div>
                        <div className="score">
                            <h1>Total</h1>
                            <h2>{scoreDisplay}</h2>
                        </div>
                        <div className="score1">
                            <>
                                <h2 className="title_time">Remaining Time</h2>
                                <div className='numbers'>{seconds}</div>
                            </>
                        </div>
                    </div>
                </>

            }
        </>
    )
}
export default App