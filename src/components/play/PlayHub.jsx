import React from 'react'
import { Routes, Route } from 'react-router-dom'
import PlayHome from '../partyNight/screens/PlayHome'
import ImpostorGame from '../partyNight/screens/games/ImpostorGame'
import DiceGame from '../partyNight/screens/games/DiceGame'
import BottleGame from '../partyNight/screens/games/BottleGame'
import TruthOrDareGame from '../partyNight/screens/games/TruthOrDareGame'

export default function PlayHub() {
  return (
    <Routes>
      <Route index element={<PlayHome />} />
      <Route path="party/impostor" element={<ImpostorGame />} />
      <Route path="party/dice" element={<DiceGame />} />
      <Route path="party/bottle" element={<BottleGame />} />
      <Route path="party/truth-or-dare" element={<TruthOrDareGame />} />
    </Routes>
  )
}
