import { useState } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import Scribble from './Scribble';
import TicTacToe from './TicTacToe';
import Snake from './Snake';

export default function Games() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="games-container">
      <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
        <TabPanel header="Scribble">
          <Scribble />
        </TabPanel>
        <TabPanel header="Tic Tac Toe">
          <TicTacToe />
        </TabPanel>
        <TabPanel header="Snake">
          <Snake />
        </TabPanel>
      </TabView>
    </div>
  );
} 