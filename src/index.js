import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
    return (<button className={props.btnClass}  onClick={props.onClick}>
            {props.value}
        </button>
    );
}
  class Board extends React.Component {
    renderSquare(i) {
        const winningLine=this.props.winningLine;
        const btnClass=(winningLine&&(winningLine.includes(i)))?'square square_highlight':'square'
      return <Square 
        value={this.props.squares[i]}
        onClick={()=> this.props.onClick(i)}
        key={i}
        btnClass={btnClass}
        />;
    }
  
    render() {
        let n=0;
        const items = []
        const rows = new Array(3);
        rows.fill();
        const elements=rows.map(row=>{
            row=[];
            for(let i=0;i<3;i++){
                row.push(this.renderSquare(n))
                n++;
            }
            return row;
        })
        
        for (const [index, value] of elements.entries()) {
          items.push(<div key={index} className="board-row">
              {value}
          </div>)
        }
        return (
          <div>
            {items}
          </div>
        )
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            xIsNext: true,
            history: [{squares: Array(9).fill(null)}],
            stepNumber: 0,
            stepHistory: ['Начало игры'],
            sortDown: true,
            winningLine: [],
            draw: false,
        };
    }
    handleClick(i) { 
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length-1];
        const squares = current.squares.slice();
        const winner = calculateWinner(squares);
        const stepHistory = this.state.stepHistory.slice();
        const stepCoords = getStepCoords(i);
        stepHistory[this.state.stepNumber + 1] = stepCoords;
        if(winner||squares[i]!==null) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X': 'O';
        if(!squares.includes(null)){
            this.setState({draw:true})
        }
        this.setState({winningLine:calculateWinningLine(squares)});
        this.setState({history: history.concat([{squares: squares}])});
        this.setState({xIsNext: !this.state.xIsNext});
        this.setState({stepNumber: history.length});
        this.setState({stepHistory: stepHistory});
    }
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        })
    }
    render() {
        let status;
        const history = this.state.history.slice();
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        let moves = history.map((step, move)=>{
            const className = this.state.stepNumber===move?'button_highlight':''
            const desc = move ? `Перейти к ходу №${move}` : `Перейти в начало игры`
            return (
            <li key={move}>
                <button className={className} onClick={()=>{this.jumpTo(move)}}>{desc}</button>
                <span className='history'>
                    {this.state.stepHistory[move]}
                </span>
            </li>
            )
        });
        if(!this.state.sortDown){moves=moves.reverse()}
        if(winner) {
          status = `Winner is: ${winner}`;
        } else  if (this.state.draw){ 
            status = `Ничья`;
        } 
        else{
          status = `Next player: ${this.state.xIsNext ? 'X': 'O'}`;
        }
      return (
        <div className="game">
          <div className="game-board">
            <Board squares={current.squares} onClick={(i) => this.handleClick(i)} winningLine={this.state.winningLine}/>
          </div>
          <div className="game-info">
            <div>{status}</div>
            <button onClick={()=>this.setState({sortDown:!this.state.sortDown})}className="button-sort">Изменить сортировку</button>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }

  function calculateWinningLine(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return lines[i];
          }
        
  }
  return null;
}

  function getStepCoords(i) {
      const row = Math.floor((i)/3)+1;
      const cell = (i+1) - ((row -1)*3)
    return `Ряд: ${row}, клетка: ${cell}`
  }